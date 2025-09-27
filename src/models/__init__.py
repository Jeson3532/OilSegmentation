from pydantic import BaseModel, Field

class SegmentImageBody(BaseModel):
    image: bytes = Field(..., description="Байтовое представление снимка")