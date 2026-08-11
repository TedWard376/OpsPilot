import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import { Modal } from '../Modal'
import type { IncidentPriority, NewIncidentInput } from '../../types/incident'
import { getAssignedEngineers } from '../../services/engineerService'
import { getAllServers } from '../../services/serverService'
import { ServerHealthIndicator } from '../servers/ServerHealthIndicator'

interface CreateIncidentModalProps {
  onClose: () => void
  onCreate: (input: NewIncidentInput) => void
  initialServerIds?: string[]
  initialTitle?: string
  initialPriority?: IncidentPriority
}

const PRIORITIES: IncidentPriority[] = ['Critical', 'High', 'Medium', 'Low']

const fieldClassName =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20'

export function CreateIncidentModal({ onClose, onCreate, initialServerIds = [], initialTitle = '', initialPriority = 'Medium' }: CreateIncidentModalProps) {
  const [title, setTitle] = useState(initialTitle)
  const [priority, setPriority] = useState<IncidentPriority>(initialPriority)
  const [engineers, setEngineers] = useState<string[]>([])
  const [assignedEngineer, setAssignedEngineer] = useState('')
  const [affectedServerIds, setAffectedServerIds] = useState<string[]>(initialServerIds)
  const [serverQuery, setServerQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void getAssignedEngineers().then((roster) => {
      if (!cancelled) {
        setEngineers(roster)
        setAssignedEngineer((current) => current || roster[0] || '')
      }
    }).catch(() => {
      if (!cancelled) setError('Unable to load engineers.')
    })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredServers = useMemo(() => {
    const allServers = getAllServers()
    const q = serverQuery.trim().toLowerCase()
    if (q === '') return allServers
    return allServers.filter(
      (server) =>
        server.hostname.toLowerCase().includes(q) ||
        server.service.toLowerCase().includes(q) ||
        server.environment.toLowerCase().includes(q),
    )
  }, [serverQuery])

  function toggleServer(id: string) {
    setAffectedServerIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      setError('Give the incident a title.')
      return
    }
    if (affectedServerIds.length === 0) {
      setError('Select at least one affected server.')
      return
    }

    onCreate({ title: title.trim(), priority, assignedEngineer, affectedServerIds })
  }

  return (
    <Modal title="Create Incident" description="Manually log a new incident for investigation." onClose={onClose} width="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="incident-title" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
            Title
          </label>
          <input
            id="incident-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Elevated error rate on prod-api-01"
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="incident-priority" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              Priority
            </label>
            <select
              id="incident-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as IncidentPriority)}
              className={`mt-1.5 ${fieldClassName}`}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="incident-engineer" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              Assign To
            </label>
            <select
              id="incident-engineer"
              value={assignedEngineer}
              onChange={(e) => setAssignedEngineer(e.target.value)}
              className={`mt-1.5 ${fieldClassName}`}
            >
              {engineers.map((engineer) => (
                <option key={engineer} value={engineer}>
                  {engineer}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">Affected Servers</span>
            {affectedServerIds.length > 0 && (
              <span className="text-xs text-[var(--muted-foreground)]">{affectedServerIds.length} selected</span>
            )}
          </div>

          <div className="relative mt-1.5">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={serverQuery}
              onChange={(e) => setServerQuery(e.target.value)}
              placeholder="Search by hostname, service, or environment…"
              className={`${fieldClassName} pl-8`}
            />
          </div>

          <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-[var(--border)]">
            {filteredServers.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">No servers match your search.</p>
            ) : (
              filteredServers.map((server) => (
                <label
                  key={server.id}
                  className="flex cursor-pointer items-center gap-2.5 border-b border-[var(--border)] px-3 py-2 text-sm last:border-b-0 hover:bg-[var(--page-background)]"
                >
                  <input
                    type="checkbox"
                    checked={affectedServerIds.includes(server.id)}
                    onChange={() => toggleServer(server.id)}
                    className="accent-[var(--primary)]"
                  />
                  <ServerHealthIndicator status={server.status} />
                  <span className="font-medium text-[var(--foreground)]">{server.hostname}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {server.service} · {server.environment}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Create Incident
          </button>
        </div>
      </form>
    </Modal>
  )
}
