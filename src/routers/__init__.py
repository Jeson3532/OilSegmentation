from src.routers.user import router as u_router
from src.routers.admin import router as a_router
from fastapi import APIRouter
routers = []

for name, context in list(globals().items()):
    if ("_router" in name) and (type(context) is APIRouter):
        if context not in routers:
            routers.append(context)
