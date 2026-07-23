import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../Modal'
import type { IncidentPriority, NewIncidentInput } from '../../data/incidents'
import { incidentAffectedSystems, incidentEngineers } from '../../data/incidents'

interface CreateIncidentModalProps {
  onClose: () => void
  onCreate: (input: NewIncidentInput) => void
}

const PRIORITIES: IncidentPriority[] = ['Critical', 'High', 'Medium', 'Low']

const fieldClassName =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20'

export function CreateIncidentModal({ onClose, onCreate }: CreateIncidentModalProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<IncidentPriority>('Medium')
  const [assignedEngineer, setAssignedEngineer] = useState<string>(incidentEngineers[0])
  const [affectedSystems, setAffectedSystems] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  function toggleSystem(system: string) {
    setAffectedSystems((prev) => (prev.includes(system) ? prev.filter((s) => s !== system) : [...prev, system]))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      setError('Give the incident a title.')
      return
    }
    if (affectedSystems.length === 0) {
      setError('Select at least one affected system.')
      return
    }

    onCreate({ title: title.trim(), priority, assignedEngineer, affectedSystems })
  }

  return (
    <Modal title="Create Incident" description="Manually log a new incident for investigation." onClose={onClose}>
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
            placeholder="e.g. Elevated error rate on API Gateway"
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
              {incidentEngineers.map((engineer) => (
                <option key={engineer} value={engineer}>
                  {engineer}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">Affected Systems</span>
          <div className="mt-1.5 grid max-h-40 grid-cols-2 gap-1.5 overflow-y-auto rounded-lg border border-[var(--border)] p-2">
            {incidentAffectedSystems.map((system) => (
              <label
                key={system}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
              >
                <input
                  type="checkbox"
                  checked={affectedSystems.includes(system)}
                  onChange={() => toggleSystem(system)}
                  className="accent-[var(--primary)]"
                />
                {system}
              </label>
            ))}
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
