from fastapi.testclient import TestClient
import io
import aiohttp as http
import asyncio
from PIL import Image
import base64
import matplotlib.cm as cm
import numpy as np
import os


def save_path(name: str):
    cur_dir = os.path.dirname(__file__)
    output_path = os.path.join(cur_dir, "..", "output", name)
    return output_path


def apply_colormap(mask):
    normalized_mask = mask.astype(np.float32)
    if np.max(normalized_mask) > 0:
        normalized_mask = normalized_mask / np.max(normalized_mask)

    colormap = cm.get_cmap('tab10')
    colored = (colormap(normalized_mask)[:, :, :3] * 255).astype(np.uint8)

    return Image.fromarray(colored)



bytearray_ = io.BytesIO()
with Image.open("../src/images/razliv.jpg") as f:
    f.save(bytearray_, format="jpeg")


async def test_segment_image(bytes_):
    try:
        async with http.ClientSession() as session:
            jsn = {
                "image": base64.b64encode(bytes_).decode("utf-8"),
                "name": "Самотлорское месторождение"
            }
            async with session.post("http://localhost:7766/user/segmentImage", json=jsn, timeout=10) as response:
                data = await response.json()
                image_bytes = base64.b64decode(data['mask'])
                mask_io = io.BytesIO(image_bytes)
                with Image.open(mask_io) as f:
                    f.save(save_path("last.png"), format='png')
                return data
    except Exception as e:
        print("Ошибка тестирования:", e)


result = asyncio.run(test_segment_image(bytearray_.getvalue()))
print(result)
