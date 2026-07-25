import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { getIncidentById, updateIncident } from '../data/incidents'
import type { IncidentPriority } from '../data/incidents'
import {
  getIncidentDetail,
  buildTimelineStages,
  stageIndexForStatus,
  statusLabelForStage,
  TIMELINE_LABELS,
} from '../data/incidentDetail'
import type { ActivityLogEntry, InvestigationNote, ResolutionInfo } from '../data/incidentDetail'
import { IncidentDetailHeader } from '../components/incidents/detail/IncidentDetailHeader'
import { IncidentTimelineStepper } from '../components/incidents/detail/IncidentTimelineStepper'
import { RecentMetricsSection } from '../components/incidents/detail/RecentMetricsSection'
import { RelatedAlertsPanel } from '../components/incidents/detail/RelatedAlertsPanel'
import { AffectedServersPanel } from '../components/incidents/detail/AffectedServersPanel'
import { InvestigationNotesPanel } from '../components/incidents/detail/InvestigationNotesPanel'
import { AIInvestigationPanel } from '../components/servers/detail/AIInvestigationPanel'
import { ActivityLogPanel } from '../components/incidents/detail/ActivityLogPanel'
import { ResolutionSection } from '../components/incidents/detail/ResolutionSection'
import { ReassignModal } from '../components/incidents/detail/ReassignModal'
import { EscalateModal } from '../components/incidents/detail/EscalateModal'

const LAST_STAGE_INDEX = TIMELINE_LABELS.length - 1

function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const incident = id ? getIncidentById(id) : undefined

  // Single call composes every mock dataset this page needs. In production
  // this becomes something like `useIncidentDetail(id)` backed by
  // `GET /api/incidents/{id}/detail`.
  const detail = useMemo(() => (incident ? getIncidentDetail(incident) : undefined), [incident])

  const [priority, setPriority] = useState<IncidentPriority | undefined>(incident?.priority)
  const [assignedEngineer, setAssignedEngineer] = useState(incident?.assignedEngineer ?? '')
  const [stageIndex, setStageIndex] = useState(incident ? stageIndexForStatus(incident.status) : 0)
  const [notes, setNotes] = useState<InvestigationNote[]>(detail?.notes ?? [])
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(detail?.activityLog ?? [])
  const [resolution, setResolution] = useState<ResolutionInfo | undefined>(detail?.resolution)
  const [reassignOpen, setReassignOpen] = useState(false)
  const [escalateOpen, setEscalateOpen] = useState(false)

  if (!incident || !detail || !priority || !resolution) {
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
  const canResolve = stageIndex === LAST_STAGE_INDEX && !resolution.isResolved
  const nextStageLabel = !resolution.isResolved && stageIndex < LAST_STAGE_INDEX ? TIMELINE_LABELS[stageIndex + 1] : null

  const liveTimeline = buildTimelineStages(stageIndex, resolution.isResolved, {
    created: incident.createdAt,
    updated: incident.updatedAt,
  })
  const liveStatus = statusLabelForStage(stageIndex, resolution.isResolved)

  function logActivity(entry: Omit<ActivityLogEntry, 'id'>) {
    setActivityLog((prev) => [...prev, { ...entry, id: `${incident!.id}-log-${prev.length + 1}` }])
  }

  function handleAddNote(content: string) {
    setNotes((prev) => [
      ...prev,
      { id: `${incident!.id}-note-${prev.length + 1}`, author: incident!.assignedEngineer, timestamp: 'Just now', content },
    ])
  }

  function handleReassign(newEngineer: string) {
    const previous = assignedEngineer
    setAssignedEngineer(newEngineer)
    updateIncident(incident!.id, { assignedEngineer: newEngineer, updatedAt: 'Just now' })
    logActivity({ type: 'assignment', actor: 'You', action: `Reassigned this incident from ${previous} to ${newEngineer}.`, timestamp: 'Just now' })
    setReassignOpen(false)
  }

  function handleEscalate(newPriority: IncidentPriority) {
    const previous = priority
    setPriority(newPriority)
    updateIncident(incident!.id, { priority: newPriority, updatedAt: 'Just now' })
    logActivity({ type: 'status', actor: 'You', action: `Changed priority from ${previous} to ${newPriority}.`, timestamp: 'Just now' })
    setEscalateOpen(false)
  }

  function handleAdvanceStage() {
    if (stageIndex >= LAST_STAGE_INDEX) return
    const next = stageIndex + 1
    setStageIndex(next)
    const newStatus = statusLabelForStage(next, false)
    updateIncident(incident!.id, { status: newStatus, updatedAt: 'Just now' })
    logActivity({ type: 'status', actor: 'You', action: `Marked "${TIMELINE_LABELS[stageIndex]}" complete — advanced to "${TIMELINE_LABELS[next]}".`, timestamp: 'Just now' })
  }

  function handleMarkResolved() {
    if (!canResolve) return
    const resolved: ResolutionInfo = {
      isResolved: true,
      rootCause: resolution!.rootCause || `Root cause analysis for ${primaryServerHostname} — see investigation notes for detail.`,
      resolutionSummary: resolution!.resolutionSummary || `Marked resolved by ${incident!.assignedEngineer}. Metrics confirmed back to baseline.`,
      resolvedBy: incident!.assignedEngineer,
      resolvedAt: 'Just now',
    }
    setResolution(resolved)
    updateIncident(incident!.id, { status: 'Resolved', updatedAt: 'Just now' })
    logActivity({ type: 'status', actor: incident!.assignedEngineer, action: 'Marked incident as Resolved.', timestamp: 'Just now' })
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
        incident={{ ...incident, priority, assignedEngineer, status: liveStatus }}
        isResolved={resolution.isResolved}
        canResolve={canResolve}
        onAddNote={() => document.getElementById('investigation-notes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        onInvestigate={() => document.getElementById('ai-investigation')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        onResolve={handleMarkResolved}
        onReassign={() => setReassignOpen(true)}
        onEscalate={() => setEscalateOpen(true)}
      />

      <IncidentTimelineStepper stages={liveTimeline} nextStageLabel={nextStageLabel} onAdvance={handleAdvanceStage} />

      <RecentMetricsSection metrics={detail.metrics} primaryServerHostname={primaryServerHostname} />

      <div className="grid gap-4 xl:grid-cols-2">
        <RelatedAlertsPanel alerts={detail.relatedAlerts} onAlertClick={(alert) => navigate(`/alerts/${alert.id}`)} />
        <AffectedServersPanel servers={detail.affectedServers} onServerClick={(ref) => navigate(`/servers/${ref.server.id}`)} />
      </div>

      <InvestigationNotesPanel notes={notes} onAddNote={handleAddNote} />

      <div id="ai-investigation">
        <AIInvestigationPanel investigation={detail.aiInvestigation} />
      </div>

      <ActivityLogPanel entries={activityLog} />

      <ResolutionSection resolution={resolution} canResolve={canResolve} onMarkResolved={handleMarkResolved} />

      <button
        type="button"
        onClick={() => navigate('/incidents')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Incidents
      </button>

      {reassignOpen && (
        <ReassignModal currentEngineer={assignedEngineer} onClose={() => setReassignOpen(false)} onConfirm={handleReassign} />
      )}
      {escalateOpen && <EscalateModal currentPriority={priority} onClose={() => setEscalateOpen(false)} onConfirm={handleEscalate} />}
    </div>
  )
}

export default IncidentDetailPage
