"""Pydantic schemas for documentation payloads.

Same role as schemas/alert.py: this is the API's public contract, decided
independently of where the data currently lives (app/data/documentation.py).
Field names use the same camelCase convention as the rest of the API so the
JSON returned here can eventually replace the frontend's Documentation mock
data with no translation layer.
"""

from __future__ import annotations

from pydantic import BaseModel


class Document(BaseModel):
    """Schema for a single documentation resource (runbook, guide, policy, etc.).

    `content` is a single string for now rather than a structured list of
    sections. That's a deliberate simplification, not an oversight: how a
    runbook's body should be structured (markdown? discrete step blocks?) is
    a bigger design question than this stage needs to answer. A flat string
    proves the API contract; restructuring it later is a schema change, not
    a rewrite of this feature.
    """

    id: str
    title: str
    description: str
    content: str
    category: str
    tags: list[str]
    documentType: str
    author: str
    version: str
    status: str
    createdAt: str
    updatedAt: str
    lastReviewedAt: str
