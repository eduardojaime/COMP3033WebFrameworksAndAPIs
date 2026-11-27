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
