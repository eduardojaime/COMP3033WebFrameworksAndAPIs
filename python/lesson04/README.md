# Lesson 04: Read Projects with SQLAlchemy, Alembic, and PostgreSQL

In this lesson, you will extend the Lesson 03 project-tracker API so that it
reads projects from a PostgreSQL database using SQLAlchemy's code-first mapped
model classes. You will also use Alembic to manage the database schema with
migrations. This lesson intentionally covers the **Read** part of CRUD only;
create, update, and delete operations are introduced later.

## Learning objectives

By the end of the lesson, you should be able to:

- Use a Pydantic response model to serialize database rows returned by a
    `GET` endpoint.
- Organize database code into a `db` module containing `connection.py` and
  `models.py`.
- Define a SQLAlchemy mapped model class (code-first ORM model).
- Provision a PostgreSQL database on Render.com, Supabase, or Neon.
- Configure a database connection using an environment variable.
- Initialize Alembic and understand a code-first migration generated from
    mapped model classes.
- Apply and roll back a migration.
- Use a database session in FastAPI endpoints with dependency injection.
- Test a database-backed `GET` request with Postman.

## Prerequisites

- Completion of [Lesson 03](../lesson03/README.md).
- Python 3.x installed. On Windows, the Python launcher is usually available as `py`.
- Visual Studio Code and the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python).
- A [Render.com](https://render.com), [Supabase](https://supabase.com), or [Neon](https://neon.com) account for hosting a PostgreSQL database, or access to another PostgreSQL instance.
- [Postman](https://www.postman.com/downloads/) for testing the `GET` request.

## Part 1: Create the project

Create or open the `python/lesson04` folder in Visual Studio Code. The
finished project structure looks like this:

```text
lesson04/
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

Database code now lives in its own `db` module instead of a single file.
`db/connection.py` owns the engine, session factory, and declarative `Base`
class. `db/models.py` owns the SQLAlchemy mapped model classes that describe
database tables. The `schemas` package owns the Pydantic response models,
with one module per entity (`schemas/project.py`) re-exported through
`schemas/__init__.py`. This separation keeps database concerns apart from API
response concerns, and keeps each growing as more entities are added.

## Part 2: Create and activate a virtual environment

Run these commands from the `python/lesson04` folder.

### Windows PowerShell

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
```

### Windows Command Prompt

```cmd
py -m venv .venv
.venv\Scripts\activate.bat
```

### macOS or Linux

```bash
py -m venv .venv
source .venv/bin/activate
```

Confirm that the virtual environment's Python interpreter is being used:

```powershell
py -c "import sys; print(sys.executable)"
```

## Part 3: Configure `.gitignore`

You can copy the `.gitignore` content from the [Lesson 03 instructions](../lesson03/README.md#part-3-configure-gitignore), since the Python lessons use the same exclusions.

Create `.gitignore` with:

```gitignore
.venv/
__pycache__/
*.py[cod]
.env
```

Note: You can also copy over the contents of this file to yours: [Python.gitignore](https://github.com/github/gitignore/blob/main/Python.gitignore)

The `.env` file holds your real PostgreSQL connection string and must never
be committed.

## Part 4: Install dependencies

Create `requirements.txt`:

```text
fastapi
pydantic
uvicorn[standard]
sqlalchemy
alembic
psycopg[binary]
python-dotenv
```

- `sqlalchemy` provides the ORM used to define mapped model classes and talk
  to the database.
- `alembic` manages versioned database schema migrations generated from those
  model classes.
- `psycopg[binary]` is the PostgreSQL driver SQLAlchemy uses at runtime.
- `python-dotenv` loads variables from a local `.env` file into the process
  environment.

With the virtual environment activated, install the dependencies:

```powershell
py -m pip install -r requirements.txt
```

## Part 5: Create a PostgreSQL database

Choose one PostgreSQL hosting option below and follow the matching steps.
Each option produces a connection string used in Part 6.

### Option A: Supabase

1. Go to [Supabase](https://supabase.com) and sign in, or create a free account. **Recommendation:** Sign in using your GitHub Credentials.
2. Select **New project**, choose an organization, give the project a name,
   for example `project-tracker-db`, set a strong database password, and choose a
   region close to you (Canada Central).
3. Wait for the project's database to finish provisioning.
4. Open **Database** > **Connect**. Under the connection method, select
   **Session Pooler** and copy the **URI** connection string. Use the session
   pooler rather than Direct connection when the network cannot reach the
   direct endpoint (for example, on an IPv4-only network).
5. The URI will look similar to this; Supabase supplies the actual username
   and host for your project, so copy those values rather than typing this
   example literally:

   ```text
   postgresql://postgres.<project-ref>:[YOUR-PASSWORD]@aws-1-ca-central-1.pooler.supabase.com:5432/postgres?sslmode=require
   ```

   Replace `[YOUR-PASSWORD]` with the database password. If it contains URI
   reserved characters such as `@`, `:`, `#`, `?`, `/`, or a space, percent-encode
   them in the URI. Keep `sslmode=require` so the connection uses SSL. Never
   commit a connection string containing the real password.
6. To test the connection in Visual Studio Code, install the
   [PostgreSQL extension by Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-pgsql),
   open its PostgreSQL view, and select **Add New Connection**. Choose
   **Connection String**, paste the URI, select **Test Connection**, then
   **Save & Connect**.
7. Use the same URI in the `.env` file in Part 6. Change its scheme to
   `postgresql+psycopg://` for SQLAlchemy and keep the remaining connection
   details and query parameters, including `sslmode=require`, unchanged.

### Option B: Neon

> **Placeholder:** this section will be expanded with current Neon screenshots
> and exact UI labels. Follow along with the instructor if the Neon interface
> has changed since this was written.

1. Go to [Neon](https://neon.com) and sign in, or create a free account.
2. From the Neon Console, select **New project**.
3. Give the project a name, for example `project-tracker-db`, choose a
    PostgreSQL version and region, then create the project.
4. Wait for the project and its default `main` branch to finish provisioning.
5. Select **Connect** in the Neon Console. In the **Connect to your branch**
    dialog, choose the branch, database, and role you want to use.
6. Copy the generated connection string. Neon provides pooled connection
    details by default; the pooled hostname includes `-pooler`. For this
    lesson, either the pooled or direct PostgreSQL connection can be used.
7. Keep the SSL options in the connection string. Neon requires encrypted
    connections, so the URL normally includes `sslmode=require` and may also
    include `channel_binding=require`.

Neon speaks the standard PostgreSQL protocol, so the connection works with
the `psycopg` driver, SQLAlchemy, and Alembic used in this lesson.

### Option C: Render.com

> **Placeholder:** this section will be expanded with current Render.com
> screenshots and exact UI labels. Follow along with the instructor if the
> Render interface has changed since this was written.

1. Go to [Render.com](https://render.com) and sign in, or create a free account.
2. From the dashboard, select **New** > **PostgreSQL**.
3. Give the database a name, for example `project-tracker-db`, choose a
   region close to you, and select the free instance type.
4. Select **Create Database** and wait for it to become available.
5. Open the database's **Info** page and copy the **External Database URL**.
   This is the connection string you will use in Part 6.
6. Note that Render-hosted PostgreSQL databases require `sslmode=require` for
   external connections; add it to the URL if it is not already present.

## Part 6: Configure environment variables

Create `.env.example` to document the required variable without committing a
real secret:

```text
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/project_tracker
```

Copy it to a real `.env` file (ignored by Git) and replace the placeholder
with the connection string from Render.com, Supabase, or Neon:

```powershell
Copy-Item .env.example .env
```

`postgresql+psycopg://` tells SQLAlchemy to connect using the `psycopg`
driver. Replace the host, port, database name, user, and password with the
values from your Render.com, Supabase, or Neon database. If the connection string
your provider gives you starts with `postgres://` or `postgresql://`, change
only the scheme to `postgresql+psycopg://` and keep the rest of the URL,
including any `sslmode=require` parameter, unchanged.

## Part 7: Build the `db` module

### `db/connection.py`

Create `db/connection.py`:

```python
"""Database engine and session configuration for the db module."""
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Load variables from a local .env file, if present, into the environment.
load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Copy .env.example to .env and set your "
        "PostgreSQL connection string before starting the server."
    )

# The engine manages the pool of connections to the PostgreSQL database.
engine = create_engine(DATABASE_URL)

# Each instance of SessionLocal is a database session used for one request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class every SQLAlchemy mapped model class inherits from."""


def get_db() -> Session:
    """FastAPI dependency that yields a database session for one request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

`engine` manages the connection pool. `SessionLocal` creates new sessions.
`Base` is the declarative base class every mapped model class inherits from.
`get_db()` is a generator-based FastAPI dependency: FastAPI calls it per
request, injects the yielded session into the endpoint function, and closes
it afterward even if the endpoint raises an error.

### `db/models.py`

Create `db/models.py`:

```python
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
```

This is the "code-first" approach: the Python class is the source of truth
for the table structure. `Mapped[...]` type annotations combined with
`mapped_column(...)` declare each column's Python type and database
constraints together. This is the modern SQLAlchemy 2.0 mapped-class style.

## Part 8: Define the Pydantic response schema

Schemas live in their own `schemas` package, one module per entity, mirroring
how `db/models.py` groups SQLAlchemy mapped classes. Create
`schemas/project.py` with a `ProjectRead` schema:

```python
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
```

`ProjectRead` is a response schema, not a request schema. The `from_attributes`
setting allows FastAPI to serialize a SQLAlchemy `Project` instance into JSON.
There are no `POST`, `PATCH`, or `DELETE` request schemas in this lesson
because the API is intentionally read-only.

The `schemas/__init__.py` file re-exports the response classes:

```python
from schemas.project import ProjectBase, ProjectRead, ProjectStatus

__all__ = ["ProjectBase", "ProjectRead", "ProjectStatus"]
```

## Part 9: Build the read-only API in `server.py`

Create `server.py`:

```python
# for creating the WebAPI application
from fastapi import Depends, FastAPI
# for a typed database session parameter
from sqlalchemy.orm import Session

# db module: connection.py (engine/session) and models.py (mapped classes)
from db.connection import get_db
from db.models import Project
# response validation schema
from schemas import ProjectRead

# Declare the app object
# Swagger UI will be available at http://localhost:3000/docs and ReDoc at http://localhost:3000/redoc
app = FastAPI(
    title="Project Management API",
    description="Demo API for managing projects, backed by PostgreSQL",
    version="2.0.0",
)


# CONTROLLER
# Lesson 04 covers the Read part of CRUD: retrieve all projects.
@app.get("/api/projects/", response_model=list[ProjectRead], description="Retrieve all projects", summary="Get all projects")
def list_projects(db: Session = Depends(get_db)) -> list[Project]:
    return db.query(Project).all()
```

`Depends(get_db)` is FastAPI's dependency injection: FastAPI calls
`get_db()` for the request, passes the session into `db`, and closes it after
the query is complete.

## Part 10: Run the API

With the virtual environment activated and `.env` configured, run:

```powershell
uvicorn server:app --reload --port 3000
```

If `DATABASE_URL` is missing or incorrect, the application raises a clear
error on startup instead of failing silently later. Once it starts, open:

- [http://localhost:3000/docs](http://localhost:3000/docs)

The `/api/projects/` list should return an empty array, because the
`projects` table does not exist yet. Continue to Part 11 to create it.

## Part 11: Initialize Alembic

With the virtual environment activated, run:

```powershell
alembic init alembic
```

This creates `alembic.ini` and an `alembic/` folder containing `env.py`,
`script.py.mako`, and an empty `versions/` folder. Make two changes so
Alembic can find the application's models and connection string:

1. In `alembic/env.py`, import the shared `Base` and register the model
   classes on it, then point `target_metadata` at it:

   ```python
   from db.connection import Base, DATABASE_URL
   from db import models  # noqa: F401  (registers Project on Base.metadata)

   config.set_main_option("sqlalchemy.url", DATABASE_URL.replace("%", "%%"))

   target_metadata = Base.metadata
   ```

2. Leave the `sqlalchemy.url` value in `alembic.ini` as a placeholder; the
   line added above overrides it at runtime with the value from `.env`, so
   the real connection string is never committed to `alembic.ini`. The
   `.replace("%", "%%")` escape is needed because Alembic uses Python
   configuration interpolation; it preserves percent-encoded password
   characters when Alembic reads the URL.

This repository's `python/lesson04/alembic/` folder already contains a
working `env.py` configured this way, so you can compare your output to it.

## Part 12: Create and apply the first migration

Generate a migration by comparing the mapped model classes in `db/models.py`
against the (currently empty) database:

```powershell
alembic revision --autogenerate -m "create projects table"
```

Open the generated file under `alembic/versions/`. Confirm that `upgrade()`
calls `op.create_table("projects", ...)` with columns matching `Project` in
`db/models.py`, and that `downgrade()` calls `op.drop_table("projects")`.

Apply the migration:

```powershell
alembic upgrade head
```

Confirm the table was created, then restart the API and request
`GET /api/projects/` again; it should still return an empty array, now
backed by a real `projects` table in PostgreSQL instead of an in-memory list.

## Part 13: Test the API with Postman

1. Ensure the FastAPI application is running and the migration has been
   applied.
2. In Postman, open the **Web Frameworks and APIs** collection from Lesson 03
   (or create it if it does not exist).
3. Create a `GET` request named **Project List** sent to
    `http://localhost:3000/api/projects/`. Because the database starts empty,
    the expected response is initially `[]`.
4. Open the response in Postman and confirm the status is `200 OK`.
5. Restart the API process and send **Project List** again. The request
    should still succeed, proving that the endpoint reads from PostgreSQL.

This lesson does not add projects through the API. The `POST`, `PATCH`, and
`DELETE` operations will be introduced in a later CRUD lesson.

## Part 14: Exercise - add a column with a second migration

As a self-check, add a `priority` column to the project:

1. Add `priority: Mapped[str] = mapped_column(nullable=False, default="Normal")`
   to the `Project` class in `db/models.py`.
2. Add a matching `priority` field to `ProjectBase` in `schemas/project.py`.
3. Generate a new migration:

   ```powershell
   alembic revision --autogenerate -m "add priority column to projects"
   ```

4. Review the generated file, then apply it:

   ```powershell
   alembic upgrade head
   ```

5. Confirm the `GET` response schema includes `priority` after the migration.
6. Practice rolling the change back:

   ```powershell
   alembic downgrade -1
   ```

   Confirm the column is removed, then run `alembic upgrade head` again to
   restore it.

## Expected requests

| Request | Expected result |
| --- | --- |
| `GET /api/projects/` | `200 OK` and a JSON array of projects |
| `GET /docs` | Interactive Swagger UI |

## Completion checklist

- [ ] The virtual environment is created and activated.
- [ ] Dependencies are listed in `requirements.txt` and installed.
- [ ] A PostgreSQL database exists on Render.com, Supabase, Neon, or another PostgreSQL instance.
- [ ] `DATABASE_URL` is set in a local, uncommitted `.env` file.
- [ ] `db/connection.py` defines the engine, session factory, and `Base` class.
- [ ] `db/models.py` defines the `Project` mapped model class.
- [ ] `schemas/project.py` defines the `ProjectRead` response model.
- [ ] Alembic is initialized and the first migration creates the `projects` table.
- [ ] `GET /api/projects/` reads from the real database.
- [ ] The read-only endpoint was tested with Postman.
