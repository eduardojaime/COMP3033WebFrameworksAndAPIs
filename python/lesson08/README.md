# Python Lesson 08: Securing a FastAPI API

## Learning objectives

By the end of this lesson, you should be able to:

- Protect FastAPI endpoints with HTTP Basic authentication.
- Return an authentication challenge when credentials are missing or invalid.
- Send Basic credentials with Postman.
- Compare API keys and bearer tokens as alternatives for API authentication.

## Prerequisites

- Python 3.x and the dependencies listed in `requirements.txt`.
- A PostgreSQL database configured for this lesson.
- The project API from the earlier Python lessons.
- [Postman](https://www.postman.com/downloads/) for testing requests.

## Set up the lesson

If this lesson does not already have a virtual environment, create one and install the listed dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Configure the lesson's `DATABASE_URL` in a local `.env` file, as in the earlier database lessons. Add local credentials for the HTTP Basic exercise:

```dotenv
BASIC_AUTH_USERNAME=lesson-user
BASIC_AUTH_PASSWORD=replace-with-a-local-demo-password
```

Use your own local demo values. Never commit `.env` or real credentials.

## Part 1: Protect the project API with HTTP Basic

FastAPI includes HTTP Basic support in `fastapi.security`; no additional package is needed. A dependency can validate credentials and be attached to each project route.

1. Create `config.py` in this lesson's folder. It loads `.env` once and fails clearly if a required setting is missing, for both the database and authentication settings:

   ```python
   import os

   from dotenv import load_dotenv

   load_dotenv()


   def required_setting(name: str) -> str:
       value = os.getenv(name)
       if not value:
           raise RuntimeError(f"Missing required environment variable: {name}")
       return value


   DATABASE_URL = required_setting("DATABASE_URL")
   BASIC_AUTH_USERNAME = required_setting("BASIC_AUTH_USERNAME")
   BASIC_AUTH_PASSWORD = required_setting("BASIC_AUTH_PASSWORD")
   ```

   Then update `db/connection.py` to use it instead of loading `.env` itself. Remove the `os` and `dotenv` imports, the `load_dotenv()` call, and the `os.environ.get("DATABASE_URL")` check, and import the value from `config`:

   ```python
   from config import DATABASE_URL

   engine = create_engine(DATABASE_URL)
   ```

   `alembic/env.py` imports `DATABASE_URL` from `db.connection`, so it keeps working. Because `config.py` requires every setting, the Basic variables must also be present in `.env` when you run `alembic` commands.
2. In `server.py`, add these imports:

   ```python
   from secrets import compare_digest
   from typing import Annotated

   from fastapi.security import HTTPBasic, HTTPBasicCredentials

   from config import BASIC_AUTH_PASSWORD, BASIC_AUTH_USERNAME
   ```

   Keep the existing FastAPI imports, including `Depends` and `HTTPException`. Then create the security scheme object below the imports:

   ```python
   basic_auth = HTTPBasic()
   ```

3. Add a dependency that validates the credentials. `compare_digest` avoids a straightforward timing leak when comparing the supplied values:

   ```python
   def require_basic_auth(
       credentials: Annotated[HTTPBasicCredentials, Depends(basic_auth)],
   ) -> str:
       username_matches = compare_digest(
           credentials.username, BASIC_AUTH_USERNAME
       )
       password_matches = compare_digest(
           credentials.password, BASIC_AUTH_PASSWORD
       )

       if not (username_matches and password_matches):
           raise HTTPException(
               status_code=401,
               detail="Invalid username or password",
               headers={"WWW-Authenticate": "Basic"},
           )

       return credentials.username
   ```

4. Require the dependency on every project endpoint. For example, update the route decorator in `server.py`:

   ```python
   @app.get(
       "/api/projects/",
       response_model=list[ProjectRead],
       summary="Get projects with optional filters and pagination",
       dependencies=[Depends(require_basic_auth)],
   )
   ```

   Add `dependencies=[Depends(require_basic_auth)]` to the `POST`, `PUT`, and `DELETE` project route decorators too. Applying it to every route keeps the whole project API protected.

5. Start the API from this lesson's folder:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   uvicorn server:app --reload --port 3000
   ```

### Test HTTP Basic in Postman

Use the existing project requests, for example `GET http://localhost:3000/api/projects/`.

1. Send the request with no authorization. It should return `401 Unauthorized` and include a `WWW-Authenticate: Basic` response header.
2. In Postman's **Authorization** tab, choose **Basic Auth** and enter the local `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD` values.
3. Send the request again. A valid request should return the endpoint's normal success response.
4. Change either value and resend. The API should return `401 Unauthorized`.

Postman builds the `Authorization` header for you. HTTP Basic sends `Authorization: Basic <credentials>`, where `<credentials>` is the Base64 encoding of `username:password`. For example, `lesson-user:demo-password` is sent as `bGVzc29uLXVzZXI6ZGVtby1wYXNzd29yZA==`.

To see this for yourself, copy the Base64 value from the request's **Headers** (or a `curl -v` request) into [base64decode.org](https://www.base64decode.org/) and decode it. Use only throwaway demo values on third-party sites, never real credentials.

Base64 is an encoding, not encryption: anyone who sees the header can decode it. That is why HTTP Basic must run over HTTPS outside local development.

### HTTP Basic security notes

HTTP Basic sends the username and password with each request. Use it only over HTTPS outside local development. Environment variables keep credentials out of source control, but they are not a password database: production user passwords should be stored as salted, slow password hashes, not plaintext. Also consider rate limiting and account lockout protections for a user-facing service.

## Alternatives to HTTP Basic

Try one alternative at a time. Each one **replaces** the HTTP Basic dependency on the project routes; it does not add to it. The alternatives reuse `required_setting` from `config.py` and `compare_digest` and `Annotated` from Part 1, so complete Part 1 first. Add only the `.env` variable, `config.py` setting, and `server.py` code for the approach you are testing; the server fails at startup if `config.py` requires a variable that is missing from `.env`.

## Alternative A: API keys

An API key can be appropriate for a simple client or service integration. FastAPI can read a key from a named header with `APIKeyHeader`. Add a separate key to the local `.env` file:

```dotenv
API_KEY=replace-with-a-long-random-local-demo-key
```

Add the setting to `config.py`:

```python
API_KEY = required_setting("API_KEY")
```

Then define a dependency in `server.py`:

```python
from fastapi.security import APIKeyHeader

from config import API_KEY

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def require_api_key(
    api_key: Annotated[str | None, Depends(api_key_header)],
) -> None:
    if api_key is None or not compare_digest(api_key, API_KEY):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
```

To protect the routes with the key, **replace** `dependencies=[Depends(require_basic_auth)]` with `dependencies=[Depends(require_api_key)]` on each project route. If both dependencies remain, every request needs both credentials. In Postman, send the key in an `X-API-Key` header.

This response has no `WWW-Authenticate` header because HTTP has no standard challenge scheme for API keys. Keep keys secret, use HTTPS, and plan how to revoke and rotate them. A single shared key does not identify individual users; issue separate keys if clients need separate access or auditing.

## Alternative B: bearer tokens

Bearer tokens are sent in the `Authorization: Bearer <token>` header. FastAPI's `HTTPBearer` helper parses that header; the application must still validate the token. For a small demonstration, a shared token can be kept in the local `.env` file:

```dotenv
API_BEARER_TOKEN=replace-with-a-long-random-local-demo-token
```

Add the setting to `config.py`:

```python
API_BEARER_TOKEN = required_setting("API_BEARER_TOKEN")
```

Then add the dependency to `server.py`:

```python
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from config import API_BEARER_TOKEN

bearer_scheme = HTTPBearer(auto_error=False)


def require_bearer_token(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ],
) -> None:
    if credentials is None or not compare_digest(
        credentials.credentials, API_BEARER_TOKEN
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

**Replace** `dependencies=[Depends(require_basic_auth)]` with `dependencies=[Depends(require_bearer_token)]` on each project route, then send the token as a **Bearer Token** in Postman's Authorization tab.

A shared bearer token is a simple API credential, not a complete login system or a JWT. For user authentication, use short-lived, validated tokens and a secure token-issuing flow. FastAPI's `OAuth2PasswordBearer` extracts a bearer token from a request; it does not issue or validate the token by itself.

## Choosing an approach

- Use **HTTP Basic** to practice username-and-password authentication for this lesson.
- Use **API keys** for straightforward client or service access where per-client credentials and key rotation are manageable.
- Use **bearer tokens** when clients need to present issued tokens, commonly for stateless APIs. Use a well-understood OAuth2/OIDC or JWT flow for production user authentication rather than relying on one permanent shared token.

For more information, see the FastAPI guides for [HTTP Basic](https://fastapi.tiangolo.com/advanced/security/http-basic-auth/) and [OAuth2 with JWT](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/), and the [security tools reference](https://fastapi.tiangolo.com/reference/security/) for `APIKeyHeader`, `HTTPBearer`, and the other helpers.
