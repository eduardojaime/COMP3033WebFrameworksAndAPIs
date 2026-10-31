"""add course to projects

Revision ID: 8b2d7e5a1c40
Revises: 4f3a1c9d2b6e
Create Date: 2026-10-30 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "8b2d7e5a1c40"
down_revision: Union[str, None] = "4f3a1c9d2b6e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add the column as nullable first so existing rows are preserved,
    # backfill them, then enforce NOT NULL.
    op.add_column("projects", sa.Column("course", sa.String(), nullable=True))
    op.execute("UPDATE projects SET course = 'Unassigned' WHERE course IS NULL")
    op.alter_column("projects", "course", nullable=False)

    # Convert the previous status values to the ones used in this lesson.
    op.execute("UPDATE projects SET status = 'TO DO' WHERE status = 'Not Started'")
    op.execute("UPDATE projects SET status = 'IN PROGRESS' WHERE status = 'In Progress'")
    op.execute("UPDATE projects SET status = 'DONE' WHERE status = 'Completed'")
    op.alter_column("projects", "status", server_default="TO DO")


def downgrade() -> None:
    op.alter_column("projects", "status", server_default="Not Started")
    op.execute("UPDATE projects SET status = 'Not Started' WHERE status = 'TO DO'")
    op.execute("UPDATE projects SET status = 'In Progress' WHERE status = 'IN PROGRESS'")
    op.execute("UPDATE projects SET status = 'Completed' WHERE status = 'DONE'")
    op.drop_column("projects", "course")
