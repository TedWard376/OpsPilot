"""Service layer for server business logic.

This module contains the application-specific rules for retrieving server
records. The router layer is intentionally thin: it forwards the request to
this service and returns the service result as an HTTP response.

In this phase the data source is in-memory, but the service contract is
already shaped for a future repository-backed implementation.
"""

from __future__ import annotations

from fastapi import HTTPException

from app.data.servers import SERVERS


def get_all_servers() -> list[dict[str, object]]:
    """Return the complete in-memory server inventory.

    This keeps the endpoint implementation simple and makes the service easy
    to replace later with a database-backed repository.
    """
    return SERVERS


def get_server_by_id(server_id: str) -> dict[str, object]:
    """Return one server by its identifier or raise a 404 error.

    Args:
        server_id: The server identifier from the URL path.

    Returns:
        A server dictionary from the in-memory data source.

    Raises:
        HTTPException: If the server identifier is not present.
    """
    for server in SERVERS:
        if server["id"] == server_id:
            return server

    raise HTTPException(
        status_code=404,
        detail=f"Server with id '{server_id}' was not found.",
    )
