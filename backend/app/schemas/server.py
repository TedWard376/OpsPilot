"""Pydantic schemas for server payloads.

Schemas are a contract layer: they describe the shape of the data that
should flow in and out of the API. Even with in-memory data, they help us
keep the API stable and documented.
"""

from __future__ import annotations

from pydantic import BaseModel


class Server(BaseModel):
    """Schema for a single server resource.

    This model describes the public API response shape for each server.
    It intentionally includes both the infrastructure-focused names and the
    UI-facing compatibility fields so the backend contract stays stable as the
    application evolves.
    """

    id: str
    hostname: str
    displayName: str
    operatingSystem: str
    environment: str
    ipAddress: str
    location: str
    status: str
    cpuUsage: int
    memoryUsage: int
    diskUsage: int
    uptime: str
    lastSeen: str
    lastSeenAt: str
    service: str
    os: str
    cpu: int
    memory: int
    disk: int
