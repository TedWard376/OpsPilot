import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import PlaceholderPage from './pages/SectionPage'

const routes = [
  { path: '/', title: 'Dashboard', description: 'This is the dashboard placeholder for the OpsPilot shell.' },
  { path: '/infrastructure', title: 'Infrastructure', description: 'This is the infrastructure placeholder for the OpsPilot shell.' },
  { path: '/servers', title: 'Servers', description: 'This is the servers placeholder for the OpsPilot shell.' },
  { path: '/virtual-machines', title: 'Virtual Machines', description: 'This is the virtual machines placeholder for the OpsPilot shell.' },
  { path: '/storage', title: 'Storage', description: 'This is the storage placeholder for the OpsPilot shell.' },
  { path: '/networks', title: 'Networks', description: 'This is the networks placeholder for the OpsPilot shell.' },
  { path: '/alerts', title: 'Alerts', description: 'This is the alerts placeholder for the OpsPilot shell.' },
  { path: '/incidents', title: 'Incidents', description: 'This is the incidents placeholder for the OpsPilot shell.' },
  { path: '/documentation', title: 'Documentation', description: 'This is the documentation placeholder for the OpsPilot shell.' },
  { path: '/reports', title: 'Reports', description: 'This is the reports placeholder for the OpsPilot shell.' },
  { path: '/ai-assistant', title: 'AI Assistant', description: 'This is the AI assistant placeholder for the OpsPilot shell.' },
  { path: '/settings', title: 'Settings', description: 'This is the settings placeholder for the OpsPilot shell.' },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<PlaceholderPage title="Dashboard" description="This is the dashboard placeholder for the OpsPilot shell." />} />
          {routes.filter((route) => route.path !== '/').map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PlaceholderPage title={route.title} description={route.description} />}
            />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
