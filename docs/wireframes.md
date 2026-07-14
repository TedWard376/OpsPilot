# OpsPilot - Wireframes & User Interface Design

**Version:** 1.0

**Status:** Draft

---

# Design Principles

OpsPilot should feel like a professional enterprise SaaS platform similar to products such as Azure Portal, Datadog, Grafana or ServiceNow.

The UI should prioritise:

- Fast incident investigation
- Clear information hierarchy
- Minimal clutter
- Modern dashboard aesthetics
- AI integrated naturally (not just a chatbot)

---

# Navigation

```
+--------------------------------------------------------------+
| OpsPilot Logo                                    User Avatar |
+--------------------------------------------------------------+

 Dashboard
 Infrastructure
 Alerts
 Incidents
 Documentation
 AI Assistant
 Reports
 Settings
```

The sidebar remains visible throughout the application.

---

# Login Page

```
+--------------------------------------------------------------+

                        OpsPilot

       AI-powered Incident Investigation Platform

               [ Email Address               ]

               [ Password                    ]

                ( ) Remember Me

              [      Sign In      ]

---------------------------------------------------------------

                Continue with Microsoft

---------------------------------------------------------------

                    Forgot Password?

```

---

# Dashboard

Purpose:
Provide engineers with a quick overview of infrastructure health.

```
+--------------------------------------------------------------------------+

 Sidebar

 Dashboard

+--------------------------------------------------------------+

 Infrastructure Health          94%

 Active Alerts                  6

 Open Incidents                 3

 Healthy Servers               41

---------------------------------------------------------------

 Health Overview

 ████████████████████████

---------------------------------------------------------------

 Critical Alerts

 ● Database latency

 ● Backup failed

 ● High CPU Server03

---------------------------------------------------------------

 Recent Incidents

 #241 Website unavailable

 #242 Failed backup

 #243 High memory usage

---------------------------------------------------------------

 AI Summary

 "Two critical systems require investigation.
 Backup failures appear related to storage capacity."

```

---

# Infrastructure Page

Purpose:
Display all managed infrastructure.

```
+--------------------------------------------------------------------------+

 Infrastructure

 Search Infrastructure

[__________________________] [Search]

---------------------------------------------------------------

 Filters

 Status

 Type

 Location

---------------------------------------------------------------

 HOSTNAME      STATUS     CPU     RAM     STORAGE

 Server01      Healthy    12%     34%     58%

 Server02      Warning    88%     73%     44%

 Server03      Critical   99%     95%     90%

 VM-App01      Healthy    18%     27%     32%

 DB-Primary    Warning    74%     81%     67%

```

Selecting a server opens the Server Details page.

---

# Server Details

```
+--------------------------------------------------------------------------+

 Server03

 Status

 ● Critical

---------------------------------------------------------------

 CPU

 ████████████████ 99%

---------------------------------------------------------------

 Memory

 █████████████ 94%

---------------------------------------------------------------

 Disk

 ███████ 61%

---------------------------------------------------------------

 Recent Alerts

 High CPU

 High Memory

 Application Timeout

---------------------------------------------------------------

 AI Investigation

 [ Investigate ]

```

---

# Alerts Page

```
+--------------------------------------------------------------------------+

 Active Alerts

 Search

[_____________________]

---------------------------------------------------------------

 Severity

 Critical

 Warning

 Info

---------------------------------------------------------------

 ALERT                     SEVERITY      STATUS

 Database Timeout          Critical      Open

 Backup Failed             Critical      Open

 CPU High                  Warning       Open

 Disk Space Low            Warning       Open

 VPN Offline               Critical      Open

```

Selecting an alert opens Alert Details.

---

# Alert Details

```
+--------------------------------------------------------------------------+

 Alert

 Database Timeout

---------------------------------------------------------------

 Status

 Open

 Severity

 Critical

---------------------------------------------------------------

 Affected System

 Database01

---------------------------------------------------------------

 Created

 10:42

---------------------------------------------------------------

 Related Incident

 Incident #241

---------------------------------------------------------------

 [ Investigate with AI ]

```

