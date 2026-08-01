# Frontend Architecture Overview

## Purpose

OpsPilot’s frontend is a React + TypeScript single-page application designed to present infrastructure health, alerts, incidents, documentation, and AI-assisted operations workflows in one cohesive operational console.

The frontend is intentionally organized to stay easy to extend as the backend matures from mock-driven data access into real API-backed integrations.

---

## Core Technology Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Recharts for charting
- Lucide React for icons

These choices support a fast development loop, strongly typed data contracts, and a clean enterprise-style UI structure.

---

## Architectural Shape

The application follows a layered frontend design:

1. App shell and routing
2. Page-level composition
3. Reusable UI components
4. Feature-specific service access
5. Shared types and mock data sources

In practice, the flow looks like this:

```text
Browser entry (main.tsx)
  -> App.tsx route registration
  -> MainLayout shell
  -> Page component
  -> Feature components
  -> Services / types / data layer
```

---

## Application Entry Points

### `main.tsx`

This is the bootstrap file for the React application. It mounts the app into the `#root` element with `StrictMode`.

### `App.tsx`

`App.tsx` is the routing root of the application. It uses `BrowserRouter` to define all primary routes, including:

- `/` for Dashboard
- `/servers` and `/servers/:id`
- `/alerts` and `/alerts/:id`
- `/incidents` and `/incidents/:id`
- `/docs` and `/docs/:id`
- `/reports`
- placeholder infrastructure pages such as `/infrastructure`, `/vms`, `/storage`, and `/networks`

The app also includes a catch-all redirect back to `/` for unknown routes.

### `MainLayout.tsx`

The main page layout is shared across the app and provides two persistent shell elements:

- `Sidebar` for navigation
- `TopNav` for the top-level header context

The layout uses `Outlet` from React Router so each page can render within the same visual frame.

---

## Frontend Layer Responsibilities

### Pages

The `src/pages/` area contains top-level route views such as:

- `Dashboard`
- `Servers`
- `ServerDetail`
- `Alerts`
- `AlertDetail`
- `Incidents`
- `IncidentDetail`
- `Documentation`
- `DocumentationDetails`
- `Reports`

These pages focus on orchestration and composition rather than including all business logic directly.

### Components

The `src/components/` directory contains reusable UI and feature components, split by domain:

- `servers/`
- `alerts/`
- `incidents/`
- `documentation/`
- `reports/`
- shared shell components such as `Sidebar`, `TopNav`, `MetricCard`, `StatusBadge`, and `Modal`

This keeps the page-level code smaller and promotes reusability.

### Layouts

`src/layouts/` contains the application shell and shared structural wrappers, most notably `MainLayout.tsx`.

### Hooks

The `src/hooks/` folder is the point where feature-specific data retrieval and client-side state interaction logic can be isolated, for example:

- `useServerList`
- `useAlertList`
- `useIncidentList`
- `useDocumentationList`
- `useReportFilters`

These hooks help keep page components simpler and more declarative.

### Services

The `src/services/` folder provides the access layer for domain data. Its purpose is to shield pages and components from raw data source details.

For example:

- `serverService.ts`
- `alertService.ts`
- `incidentService.ts`
- `documentationService.ts`
- `reportsService.ts`
- `dashboardService.ts`

The design pattern is intentionally service-oriented so the same page/component contracts remain stable even if the underlying implementation switches from in-memory mock data to an API response.

### Data and Types

The codebase separates:

- `src/data/` for mock or static data sources
- `src/types/` for shared TypeScript contracts
- `src/utils/` for helper and generator functions

This separation is important because it makes the frontend resilient to backend integration changes.

---

## Data Flow Pattern

A representative data request in the app follows this pattern:

1. A page mounts and renders a feature view.
2. Page or hook calls a service function.
3. The service reads from the data layer or a future backend endpoint.
4. Returned records are typed through `src/types/` contracts.
5. Feature components render the structured data into the UI.

That pattern is visible in the server domain where `getAllServers()` and `getServerById()` wrap the data source instead of allowing components to reach directly into raw data exports.

---

## Navigation and UI Model

The navigation is built around a global left sidebar and route-driven content area. The sidebar maps domain IDs to route paths and highlights the active page based on the current location.

This gives OpsPilot a dashboard-like operational portal feel rather than a simple CRUD app layout.

---

## Styling and Theme System

The frontend uses Tailwind CSS with a shared theme and CSS variables for visual consistency.

Key styling inputs live in:

- `src/index.css`
- `src/styles/tailwind.css`
- `src/styles/theme.css`
- `src/styles/fonts.css`

This allows the interface to remain themable and consistent across cards, tables, navigational shells, and charts.

---

## Current Implementation Status

The frontend currently behaves as a polished front-end prototype with a strong UI structure and domain-specific page composition. The service layer is already prepared as the integration seam for a FastAPI or other backend API.

As a result, the project is positioned well for a clean transition from static/mock-driven data to live backend data without rewriting the page and component architecture.

---

## Recommended Future Evolution

The next architecture improvements would be:

- replace mock-only data services with real API-backed endpoints
- introduce a centralized global state layer for shared operational state
- add request/response caching and loading/error boundaries
- formalize domain-driven service contracts for backend parity

These would evolve the current UI-first design into a production-ready application architecture.
