# Lesson 05: Complete CRUD Operations for Projects

## Part 1: API Goals Canvas

| Who | What | How | Input | Output | Status Codes |
|-|-|-|-|-|-
| User | Manage Projects | Search for Projects | Nothing or project name | List of matching projects | TBD |
| - | - | Add new Projects | Project information | New project information | TBD |
| - | - | Update Projects | Project information | Updated project information | TBD |
| - | - | Delete Projects | Project ID | Nothing | TBD |
| Admin | Manage Courses | Search for Courses | Nothing or course name | List of matching courses | TBD |
| - | - | Add new Courses | Course information | New course information | TBD |
| - | - | Update Courses | Course information | Updated course information | TBD |
| - | - | Delete Courses | Course ID | Nothing | TBD |

## Part 2: Endpoint List

| What | How | Endpoint | Parameters | Method | Description | Status Codes |
|-|-|-|-|-|-|-
| Manage Projects | Search for projects | `/api/projects/` | None for now | `GET` | Lists all projects in the database | `200` on success |
| - | Create new project | `/api/projects/` | Project information in the request body as JSON | `POST` | Inserts the given project into the database | `201` on success, `422` for invalid input |
| - | Update a project | `/api/projects/{project_id}` | `project_id` path parameter and complete project object in the request body | `PUT` | Replaces a project in the database | `200` on success, `404` if not found, `422` for invalid input |
| - | Delete a project | `/api/projects/{project_id}` | `project_id` path parameter | `DELETE` | Deletes the project with the specified ID | `204` on success, `404` if not found |

The course-management rows are planning examples for a future feature. This
lesson implements the **Project** CRUD operations only.

## Learning objectives

By the end of this lesson, you should be able to:

- Explain the four CRUD operations: Create, Read, Update, and Delete.
- Design CRUD endpoints using HTTP methods and status codes.
- Validate request bodies with Pydantic models.
- Create database records with SQLAlchemy sessions.
- Read project records from PostgreSQL.
- Replace an existing project with a `PUT` request.
- Delete a project with a `DELETE` request.
- Handle missing records with `404 Not Found`.
- Handle invalid request bodies with FastAPI and Pydantic validation.
- Test CRUD endpoints with Postman.

## Prerequisites

