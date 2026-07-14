import { NavLink } from 'react-router-dom'


function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      <div className="px-4 py-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white shadow-sm">
            OP
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">OpsPilot</p>
            <p className="text-xs text-slate-500">Incident Intelligence</p>
          </div>
        </div>

        <div className="mb-4">
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
            <span className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <DashboardIcon />
              </span>
              <span>Dashboard</span>
            </span>
          </NavLink>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="px-4">
          <p className="mb-2 mt-2 px-2 text-xs font-semibold uppercase text-slate-400">Infrastructure</p>
          <nav className="space-y-1">
            <NavLink to="/infrastructure" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><InfrastructureIcon /></span>
              Overview
            </NavLink>

            <NavLink to="/servers" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><ServersIcon /></span>
              Servers
            </NavLink>

            <NavLink to="/virtual-machines" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><VmIcon /></span>
              Virtual Machines
            </NavLink>

            <NavLink to="/storage" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><StorageIcon /></span>
              Storage
            </NavLink>

            <NavLink to="/networks" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><NetworksIcon /></span>
              Networks
            </NavLink>
          </nav>

          <p className="mt-6 mb-2 px-2 text-xs font-semibold uppercase text-slate-400">Operations</p>
          <nav className="space-y-1">
            <NavLink to="/alerts" className={({ isActive }) => `flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><AlertsIcon /></span>
                Alerts
              </span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs text-white">3</span>
            </NavLink>

            <NavLink to="/incidents" className={({ isActive }) => `flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><IncidentsIcon /></span>
                Incidents
              </span>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs text-white">2</span>
            </NavLink>

            <NavLink to="/documentation" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><DocsIcon /></span>
              Documentation
            </NavLink>

            <NavLink to="/reports" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><ReportsIcon /></span>
              Reports
            </NavLink>
          </nav>
        </div>

        <div className="mt-6 px-4">
          <p className="mb-2 px-2 text-xs font-semibold uppercase text-slate-400">Workspace</p>
          <div className="rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-sky-500 text-white flex items-center justify-center">SM</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Sarah Martinez</div>
                <div className="text-xs text-slate-500">Sr. SRE Engineer</div>
              </div>
              <div className="text-slate-400">↪</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function InfrastructureIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h16" />
      <path d="M9 4v16" />
    </svg>
  )
}

function ServersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10" />
      <path d="M7 12h10" />
      <path d="M7 16h6" />
    </svg>
  )
}

function VmIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 19v2" />
      <path d="M16 19v2" />
      <path d="M3 15h18" />
    </svg>
  )
}

function StorageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
      <path d="M9 11h6" />
    </svg>
  )
}

function NetworksIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <path d="M3 12h18" />
      <path d="M12 4a14 14 0 0 1 0 16" />
      <path d="M12 4a14 14 0 0 0 0 16" />
    </svg>
  )
}

function AlertsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 19h16L12 3Z" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  )
}

function IncidentsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4H6a2 2 0 0 0-2 2v3" />
      <path d="M14 4h4a2 2 0 0 1 2 2v3" />
      <path d="M10 20H6a2 2 0 0 1-2-2v-3" />
      <path d="M14 20h4a2 2 0 0 0 2-2v-3" />
      <rect x="8" y="8" width="8" height="8" rx="2" />
    </svg>
  )
}

function DocsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h8l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M15 3v4h4" />
    </svg>
  )
}

function ReportsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
    </svg>
  )
}

export default Sidebar
