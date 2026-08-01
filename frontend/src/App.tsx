import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import PlaceholderPage from './pages/SectionPage'
import ServersPage from './pages/Servers'
import ServerDetailPage from './pages/ServerDetail'
import AlertDetailPage from './pages/AlertDetail'
import AlertsPage from './pages/Alerts'
import IncidentDetailPage from './pages/IncidentDetail'
import IncidentsPage from './pages/Incidents'
import DocumentationPage from './pages/Documentation'
import DocumentationDetailsPage from './pages/DocumentationDetails'
import Reports from './pages/Reports'

const placeholderRoutes = [
  { path: '/infrastructure', title: 'Infrastructure', description: 'A central view into the systems that keep your platform moving.', pageId: 'infrastructure' },
  { path: '/vms', title: 'Virtual Machines', description: 'Capacity and availability for virtualized workloads.', pageId: 'vms' },
  { path: '/storage', title: 'Storage', description: 'Capacity planning and data resilience for storage pools.', pageId: 'storage' },
  { path: '/networks', title: 'Networks', description: 'Connectivity, latency, and path health across your estate.', pageId: 'networks' },
  { path: '/ai', title: 'AI Assistant', description: 'Operational prompting and AI-driven troubleshooting workflows.', pageId: 'ai' },
  { path: '/settings', title: 'Settings', description: 'Configuration and workspace preferences for OpsPilot.', pageId: 'settings' },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/servers" element={<ServersPage />} />
          <Route path="/servers/:id" element={<ServerDetailPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/:id" element={<AlertDetailPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/docs/:id" element={<DocumentationDetailsPage />} />
          <Route path="/reports" element={<Reports />} />
          {placeholderRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PlaceholderPage title={route.title} description={route.description} pageId={route.pageId} />}
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
