"""Service layer for engineer roster lookup.

This keeps the API route thin and leaves room to replace the in-memory data
source with a real team directory or database-backed repository later.
"""

from app.data.engineers import ENGINEERS


def get_all_engineers() -> list[str]:
    """Return the available engineer roster for assignment workflows."""
    return ENGINEERS
