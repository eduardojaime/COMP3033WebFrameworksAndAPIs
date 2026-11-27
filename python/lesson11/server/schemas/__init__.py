"""Pydantic schemas package.

Each module groups the response schemas for one entity, the same way
db/models.py groups SQLAlchemy mapped classes. Schemas are re-exported here
so callers can keep writing `from schemas import ProjectRead` instead of
reaching into submodules.
"""
from schemas.project import (
    ProjectBase,
    ProjectCreate,
    ProjectRead,
    ProjectStatus,
    ProjectUpdate,
)

__all__ = [
    "ProjectBase",
    "ProjectCreate",
    "ProjectRead",
    "ProjectStatus",
    "ProjectUpdate",
]
