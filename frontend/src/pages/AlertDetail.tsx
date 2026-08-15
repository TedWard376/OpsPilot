import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { loadAlertById, updateAlert } from '../services/alertService'
import { getServerById } from '../services/serverService'
import { getAlertDetail } from '../services/alertDetailService'
import { getAssignedEngineers } from '../services/engineerService'
import { addIncident } from '../services/incidentService'
import type { NewIncidentInput } from '../types/incident'
import type { AlertItem, AlertStatus } from '../types/alert'
import { AlertDetailHeader } from '../components/alerts/detail/AlertDetailHeader'
import { AlertHealthSummarySection } from '../components/alerts/detail/AlertHealthSummarySection'
import { AffectedResourcePanel } from '../components/alerts/detail/AffectedResourcePanel'
import { AlertMetricGraphsSection } from '../components/alerts/detail/AlertMetricGraphsSection'
import { AlertTimeline } from '../components/alerts/detail/AlertTimeline'
import { RelatedIncidentsPanel } from '../components/alerts/detail/RelatedIncidentsPanel'
import { RelatedDocumentationPanel } from '../components/alerts/detail/RelatedDocumentationPanel'
import { AlertAIInvestigationPanel } from '../components/alerts/detail/AlertAIInvestigationPanel'
import { AssignEngineerModal } from '../components/alerts/detail/AssignEngineerModal'
import { CreateIncidentModal } from '../components/incidents/CreateIncidentModal'

function AlertDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [alert, setAlert] = useState<AlertItem | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadAlert() {
      if (!id) {
        if (!cancelled) {
          setAlert(undefined)
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        const result = await loadAlertById(id)

        if (!cancelled) {
          setAlert(result)
          setError(null)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load alert details.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadAlert()

    return () => {
      cancelled = true
    }
  }, [id])

  const server = alert ? getServerById(alert.affectedServerId) : undefined

  // Real engineer roster from GET /api/engineers, same source used by
  // AssignEngineerModal and the incident-side engineer pickers. Used below
  // so alert timeline/related-incident/acknowledgement data reflects actual
  // engineers instead of a mock name pool.
  const [engineers, setEngineers] = useState<string[]>([])

  useEffect(() => {
    void getAssignedEngineers().then((roster) => {
      setEngineers(roster)
    })
  }, [])

  // Single call composes every mock dataset this page needs beyond the
  // alert record itself (health summary, timeline, AI investigation, etc).
  // The backend currently only exposes GET /api/alerts and
  // GET /api/alerts/{id}, so this stays mock-generated for now; in
  // production it becomes something like `useAlertDetail(id)` backed by
  // `GET /api/alerts/{id}/detail`. Engineer names are the one exception —
  // those come from the real GET /api/engineers roster above.
  const detail = useMemo(() => (alert ? getAlertDetail(alert, server, engineers) : undefined), [alert, server, engineers])

  const [status, setStatus] = useState<AlertStatus | undefined>(undefined)
  const [assignedEngineer, setAssignedEngineer] = useState<string | null>(null)
  const [assignOpen, setAssignOpen] = useState(false)
  const [createIncidentOpen, setCreateIncidentOpen] = useState(false)

  // Sync local UI state whenever a new alert/detail finishes loading.
  useEffect(() => {
    setStatus(alert?.status)
  }, [alert])

  useEffect(() => {
    setAssignedEngineer(detail?.acknowledgedBy ?? null)
  }, [detail])

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">
        Loading alert details…
      </div>
    )
  }

  if (error) {
    return <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--muted-foreground)]">{error}</div>
  }

  if (!alert || !detail || !status) {
    return (
      <div className="space-y-4 pb-6">
        <button
          type="button"
          onClick={() => navigate('/alerts')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Alerts
        </button>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Alert not found</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            The alert you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  const isAcknowledged = status !== 'Open'
  const canAcknowledge = status === 'Open'

  function handleAcknowledge() {
    if (!canAcknowledge) return
    setStatus('Acknowledged')
    updateAlert(alert!.id, { status: 'Acknowledged' })
    setAssignedEngineer((prev) => prev ?? 'You')
  }

  function handleAssignEngineer(engineer: string) {
    setAssignedEngineer(engineer)
    setAssignOpen(false)
  }

  function handleCreateIncident(input: NewIncidentInput) {
    const created = addIncident(input)
    setCreateIncidentOpen(false)
    navigate(`/incidents/${created.id}`)
  }

  return (
    <div className="space-y-5 pb-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
        <Link to="/" className="transition-colors hover:text-[var(--foreground)]">
          Dashboard
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link to="/alerts" className="transition-colors hover:text-[var(--foreground)]">
          Alerts
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span className="font-medium text-[var(--foreground)]">{alert.id}</span>
      </nav>

      <AlertDetailHeader
        alert={{ ...alert, status }}
        assignedEngineer={assignedEngineer}
        canAcknowledge={canAcknowledge}
        isAcknowledged={isAcknowledged}
        onAcknowledge={handleAcknowledge}
        onCreateIncident={() => setCreateIncidentOpen(true)}
        onAssignEngineer={() => setAssignOpen(true)}
        onInvestigate={() => document.getElementById('ai-investigation')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      />

      <AlertHealthSummarySection summary={detail.healthSummary} />

      <AffectedResourcePanel resource={detail.affectedResource} />

      <AlertTimeline events={detail.timeline} />

      <AlertMetricGraphsSection metrics={detail.metrics} />

      <div className="grid gap-4 xl:grid-cols-2">
        <RelatedIncidentsPanel incidents={detail.relatedIncidents} onIncidentClick={(incident) => navigate(`/incidents/${incident.id}`)} />
        <RelatedDocumentationPanel docs={detail.relatedDocs} />
      </div>

      <AlertAIInvestigationPanel investigation={detail.aiInvestigation} />

      <button
        type="button"
        onClick={() => navigate('/alerts')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Alerts
      </button>

      {assignOpen && (
        <AssignEngineerModal currentEngineer={assignedEngineer} onClose={() => setAssignOpen(false)} onConfirm={handleAssignEngineer} />
      )}

      {createIncidentOpen && (
        <CreateIncidentModal
          onClose={() => setCreateIncidentOpen(false)}
          onCreate={handleCreateIncident}
          initialServerIds={[alert.affectedServerId]}
          initialTitle={`${alert.name} on ${alert.affectedServerHostname}`}
          initialPriority={alert.severity === 'Informational' ? 'Low' : alert.severity}
        />
      )}
    </div>
  )
}

export default AlertDetailPage
