"""Database engine and session configuration for SQLAlchemy."""
# Import libraries
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Load environment variables from .env file
load_dotenv()

# Configure the database engine using the connection string from the environment variable
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set.")

# Engine manages the connection pool
engine = create_engine(DATABASE_URL)

# Instance of SessionLocal class to create a database session per request
# autocommit=False: Changes are not automatically committed to the database
# autoflush=False: Changes are not automatically flushed to the database
# bind=engine: Binds the session to the database engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classes to manage database sessions using context management
class Base(DeclarativeBase):
    """Base class that SQLAlchemy mapped model classes inherit from."""

def get_db():
    """Fast API dependency that provides a database session for each request."""
    db = SessionLocal()
    try:
        # Provide the database session to the request context
        yield db
    finally:
        # Close the db session after every request or an error if not needed anymore
        db.close()