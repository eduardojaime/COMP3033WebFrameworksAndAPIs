# for creating the WebAPI application
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# browser origins allowed to call the API
from config import CORS_ORIGINS

# one router per API version
from routers.v1 import projects as projects_v1
from routers.v2 import projects as projects_v2

# Tag descriptions group the endpoints and are shown in Swagger UI and ReDoc
tags_metadata = [
    {"name": "Projects v1", "description": "Version 1 of the project endpoints."},
    {"name": "Projects v2", "description": "Version 2 of the project endpoints."},
]

# Declare the app object
# Swagger UI is served at /docs, ReDoc at /redoc, and the raw OpenAPI document at /openapi.json
app = FastAPI(
    title="Project Management API",
    summary="Demo API for managing course projects",
    description=(
        "Demo API for managing projects, backed by PostgreSQL.\n\n"
        "Descriptions support **Markdown**. "
        "All endpoints require HTTP Basic authentication."
    ),
    version="4.0.0",
    contact={"name": "COMP3033 Web Frameworks and APIs"},
    openapi_tags=tags_metadata,
)

# Allow browsers on these origins to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["Authorization"],
    # lets browser code read the custom version header added in Lesson 10
    expose_headers=["version"],
)

# The original URL keeps working and serves v1; it is hidden from the docs because /api/v1/projects documents the same routes
app.include_router(projects_v1.router, prefix="/api/projects", include_in_schema=False)
app.include_router(projects_v1.router, prefix="/api/v1/projects")
app.include_router(projects_v2.router, prefix="/api/v2/projects")
