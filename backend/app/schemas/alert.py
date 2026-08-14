"""Pydantic schemas for alert payloads.

Like schemas/server.py, this file is the API's public contract: the exact
shape of JSON the /alerts endpoints promise to return. It is deliberately
separate from app/data/alerts.py — the schema describes "what the API
returns", the data module describes "where that data currently lives".
Keeping those two concerns in different files is what lets the storage
layer change later without changing the contract the frontend depends on.
"""

from __future__ import annotations

from pydantic import BaseModel


class Alert(BaseModel):
    """Schema for a single alert resource.

    Field naming intentionally matches the camelCase convention already
    used by the frontend (and by schemas/server.py), so the JSON this API
    returns can be consumed by the existing TypeScript AlertItem-shaped
    code with no translation layer required.
    """

    id: str
    title: str
    description: str
    severity: str
    status: str
    source: str
    affectedServerId: str
    category: str
    environment: str
    # Event time: when the underlying condition was actually observed.
    timestamp: str
    acknowledged: bool
    # Only set once an engineer has acknowledged the alert.
    acknowledgedBy: str | None = None
    # Record time: when this alert entry was created in the system.
    # Usually equal to `timestamp`, but kept separate because in a real
    # monitoring system the two can drift (e.g. a delayed ingestion pipeline).
    createdAt: str
