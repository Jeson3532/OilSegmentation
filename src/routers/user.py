from fastapi import APIRouter, HTTPException
from typing import Annotated
import base64
from src.utils import methods
from src.models import SegmentImageBody
from src.database.methods import BaseMethods
import logging

logger = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)
router = APIRouter(prefix="/user", tags=['User Methods'])


@router.post("/segmentImage")
async def _(body: SegmentImageBody):
    image_b64 = body.image
    image_bytes = base64.b64decode(image_b64)
    result = methods.segment_image(image_bytes)
    if "error" in result:
        raise HTTPException(status_code=result['status_code'],
                            detail=result['detail'])
    encoded_mask = base64.b64encode(result['mask']).decode("utf-8")
    percent_pol = result['percent_pollution']
    collected_writedata = methods.collect_writedata(name=body.name,
                                                    image_bytes=image_bytes,
                                                    percent_pollution=percent_pol)
    await BaseMethods.write_data(collected_writedata)
    result_dict = {
        "status": result['status_code'],
        "classes": result['classes'],
        'mask': encoded_mask,
        'percent_pollution': percent_pol
    }
    return result_dict


