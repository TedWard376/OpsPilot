from fastapi import APIRouter

from app.schemas.documentation import Document
from app.services.documentation_service import get_all_documents, get_document_by_id

router = APIRouter(prefix="/api", tags=["documentation"])


@router.get("/documentation", response_model=list[Document])
def get_documentation() -> list[dict[str, object]]:
    """Return all documentation records.

    The router stays focused on the HTTP concern and delegates the actual
    lookup to the service layer. FastAPI serializes the result according to
    the `Document` schema.
    """
    return get_all_documents()


@router.get("/documentation/{document_id}", response_model=Document)
def get_document(document_id: str) -> dict[str, object]:
    """Return one document by its identifier.

    If no matching document exists, the service layer raises an
    HTTPException (404) that FastAPI converts into the appropriate error
    response.
    """
    return get_document_by_id(document_id)
