# OpsPilot

OpsPilot is an AI-powered incident investigation and operations platform for infrastructure, alerts, incidents, documentation, and reporting workflows.

It is designed for IT operations, cloud engineering, and SRE teams that need a centralized operational console for investigation, investigation support, and reporting.

---

## Project Vision

OpsPilot brings together:

- infrastructure visibility
- alert triage
- incident collaboration
- documentation access
- AI-assisted investigation support
- report generation workflows

The project is structured to reflect a realistic enterprise operations product rather than a basic demo CRUD application.

---

## Core Features

- Dashboard overview for health and operational context
- Server and infrastructure monitoring views
- Alert management and investigation flow
- Incident tracking and detail pages
- Documentation and knowledge-base browsing
- AI assistant-style operational support
- Reports and executive summary views

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Recharts

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic

### Data and AI

- PostgreSQL
- OpenAI API
- ChromaDB (planned for future retrieval workflows)

### Deployment

- Docker
- Azure-ready deployment model

---

## Repository Structure

```text
OpsPilot/
├─ backend/
├─ database/
├─ docker/
├─ docs/
├─ frontend/
├─ infrastructure/
└─ README.md
```

### Frontend structure

```text
frontend/
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ components/
│  ├─ hooks/
│  ├─ layouts/
│  ├─ pages/
│  ├─ services/
│  ├─ styles/
│  ├─ types/
│  └─ utils/
└─ package.json
```

---

## Documentation Index

The repository already includes several technical and design documents:

- [docs/API_endpoints.md](docs/API_endpoints.md)
- [docs/Database_schema.md](docs/Database_schema.md)
- [docs/wireframes.md](docs/wireframes.md)
- [docs/Frontend_architecture.md](docs/Frontend_architecture.md)

These files together provide:

- application endpoint expectations
- data model references
- UI design direction
- frontend architecture context

---

## Frontend Architecture Summary

The frontend is organized around a layered architecture:

- route registration in [frontend/src/App.tsx](frontend/src/App.tsx)
- shared application shell in [frontend/src/layouts/MainLayout.tsx](frontend/src/layouts/MainLayout.tsx)
- navigation in [frontend/src/components/Sidebar.tsx](frontend/src/components/Sidebar.tsx)
- page composition in [frontend/src/pages](frontend/src/pages)
- service access in [frontend/src/services](frontend/src/services)
- shared contracts in [frontend/src/types](frontend/src/types)

The app keeps pages compositional and uses service and data layers to remain easy to adapt when the backend becomes live.

---

## Running the Frontend

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server should start locally for frontend iteration and visualization.

---

## Project Notes

This repository currently presents a strong frontend prototype and a well-structured documentation baseline. The intent is to continue evolving into a production-grade integrated operations platform with backend API services, database persistence, and AI workflow enrichment.

For a deeper explanation of the frontend design, start with [docs/Frontend_architecture.md](docs/Frontend_architecture.md).