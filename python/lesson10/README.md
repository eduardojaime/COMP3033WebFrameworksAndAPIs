# Python Lesson 10: API Versioning

## Learning objectives

By the end of this lesson, you should be able to:

- Explain why APIs are versioned and why existing endpoints must keep working.
- Version an endpoint with a query parameter such as `?v=2`.
- Version an API with path prefixes such as `/api/v1/projects` and `/api/v2/projects` by using FastAPI routers.
- Identify the API version in a response with a custom header.
- See each version documented separately in Swagger UI.
- Test versioned endpoints in Postman.

## Prerequisites

- Python 3.x and the dependencies listed in `requirements.txt`.
- A PostgreSQL database configured for this lesson (the same setup as Lessons 08 and 09).
- [Postman](https://www.postman.com/downloads/) for testing requests.

This lesson starts from the finished Lesson 09 API: project CRUD endpoints protected with HTTP Basic and documented with OpenAPI metadata. Copy the Lesson 09 folder to `python/lesson10` (without `.venv`) before you begin.

## Set up the lesson

If this lesson does not already have a virtual environment, create one and install the listed dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Copy `.env.example` to `.env` and set your local database URL and demo credentials. Never commit `.env` or real credentials.

Start the API from this lesson's folder and keep it running while you work:

```powershell
uvicorn server:app --reload --port 3000
```

## Why version an API?

Clients that you do not control, such as mobile apps and other teams' services, depend on the shape of your responses. If you rename a field or change a status code, you break them. Versioning lets you publish a new behaviour (v2) while the old behaviour (v1) keeps working until clients have moved.

The most important rule of this lesson: **when you add versioning to an existing API, the URLs that already work must keep working.**

Two common strategies are covered here:

| Strategy | Example | Notes |
| --- | --- | --- |
| Query parameter | `GET /api/projects/?v=2` | Easy to add to one endpoint; the version is optional and defaults to v1 |
| Path | `GET /api/v2/projects/` | The version is visible in the URL and each version can have its own code and documentation |

## Part 1: Query-parameter versioning

For simplicity, apply this to one endpoint: `GET /api/projects/` in `server.py`. (Versioning can also be applied to the whole API, as in Part 2.)

1. In `server.py`, import `Literal`:

   ```python
   from typing import Annotated, Literal
   ```

2. Move the query code out of the route function into a new function called `get_projects_v1`, placed above the routes. The route becomes a small dispatcher in step 4.

   ```python
   def get_projects_v1(
       db: Session, course: str | None, status: ProjectStatus | None, page: int
   ) -> list[Project]:
       page_size = 10
       query = db.query(Project)

       if course is not None:
           query = query.filter(Project.course == course)
       if status is not None:
           query = query.filter(Project.status == status)

       # ID is a tie-breaker so pages are stable when names match
       return (
           query.order_by(Project.name.asc(), Project.id.asc())
           .offset((page - 1) * page_size)
           .limit(page_size)
           .all()
       )
   ```

3. Add a `get_projects_v2` function that reports that v2 is a work in progress. `501 Not Implemented` is the matching HTTP status:

   ```python
   def get_projects_v2() -> list[Project]:
       raise HTTPException(
           status_code=status.HTTP_501_NOT_IMPLEMENTED,
           detail="Version 2 of this endpoint is a work in progress",
       )
   ```

4. Add a `v` query parameter to `list_projects` and dispatch on it. The default is `"1"`, so requests that do not send `v` behave exactly as before:

   ```python
   def list_projects(
       course: str | None = Query(default=None, description="Only return projects for this course"),
       status: ProjectStatus | None = Query(default=None, description="Only return projects with this status"),
       page: int = Query(default=1, ge=1, description="Page number, 10 projects per page"),
       v: Literal["1", "2"] = Query(default="1", description="API version (query-parameter versioning)"),
       db: Session = Depends(get_db),
   ) -> list[Project]:
       """Return one page of projects ordered by name.

       Combine `course` and `status` to filter the results.
       """
       match v:
           case "1":
               return get_projects_v1(db, course, status, page)
           case "2":
               return get_projects_v2()
   ```

   The Node.js version of this exercise needs a `default` case that returns a "bad request" response for unknown versions. Here, `Literal["1", "2"]` does that job: FastAPI rejects any other value with `422 Unprocessable Entity` before your function runs.

5. Make sure the server is running, then test in Postman (the project requests from earlier lessons already exist; use your Basic Auth credentials):
   - `GET http://localhost:3000/api/projects/` returns the project list, as before.
   - Duplicate that request and add a query parameter `v` with the value `1`. It returns the same list.
   - Change `v` to `2`. It returns `501` with the "work in progress" message.
   - Change `v` to `3`. It returns `422` with a validation error that lists the allowed values.
6. Open <http://localhost:3000/docs>. The `v` parameter appears on the endpoint with its allowed values.

## Part 2: Path-based versioning with routers

Putting every version in `server.py` would make it grow quickly. FastAPI's `APIRouter` lets you group related routes in their own module, and `app.include_router(..., prefix=...)` mounts that group at a URL prefix. You will create one router per version.

### Move authentication to its own module

Both routers need the authentication dependency, and `server.py` will import the routers, so the dependency cannot stay in `server.py` (the modules would import each other). Create `security.py` and move the Basic authentication code into it:

```python
from secrets import compare_digest
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from config import BASIC_AUTH_PASSWORD, BASIC_AUTH_USERNAME

# the description appears in Swagger UI's Authorize dialog
basic_auth = HTTPBasic(description="Use the demo username and password from your .env file")


def require_basic_auth(
    credentials: Annotated[HTTPBasicCredentials, Depends(basic_auth)],
) -> str:
    # compare_digest avoids leaking information through comparison timing
    username_matches = compare_digest(
        credentials.username, BASIC_AUTH_USERNAME
    )
    password_matches = compare_digest(
        credentials.password, BASIC_AUTH_PASSWORD
    )

    if not (username_matches and password_matches):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username
```

### Create the v1 router

1. Create these folders and empty files inside the lesson folder:

   ```text
   routers/
       __init__.py
       v1/
           __init__.py
           projects.py
       v2/
           __init__.py
           projects.py
   ```

2. Put the existing project routes in `routers/v1/projects.py`. They are the same routes as before, with these changes:
   - They use `@router` instead of `@app`.
   - Their paths are relative (`"/"` and `"/{project_id}"`). The prefix comes from `server.py`.
   - The authentication dependency, the `401` response, and the tag are set once on the router instead of on every route.

   ```python
   # Handles /api/v1/projects (and the legacy /api/projects alias)
   from typing import Literal

   from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
   from sqlalchemy.orm import Session

   from db.connection import get_db
   from db.models import Project
   from schemas import ProjectCreate, ProjectRead, ProjectStatus, ProjectUpdate
   from security import require_basic_auth

   # every route in this router requires Basic authentication
   router = APIRouter(
       tags=["Projects v1"],
       dependencies=[Depends(require_basic_auth)],
       responses={401: {"description": "Missing or invalid Basic credentials"}},
   )


   def get_projects_v1(
       db: Session, course: str | None, status: ProjectStatus | None, page: int
   ) -> list[Project]:
       page_size = 10
       query = db.query(Project)

       if course is not None:
           query = query.filter(Project.course == course)
       if status is not None:
           query = query.filter(Project.status == status)

       # ID is a tie-breaker so pages are stable when names match
       return (
           query.order_by(Project.name.asc(), Project.id.asc())
           .offset((page - 1) * page_size)
           .limit(page_size)
           .all()
       )


   def get_projects_v2() -> list[Project]:
       raise HTTPException(
           status_code=status.HTTP_501_NOT_IMPLEMENTED,
           detail="Version 2 of this endpoint is a work in progress",
       )


   @router.get(
       "/",
       response_model=list[ProjectRead],
       summary="Get projects with optional filters and pagination",
   )
   def list_projects(
       course: str | None = Query(default=None, description="Only return projects for this course"),
       status: ProjectStatus | None = Query(default=None, description="Only return projects with this status"),
       page: int = Query(default=1, ge=1, description="Page number, 10 projects per page"),
       v: Literal["1", "2"] = Query(default="1", description="API version (query-parameter versioning)"),
       db: Session = Depends(get_db),
   ) -> list[Project]:
       """Return one page of projects ordered by name.

       Combine `course` and `status` to filter the results.
       """
       match v:
           case "1":
               return get_projects_v1(db, course, status, page)
           case "2":
               return get_projects_v2()


   @router.post(
       "/",
       response_model=ProjectRead,
       status_code=status.HTTP_201_CREATED,
       summary="Create a project",
   )
   def create_project(
       payload: ProjectCreate,
       db: Session = Depends(get_db),
   ) -> Project:
       """Create a project. `status` defaults to `TO DO` when omitted."""
       project = Project(**payload.model_dump())
       db.add(project)
       db.commit()
       db.refresh(project)
       return project


   @router.put(
       "/{project_id}",
       response_model=ProjectRead,
       summary="Replace a project",
       responses={404: {"description": "Project not found"}},
   )
   def update_project(
       project_id: int,
       payload: ProjectUpdate,
       db: Session = Depends(get_db),
   ) -> Project:
       """Replace every editable field of an existing project."""
       project = db.get(Project, project_id)
       if project is None:
           raise HTTPException(status_code=404, detail="Project not found")

       project.name = payload.name
       project.due_date = payload.due_date
       project.course = payload.course
       project.status = payload.status

       db.commit()
       db.refresh(project)
       return project


   @router.delete(
       "/{project_id}",
       status_code=status.HTTP_204_NO_CONTENT,
       summary="Delete a project",
       responses={404: {"description": "Project not found"}},
   )
   def delete_project(project_id: int, db: Session = Depends(get_db)) -> Response:
       """Delete a project by ID. A successful delete returns no body."""
       project = db.get(Project, project_id)
       if project is None:
           raise HTTPException(status_code=404, detail="Project not found")

       db.delete(project)
       db.commit()
       return Response(status_code=status.HTTP_204_NO_CONTENT)
   ```

### Create the v2 router

Version 2 starts as a copy of the list endpoint. For now it returns the same data as v1, plus a custom `version` response header that identifies the version that answered. A FastAPI route adds response headers through a `Response` parameter.

Create `routers/v2/projects.py`:

```python
# Handles /api/v2/projects
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from db.connection import get_db
from db.models import Project
from routers.v1.projects import get_projects_v1
from schemas import ProjectRead, ProjectStatus
from security import require_basic_auth

router = APIRouter(
    tags=["Projects v2"],
    dependencies=[Depends(require_basic_auth)],
    responses={401: {"description": "Missing or invalid Basic credentials"}},
)


@router.get(
    "/",
    response_model=list[ProjectRead],
    summary="Get projects with optional filters and pagination (v2)",
)
def list_projects(
    response: Response,
    course: str | None = Query(default=None, description="Only return projects for this course"),
    status: ProjectStatus | None = Query(default=None, description="Only return projects with this status"),
    page: int = Query(default=1, ge=1, description="Page number, 10 projects per page"),
    db: Session = Depends(get_db),
) -> list[Project]:
    """Same results as v1 for now; the custom `version` response header identifies v2."""
    response.headers["version"] = "apiv2"
    return get_projects_v1(db, course, status, page)
```

v2 reuses `get_projects_v1` so the query logic is not duplicated. When v2's behaviour diverges, give it its own query code so that changing v2 never changes v1. Only `GET` is implemented in v2; the other operations are added to v2 only when they change.

### Mount the routers in server.py

Replace the contents of `server.py` with this. The route functions and the authentication code are gone, because they now live in the routers and in `security.py`:

```python
# for creating the WebAPI application
from fastapi import FastAPI

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

# The original URL keeps working and serves v1; it is hidden from the docs because /api/v1/projects documents the same routes
app.include_router(projects_v1.router, prefix="/api/projects", include_in_schema=False)
app.include_router(projects_v1.router, prefix="/api/v1/projects")
app.include_router(projects_v2.router, prefix="/api/v2/projects")
```

The same v1 router is mounted twice. `/api/projects` is the original, unversioned URL, so existing clients are not broken. `/api/v1/projects` is the explicit v1 URL that new clients should use. `include_in_schema=False` keeps the duplicate out of the documentation.

### Test the versions

With the server running, test in Postman:

1. `GET http://localhost:3000/api/projects/` still works (original URL).
2. Duplicate it and change the URL to `http://localhost:3000/api/v1/projects/`. It returns the same list.
3. Duplicate it again and change the URL to `http://localhost:3000/api/v2/projects/`. It returns the list as well. Open the **Headers** tab of the response and confirm that a `version` header with the value `apiv2` is present. The v1 responses do not have it.
4. Send `POST` to `/api/v1/projects/` to confirm the other v1 operations still work after the refactor.
5. Send `POST` to `/api/v2/projects/`. It returns `405 Method Not Allowed`, because v2 only implements `GET`.
6. Remove the Basic Auth settings from one request and confirm all versions return `401`.

## Part 3: Versions in the documentation

Open <http://localhost:3000/docs>. Swagger UI shows two groups, **Projects v1** and **Projects v2**, with the tag descriptions from `server.py`. Each version has its own endpoints, summaries, and parameters. Check that:

- `/api/v1/projects/` has the `v` query parameter, and `/api/v2/projects/` does not.
- The unversioned `/api/projects/` does not appear, because of `include_in_schema=False`.
- The **Authorize** button still unlocks all of the endpoints.

Open `/openapi.json` and look at the `paths` section: each versioned URL is its own entry.

Because the routers keep each version separate, you can also retire one gracefully. Add `deprecated=True` to a route decorator, such as `@router.get("/", deprecated=True, ...)`, and Swagger UI shows the endpoint as struck through while it keeps working.

## Choosing a strategy

| | Query parameter | Path |
| --- | --- | --- |
| Existing URLs | Unchanged, the version is optional | Keep the original URL as an alias of v1 |
| Visibility | Easy to miss; part of the query string | Clear in every URL and log line |
| Code organization | Branching inside the endpoint | One router per version |
| Documentation | One entry that mixes versions | One entry per version |
| Caching and routing | The same path for every version | Different paths, simpler to cache and route |

Path-based versioning is the more common choice for public APIs. Query-parameter versioning is useful for adding a version to a single endpoint without restructuring the application.

## Review questions

1. Why must the original `/api/projects/` URL keep working after versioning is added?
2. What happens when a client sends `?v=3`, and which part of the code produces that response?
3. Why was the authentication code moved into `security.py`?
4. What does `app.include_router(..., prefix=...)` do, and why is the v1 router mounted twice?
5. Why does v2 currently only answer `GET`, and what would a client see when it calls `POST` on v2?
6. When would you choose query-parameter versioning over path-based versioning?
