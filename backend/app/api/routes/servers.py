from fastapi import APIRouter

from app.schemas.server import Server
from app.services.server_service import get_all_servers, get_server_by_id

router = APIRouter(prefix="/api", tags=["servers"])


@router.get("/servers", response_model=list[Server])
def get_servers() -> list[dict[str, object]]:
    """Return all servers.

    The router keeps the HTTP concern here and delegates data lookup to the
    service layer. FastAPI will serialize the returned response model
    according to the `Server` schema.
    """
    return get_all_servers()


@router.get("/servers/{server_id}", response_model=Server)
def get_server(server_id: str) -> dict[str, object]:
    """Return one server by its identifier.

    If a matching server does not exist, the service layer raises a 404
    response that FastAPI converts into the appropriate HTTP error.
    """
    return get_server_by_id(server_id)