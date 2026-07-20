import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { getServerById } from '../data/servers'
import { getServerDetail } from '../data/serverDetail'
import { ServerDetailHeader } from '../components/servers/detail/ServerDetailHeader'
import { HealthSummarySection } from '../components/servers/detail/HealthSummarySection'
import { PerformanceSection } from '../components/servers/detail/PerformanceSection'
import { RunningServicesTable } from '../components/servers/detail/RunningServicesTable'
import { ServerAlertsPanel } from '../components/servers/detail/ServerAlertsPanel'
import { ServerIncidentsPanel } from '../components/servers/detail/ServerIncidentsPanel'
import { AIInvestigationPanel } from '../components/servers/detail/AIInvestigationPanel'
import { ConfigurationSection } from '../components/servers/detail/ConfigurationSection'
import { ActivityTimeline } from '../components/servers/detail/ActivityTimeline'

function ServerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const server = id ? getServerById(id) : undefined

  if (!server) {
    return (
      <div className="space-y-4 pb-6">
        <button
          type="button"
          onClick={() => navigate('/servers')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Servers
        </button>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Server not found</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            The server you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  // Single call composes every mock dataset this page needs. In production this
  // becomes something like `useServerDetail(id)` backed by `GET /api/servers/{id}/detail`.
  const detail = getServerDetail(server)

  return (
    <div className="space-y-5 pb-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
        <Link to="/" className="transition-colors hover:text-[var(--foreground)]">
          Dashboard
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link to="/infrastructure" className="transition-colors hover:text-[var(--foreground)]">
          Infrastructure
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link to="/servers" className="transition-colors hover:text-[var(--foreground)]">
          Servers
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span className="font-medium text-[var(--foreground)]">{server.hostname}</span>
      </nav>

      <ServerDetailHeader
        server={server}
        uptime={detail.uptime}
        assignedTeam={detail.assignedTeam}
        onViewLogs={() => navigate(`/servers/${server.id}?tab=logs`)}
        onOpenIncident={() => navigate('/incidents')}
        onRestart={() => {
          /* Placeholder — will call the restart action endpoint once available. */
        }}
        onInvestigate={() => {
          document.getElementById('ai-investigation')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

      <HealthSummarySection server={server} summary={detail.healthSummary} />

      <PerformanceSection performance={detail.performance} />

      <RunningServicesTable services={detail.services} />

      <div className="grid gap-4 xl:grid-cols-2">
        <ServerAlertsPanel alerts={detail.alerts} onAlertClick={(alert) => navigate(`/alerts/${alert.id}`)} />
        <ServerIncidentsPanel incidents={detail.incidents} onIncidentClick={(incident) => navigate(`/incidents/${incident.id}`)} />
      </div>

      <div id="ai-investigation">
        <AIInvestigationPanel investigation={detail.aiInvestigation} />
      </div>

      <ConfigurationSection configuration={detail.configuration} />

      <ActivityTimeline events={detail.timeline} />

      <button
        type="button"
        onClick={() => navigate('/servers')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Servers
      </button>
    </div>
  )
}

export default ServerDetailPage
