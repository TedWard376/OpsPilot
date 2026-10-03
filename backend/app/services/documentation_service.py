"""Service layer for documentation business logic.

Mirrors app/services/alert_service.py: the router stays thin and delegates
lookups here. Today this reads from the in-memory DOCUMENTS list; later it
can read from a database-backed repository with the exact same function
signatures, so nothing above this layer has to change.
"""

from __future__ import annotations

from fastapi import HTTPException

from app.data.documentation import DOCUMENTS


def get_all_documents() -> list[dict[str, object]]:
    """Return the complete in-memory documentation list.

    Kept intentionally simple, for the same reason get_all_alerts() is:
    it gives future logic (e.g. "only return Published documents") one
    obvious place to live, without the router needing to know about it.
    """
    return DOCUMENTS


def get_document_by_id(document_id: str) -> dict[str, object]:
    """Return one document by its identifier or raise a 404 error.

    Args:
        document_id: The document identifier from the URL path.

    Returns:
        A document dictionary from the in-memory data source.

    Raises:
        HTTPException: If no document with that identifier exists.
    """
    for document in DOCUMENTS:
        if document["id"] == document_id:
            return document

    raise HTTPException(
        status_code=404,
        detail=f"Document with id '{document_id}' was not found.",
    )
