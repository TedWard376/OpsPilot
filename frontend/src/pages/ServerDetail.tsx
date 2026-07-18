import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { ResourceProgressBar } from '../components/servers/ResourceProgressBar'
import { ServerHealthIndicator } from '../components/servers/ServerHealthIndicator'
import { ServerStatusBadge } from '../components/servers/ServerStatusBadge'
import { getServerById } from '../data/servers'

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">{value}</dd>
    </div>
  )
}

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

  return (
    <div className="space-y-6 pb-6">
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <ServerHealthIndicator status={server.status} size="md" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {server.hostname}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {server.service} · {server.environment} · {server.location}
            </p>
          </div>
        </div>
        <ServerStatusBadge status={server.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Overview</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <DetailField label="Environment" value={server.environment} />
            <DetailField label="Operating System" value={server.os} />
            <DetailField label="IP Address" value={server.ipAddress} />
            <DetailField label="Location" value={server.location} />
            <DetailField label="Service" value={server.service} />
            <DetailField label="Last Seen" value={server.lastSeen} />
          </dl>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Resource Usage</h2>
          <div className="mt-4 space-y-5">
            <div>
              <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">CPU</p>
              <ResourceProgressBar value={server.cpu} label="CPU" />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">Memory</p>
              <ResourceProgressBar value={server.memory} label="Memory" />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-[var(--muted-foreground)]">Disk</p>
              <ResourceProgressBar value={server.disk} label="Disk" />
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Related Activity</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Alerts, metrics, and incident history for this server will appear here once the API is connected.
        </p>
      </section>

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
