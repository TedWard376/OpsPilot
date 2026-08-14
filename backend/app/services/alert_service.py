"""Service layer for alert business logic.

Mirrors app/services/server_service.py: the router stays thin and delegates
lookups here. Today this reads from the in-memory ALERTS list; later it can
read from a database-backed repository with the exact same function
signatures, so nothing above this layer has to change.
"""

from __future__ import annotations

from fastapi import HTTPException

from app.data.alerts import ALERTS


def get_all_alerts() -> list[dict[str, object]]:
    """Return the complete in-memory alert list.

    Kept intentionally simple for the same reason get_all_servers() is:
    it gives future filtering/sorting logic (e.g. "only Open alerts") one
    obvious place to live, without the router needing to know about it.
    """
    return ALERTS


def get_alert_by_id(alert_id: str) -> dict[str, object]:
    """Return one alert by its identifier or raise a 404 error.

    Args:
        alert_id: The alert identifier from the URL path.

    Returns:
        An alert dictionary from the in-memory data source.

    Raises:
        HTTPException: If no alert with that identifier exists.
    """
    for alert in ALERTS:
        if alert["id"] == alert_id:
            return alert

    raise HTTPException(
        status_code=404,
        detail=f"Alert with id '{alert_id}' was not found.",
    )
