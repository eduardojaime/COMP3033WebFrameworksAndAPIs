"""SQLAlchemy mapped model classes (code-first approach)

These are the classes that describe the database tables.
Alembic uses this information to generate migration scripts and apply them to the database.
"""
# Import libraries
from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import date, datetime

from db.connection import Base

# Define Project class that inherits from Base class (DeclarativeBase, which is defined in db/connection.py)
class Project(Base):
    """SQLAlchemy mapped model class for the 'projects' table in the database."""
    # Define table name
    __tablename__ = "projects"
    # Define fields (columns) in the table using mapped_column and indicate their types and constraints
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    # Required fields use nullable=False, while optional fields use nullable=True or omit this value (default is True)
    name: Mapped[str] = mapped_column(nullable=False)
    due_date: Mapped[date] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(nullable=False, default="TO DO")
    # Other fields can be added too as needed
    description: Mapped[str] = mapped_column(nullable=True) # not required
    created_at: Mapped[datetime] = mapped_column(server_default=func.now()) # automatically set to current timestamp when record is created
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now()) # to keep track of updates to the record