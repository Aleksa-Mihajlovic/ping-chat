from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.db.database import get_db

class BaseService():
    def __init__(self, session: AsyncSession = Depends(get_db)):
        self.session = session