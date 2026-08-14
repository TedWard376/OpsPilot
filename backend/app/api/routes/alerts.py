from fastapi import APIRouter

from app.schemas.alert import Alert
from app.services.alert_service import get_all_alerts, get_alert_by_id

router = APIRouter(prefix="/api", tags=["alerts"])


@router.get("/alerts", response_model=list[Alert])
def get_alerts() -> list[dict[str, object]]:
    """Return all alerts.

    The router stays focused on the HTTP concern and delegates the actual
    lookup to the service layer. FastAPI serializes the result according to
    the `Alert` schema.
    """
    return get_all_alerts()


@router.get("/alerts/{alert_id}", response_model=Alert)
def get_alert(alert_id: str) -> dict[str, object]:
    """Return one alert by its identifier.

    If no matching alert exists, the service layer raises an HTTPException
    (404) that FastAPI converts into the appropriate error response.
    """
    return get_alert_by_id(alert_id)
