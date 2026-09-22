# AGENTS.md

## Repository overview

This repository is a course codebase for COMP3033 Web Frameworks and APIs. It contains progressive, mostly independent lesson projects rather than one root application. Node.js and Python versions of lessons may be maintained in parallel.

- `lesson01/` contains API exploration notes.
- `nodejs/lesson02/` contains standalone Node.js HTTP, Connect, and Express examples.
- `python/lesson02/` contains Python virtual-environment, FastAPI, and Uvicorn examples.
- `lesson02/` may contain legacy or earlier lesson material; prefer the language-specific lesson folder when working on the current Node.js or Python version.
- `lesson03/` through `lesson10/` contain progressively extended Express/Mongoose applications.
- `lesson11/` contains a CORS-enabled server and browser/Node.js clients.
- `lesson12/` contains JavaScript Azure Functions.
- `archive/` contains historical lesson copies and experiments.
- `final_data/` contains mocked data for the final exam.

## General workflow

- Read the target lesson's `README.md` before changing lesson code.
- Treat each lesson as an independent project. Run npm commands from the relevant Node.js lesson directory and Python commands from the relevant Python lesson directory, not from the repository root.
- Preserve the instructional progression. Prefer changes in the latest relevant lesson unless the task explicitly targets an earlier snapshot or the archive.
- Keep changes focused. Preserve the existing CommonJS style and public APIs in Node.js lessons. Use standard Python project conventions in Python lessons.
- Do not modify `archive/` or generated/vendor content unless explicitly requested.

## Commands

For lessons 3–11:

- Install dependencies: `npm install`
- Start the application: `npm start`
- The default Express port is `3000`; `PORT` may be used where supported by `bin/www`.

For the Node.js Lesson 02 examples, run commands from `nodejs/lesson02/`:

- `node httpserver.js`
- `node httpserver-routing.js`
- `node connectserver.js`
- `node expressserver.js`

For the Python Lesson 02 example, run commands from `python/lesson02/`:

- Create a virtual environment: `python -m venv .venv`
- Activate the virtual environment using the operating system's activation command.
- Install dependencies: `python -m pip install -r requirements.txt`
- Start the FastAPI application: `uvicorn server:app --reload --port 3000`

For lesson 12:

- Install dependencies from `lesson12/`: `npm install`
- Start locally with Azure Functions Core Tools: `npm start`
- The usual local base URL is `http://localhost:7071`.

There is no root-level package manager configuration, build system, lint configuration, or meaningful automated test suite. Validate JavaScript changes by starting the affected lesson and exercising the relevant endpoint or example. Use `npm test` in `lesson12/` only as the existing placeholder test command.

## Project conventions

- Express entry points are `app.js`; server launchers are under `bin/www`.
- Routes are under `routes/`, API routes commonly under `routes/api/`, models under `models/`, configuration under `config/`, views under `views/`, and static assets under `public/`.
- MongoDB/Mongoose configuration is commonly in `config/globals.js`.
- OpenAPI source is commonly `documentation/api-specification.yaml`.
- Mock data is commonly under `mockdata/`.
- Use the existing lesson's dependency versions and scripts. Add a dependency only when necessary, and update that lesson's manifest and lockfile together.
- Python lessons should use `requirements.txt` for direct dependencies and exclude `.venv/`, `__pycache__/`, and generated files from Git.
- FastAPI applications should use Uvicorn as their ASGI server unless a lesson explicitly teaches another server.

## Security

- Do not commit credentials, tokens, or connection strings. Existing lessons contain instructional hard-coded MongoDB and Basic Authentication values; treat them as exposed and do not copy them into new code. Prefer environment variables for new or corrected code.
- Never expose Basic Authentication credentials in browser-facing code.
- Do not recommend unrestricted MongoDB network access for production.
- Keep `.env` files local; they are ignored by Git.
- Do not commit Python virtual environments, API keys, tokens, or other credentials.

## Files to avoid changing

Unless the task specifically concerns them, avoid changing:

- `archive/`
- `node_modules/`
- `package-lock.json` files
- Express `bin/www` launchers
- `lesson12/.vscode/` debugging and task configuration
- Draw.io diagrams and other binary/design assets
- Generated output such as `coverage/`, `.nyc_output/`, `.cache/`, `dist/`, `build/`, and `obj/`

## Completion checklist

1. Confirm the change is made in the intended language-specific lesson and not an archived or legacy copy.
2. Check for syntax or editor diagnostics in modified source files.
3. Run the narrowest applicable command from the target lesson directory.
4. For Node.js changes, run the relevant Node.js example or npm script.
5. For Python changes, activate the virtual environment, install `requirements.txt`, and run the relevant Python application or validation command.
6. Report any required external services, such as MongoDB or Azure Functions Core Tools, if validation cannot run locally.
