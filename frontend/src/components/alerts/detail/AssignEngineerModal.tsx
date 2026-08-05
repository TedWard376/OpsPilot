import { useEffect, useState } from 'react'
import { Modal } from '../../Modal'
import { getAssignedEngineers } from '../../../services/engineerService.ts'

interface AssignEngineerModalProps {
  currentEngineer: string | null
  onClose: () => void
  onConfirm: (engineer: string) => void
}

export function AssignEngineerModal({ currentEngineer, onClose, onConfirm }: AssignEngineerModalProps) {
  const [engineers, setEngineers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState(currentEngineer ?? '')

  useEffect(() => {
    let cancelled = false

    async function loadEngineers() {
      try {
        setLoading(true)
        const roster = await getAssignedEngineers()

        if (!cancelled) {
          setEngineers(roster)
          setSelected(currentEngineer ?? roster[0] ?? '')
          setError(null)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load engineers.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadEngineers()

    return () => {
      cancelled = true
    }
  }, [currentEngineer])

  return (
    <Modal
      title="Assign Engineer"
      description="Choose who's responsible for investigating this alert."
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selected)}
            disabled={selected === currentEngineer}
            className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm Assignment
          </button>
        </>
      }
    >
      <div className="space-y-2">
        {loading && <p className="text-sm text-[var(--muted-foreground)]">Loading engineers…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && engineers.length === 0 && (
          <p className="text-sm text-[var(--muted-foreground)]">No engineers are available right now.</p>
        )}
        {!loading && !error && engineers.map((engineer) => (
          <label
            key={engineer}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <input
              type="radio"
              name="engineer"
              value={engineer}
              checked={selected === engineer}
              onChange={() => setSelected(engineer)}
              className="accent-[var(--primary)]"
            />
            {engineer}
            {engineer === currentEngineer && <span className="ml-auto text-xs text-[var(--muted-foreground)]">Current</span>}
          </label>
        ))}
      </div>
    </Modal>
  )
}
