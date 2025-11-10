from src.models import WriteDataModel
from src.database.models import session_maker, History
from sqlalchemy import select
import logging
import asyncio
import base64

logger = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)


def orm_to_dict(obj):
    if obj is None:
        return None

    data = {}
    for column in obj.__table__.columns:
        value = getattr(obj, column.name)
        if column.name == "image_bytes" and value is not None:
            value = base64.b64encode(value).decode("utf-8")
        data[column.name] = value
    return data

def orm_list_to_dicts(results):
    return [orm_to_dict(obj) for obj in results]

class BaseMethods:
    @classmethod
    async def write_data(cls, data: WriteDataModel):
        async with session_maker() as session:
            try:
                session.add(data)
                await session.commit()
                return True
            except Exception as e:
                logger.info(f"Ошибка при выполнении запроса в базе данных: {e}")
                return False
    @classmethod
    async def get_data(cls, index_: int):
        async with session_maker() as session:
            try:
                query = select(History).where(History.field_id == index_)
                st = await session.execute(query)
                result = st.scalars().first()
                return orm_to_dict(result)
            except Exception as e:
                logger.info(f"Ошибка при выполнении запроса в базе данных: {e}")
                return False

    @classmethod
    async def get_all_data(cls):
        async with session_maker() as session:
            try:
                query = select(History)
                st = await session.execute(query)
                result = st.scalars().all()
                return orm_list_to_dicts(result)
            except Exception as e:
                logger.info(f"Ошибка при выполнении запроса в базе данных: {e}")
                return False

# result = asyncio.run(BaseMethods.get_data(1))
# print(result)