---

# Incidents Page

```
+--------------------------------------------------------------------------+

 Open Incidents

---------------------------------------------------------------

 Priority

 Status

 Assigned Engineer

---------------------------------------------------------------

 #241 Website unavailable

 Critical

 Open

 Emily

---------------------------------------------------------------

 #242 Backup failed

 High

 Investigating

 James

---------------------------------------------------------------

 #243 DNS Failure

 Medium

 Monitoring

 Alex

```

---

# Incident Details (Most Important Screen)

This is the core of the application.

```
+------------------------------------------------------------------------------------+

 Incident #241

 Website unavailable

====================================================================================

 Timeline

 10:21 CPU Spike

 10:22 Database Timeout

 10:24 Alert Created

 10:25 Investigation Started

====================================================================================

 Infrastructure

 Server03

 Database01

 Load Balancer

====================================================================================

 Metrics

 CPU

 Memory

 Disk

 Network

====================================================================================

 AI Investigation

 Possible Cause

 Database connection exhaustion.

-----------------------------------------------------

 Recommended Investigation

 1. Check database connectivity.

 2. Review application logs.

 3. Inspect firewall rules.

 4. Verify recent deployments.

-----------------------------------------------------

 Related Documentation

 • Database Troubleshooting

 • Azure SQL Connectivity

 • VMware Networking

-----------------------------------------------------

 Confidence

 83%

====================================================================================

 Notes

 ___________________________________________

 ___________________________________________

 ___________________________________________

====================================================================================

 [Generate Incident Report]

```

---

# AI Assistant

Unlike ChatGPT, this is context-aware.

```
+--------------------------------------------------------------------------+

 AI Assistant

---------------------------------------------------------------

 Context

 Incident #241

 Server03

 Database01

---------------------------------------------------------------

 Ask a question

 ____________________________________________

 [ Send ]

---------------------------------------------------------------

 Suggested Questions

 Why is Server03 unhealthy?

 Explain this alert.

 Show similar incidents.

 Recommend investigation steps.

 Explain VMware snapshots.

```

---

# Documentation

```
+--------------------------------------------------------------------------+

 Documentation

 Search

[________________________________________]

---------------------------------------------------------------

 Upload Document

---------------------------------------------------------------

 Recent Documents

 VMware Best Practices

 Azure Backup Guide

 SQL Troubleshooting

 Disaster Recovery Runbook

 Incident Playbook

```

---

# Document Viewer

```
+--------------------------------------------------------------------------+

 VMware Best Practices

---------------------------------------------------------------

 Search

[________________________]

---------------------------------------------------------------

 Document

...

---------------------------------------------------------------

 Ask AI

 ____________________________________

```

---

# Reports

```
+--------------------------------------------------------------------------+

 Incident Reports

---------------------------------------------------------------

 #241

 Website unavailable

 Generated

 12 July

---------------------------------------------------------------

 #242

 Backup Failure

 Generated

 9 July

---------------------------------------------------------------

 [Export PDF]

```

---

# Settings

```
+--------------------------------------------------------------------------+

 Profile

 Name

 Email

 Password

---------------------------------------------------------------

 AI Settings

 Default Model

 Temperature

---------------------------------------------------------------

 Preferences

 Theme

 Notifications

 Language

```

---

# Mobile Behaviour

Sidebar collapses into a hamburger menu.

Tables become stacked cards.

Charts resize automatically.

AI Assistant becomes full-screen.

---

# Colour Palette (Initial)

| Element | Colour |
|----------|---------|
| Primary | Blue |
| Success | Green |
| Warning | Amber |
| Critical | Red |
| Background | White / Dark Mode |
| Sidebar | Dark Slate |

---

# Icons

Recommended:

- Lucide React
- Heroicons

---

# Future Improvements

- Infrastructure topology graph
- Live metrics
- Real-time alerts
- AI-generated architecture diagrams
- Teams integration
- Microsoft authentication
- Dark mode
- Multi-tenant organisations