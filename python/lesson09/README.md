# Python Lesson 09: API Documentation with OpenAPI and Swagger UI

## Learning objectives

By the end of this lesson, you should be able to:

- Describe what an OpenAPI Specification (OAS) document is and how it is structured.
- Find the Swagger UI, ReDoc, and `/openapi.json` endpoints that FastAPI generates automatically.
- Explain which parts of your Python code produce which parts of the generated documentation.
- Improve the documentation with metadata: titles, tags, summaries, descriptions, and response codes.
- Test the secured API from Swagger UI and import the specification into Postman.

## Prerequisites

- Python 3.x and the dependencies listed in `requirements.txt`.
- A PostgreSQL database configured for this lesson (the same setup as Lesson 08).
- [Postman](https://www.postman.com/downloads/) for the import exercise.

This lesson starts from the finished Lesson 08 API (project CRUD endpoints protected with HTTP Basic). There is no documentation tooling to install: FastAPI generates the OpenAPI document and Swagger UI for you. This lesson is about understanding what is generated and how to improve it, so the code changes are small.

## Set up the lesson

If this lesson does not already have a virtual environment, create one and install the listed dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Copy `.env.example` to `.env` and replace the placeholder values with your local database URL and demo credentials. Never commit `.env` or real credentials.

Start the API from this lesson's folder:

```powershell
uvicorn server:app --reload --port 3000
```

## Part 1: What is OpenAPI?

The [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) (OAS, formerly known as Swagger) is a language-independent, machine-readable format for describing an HTTP API. An OAS document is written in JSON or YAML and lists the endpoints, parameters, request bodies, responses, and security requirements of an API.

The same document can drive many tools: interactive documentation, client and server code generators, API testing tools, and API gateways.

Explore the format with these references:

- [OpenAPI Map](https://openapi-map.apihandyman.io/) shows the structure of an OAS document and what each section is for.
- [Swagger Editor](https://editor.swagger.io/) lets you write a YAML specification and see it rendered live. Paste the document from Part 2 into it to see how another tool renders it.

The main top-level sections of an OAS document are:

| Section | Purpose |
| --- | --- |
| `openapi` | The version of the OpenAPI Specification used by the document |
| `info` | Title, version, description, and contact details for the API |
| `tags` | Names and descriptions used to group endpoints |
| `paths` | Each endpoint, its HTTP methods, parameters, request body, and responses |
| `components` | Reusable pieces: `schemas` (data models) and `securitySchemes` (authentication) |

## Part 2: Explore what FastAPI generates

With the API running on port 3000, open these URLs in a browser:

| URL | What you get |
| --- | --- |
| <http://localhost:3000/docs> | Swagger UI: interactive documentation where you can send requests |
| <http://localhost:3000/redoc> | ReDoc: read-only documentation with a three-panel layout |
| <http://localhost:3000/openapi.json> | The raw OpenAPI document that both tools render |

Swagger UI and ReDoc are only viewers. Both read `/openapi.json`, and FastAPI builds that document from your code when the app starts.

1. Open `/openapi.json` (a browser JSON viewer helps) and find these sections: `openapi`, `info`, `paths`, and `components`.
2. Under `paths`, find `/api/projects/` and its `get` and `post` operations. Compare each entry with what Swagger UI shows for the same endpoint.
3. Under `components` > `schemas`, find `ProjectCreate`, `ProjectRead`, and `ProjectUpdate`. Compare them with the Pydantic classes in `schemas/project.py`.
4. Under `components` > `securitySchemes`, find `HTTPBasic`. Compare it with the `HTTPBasic()` object in `server.py`.
5. In Swagger UI, expand an endpoint and read the parameters, request body example, and responses.

## Part 3: Where the documentation comes from

FastAPI reads your Python code and fills in the OAS document. Nothing is written twice: if you change the code, the documentation changes with it.

| What you write in code | What appears in the OpenAPI document and Swagger UI |
| --- | --- |
| `FastAPI(title=..., version=..., description=...)` | The `info` section at the top of the page |
| `@app.get("/api/projects/")` | An entry under `paths` with the `get` operation |
| Function name, for example `list_projects` | The `operationId` and, when no `summary` is given, the generated title |
| `summary="..."` in the decorator | The short title shown next to the endpoint |
| Function docstring | The longer, Markdown-capable description of the endpoint |
| `tags=["Projects"]` and `openapi_tags=[...]` | Groups endpoints into sections and describes each group |
| Path parameter, such as `project_id: int` | A required `path` parameter with its type |
| Query parameter, such as `page: int = Query(default=1, ge=1)` | An optional `query` parameter with its type, default, and constraint |
| `Query(description="...")` | The parameter's description text |
| Pydantic body parameter, such as `payload: ProjectCreate` | The `requestBody` and a schema under `components` |
| `Field(description=..., examples=[...])` on a Pydantic field | Field descriptions and the example values pre-filled in Swagger UI |
| `Literal[...]` type, such as `ProjectStatus` | An `enum` listing the allowed values |
| `response_model=list[ProjectRead]` | The schema of the successful (`200`) response |
| `status_code=status.HTTP_201_CREATED` | The documented success status code |
| `responses={401: {...}}` | Extra documented responses such as `401` and `404` |
| `dependencies=[Depends(require_basic_auth)]` and `HTTPBasic()` | A `securitySchemes` entry, a lock icon on each endpoint, and the **Authorize** button |
| Validation rules such as `min_length`, `ge`, and `max_length` | Constraints in the schema and an automatic `422` validation error response |

Anything the code cannot express automatically, such as the meaning of a field or the possible error responses, is added through metadata. Part 4 does that.

## Part 4: Improve the documentation with metadata

This lesson's code already contains the metadata changes below. Compare each one with the Lesson 08 version and check the effect at <http://localhost:3000/docs>.

1. **Application information.** In `server.py`, the `FastAPI(...)` call now includes a `summary`, a Markdown `description`, a `contact`, and a new `version`. Refresh `/docs` and find them at the top of the page. Change the `version` and refresh again.
2. **Tags.** Each route has `tags=["Projects"]`, and `openapi_tags` describes the tag. Swagger UI groups the endpoints under a **Projects** heading with that description. Try a second tag, such as `"Admin"`, on one route to see a new group appear.
3. **Descriptions.** Each route function has a docstring. Swagger UI shows it as the endpoint's description when you expand it. The query parameters use `Query(description=...)`.
4. **Documented responses.** The routes use a `responses={...}` argument to document `401` (and `404` where an ID is looked up). Expand an endpoint and look at its **Responses** table. Compare it with the Lesson 08 version, which listed only the success and `422` responses.
5. **Schema field metadata.** In `schemas/project.py`, each `Field(...)` now has a `description` and `examples`. Expand **POST** `/api/projects/` and look at the request body example and the **Schemas** section at the bottom of the page.
6. **Security scheme description.** `HTTPBasic(description=...)` adds text to the **Authorize** dialog.

Metadata does not change behaviour. It only changes the generated document, so the API responds exactly as before.

### Turn the documentation off or move it

The documentation URLs are normal FastAPI options, so you can move or disable them when an API should not publish its documentation:

```python
app = FastAPI(docs_url="/swagger", redoc_url=None, openapi_url="/api/openapi.json")
```

Set a URL to `None` to disable it. Disabling `openapi_url` turns off the documentation endpoints that depend on it. Hiding documentation is not a security control, so keep authentication on the endpoints themselves.

## Part 5: Try the API in Swagger UI

Swagger UI is also a test client.

1. Open <http://localhost:3000/docs> and expand **GET** `/api/projects/`.
2. Click **Try it out** and then **Execute** without logging in. The response should be `401 Unauthorized`.
3. Click **Authorize** at the top of the page, enter the `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD` values from your local `.env`, and close the dialog. The lock icons on the endpoints change to closed.
4. Run the request again. It should now return `200` with a list of projects.
5. Fill in `course`, `status`, and `page`, and execute again to see how the query parameters change the request URL. Swagger UI shows the equivalent `curl` command and the response headers.
6. Expand **POST** `/api/projects/`, click **Try it out**, edit the example body, and execute it. Then send a body with an invalid `status` and read the `422` response.

Swagger UI sends the Basic credentials from the browser, so it works well for local testing. Use demo credentials only, and do not leave the documentation of a real API open to the public if it exposes details you want to keep private.

## Part 6: Import the specification into Postman

Postman can turn an OpenAPI document into a collection, so you do not have to create each request by hand.

1. In Postman, choose **Import**.
2. Paste `http://localhost:3000/openapi.json`. If Postman cannot reach the URL, open the URL in a browser, save the JSON to a file, and import the file instead.
3. Choose to import the document as a collection when prompted.
4. Open the new collection and look at the generated requests. Each endpoint in the document becomes one request, using the example bodies you added in Part 4.
5. Set the collection's **Authorization** tab to **Basic Auth** with your local demo credentials.
6. Send the requests and confirm they return the same results as in Swagger UI.

If the specification changes later, import it again to refresh the collection.

## Review questions

1. Which tools render the OpenAPI document, and where does that document come from?
2. Which parts of the generated documentation came from Python type hints, and which came from metadata you wrote yourself?
3. What would you need to change to document a new `404` response on `GET /api/projects/`?
4. Why does adding `tags`, `summary`, or `description` not change how the API behaves?
5. Why is hiding `/docs` not a substitute for authentication?

## Optional extension

Open <https://editor.swagger.io/>, paste in the JSON from `/openapi.json`, and compare how Swagger Editor renders it with FastAPI's own Swagger UI.
