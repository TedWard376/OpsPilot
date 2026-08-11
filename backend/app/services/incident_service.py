"""Service layer for incident business logic.

This module provides application-specific operations for retrieving incident
records. It intentionally keeps HTTP concerns out of the service and mirrors
the shape and error handling used by other services (e.g., `server_service`).
"""

from __future__ import annotations

from fastapi import HTTPException

from app.data.incidents import INCIDENTS


def get_all_incidents() -> list[dict[str, object]]:
    """Return all in-memory incidents.

    The function returns the `INCIDENTS` list directly so the route remains
    a thin HTTP adapter. When moving to a database later, this function can
    be updated to call a repository while keeping the route signature stable.
    """

    return INCIDENTS


def get_incident_by_id(incident_id: str) -> dict[str, object]:
    """Return one incident by its identifier or raise a 404 error.

    Args:
        incident_id: The incident identifier from the URL path.

    Returns:
        A dict representing the incident.

    Raises:
        HTTPException: If the incident is not found.
    """

    for incident in INCIDENTS:
        if incident["id"] == incident_id:
            return incident

    raise HTTPException(status_code=404, detail=f"Incident with id '{incident_id}' was not found.")
