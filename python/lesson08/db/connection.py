"""Database engine and session configuration for the db module."""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# DATABASE_URL is loaded and validated in config.py (also used by alembic/env.py).
from config import DATABASE_URL

# The engine manages the pool of connections to the PostgreSQL database.
engine = create_engine(DATABASE_URL)

# Each instance of SessionLocal is a database session used for one request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class every SQLAlchemy mapped model class inherits from."""


def get_db() -> Session:
    """FastAPI dependency that yields a database session for one request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
