# PROJECT_CONTEXT.md

# OpsPilot - Project Context

**Version:** 1.0

This document provides the context, architecture, coding standards and development philosophy for all AI coding assistants and contributors working on OpsPilot.

---

# Project Overview

OpsPilot is an AI-powered Incident Investigation Platform for IT Operations, Cloud Infrastructure and DevOps teams.

Its purpose is to reduce the time engineers spend investigating incidents by bringing together infrastructure data, documentation, historical incidents and AI-generated investigation guidance into a single application.

This project is intended to demonstrate professional software engineering practices while solving a realistic business problem.

---

# Primary Goal

Build software that could realistically be used by an MSP, Cloud Consultancy or Enterprise IT Operations team.

This is NOT a university CRUD project.

Every architectural decision should favour maintainability, scalability and readability.

---

# Target Users

* Cloud Engineers
* Infrastructure Engineers
* DevOps Engineers
* Technical Support Engineers
* Operations Engineers
* IT Managers

---

# Core Features

* Dashboard
* Infrastructure Management
* Server Management
* Alerts
* Incident Management
* Documentation Search
* AI Investigation Assistant
* AI Incident Report Generation
* User Authentication
* Audit Logging
* Reporting

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS

## Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic

## Database

* PostgreSQL

## AI

* OpenAI API
* ChromaDB (later)

## Deployment

* Docker
* Azure (later)

---

# Architecture

Frontend

↓

REST API

↓

FastAPI Backend

↓

PostgreSQL

↓

OpenAI API

The frontend should never communicate directly with the database.

All business logic belongs in the backend.

---

# Development Philosophy

Prioritise:

* readability
* maintainability
* modularity
* clean architecture
* reusable components

Avoid:

* large files
* duplicated logic
* hardcoded values
* unnecessary abstraction
* premature optimisation

---

# Project Structure

```
OpsPilot/

frontend/

backend/

docs/

README.md

PROJECT_CONTEXT.md
```

---

# Frontend Structure

```
src/

components/

layouts/

pages/

hooks/

services/

types/

utils/

assets/
```

Pages should compose reusable components.

Avoid putting large amounts of logic inside page components.

---

# Backend Structure

```
backend/

app/

api/

models/

schemas/

services/

repositories/

core/

database/

main.py
```

Keep business logic inside services.

Routes should remain thin.

---

# Coding Standards

Always use:

* TypeScript
* Functional React Components
* React Hooks
* Strict typing
* Named exports where appropriate

Never use:

* inline styles
* JavaScript when TypeScript is available
* "any" unless unavoidable
* duplicated components

Prefer composition over inheritance.

---

# React Guidelines

Components should have a single responsibility.

Create reusable UI components whenever possible.

Examples:

* Button
* Card
* MetricCard
* StatusBadge
* SearchBar
* Table
* Sidebar
* Navbar
* Modal

Avoid page-specific components unless absolutely necessary.

---

# FastAPI Guidelines

Use:

* Pydantic models
* Dependency Injection
* SQLAlchemy ORM
* RESTful endpoints
* Proper HTTP status codes

Separate:

* routes
* services
* repositories
* database models
* schemas

---

# API Principles

REST API

Consistent responses

Pagination

Filtering

Validation

Error handling

JWT authentication (later)

Never expose database implementation details.

---

# Database Principles

Use PostgreSQL.

Use SQLAlchemy ORM.

Normalise data where appropriate.

Avoid duplicated data.

Use foreign keys.

Use UUIDs where appropriate.

Do not manually write SQL unless required.

---

# AI Features

AI should assist engineers.

AI should NOT make operational decisions.

Examples:

* Explain alerts
* Summarise incidents
* Search documentation
* Recommend investigation steps
* Generate reports

The engineer always makes the final decision.

---

# UI Style

Enterprise SaaS.

Inspired by:

* Microsoft Azure Portal
* GitHub
* Datadog
* Atlassian
* Linear
* Grafana

Use:

* whitespace
* cards
* subtle shadows
* professional typography
* consistent spacing

Avoid:

* excessive gradients
* glassmorphism
* flashy animations
* gaming aesthetics

---

# Accessibility

All components should:

* support keyboard navigation
* use semantic HTML
* include accessible labels
* maintain colour contrast

---

# Git Workflow

Use feature branches.

Examples:

```
feature/app-shell

feature/dashboard

feature/server-management

feature/incidents

feature/alerts

feature/documentation

feature/ai-assistant
```

Use Conventional Commits.

Examples

```
feat(layout): create application shell

feat(dashboard): add metric cards

feat(api): implement server endpoints

fix(alerts): resolve filtering issue

refactor(sidebar): simplify navigation component
```

Avoid commits such as:

* update
* changes
* fixed stuff
* final version

---

# AI Assistant Instructions

When generating code:

1. Think like a senior software engineer.
2. Follow the existing architecture.
3. Reuse existing components before creating new ones.
4. Explain major architectural decisions.
5. Prefer clean, readable code over clever code.
6. Avoid unnecessary dependencies.
7. Do not rewrite unrelated files.
8. Keep pull requests focused on one feature.
9. Assume future scalability.
10. If requirements are ambiguous, ask for clarification instead of guessing.

---

# Learning Objective

This project exists to improve the developer's software engineering skills.

Generated code should therefore be:

* understandable
* well documented
* easy to explain in interviews

Prefer educational explanations over "magic" solutions.

---

# Definition of Done

A feature is complete when:

* It matches the design.
* It follows the architecture.
* It is typed correctly.
* It has no obvious linting issues.
* It is responsive.
* It is accessible.
* It does not duplicate existing functionality.
* It has been manually tested.
* It is committed with a meaningful commit message.

---

# Long-Term Vision

OpsPilot should resemble a real commercial SaaS product that could be presented during graduate software engineering interviews and demonstrate:

* Full-stack development
* Modern React architecture
* REST API development
* Database design
* AI integration
* Cloud-ready architecture
* Professional software engineering practices

Every contribution should move the project toward this goal.
