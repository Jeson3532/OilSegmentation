from pydantic_settings import BaseSettings, SettingsConfigDict
from src.utils import env_file_path
from pydantic import Field
from typing import Annotated


class Config(BaseSettings):
    model_config = SettingsConfigDict(env_file=env_file_path, extra="ignore")

    user: Annotated[str, Field(..., description="Имя пользователя базы данных.")]
    password: Annotated[str, Field(..., description="Пароль пользователя.")]
    host: Annotated[str, Field(..., description="Хост базы данных.")]
    port: Annotated[str, Field(..., description="Порт базы данных.")]
    dbname: Annotated[str, Field(..., description="Название базы данных внутри СУБД")]