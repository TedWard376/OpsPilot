"""In-memory incidents dataset for the OpsPilot backend.

This module stores realistic incident records used by the Incidents API.
It mirrors the style of other in-memory data modules in `app.data` so the
service and route layers can remain storage-agnostic. Later, this file can
be replaced by a database-backed repository without changing the public
service or route contracts.
"""

from __future__ import annotations

INCIDENTS: list[dict[str, object]] = [
    {
        "id": "inc-001",
        "title": "Primary database unreachable",
        "description": "Primary PostgreSQL node is not accepting connections from application servers.",
        "priority": "P0",
        "status": "Investigating",
        "severity": "Critical",
        "category": "Database outage",
        "affectedServerId": "srv-003",
        "relatedAlertIds": ["alt-101", "alt-102"],
        "assignedEngineer": "A. Patel",
        "createdAt": "2026-08-01T02:14:00Z",
        "updatedAt": "2026-08-01T02:47:30Z",
        "resolvedAt": None,
        "investigationSummary": "Connections timing out; DB process appears running but not accepting new sessions.",
        "resolution": "",
        "timeline": [
            {
                "timestamp": "2026-08-01T02:14:12Z",
                "author": "monitoring",
                "action": "alert",
                "description": "High number of connection timeouts from app cluster"
            },
            {
                "timestamp": "2026-08-01T02:17:01Z",
                "author": "A. Patel",
                "action": "investigate",
                "description": "SSH to primary DB host; process is running but listener not responding"
            },
        ],
    },

    {
        "id": "inc-002",
        "title": "Public web site returning 502",
        "description": "Customers reporting intermittent 502 Bad Gateway errors for the public web front-end.",
        "priority": "P1",
        "status": "Monitoring",
        "severity": "High",
        "category": "Web server unavailable",
        "affectedServerId": "srv-001",
        "relatedAlertIds": ["alt-110"],
        "assignedEngineer": "M. Chen",
        "createdAt": "2026-07-30T11:05:00Z",
        "updatedAt": "2026-07-30T13:22:00Z",
        "resolvedAt": "2026-07-30T13:20:00Z",
        "investigationSummary": "Bad backend responses from API gateway caused upstream 502s; mitigated by routing traffic away from a failing node.",
        "resolution": "Replaced unhealthy upstream and cleared request queue; monitoring for recurrence.",
        "timeline": [
            {
                "timestamp": "2026-07-30T11:05:12Z",
                "author": "synthetic-checks",
                "action": "alert",
                "description": "Synthetic check failed with 502"
            },
            {
                "timestamp": "2026-07-30T11:12:03Z",
                "author": "M. Chen",
                "action": "mitigate",
                "description": "Drained and removed node prod-web-01 from load balancer"
            },
        ],
    },

    {
        "id": "inc-003",
        "title": "Nightly backup failures for critical DB",
        "description": "Automated backups for the primary DB failed in three consecutive runs.",
        "priority": "P2",
        "status": "Open",
        "severity": "Medium",
        "category": "Backup failure",
        "affectedServerId": "srv-003",
        "relatedAlertIds": ["alt-201"],
        "assignedEngineer": "R. Gomez",
        "createdAt": "2026-08-02T06:01:00Z",
        "updatedAt": "2026-08-02T06:05:00Z",
        "resolvedAt": None,
        "investigationSummary": "",
        "resolution": "",
        "timeline": [
            {
                "timestamp": "2026-08-02T06:01:10Z",
                "author": "backup-service",
                "action": "alert",
                "description": "Backup job exit code 2: snapshot creation failed"
            }
        ],
    },

    {
        "id": "inc-004",
        "title": "High CPU on worker fleet",
        "description": "Workers processing background jobs are experiencing sustained high CPU usage causing job latency to increase.",
        "priority": "P2",
        "status": "Investigating",
        "severity": "High",
        "category": "High CPU usage",
        "affectedServerId": "srv-007",
        "relatedAlertIds": ["alt-303", "alt-304"],
        "assignedEngineer": "L. Brooks",
        "createdAt": "2026-08-03T08:45:00Z",
        "updatedAt": "2026-08-03T09:10:00Z",
        "resolvedAt": None,
        "investigationSummary": "Suspect runaway job type X; scaling policy being evaluated.",
        "resolution": "",
        "timeline": [
            {
                "timestamp": "2026-08-03T08:45:05Z",
                "author": "metrics",
                "action": "alert",
                "description": "CPU > 90% on prod-worker-03"
            },
            {
                "timestamp": "2026-08-03T08:48:10Z",
                "author": "L. Brooks",
                "action": "investigate",
                "description": "Checking job queue and process list"
            },
        ],
    },

    {
        "id": "inc-005",
        "title": "Intermittent network latency to storage cluster",
        "description": "I/O latency spikes to shared storage observed affecting multiple services.",
        "priority": "P1",
        "status": "Monitoring",
        "severity": "High",
        "category": "Network latency",
        "affectedServerId": "srv-009",
        "relatedAlertIds": ["alt-411"],
        "assignedEngineer": "S. Novak",
        "createdAt": "2026-07-28T22:30:00Z",
        "updatedAt": "2026-07-29T01:02:00Z",
        "resolvedAt": "2026-07-29T00:58:00Z",
        "investigationSummary": "Transient network fabric congestion in region; vendor applied QoS fix.",
        "resolution": "Vendor fixed QoS on fabric; no further spikes observed.",
        "timeline": [
            {
                "timestamp": "2026-07-28T22:30:10Z",
                "author": "observability",
                "action": "alert",
                "description": "Storage latency > 200ms on region ap-southeast-1"
            },
            {
                "timestamp": "2026-07-29T00:20:00Z",
                "author": "S. Novak",
                "action": "coordinated",
                "description": "Opened vendor ticket and provided traces"
            },
        ],
    },

    {
        "id": "inc-006",
        "title": "SSL certificate expiry approaching for API gateway",
        "description": "TLS certificate for the API gateway will expire in 3 days; automated renewal failing.",
        "priority": "P3",
        "status": "Open",
        "severity": "Low",
        "category": "SSL certificate expiry",
        "affectedServerId": "srv-002",
        "relatedAlertIds": [],
        "assignedEngineer": "J. Kim",
        "createdAt": "2026-08-04T07:00:00Z",
        "updatedAt": "2026-08-04T07:05:00Z",
        "resolvedAt": None,
        "investigationSummary": "",
        "resolution": "",
        "timeline": [
            {
                "timestamp": "2026-08-04T07:00:00Z",
                "author": "cert-manager",
                "action": "alert",
                "description": "Certificate renewals failing for gateway cert"
            }
        ],
    },

    {
        "id": "inc-007",
        "title": "Authentication service degraded",
        "description": "Login and token refresh endpoints returning intermittent 503s.",
        "priority": "P1",
        "status": "Investigating",
        "severity": "High",
        "category": "Authentication service degradation",
        "affectedServerId": "srv-002",
        "relatedAlertIds": ["alt-507"],
        "assignedEngineer": "M. Chen",
        "createdAt": "2026-08-03T14:10:00Z",
        "updatedAt": "2026-08-03T14:25:00Z",
        "resolvedAt": None,
        "investigationSummary": "Rolling restart of auth cluster nodes underway.",
        "resolution": "",
        "timeline": [
            {
                "timestamp": "2026-08-03T14:10:05Z",
                "author": "observability",
                "action": "alert",
                "description": "Auth endpoint 503 rate increased to 4%"
            },
        ],
    },

    {
        "id": "inc-008",
        "title": "Storage capacity nearing threshold",
        "description": "A persistent increase in retention has caused a storage pool to reach 87% capacity.",
        "priority": "P2",
        "status": "Open",
        "severity": "Medium",
        "category": "Storage capacity issue",
        "affectedServerId": "srv-009",
        "relatedAlertIds": ["alt-601"],
        "assignedEngineer": "R. Gomez",
        "createdAt": "2026-08-01T05:00:00Z",
        "updatedAt": "2026-08-01T05:20:00Z",
        "resolvedAt": None,
        "investigationSummary": "",
        "resolution": "",
        "timeline": [
            {
                "timestamp": "2026-08-01T05:00:10Z",
                "author": "storage-monitor",
                "action": "alert",
                "description": "Pool usage at 87% (threshold 85%)"
            }
        ],
    },

    {
        "id": "inc-009",
        "title": "Database replica lagging behind primary",
        "description": "Standby replica replication lag exceeded safe threshold causing stale reads.",
        "priority": "P2",
        "status": "Monitoring",
        "severity": "Medium",
        "category": "Database replication",
        "affectedServerId": "srv-003",
        "relatedAlertIds": ["alt-701"],
        "assignedEngineer": "A. Patel",
        "createdAt": "2026-07-31T03:40:00Z",
        "updatedAt": "2026-07-31T04:02:00Z",
        "resolvedAt": "2026-07-31T04:00:00Z",
        "investigationSummary": "Replication backlog cleared after replaying WAL segments.",
        "resolution": "Applied catch-up and restored steady-state replication.",
        "timeline": [
            {
                "timestamp": "2026-07-31T03:40:22Z",
                "author": "replication-monitor",
                "action": "alert",
                "description": "Replica lag > 120s"
            },
        ],
    },
]
