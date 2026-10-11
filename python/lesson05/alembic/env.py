"""Alembic environment configuration.

Imports the application's Base metadata and model classes so that
`alembic revision --autogenerate` can detect table changes, and reuses the
same DATABASE_URL environment variable as the FastAPI application.
"""
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from db.connection import Base, DATABASE_URL
from db import models  # noqa: F401  (registers Project on Base.metadata)

# This is the Alembic Config object, which provides access to the values
# within the .ini file in use.
config = context.config

# Override the sqlalchemy.url placeholder from alembic.ini with the
# application's real connection string, kept in one place (.env).
config.set_main_option("sqlalchemy.url", DATABASE_URL.replace("%", "%%"))

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add the model's MetaData object here for 'autogenerate' support.
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (emits SQL without a DB connection)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode (connects to the database)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
