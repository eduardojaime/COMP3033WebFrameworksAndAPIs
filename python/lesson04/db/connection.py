"""Database engine and session configuration for the db module."""
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Load variables from a local .env file, if present, into the environment.
load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Copy .env.example to .env and set your "
        "PostgreSQL connection string before starting the server."
    )

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
