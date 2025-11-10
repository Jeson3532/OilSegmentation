from pydantic import BaseModel, Field
from datetime import datetime


class SegmentImageBody(BaseModel):
    name: str = Field(..., description="Название месторождения")
    image: str = Field(..., description="Байтовое представление снимка, конвертированное в base64-строку")

class GetFieldBody(BaseModel):
    index: int = Field(..., description="Индекс истории")


class WriteDataModel(BaseModel):
    name: str
    image_base64: str
    percent_pollution: float

    class Config:
        from_attributes = True
