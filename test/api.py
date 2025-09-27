from fastapi.testclient import TestClient
import io
import aiohttp as http
import asyncio
from PIL import Image
import base64
import matplotlib.cm as cm
import numpy as np
def apply_colormap(mask):
    """Использует цветовые карты matplotlib"""
    # Нормализуем маску для цветовой карты
    normalized_mask = mask.astype(np.float32)
    if np.max(normalized_mask) > 0:
        normalized_mask = normalized_mask / np.max(normalized_mask)

    # Применяем цветовую карту (jet, viridis, tab10, etc.)
    colormap = cm.get_cmap('tab10')  # или 'viridis', 'jet', 'Set3'
    colored = (colormap(normalized_mask)[:, :, :3] * 255).astype(np.uint8)

    return Image.fromarray(colored)

# Test Image
bytearray_ = io.BytesIO()
with Image.open("../src/images/razliv.jpg") as f:
    f.save(bytearray_, format="jpeg")

async def test_segment_image(bytes_):
    try:
        async with http.ClientSession() as session:
            jsn = {
                "image": base64.b64encode(bytes_).decode("utf-8")
            }
            async with session.post("http://localhost:7766/user/segmentImage", json=jsn, timeout=10) as response:
                data = await response.json()
                print(data)
                image_bytes = base64.b64decode(data['mask'])
                mask_io = io.BytesIO(image_bytes)
                with Image.open(mask_io) as f:
                    f.save("output.png", format='png')
                return True
    except Exception as e:
        print("Ошибка тестирования:", e)

result = asyncio.run(test_segment_image(bytearray_.getvalue()))
print(result)