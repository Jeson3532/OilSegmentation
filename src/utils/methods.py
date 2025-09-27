from PIL import Image
import io
import os
import segmentation_models_pytorch as smp
import torch
import numpy as np
import cv2
import albumentations as alb
from src.models import WriteDataModel
from src.database.models import History
from pathlib import Path

cur_dir = os.path.dirname(__file__)

def apply_colormap(mask, original_image):
    """Создает наложение маски на исходное изображение"""
    # Проверяем и выравниваем размеры
    original_size = original_image.size  # (width, height)
    mask_size = (mask.shape[1], mask.shape[0])  # (width, height)

    print(f"Original size: {original_size}, Mask size: {mask_size}")

    # Если размеры не совпадают, изменяем размер маски
    if original_size != mask_size:
        mask_pil = Image.fromarray(mask, mode='L')
        mask_resized = mask_pil.resize(original_size, Image.NEAREST)
    return mask_resized


    # Aug
val_transform = alb.Compose([
    alb.Resize(512, 512),
    alb.Normalize(mean=(0.485,0.456,0.406), std=(0.229,0.224,0.225)),
    alb.ToTensorV2()
])
transform = alb.Compose([
    alb.Resize(512, 512, interpolation=cv2.INTER_NEAREST)
])




DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
current_file = Path(__file__).resolve()
project_root = current_file.parent.parent

v1_model_path = project_root / "segment_models" / "usnpp_model_v1.pth"
v2_model_path = project_root / "segment_models" / "usnpp_model_v2.pth"

model = smp.UnetPlusPlus(
    encoder_name="resnet34",
    encoder_weights="imagenet",
    decoder_attention_type="scse",
    in_channels=3,
    classes=6,
    activation=None
).to(DEVICE)

model.load_state_dict(torch.load(v2_model_path, map_location=DEVICE))
print("Модель загружена.")
model.to(DEVICE)


def segment_image(image_bytes: bytes, path="../images/images.jpeg"):
    try:
        bytes_ = io.BytesIO(image_bytes)

        image = Image.open(bytes_).convert("RGB")
        numpy_arr = np.array(image)

        transformed = val_transform(image=numpy_arr)
        tensor = transformed['image'].unsqueeze(0).to(DEVICE)

        model.eval()
        with torch.no_grad():
            pred = model(tensor)
            pred_mask = torch.argmax(pred, dim=1).squeeze().cpu().numpy()

        pred_mask = pred_mask.astype(np.uint8)

        # ресайз маску к размеру исходника
        mask_resized = Image.fromarray(pred_mask).resize(image.size, resample=Image.NEAREST)
        pred_mask = np.array(mask_resized)

        classes = np.unique(pred_mask)

        # расчет площади маски
        total_pixels = pred_mask.size
        mask_pixels = np.count_nonzero(pred_mask)  # все классы > 0
        mask_percent = round((mask_pixels / total_pixels) * 100, 2)

        # если хочешь считать процент для каждого класса отдельно
        classes_percent = {}
        for cls in classes:
            cls_pixels = np.sum(pred_mask == cls)
            classes_percent[int(cls)] = round((cls_pixels / total_pixels) * 100, 2)

        # наложение
        image_rgba = image.convert("RGBA")

        mask_rgba = np.zeros((image_rgba.height, image_rgba.width, 4), dtype=np.uint8)
        mask_rgba[pred_mask > 0] = [255, 0, 0, 120]  # цвет маски

        mask_img = Image.fromarray(mask_rgba, mode="RGBA")

        result = Image.alpha_composite(image_rgba, mask_img)

        output_buffer = io.BytesIO()
        result.save(output_buffer, format='PNG')
        result_bytes = output_buffer.getvalue()

        return {
            "status_code": 200,
            "mask": result_bytes,
            "classes": classes.tolist(),
            "percent_pollution": mask_percent
        }

    except Exception as e:
        print(f"Ошибка при сегментации: {e}")
        return {
            "error": "Ошибка при сегментации.",
            "status_code": 400,
            "detail": str(e)
        }

def collect_writedata(name: str, image_bytes: bytes, percent_pollution: float):
    write_data_dict = {
        "name": name,
        "image_bytes": image_bytes,
        "percent_pollution": percent_pollution
    }
    return History(**write_data_dict)




