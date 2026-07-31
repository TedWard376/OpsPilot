import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { getDocById, getDocDetail } from '../services/documentationService'
import { DocDetailHeader } from '../components/documentation/detail/DocDetailHeader'
import { DocContentSection } from '../components/documentation/detail/DocContentSection'
import { RelatedServersPanel } from '../components/documentation/detail/RelatedServersPanel'
import { RelatedAlertsPanel } from '../components/documentation/detail/RelatedAlertsPanel'
import { RelatedIncidentsPanel } from '../components/documentation/detail/RelatedIncidentsPanel'
import { RelatedDocumentationPanel } from '../components/alerts/detail/RelatedDocumentationPanel'
import { AIAssistantPanel } from '../components/documentation/detail/AIAssistantPanel'

function DocumentationDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const doc = id ? getDocById(id) : undefined

  // In production this becomes `useDocDetail(id)` backed by
  // `GET /api/docs/{id}/detail`.
  const detail = useMemo(() => (doc ? getDocDetail(doc) : undefined), [doc])

  if (!doc || !detail) {
    return (
      <div className="space-y-4 pb-6">
        <button
          type="button"
          onClick={() => navigate('/docs')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Documentation
        </button>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Document not found</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">This document does not exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
        <Link to="/" className="transition-colors hover:text-[var(--foreground)]">
          Dashboard
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link to="/docs" className="transition-colors hover:text-[var(--foreground)]">
          Documentation
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span className="font-medium text-[var(--foreground)]">{doc.id}</span>
      </nav>

      <DocDetailHeader doc={doc} />

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        {detail.sections.map((section) => (
          <DocContentSection key={section.id} section={section} />
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <RelatedServersPanel servers={detail.relatedServers} onServerClick={(server) => navigate(`/servers/${server.id}`)} />
        <RelatedAlertsPanel alerts={detail.relatedAlerts} onAlertClick={(alert) => navigate(`/alerts/${alert.id}`)} />
        <RelatedIncidentsPanel incidents={detail.relatedIncidents} onIncidentClick={(incident) => navigate(`/incidents/${incident.id}`)} />
        <RelatedDocumentationPanel docs={detail.relatedDocs} />
      </div>

      <AIAssistantPanel assistant={detail.aiAssistant} />

      <button
        type="button"
        onClick={() => navigate('/docs')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Documentation
      </button>
    </div>
  )
}

export default DocumentationDetails
