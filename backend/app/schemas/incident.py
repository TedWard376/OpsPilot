"""Pydantic schemas for incident payloads.

Defines the public API contract for incident resources used by the
Incidents endpoints. Kept intentionally simple (timestamps as strings)
to match existing schemas in the repository and make frontend integration
straightforward.
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel


class TimelineEntry(BaseModel):
    """Represents one timeline event inside an incident.

    Storing the timestamp as a string keeps the shape consistent with other
    schemas in the project and avoids unnecessary conversion at this stage.
    """

    timestamp: str
    author: str
    action: str
    description: str


class Incident(BaseModel):
    """Schema for a single incident resource.

    Fields mirror the in-memory dataset and the UI expectations. Optional
    fields are allowed where incidents may not yet have been investigated or
    resolved.
    """

    id: str
    title: str
    description: str
    priority: str
    status: str
    severity: str
    category: str
    affectedServerId: Optional[str]
    relatedAlertIds: List[str]
    assignedEngineer: Optional[str]
    createdAt: str
    updatedAt: str
    resolvedAt: Optional[str]
    investigationSummary: Optional[str]
    resolution: Optional[str]
    timeline: List[TimelineEntry]

    class Config:
        orm_mode = True
