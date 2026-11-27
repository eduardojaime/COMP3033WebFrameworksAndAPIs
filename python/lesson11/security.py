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
