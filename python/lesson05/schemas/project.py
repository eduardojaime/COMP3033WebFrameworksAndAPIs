"""Pydantic response schema for the Project entity.

This is intentionally separate from the SQLAlchemy model class in
db/models.py. The ORM model describes the database table; this schema
describes the shape of the HTTP response body.
"""
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ProjectStatus = Literal["Not Started", "In Progress", "Completed"]


class ProjectBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    due_date: date
    status: ProjectStatus = "Not Started"

class ProjectRead(ProjectBase):
    """Serializes a Project row in API responses."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
