from fastapi import APIRouter

from app.schemas.incident import Incident
from app.services.incident_service import get_all_incidents, get_incident_by_id

router = APIRouter(prefix="/api", tags=["incidents"])


@router.get("/incidents", response_model=list[Incident])
def get_incidents() -> list[dict[str, object]]:
    """Return all incidents.

    The router delegates the lookup to the service layer and relies on the
    `Incident` schema for serialization and OpenAPI documentation.
    """
    return get_all_incidents()


@router.get("/incidents/{incident_id}", response_model=Incident)
def get_incident(incident_id: str) -> dict[str, object]:
    """Return a single incident by its identifier.

    If the incident cannot be found, the service raises an HTTP 404 which
    FastAPI will convert into an appropriate response.
    """
    return get_incident_by_id(incident_id)
