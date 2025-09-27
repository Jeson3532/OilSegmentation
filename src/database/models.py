from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, text, func, DateTime, Text, LargeBinary
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from src.utils.config import Config
import logging
from datetime import datetime

logger = logging.getLogger()
logging.basicConfig(level=logging.DEBUG)

config = Config()

host = config.host
port = config.port
user = config.user
password = config.password
dbname = config.dbname
url = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{dbname}"

engine = create_async_engine(url)
session_maker = async_sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    ...


class History(Base):
    __tablename__ = "history"

    field_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(comment="Название месторождения")
    image_bytes: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    percent_pollution: Mapped[float] = mapped_column()

    @classmethod
    async def create_table(cls):
        async with engine.begin() as connect:
            await connect.run_sync(
                lambda conn: cls.metadata.drop_all(bind=conn, tables=[cls.__table__])
            )

            logger.info(f"Создаю базу данных {cls.__tablename__}...")
            query = cls.metadata.create_all
            await connect.run_sync(query)
            logger.info("База данных создана!")