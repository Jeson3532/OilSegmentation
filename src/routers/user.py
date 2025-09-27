from fastapi import APIRouter, HTTPException
from typing import Annotated
import base64
from src.utils import methods
from src.models import SegmentImageBody
import logging

logger = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)
router = APIRouter(prefix="/user")


@router.post("/segmentImage")
async def _(body: SegmentImageBody):
    image_bytes = body.image
    image_bytes = base64.b64decode(image_bytes)
    result = methods.segment_image(image_bytes)
    if "error" in result:
        raise HTTPException(status_code=result['status_code'],
                            detail=result['detail'])
    logger.info(123)
    a = base64.b64encode(result['mask']).decode("utf-8")
    logger.info(f"Test: {a}")
    result_dict = {
        "status": result['status_code'],
        "classes": result['classes'],
        'mask': a
    }
    return result_dict


