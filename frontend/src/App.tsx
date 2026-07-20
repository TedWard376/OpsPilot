import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import PlaceholderPage from './pages/SectionPage'
import ServersPage from './pages/Servers'
import ServerDetailPage from './pages/ServerDetail'
import AlertDetailPage from './pages/AlertDetail'
import IncidentDetailPage from './pages/IncidentDetail'

const placeholderRoutes = [
  { path: '/infrastructure', title: 'Infrastructure', description: 'A central view into the systems that keep your platform moving.', pageId: 'infrastructure' },
  { path: '/vms', title: 'Virtual Machines', description: 'Capacity and availability for virtualized workloads.', pageId: 'vms' },
  { path: '/storage', title: 'Storage', description: 'Capacity planning and data resilience for storage pools.', pageId: 'storage' },
  { path: '/networks', title: 'Networks', description: 'Connectivity, latency, and path health across your estate.', pageId: 'networks' },
  { path: '/alerts', title: 'Alerts', description: 'Real-time incident notifications and active response signals.', pageId: 'alerts' },
  { path: '/incidents', title: 'Incidents', description: 'Detailed incident state for ongoing and recent events.', pageId: 'incidents' },
  { path: '/docs', title: 'Documentation', description: 'Runbooks and operational guidance for your engineering teams.', pageId: 'docs' },
  { path: '/reports', title: 'Reports', description: 'Historical reporting and trend summaries for key services.', pageId: 'reports' },
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
          <Route path="/alerts/:id" element={<AlertDetailPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
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
