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

# Browser origins allowed to call the API; an empty list allows none
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]