- Completion of [Lesson 04](../lesson04/README.md).
- Python 3.x installed. On Windows, the Python launcher is usually available as `py`.
- Visual Studio Code and the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
- A PostgreSQL database on Render.com, Supabase, Neon, or another PostgreSQL provider.
- The Lesson 04 virtual environment and dependencies.
- [Postman](https://www.postman.com/downloads/) for testing requests.

## Part 3: Review the project structure

Lesson 05 extends the modular structure established in Lesson 04:

```text
lesson05/
├── .env.example
├── .gitignore
├── README.md
├── requirements.txt
├── server.py
├── db/
│   ├── __init__.py
│   ├── connection.py
│   └── models.py
├── schemas/
│   ├── __init__.py
│   └── project.py
└── alembic/
    ├── env.py
    ├── script.py.mako
    └── versions/
```

The responsibilities remain separated:

- `db/connection.py` creates the SQLAlchemy engine and database sessions.
- `db/models.py` defines the `Project` mapped class.
- `schemas/project.py` defines Pydantic request and response schemas.
- `server.py` defines the FastAPI routes and CRUD operations.
- `alembic/` contains version-controlled database migrations.

You can copy the `.gitignore` content from the [Lesson 04 instructions](../lesson04/README.md#part-3-configure-gitignore), or use the [Python.gitignore](https://github.com/github/gitignore/blob/main/Python.gitignore) template.

## Part 4: Confirm the database and migration

Use the PostgreSQL database configured in Lesson 04. If you are creating a
new database, use one of the providers described in the Lesson 04
instructions:

- [Render.com](https://render.com)
- [Supabase](https://supabase.com)
- [Neon](https://neon.com)

From the `python/lesson05` folder, create and activate a virtual environment
if needed, install the dependencies, and configure `DATABASE_URL` in `.env`:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
```

The SQLAlchemy URL should use the `psycopg` driver:

```text
DATABASE_URL=postgresql+psycopg://user:password@host:5432/project_tracker?sslmode=require
```

Apply the existing migrations before starting the API:

```powershell
alembic upgrade head
```

Confirm that the `projects` table exists. It may be empty at the beginning of
the lesson. The `POST` endpoint in Part 6 will create the first project.

## Part 5: Define Pydantic CRUD schemas

Update `schemas/project.py`. The read-only Lesson 04 schema is extended with
separate schemas for creating and replacing projects:

```python
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ProjectStatus = Literal["Not Started", "In Progress", "Completed"]


class ProjectBase(BaseModel):
	name: str = Field(min_length=1, max_length=100)
	due_date: date
	status: ProjectStatus = "Not Started"


class ProjectCreate(ProjectBase):
	"""Validates the body of POST /api/projects/."""


class ProjectUpdate(ProjectBase):
	"""Validates the complete replacement body of PUT /api/projects/{id}."""


class ProjectRead(ProjectBase):
	"""Serializes a Project row in an API response."""

	model_config = ConfigDict(from_attributes=True)

	id: int
	created_at: datetime
	updated_at: datetime
```

The schemas have different responsibilities:

- `ProjectCreate` validates data supplied by a client creating a project.
- `ProjectUpdate` validates data supplied by a client replacing a project.
- `ProjectRead` controls the shape of data returned by the API.
- `ProjectBase` avoids repeating common project fields.

For this lesson, `PUT` means a complete replacement. The client must send
all fields required by `ProjectUpdate`. A later lesson could introduce
`PATCH` and a separate schema where every field is optional.

Update `schemas/__init__.py` so the route module can import the schemas from
the package:

```python
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
```

FastAPI validates the request body before the route function runs. Invalid
data returns `422 Unprocessable Entity` with details about the failed field.

## Part 6: Implement `POST /api/projects/`

Add the following imports to `server.py`:

```python
from fastapi import Depends, FastAPI, HTTPException, Response, status
from sqlalchemy.orm import Session

from db.connection import get_db
from db.models import Project
from schemas import ProjectCreate, ProjectRead, ProjectUpdate
```

Add a route that creates a SQLAlchemy object from the validated Pydantic
payload:

```python
@app.post(
	"/api/projects/",
	response_model=ProjectRead,
	status_code=status.HTTP_201_CREATED,
	summary="Create a project",
)
def create_project(
	payload: ProjectCreate,
	db: Session = Depends(get_db),
) -> Project:
	project = Project(**payload.model_dump())
	db.add(project)
	db.commit()
	db.refresh(project)
	return project
```

The operation is:

1. FastAPI receives the JSON request body.
2. Pydantic validates it as `ProjectCreate`.
3. `model_dump()` converts the validated object to a dictionary.
4. SQLAlchemy creates a `Project` instance.
5. `db.add()` stages the object for insertion.
6. `db.commit()` saves the row to PostgreSQL.
7. `db.refresh()` loads generated values such as `id` and timestamps.
8. FastAPI serializes the result using `ProjectRead`.

## Part 7: Implement `GET /api/projects/`

Keep the read endpoint from Lesson 04:

```python
@app.get(
	"/api/projects/",
	response_model=list[ProjectRead],
	summary="Get all projects",
)
def list_projects(db: Session = Depends(get_db)) -> list[Project]:
	return db.query(Project).all()
```

This route reads every project from PostgreSQL and returns a JSON array. The
response model ensures that database objects are serialized consistently.

## Part 8: Implement `PUT /api/projects/{project_id}`

Add a route that replaces an existing project:

```python
@app.put(
	"/api/projects/{project_id}",
	response_model=ProjectRead,
	summary="Replace a project",
)
def update_project(
	project_id: int,
	payload: ProjectUpdate,
	db: Session = Depends(get_db),
) -> Project:
	project = db.get(Project, project_id)
	if project is None:
		raise HTTPException(status_code=404, detail="Project not found")

	project.name = payload.name
	project.due_date = payload.due_date
	project.status = payload.status

	db.commit()
	db.refresh(project)
	return project
```

The path parameter identifies the row to update. The request body supplies a
complete replacement. If the ID does not exist, the API returns `404 Not
Found` and does not modify the database.

## Part 9: Implement `DELETE /api/projects/{project_id}`

Add a route that deletes an existing project:

```python
@app.delete(
	"/api/projects/{project_id}",
	status_code=status.HTTP_204_NO_CONTENT,
	summary="Delete a project",
)
def delete_project(project_id: int, db: Session = Depends(get_db)) -> Response:
	project = db.get(Project, project_id)
	if project is None:
		raise HTTPException(status_code=404, detail="Project not found")

	db.delete(project)
	db.commit()
	return Response(status_code=status.HTTP_204_NO_CONTENT)
```

The endpoint returns `204 No Content` after a successful deletion. A `204`
response should not contain a JSON response body. If the project does not
exist, it returns `404 Not Found`.

## Part 10: Complete `server.py`

After adding all four operations, the controller should contain these routes:

| Method | Route | Operation |
| --- | --- | --- |
| `GET` | `/api/projects/` | Read all projects |
| `POST` | `/api/projects/` | Create a project |
| `PUT` | `/api/projects/{project_id}` | Replace a project |
| `DELETE` | `/api/projects/{project_id}` | Delete a project |

The complete route module should use the shared `get_db` dependency and the
shared `Project` mapped class. Do not create tables with `Base.metadata.create_all()`
in `server.py`; Alembic owns schema creation and changes.

## Part 11: Run the API

Start the application from the `python/lesson05` folder:

```powershell
uvicorn server:app --reload --port 3000
```

Open the generated documentation:

- [http://localhost:3000/docs](http://localhost:3000/docs)
- [http://localhost:3000/redoc](http://localhost:3000/redoc)

The Swagger UI should display `GET`, `POST`, `PUT`, and `DELETE` operations
for the project resource.

## Part 12: Test `POST` with Postman

Create a Postman request:

- Method: `POST`
- URL: `http://localhost:3000/api/projects/`
- Header: `Content-Type: application/json`
- Body type: raw JSON

```json
{
  "name": "Assignment 02",
  "due_date": "2026-11-02",
  "status": "Not Started"
}
```

Expected result:

- Status: `201 Created`
- Response includes `id`, `name`, `due_date`, `status`, `created_at`, and
  `updated_at`.

Try invalid request bodies as well:

- Omit `name`.
- Set `name` to an empty string.
- Use `"not-a-date"` for `due_date`.
- Use an unsupported status such as `"Done"`.

Each invalid request should return `422 Unprocessable Entity` with validation
details. The invalid data should not be inserted into PostgreSQL.

## Part 13: Test `GET` with Postman

Create a Postman request:

- Method: `GET`
- URL: `http://localhost:3000/api/projects/`

Expected result:

- Status: `200 OK`
- Response is a JSON array.
- The project created in Part 12 appears in the array.

Restart the API and repeat the request. The project should still exist,
demonstrating that it was stored in PostgreSQL rather than in memory.

## Part 14: Test `PUT` with Postman

Use the `id` returned by the POST request:

- Method: `PUT`
- URL: `http://localhost:3000/api/projects/1`
- Header: `Content-Type: application/json`
- Body type: raw JSON

```json
{
  "name": "Updated Assignment 02",
  "due_date": "2026-11-09",
  "status": "In Progress"
}
```

Expected result:

- Status: `200 OK`
- The response contains the updated values.
- `updated_at` changes.

Send the request with an ID that does not exist. The expected result is
`404 Not Found`.

## Part 15: Test `DELETE` with Postman

Use the project ID:

- Method: `DELETE`
- URL: `http://localhost:3000/api/projects/1`

Expected result:

- Status: `204 No Content`.
- The response has no JSON body.

Send `GET /api/projects/` again to confirm the project was removed. Send the
same DELETE request a second time to confirm that a missing project returns
`404 Not Found`.

## Part 16: Alembic and CRUD

The CRUD routes change data rows, not the database structure. Alembic remains
responsible for structural changes such as adding a column:

1. Change the SQLAlchemy mapped class in `db/models.py`.
2. Update the relevant Pydantic schemas in `schemas/project.py`.
3. Generate a migration:

   ```powershell
   alembic revision --autogenerate -m "describe the schema change"
   ```

4. Review the generated migration.
5. Apply it:

   ```powershell
   alembic upgrade head
   ```

CRUD requests should not be used to create or alter database tables. They
operate on rows in the schema created and maintained by Alembic.

## Expected requests

| Request | Expected result |
| --- | --- |
| `GET /api/projects/` | `200 OK` and a JSON array |
| `POST /api/projects/` with valid JSON | `201 Created` and the new project |
| `POST /api/projects/` with invalid JSON | `422 Unprocessable Entity` |
| `PUT /api/projects/{id}` with valid JSON | `200 OK` and the updated project |
| `PUT /api/projects/{id}` with a missing ID | `404 Not Found` |
| `DELETE /api/projects/{id}` | `204 No Content` |
| `DELETE /api/projects/{id}` with a missing ID | `404 Not Found` |
| `GET /docs` | Interactive Swagger UI |

## Completion checklist

- [ ] The virtual environment is created and activated.
- [ ] Dependencies are installed from `requirements.txt`.
- [ ] A PostgreSQL database is configured through `DATABASE_URL`.
- [ ] The `projects` table exists after running `alembic upgrade head`.
- [ ] `ProjectCreate`, `ProjectUpdate`, and `ProjectRead` are defined.
- [ ] `GET /api/projects/` reads projects from PostgreSQL.
- [ ] `POST /api/projects/` creates a project.
- [ ] Invalid POST and PUT request bodies return `422` validation responses.
- [ ] `PUT /api/projects/{project_id}` replaces an existing project.
- [ ] Missing project IDs return `404 Not Found`.
- [ ] `DELETE /api/projects/{project_id}` deletes a project.
- [ ] Successful DELETE requests return `204 No Content`.
- [ ] All CRUD operations are tested with Postman.
