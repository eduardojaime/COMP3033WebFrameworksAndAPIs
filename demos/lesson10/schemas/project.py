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
# Avoids repeating the same fields in multiple classes
class ProjectBase(BaseModel):
    """Base Pydantic model class for Project data"""
    name: str = Field(min_length=5, max_length=100)
    due_date: date
    status: ProjectStatus = "TO DO" 

# CRUD schemas
# This model controls the shape of the data returned by API calls
class ProjectRead(ProjectBase):
    """Serialization schema for reading Project data from the db into an object"""
    model_config = ConfigDict(from_attributes=True) # allows FastAPI to serialize a SQLAlchemy model into a Pydantic model
    id: int
    description: str | None = None # Nullable field, optional
    created_at: datetime
    updated_at: datetime

# Validates data supplied by client on POST requests for creating a project
class ProjectCreate(ProjectBase):
    """Validation schema for creating a new Project in the db"""
    description: str | None = None # Nullable field, optional
    status: ProjectStatus = "TO DO" # Default value for status field when creating a new project

# Validates data supplied by client on PUT requests for updating a project
class ProjectUpdate(ProjectBase):
    """Validation schema for updating an existing Project in the db"""
    # other than the fields inherited from ProjectBase, we can except description when updating a project
    description: str | None = None # Nullable field, optional
