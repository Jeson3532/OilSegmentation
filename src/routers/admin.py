from fastapi import APIRouter, HTTPException
from src.database.methods import BaseMethods
from src.models import GetFieldBody

router = APIRouter(prefix="/admin", tags=['Admin Methods'])

@router.get("/fieldHistory/{id_}")
async def _(id_: int):
    result = await BaseMethods.get_data(id_)
    if not result:
        raise HTTPException(status_code=400, detail="Не удалось выполнить запрос.")
    return {"data": result}

@router.get("/fieldHistory")
async def _():
    result = await BaseMethods.get_all_data()
    if not result:
        raise HTTPException(status_code=400, detail="Не удалось выполнить запрос.")
    return {"count_fields": len(result), "data": result}


