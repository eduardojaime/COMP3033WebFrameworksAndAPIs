"""SQLAlchemy mapped model classes (code-first ORM models).

These classes describe the database tables. Alembic compares them against
the live database schema to autogenerate migrations.
"""
from datetime import date, datetime

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column

from db.connection import Base


class Project(Base):
    """Maps to the 'projects' table created by the Alembic migrations."""

    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    due_date: Mapped[date] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(nullable=False, default="Not Started")
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )
