# Lesson 06: GitHub Workflow and Render Deployment

## Learning objectives

By the end of this lesson, you should be able to:

- Create a GitHub repository for a Python FastAPI application.
- Use development, QA, staging, and production branches.
- Deploy a FastAPI application to Render from GitHub.
- Configure a Python build command, start command, and environment variables.
- Promote a change through pull requests and verify automatic deployments.

## Prerequisites

- A working Python FastAPI project with a `server.py` module that defines `app` and a `requirements.txt` file.
- A GitHub account and GitHub Desktop, or Git installed locally.
- A Render account connected to GitHub.
- [Postman](https://www.postman.com/downloads/) for testing the deployed API.
- If the application uses PostgreSQL, a reachable PostgreSQL database and its connection URL.

## Part 1: Prepare the GitHub repository

1. Sign in to [GitHub](https://github.com/) and create a repository named `ProjectManagerAPI`.
2. Clone the repository to your computer.
3. Copy the contents of your Python FastAPI project into the cloned repository. Include `server.py`, `requirements.txt`, and the application packages it imports.
4. Add a Python `.gitignore`. Ensure it excludes at least `.venv/`, `__pycache__/`, and `.env` so virtual environments and secrets are not committed.
5. Commit and push the initial project to GitHub.
6. Use the repository's default branch (`main` on new repositories) as the production branch. Create `dev`, `qa`, and `stg` branches from it and push them to GitHub.

Keep the branch names consistent between GitHub and Render. If your course repository uses `master` instead of `main`, use `master` as the production branch throughout this activity.

## Part 2: Deploy the FastAPI application to Render

Create a Render **Web Service** connected to the GitHub repository. Configure it to deploy the production branch, then create one service for each of `dev`, `qa`, and `stg`, selecting the matching branch for each service.

Use these commands in each service's settings:

- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`

The start command assumes the FastAPI instance is named `app` in `server.py`. Adjust `server:app` if your module or instance uses a different name.

The `--host 0.0.0.0` option makes Uvicorn listen on all network interfaces in the Render service, allowing Render to route incoming requests to the application. Without it, the server may only listen on the local loopback interface and be unreachable from outside the container.

For an application that connects to PostgreSQL, add `DATABASE_URL` in the Render service's environment variables. Use the SQLAlchemy URL format expected by the project, such as `postgresql+psycopg://...`. Add secrets in Render's dashboard; do not commit `.env` files, passwords, or connection URLs to GitHub. Configure migrations and database access before testing database-backed routes. Avoid having multiple services run schema migrations simultaneously against the same database.

After each service deploys, open its Render URL and verify that it starts. Test the landing page, `/docs`, and relevant API endpoints with Postman. For example, a CRUD project API can be tested at `/api/projects/`.

Each service is connected to a specific branch. When new commits are pushed to that branch, Render can automatically deploy the update. Free services may take time to start after being idle.

## Part 3: Demonstrate the software development lifecycle

### Make a change in development

1. Clone the repository (if needed) and switch to the `dev` branch.
2. Add or update a simple landing page in `server.py`. For example, add this route after the `app = FastAPI(...)` declaration:

   ```python
   from fastapi.responses import HTMLResponse

   @app.get("/", response_class=HTMLResponse, include_in_schema=False)
   def home_page() -> str:
       return """<!doctype html>
   <html lang="en">
       <head><meta charset="utf-8"><title>Project Manager API Home Page</title></head>
       <body><h1>Project Manager API Home Page</h1></body>
   </html>"""
   ```

   If you add the import, place it with the other imports at the top of the file.
3. Run the application locally and confirm the page at `/` displays **Project Manager API Home Page**.
4. Commit and push the change to `dev`.

### Promote the change

For each promotion, open a pull request on GitHub, review and merge it, then verify the deployment in the Render dashboard and test the service URL:

1. Create a pull request from `dev` to `qa`. After it is merged, confirm the QA service deploys and perform functional testing with Postman.
2. When QA testing passes, create a pull request from `qa` to `stg`. After it is merged, confirm the staging service deploys and verify the change.
3. When staging acceptance is complete, create a pull request from `stg` to the production branch (`main` or `master`). After it is merged, confirm the production service deploys.

This workflow keeps work in development until it has been reviewed and tested in the next environment. Record each service URL so you can tell which environment you are testing.

## Completion checklist

- [ ] The Python project is committed to the `ProjectManagerAPI` GitHub repository.
- [ ] The production, `dev`, `qa`, and `stg` branches exist.
- [ ] Render has a Web Service connected to each branch.
- [ ] Every service uses the Python build and start commands.
- [ ] Required environment variables are configured without committing secrets.
- [ ] The deployed landing page and `/docs` load successfully.
- [ ] API endpoints are tested with Postman.
- [ ] The landing-page change is promoted through pull requests from `dev` to `qa`, `stg`, and production.
- [ ] Automatic deployment is verified after each merge.
