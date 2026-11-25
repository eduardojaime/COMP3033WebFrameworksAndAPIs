# Loads credentials from .env file, all requests will use the same set of credentials with this approach
import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", None)
if not (DATABASE_URL):
    raise RuntimeError("DATABASE_URL environment variable is not set.")

BASIC_AUTH_USERNAME = os.environ.get("BASIC_AUTH_USERNAME", None)
BASIC_AUTH_PASSWORD = os.environ.get("BASIC_AUTH_PASSWORD", None)