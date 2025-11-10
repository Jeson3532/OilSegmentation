from fastapi import FastAPI
from src.database.models import History
import uvicorn
import asyncio

from src.routers import routers
app = FastAPI()


for router in routers:
    app.include_router(router)


async def create_tables():
    await History.create_table()


if __name__ == '__main__':
    asyncio.run(create_tables())
    uvicorn.run("src.entry.run:app", reload=True, port=7766)