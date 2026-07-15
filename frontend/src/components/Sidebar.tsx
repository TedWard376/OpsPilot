import { NavLink, useLocation } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  Bell,
  BookOpen,
  Bot,
  FileText,
  HardDrive,
  Layers,
  LayoutDashboard,
  LogOut,
  Monitor,
  Network,
  Server,
  Settings,
} from 'lucide-react'

type PageId = 'dashboard' | 'infrastructure' | 'servers' | 'vms' | 'storage' | 'networks' | 'alerts' | 'incidents' | 'docs' | 'reports' | 'ai' | 'settings'

interface NavItem {
  id: PageId
  label: string
  icon: React.ElementType
  badge?: number
}

interface NavGroup {
  group: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  { group: '', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    group: 'INFRASTRUCTURE',
    items: [
      { id: 'infrastructure', label: 'Overview', icon: Layers },
      { id: 'servers', label: 'Servers', icon: Server },
      { id: 'vms', label: 'Virtual Machines', icon: Monitor },
      { id: 'storage', label: 'Storage', icon: HardDrive },
      { id: 'networks', label: 'Networks', icon: Network },
    ],
  },
  {
    group: 'OPERATIONS',
    items: [
      { id: 'alerts', label: 'Alerts', icon: Bell, badge: 3 },
      { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: 2 },
      { id: 'docs', label: 'Documentation', icon: BookOpen },
      { id: 'reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    group: 'WORKSPACE',
    items: [
      { id: 'ai', label: 'AI Assistant', icon: Bot },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

const ROUTE_MAP: Record<PageId, string> = {
  dashboard: '/',
  infrastructure: '/infrastructure',
  servers: '/servers',
  vms: '/vms',
  storage: '/storage',
  networks: '/networks',
  alerts: '/alerts',
  incidents: '/incidents',
  docs: '/docs',
  reports: '/reports',
  ai: '/ai',
  settings: '/settings',
}

function Sidebar() {
  const location = useLocation()
  const activePage = getActivePage(location.pathname)

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)]">
      <div className="flex h-14 shrink-0 items-center border-b border-[var(--border)] px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <Activity size={15} />
          </div>
          <span className="text-base font-semibold text-[var(--foreground)]">OpsPilot</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.group || '__top'} className="mb-4">
            {group.group && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = activePage === item.id
                const to = ROUTE_MAP[item.id]
                return (
                  <SidebarNavItem key={item.id} item={item} to={to} active={active} />
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-[var(--border)] p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-[var(--muted)]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-white">
            SM
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[var(--foreground)]">Sarah Martinez</p>
            <p className="truncate text-[10px] text-[var(--muted-foreground)]">Sr. SRE Engineer</p>
          </div>
          <LogOut size={13} className="shrink-0 text-[var(--muted-foreground)]" />
        </div>
      </div>
    </aside>
  )
}

function SidebarNavItem({ item, to, active }: { item: NavItem; to: string; active: boolean }) {
  const Icon = item.icon

  return (
    <NavLink
      to={to}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
        active ? 'text-[var(--primary)]' : 'text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
      }`}
      style={active ? { backgroundColor: 'var(--active-nav-bg)' } : undefined}
    >
      <Icon size={15} className={active ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'} />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge !== undefined && (
        <span className="rounded-full bg-[var(--danger)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {item.badge}
        </span>
      )}
    </NavLink>
  )
}

function getActivePage(pathname: string): PageId {
  const map: Record<string, PageId> = {
    '/': 'dashboard',
    '/infrastructure': 'infrastructure',
    '/servers': 'servers',
    '/vms': 'vms',
    '/storage': 'storage',
    '/networks': 'networks',
    '/alerts': 'alerts',
    '/incidents': 'incidents',
    '/docs': 'docs',
    '/reports': 'reports',
    '/ai': 'ai',
    '/settings': 'settings',
  }

  return map[pathname] ?? 'dashboard'
}

export default Sidebar
