"""Pydantic schemas for Project model.

These are the classes that describe the data validation and serialization for HTTP requests and responses.
"""
# Import libraries
from datetime import date, datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

# Define classes for request and response data validation and serialization
# Some constraints have to be enforced in the Pydantic schemas as well as the SQLAlchemy model
ProjectStatus = Literal["TO DO", "IN PROGRESS", "DONE"]

# Define a base project class that other classes can inherit from, this usually contains common fields and default values
class ProjectBase(BaseModel):
    """Base Pydantic model class for Project data"""
    name: str = Field(min_length=5, max_length=100)
    due_date: date
    status: ProjectStatus = "TO DO" 

# CRUD schemas
class ProjectRead(ProjectBase):
    """Serialization schema for reading Project data from the db into an object"""
    model_config = ConfigDict(from_attributes=True) # allows FastAPI to serialize a SQLAlchemy model into a Pydantic model
    id: int
    description: str | None = None # Nullable field, optional
    created_at: datetime
    updated_at: datetime

