import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { getIncidentById } from '../data/incidents'
import { getIncidentDetail } from '../data/incidentDetail'
import type { InvestigationNote, ResolutionInfo } from '../data/incidentDetail'
import { IncidentDetailHeader } from '../components/incidents/detail/IncidentDetailHeader'
import { IncidentTimelineStepper } from '../components/incidents/detail/IncidentTimelineStepper'
import { RecentMetricsSection } from '../components/incidents/detail/RecentMetricsSection'
import { RelatedAlertsPanel } from '../components/incidents/detail/RelatedAlertsPanel'
import { AffectedServersPanel } from '../components/incidents/detail/AffectedServersPanel'
import { InvestigationNotesPanel } from '../components/incidents/detail/InvestigationNotesPanel'
import { AIInvestigationPanel } from '../components/servers/detail/AIInvestigationPanel'
import { ActivityLogPanel } from '../components/incidents/detail/ActivityLogPanel'
import { ResolutionSection } from '../components/incidents/detail/ResolutionSection'

function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const incident = id ? getIncidentById(id) : undefined

  // Single call composes every mock dataset this page needs. In production
  // this becomes something like `useIncidentDetail(id)` backed by
  // `GET /api/incidents/{id}/detail`.
  const detail = useMemo(() => (incident ? getIncidentDetail(incident) : undefined), [incident])

  const [notes, setNotes] = useState<InvestigationNote[]>(detail?.notes ?? [])
  const [resolution, setResolution] = useState<ResolutionInfo | undefined>(detail?.resolution)

  if (!incident || !detail || !resolution) {
    return (
      <div className="space-y-4 pb-6">
        <button
          type="button"
          onClick={() => navigate('/incidents')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Incidents
        </button>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Incident not found</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            The incident you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  const primaryServerHostname = detail.affectedServers[0]?.server.hostname ?? incident.affectedSystems[0]

  function handleAddNote(content: string) {
    setNotes((prev) => [
      ...prev,
      {
        id: `${incident!.id}-note-${prev.length + 1}`,
        author: incident!.assignedEngineer,
        timestamp: 'Just now',
        content,
      },
    ])
  }

  function handleMarkResolved() {
    setResolution((prev) => ({
      isResolved: true,
      rootCause: prev?.rootCause || `Root cause analysis for ${primaryServerHostname} — see investigation notes for detail.`,
      resolutionSummary:
        prev?.resolutionSummary || `Marked resolved by ${incident!.assignedEngineer}. Metrics confirmed back to baseline.`,
      resolvedBy: incident!.assignedEngineer,
      resolvedAt: 'Just now',
    }))
  }

  return (
    <div className="space-y-5 pb-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
        <Link to="/" className="transition-colors hover:text-[var(--foreground)]">
          Dashboard
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link to="/incidents" className="transition-colors hover:text-[var(--foreground)]">
          Incidents
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span className="font-medium text-[var(--foreground)]">{incident.id}</span>
      </nav>

      <IncidentDetailHeader
        incident={incident}
        isResolved={resolution.isResolved}
        onAddNote={() => document.getElementById('investigation-notes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        onInvestigate={() => document.getElementById('ai-investigation')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        onResolve={handleMarkResolved}
      />

      <IncidentTimelineStepper stages={detail.timeline} />

      <RecentMetricsSection metrics={detail.metrics} primaryServerHostname={primaryServerHostname} />

      <div className="grid gap-4 xl:grid-cols-2">
        <RelatedAlertsPanel alerts={detail.relatedAlerts} onAlertClick={(alert) => navigate(`/alerts/${alert.id}`)} />
        <AffectedServersPanel servers={detail.affectedServers} onServerClick={(ref) => navigate(`/servers/${ref.server.id}`)} />
      </div>

      <InvestigationNotesPanel notes={notes} onAddNote={handleAddNote} />

      <div id="ai-investigation">
        <AIInvestigationPanel investigation={detail.aiInvestigation} />
      </div>

      <ActivityLogPanel entries={detail.activityLog} />

      <ResolutionSection resolution={resolution} onMarkResolved={handleMarkResolved} />

      <button
        type="button"
        onClick={() => navigate('/incidents')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Incidents
      </button>
    </div>
  )
}

export default IncidentDetailPage
