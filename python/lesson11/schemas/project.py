"""Pydantic response schema for the Project entity.

This is intentionally separate from the SQLAlchemy model class in
db/models.py. The ORM model describes the database table; this schema
describes the shape of the HTTP response body.
"""
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ProjectStatus = Literal["TO DO", "IN PROGRESS", "DONE"]


class ProjectBase(BaseModel):
    # description and examples are copied into the OpenAPI schema and Swagger UI
    name: str = Field(
        min_length=1,
        max_length=100,
        description="Project name",
        examples=["Final API project"],
    )
    due_date: date = Field(description="Due date (YYYY-MM-DD)", examples=["2026-12-15"])
    course: str = Field(
        min_length=1,
        max_length=100,
        description="Course the project belongs to",
        examples=["COMP3033"],
    )
    status: ProjectStatus = Field(description="Current project status")


class ProjectCreate(ProjectBase):
    """Validates the body of POST /api/projects/."""

    status: ProjectStatus = Field(
        default="TO DO", description="Current project status"
    )


class ProjectUpdate(ProjectBase):
    """Validates the complete replacement body of PUT /api/projects/{id}."""


class ProjectRead(ProjectBase):
    """Serializes a Project row in an API response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
