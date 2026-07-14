# OpsPilot API Specification

**Version:** 1.0

**Status:** Draft

**Architecture:** REST API

**Backend:** FastAPI

**Authentication:** JWT Bearer Token

**Content-Type:** application/json

---

# Base URL

```
http://localhost:8000/api/v1
```

Production

```
https://api.opspilot.com/api/v1
```

---

# Authentication

Most endpoints require authentication.

Header

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Response Format

## Success

```json
{
  "success": true,
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Server not found"
}
```

---

# Authentication

---

## POST /auth/login

Login user.

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "John Smith",
    "role": "Engineer"
  }
}
```

---

## POST /auth/logout

Logout current user.

---

## GET /auth/me

Return current user.

---

# Users

---

## GET /users

Returns all users.

---

## GET /users/{id}

Returns a specific user.

---

## POST /users

Create new user.

---

## PATCH /users/{id}

Update user.

---

## DELETE /users/{id}

Delete user.

---

# Infrastructure

---

## GET /servers

Returns all servers.

Supports

- search
- pagination
- filtering

Example

```
GET /servers?page=1&status=healthy
```

---

## GET /servers/{id}

Returns server details.

Includes

- metrics
- alerts
- incidents

---

## POST /servers

Create server.

---

## PATCH /servers/{id}

Update server.

---

## DELETE /servers/{id}

Delete server.

---

# Virtual Machines

---

## GET /virtual-machines

List VMs.

---

## GET /virtual-machines/{id}

VM details.

---

## POST /virtual-machines

Create VM.

---

## PATCH /virtual-machines/{id}

Update VM.

---

## DELETE /virtual-machines/{id}

Delete VM.

---

# Storage

---

## GET /storage

List storage volumes.

---

## GET /storage/{id}

Storage details.

---

# Networks

---

## GET /networks

List networks.

---

## GET /networks/{id}

Network details.

---

# Alerts

---

## GET /alerts

List alerts.

Query Parameters

```
severity

status

server

page

search
```

---

## GET /alerts/{id}

Alert details.

---

## POST /alerts

Create alert.

---

## PATCH /alerts/{id}

Update alert.

Possible updates

- status

- owner

- severity

---

## DELETE /alerts/{id}

Delete alert.

---

# Incidents

---

## GET /incidents

List incidents.

Supports

- pagination

- search

- status

- priority

---

## GET /incidents/{id}

Returns

- incident

- timeline

- related alerts

- affected servers

- AI summaries

---

## POST /incidents

Create incident.

Example

```json
{
  "title": "Website unavailable",
  "priority": "Critical",
  "description": "Customer website not responding."
}
```

---

## PATCH /incidents/{id}

Update incident.

---

## POST /incidents/{id}/assign

Assign engineer.

---

## POST /incidents/{id}/close

Close incident.

---

# Incident Timeline

---

## GET /incidents/{id}/timeline

Returns chronological events.

---

## POST /incidents/{id}/timeline

Add timeline entry.

---

# Metrics

---

## GET /servers/{id}/metrics

Returns

CPU

Memory

Disk

Network

Time-series data.

---

## GET /metrics/dashboard

Dashboard summary.

---

# Documentation

---

## GET /documents

Returns uploaded documentation.

---

## POST /documents/upload

Upload document.

Supports

- PDF

- DOCX

- Markdown

---

## GET /documents/{id}

View document.

---

## DELETE /documents/{id}

Delete document.

---

## POST /documents/search

Semantic search.

Example

```json
{
  "query": "How do I restore a VM backup?"
}
```

---

# AI

---

## POST /ai/investigate

Main AI endpoint.

Request

```json
{
  "incidentId": 12
}
```

Returns

```json
{
  "summary": "...",

  "possibleCauses": [],

  "recommendedSteps": [],

  "relatedDocuments": []
}
```

---

## POST /ai/chat

General AI assistant.

Request

```json
{
  "message": "Explain VMware snapshots"
}
```

---

## POST /ai/summarise

Summarise incident.

---

## POST /ai/report

Generate incident report.

---

# Reports

---

## GET /reports

List reports.

---

## GET /reports/{id}

View report.

---

## POST /reports

Generate report.

---

## DELETE /reports/{id}

Delete report.

---

# Dashboard

---

## GET /dashboard

Returns

Infrastructure Health

Server Count

Incident Count

Alert Count

Critical Systems

Recent Incidents

Health Score

Charts

---

# Notifications

---

## GET /notifications

User notifications.

---

## PATCH /notifications/{id}

Mark as read.

---

# Audit Logs

---

## GET /audit

System audit log.

Admin only.

---

# Health Check

---

## GET /health

Returns

```json
{
  "status": "healthy"
}
```

---

# Status Codes

| Code | Meaning |
|-------|----------|
|200|OK|
|201|Created|
|204|Deleted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|500|Internal Server Error|

---


# API Principles

- RESTful design
- Stateless authentication
- JSON responses
- Pagination for large datasets
- Consistent error handling
- Role-based authorization
- OpenAPI documentation generated automatically by FastAPI