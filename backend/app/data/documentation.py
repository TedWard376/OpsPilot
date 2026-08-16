"""In-memory documentation dataset for the OpsPilot backend.

Mirrors app/data/alerts.py: realistic records held in memory only, acting as
the data-access boundary for the Documentation API. `content` holds real
troubleshooting/procedure text (not placeholder copy) because this is the
data an AI Incident Investigator will eventually read from — writing it
realistically now avoids redoing it later.
"""

from __future__ import annotations

DOCUMENTS: list[dict[str, object]] = [
    {
        "id": "doc-001",
        "title": "VMware VM Troubleshooting Guide",
        "description": "Diagnosing unresponsive or degraded virtual machines on VMware vSphere.",
        "content": (
            "1. Confirm the VM's power state and connection state in vCenter.\n"
            "2. Check host resource contention (CPU Ready, memory ballooning) on the ESXi host.\n"
            "3. Review VM-level performance charts for CPU, memory, disk latency, and network drops.\n"
            "4. Inspect vmware.log on the datastore for snapshot, storage, or heartbeat errors.\n"
            "5. If the guest OS is unresponsive but the VM shows 'powered on', attempt a guest OS "
            "restart before a hard power cycle.\n"
            "6. Escalate to the virtualization team if host-level resource contention is confirmed."
        ),
        "category": "VMware",
        "tags": ["vmware", "vsphere", "virtual-machine", "troubleshooting"],
        "documentType": "Troubleshooting Guide",
        "author": "R. Gomez",
        "version": "1.4",
        "status": "Published",
        "createdAt": "2025-11-02T10:00:00Z",
        "updatedAt": "2026-06-18T09:30:00Z",
        "lastReviewedAt": "2026-06-18T09:30:00Z",
    },
    {
        "id": "doc-002",
        "title": "Server Disk Space Investigation",
        "description": "Standard procedure for investigating and resolving low disk space conditions.",
        "content": (
            "1. Confirm the affected volume and current usage percentage from the monitoring alert.\n"
            "2. Identify the largest consumers with `du -sh /* | sort -rh | head -20`.\n"
            "3. Check for oversized log files under /var/log and rotate or truncate as appropriate.\n"
            "4. Check for orphaned Docker images/containers consuming disk (`docker system df`).\n"
            "5. If a scheduled cleanup job exists for this server, confirm it ran successfully.\n"
            "6. If usage remains critical after cleanup, escalate for a volume expansion."
        ),
        "category": "Infrastructure",
        "tags": ["disk-space", "storage", "linux", "cleanup"],
        "documentType": "Runbook",
        "author": "A. Patel",
        "version": "2.1",
        "status": "Published",
        "createdAt": "2025-09-14T08:00:00Z",
        "updatedAt": "2026-07-01T11:15:00Z",
        "lastReviewedAt": "2026-07-01T11:15:00Z",
    },
    {
        "id": "doc-003",
        "title": "Backup Failure Troubleshooting",
        "description": "Diagnosing and recovering from a failed scheduled backup job.",
        "content": (
            "1. Locate the failed job in the backup service's job history and capture the error code.\n"
            "2. Common causes: destination storage full, expired credentials, network timeout to "
            "the backup target, or a locked source volume.\n"
            "3. Verify destination storage has sufficient free capacity.\n"
            "4. Re-run the job manually in verbose mode to reproduce the failure.\n"
            "5. If the job succeeds on retry, treat as transient and monitor the next scheduled run.\n"
            "6. If it fails again, open an incident and attach the job logs."
        ),
        "category": "Backup",
        "tags": ["backup", "disaster-recovery", "storage"],
        "documentType": "Troubleshooting Guide",
        "author": "R. Gomez",
        "version": "1.2",
        "status": "Published",
        "createdAt": "2025-10-20T13:00:00Z",
        "updatedAt": "2026-05-22T10:00:00Z",
        "lastReviewedAt": "2026-05-22T10:00:00Z",
    },
    {
        "id": "doc-004",
        "title": "Azure VM Recovery Procedure",
        "description": "Recovering an Azure virtual machine that is unreachable or stuck provisioning.",
        "content": (
            "1. Check the VM's status in the Azure Portal (Running, Stopped, Failed, Updating).\n"
            "2. Review Activity Log for the resource for recent failed operations.\n"
            "3. Attempt a Redeploy operation if the VM is stuck in a 'Failed' provisioning state — "
            "this moves the VM to a new host node without changing its configuration.\n"
            "4. If Redeploy does not resolve it, attempt Stop (Deallocate) followed by Start.\n"
            "5. Use Boot Diagnostics / Serial Console to inspect boot-time errors on the guest OS.\n"
            "6. Escalate to Azure Support if the underlying platform reports a host-level fault."
        ),
        "category": "Azure",
        "tags": ["azure", "cloud", "virtual-machine", "recovery"],
        "documentType": "Procedure",
        "author": "M. Chen",
        "version": "1.0",
        "status": "Published",
        "createdAt": "2026-01-10T09:00:00Z",
        "updatedAt": "2026-01-10T09:00:00Z",
        "lastReviewedAt": "2026-07-05T14:00:00Z",
    },
    {
        "id": "doc-005",
        "title": "Network Connectivity Troubleshooting",
        "description": "Isolating the source of network latency or connectivity loss between services.",
        "content": (
            "1. Confirm the scope: single host, single availability zone, or region-wide.\n"
            "2. Run traceroute/mtr from an unaffected host to the affected endpoint.\n"
            "3. Check load balancer and security group / firewall rule changes in the last 24 hours.\n"
            "4. Review DNS resolution time separately from connection time to isolate DNS issues.\n"
            "5. Check for saturated network interfaces or dropped packets on affected hosts.\n"
            "6. If latency correlates with a specific route hop, escalate to network engineering."
        ),
        "category": "Networking",
        "tags": ["network", "latency", "dns", "troubleshooting"],
        "documentType": "Troubleshooting Guide",
        "author": "S. Novak",
        "version": "1.6",
        "status": "Published",
        "createdAt": "2025-08-30T09:00:00Z",
        "updatedAt": "2026-06-11T16:20:00Z",
        "lastReviewedAt": "2026-06-11T16:20:00Z",
    },
    {
        "id": "doc-006",
        "title": "Incident Response Procedure",
        "description": "Standard operating procedure for triaging and managing an active incident.",
        "content": (
            "1. Acknowledge the triggering alert and confirm scope of impact.\n"
            "2. Open an incident record and assign a severity level based on customer impact.\n"
            "3. Designate an incident owner responsible for coordinating the response.\n"
            "4. Post regular status updates to the incident channel at agreed intervals.\n"
            "5. Once mitigated, confirm recovery against monitoring before marking resolved.\n"
            "6. Schedule a post-incident review within 5 business days for Critical/High incidents."
        ),
        "category": "Incident Response",
        "tags": ["incident-response", "process", "on-call"],
        "documentType": "Procedure",
        "author": "L. Brooks",
        "version": "3.0",
        "status": "Published",
        "createdAt": "2025-06-01T09:00:00Z",
        "updatedAt": "2026-04-15T10:00:00Z",
        "lastReviewedAt": "2026-04-15T10:00:00Z",
    },
    {
        "id": "doc-007",
        "title": "Server Patching Procedure",
        "description": "Standard procedure for applying OS and security patches to production servers.",
        "content": (
            "1. Confirm the server is in the current patch cycle's maintenance window.\n"
            "2. Take a snapshot or verify a recent backup exists before patching.\n"
            "3. Drain traffic from the server if it sits behind a load balancer.\n"
            "4. Apply patches and reboot if required by the update.\n"
            "5. Run post-patch health checks (service status, application smoke tests).\n"
            "6. Re-enable traffic and monitor for 30 minutes before closing the maintenance window."
        ),
        "category": "Infrastructure",
        "tags": ["patching", "maintenance", "linux", "security"],
        "documentType": "Procedure",
        "author": "J. Kim",
        "version": "2.3",
        "status": "Published",
        "createdAt": "2025-07-18T09:00:00Z",
        "updatedAt": "2026-03-02T11:00:00Z",
        "lastReviewedAt": "2026-03-02T11:00:00Z",
    },
    {
        "id": "doc-008",
        "title": "Database Outage Investigation",
        "description": "Investigating a primary database that is unreachable or refusing connections.",
        "content": (
            "1. Confirm whether the database process is running on the primary host.\n"
            "2. Check connection pool exhaustion — a full pool looks identical to a downed database.\n"
            "3. Review replication lag and failover status if a standby/replica exists.\n"
            "4. Check disk space on the database volume; a full disk can silently reject writes.\n"
            "5. Review recent schema migrations or configuration changes as a possible trigger.\n"
            "6. If the primary cannot be recovered quickly, initiate a controlled failover to standby."
        ),
        "category": "Infrastructure",
        "tags": ["database", "outage", "failover"],
        "documentType": "Troubleshooting Guide",
        "author": "L. Brooks",
        "version": "1.5",
        "status": "Published",
        "createdAt": "2025-12-05T09:00:00Z",
        "updatedAt": "2026-06-29T13:45:00Z",
        "lastReviewedAt": "2026-06-29T13:45:00Z",
    },
    {
        "id": "doc-009",
        "title": "SSL Certificate Renewal Procedure",
        "description": "Renewing and deploying a TLS certificate before it expires.",
        "content": (
            "1. Confirm the exact expiry date and all domains/SANs covered by the certificate.\n"
            "2. Generate or renew the certificate through the certificate authority or ACME client.\n"
            "3. Deploy the new certificate to all terminating load balancers or servers.\n"
            "4. Verify the new certificate is being served with `openssl s_client -connect`.\n"
            "5. Confirm certificate expiry monitoring is tracking the new expiry date.\n"
            "6. Revoke or archive the old certificate once the new one is confirmed live."
        ),
        "category": "Security",
        "tags": ["ssl", "tls", "certificates", "security"],
        "documentType": "Procedure",
        "author": "A. Patel",
        "version": "1.1",
        "status": "Published",
        "createdAt": "2025-09-01T09:00:00Z",
        "updatedAt": "2026-02-14T09:00:00Z",
        "lastReviewedAt": "2026-02-14T09:00:00Z",
    },
    {
        "id": "doc-010",
        "title": "Security Incident Escalation Policy",
        "description": "Defines escalation thresholds and required approvals for suspected security incidents.",
        "content": (
            "This policy governs escalation for any suspected unauthorized access, data exposure, "
            "or anomalous authentication activity.\n\n"
            "All suspected security incidents must be reported to the security on-call within 15 "
            "minutes of detection, regardless of confirmed impact. Incidents involving confirmed "
            "unauthorized access to production systems require immediate notification to the "
            "Security Lead and Engineering Director. No system should be taken offline or have "
            "evidence altered before the security on-call has been engaged, except where required "
            "to stop active, ongoing harm."
        ),
        "category": "Security",
        "tags": ["security", "policy", "escalation"],
        "documentType": "Policy",
        "author": "S. Novak",
        "version": "1.0",
        "status": "Draft",
        "createdAt": "2026-07-20T09:00:00Z",
        "updatedAt": "2026-07-20T09:00:00Z",
        "lastReviewedAt": "2026-07-20T09:00:00Z",
    },
]
