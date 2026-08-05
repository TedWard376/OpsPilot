from fastapi import APIRouter

from app.services.engineer_service import get_all_engineers

router = APIRouter(prefix="/api", tags=["engineers"])


@router.get("/engineers", response_model=list[str])
def get_engineers() -> list[str]:
    """Return the assignable engineer roster for alert and incident workflows."""
    return get_all_engineers()
