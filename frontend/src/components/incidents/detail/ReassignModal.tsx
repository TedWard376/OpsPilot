import { useState } from 'react'
import { Modal } from '../../Modal'
import { incidentEngineers } from '../../../data/incidents'

interface ReassignModalProps {
  currentEngineer: string
  onClose: () => void
  onConfirm: (engineer: string) => void
}

export function ReassignModal({ currentEngineer, onClose, onConfirm }: ReassignModalProps) {
  const [selected, setSelected] = useState(currentEngineer)

  return (
    <Modal
      title="Reassign Incident"
      description="Choose who's responsible for investigating this incident."
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
            Confirm Reassignment
          </button>
        </>
      }
    >
      <div className="space-y-2">
        {incidentEngineers.map((engineer) => (
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
