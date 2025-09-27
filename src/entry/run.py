from fastapi import FastAPI
import uvicorn

from src.routers import routers
app = FastAPI()


for router in routers:
    app.include_router(router)

if __name__ == '__main__':
    uvicorn.run("src.entry.run:app", reload=True, port=7766)