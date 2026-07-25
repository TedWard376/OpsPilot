import { useState } from 'react'
import { Modal } from '../../Modal'
import type { IncidentPriority } from '../../../data/incidents'
import { PriorityBadge } from '../PriorityBadge'

interface EscalateModalProps {
  currentPriority: IncidentPriority
  onClose: () => void
  onConfirm: (priority: IncidentPriority) => void
}

const PRIORITIES: IncidentPriority[] = ['Critical', 'High', 'Medium', 'Low']

export function EscalateModal({ currentPriority, onClose, onConfirm }: EscalateModalProps) {
  const [selected, setSelected] = useState<IncidentPriority>(currentPriority)

  const currentRank = PRIORITIES.indexOf(currentPriority)
  const selectedRank = PRIORITIES.indexOf(selected)
  const direction = selectedRank < currentRank ? 'Escalating' : selectedRank > currentRank ? 'De-escalating' : null

  return (
    <Modal
      title="Change Priority"
      description="Escalate or de-escalate this incident's priority level."
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
            disabled={selected === currentPriority}
            className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm
          </button>
        </>
      }
    >
      <div className="space-y-2">
        {PRIORITIES.map((priority) => (
          <label
            key={priority}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            <input
              type="radio"
              name="priority"
              value={priority}
              checked={selected === priority}
              onChange={() => setSelected(priority)}
              className="accent-[var(--primary)]"
            />
            <PriorityBadge priority={priority} />
            {priority === currentPriority && <span className="ml-auto text-xs text-[var(--muted-foreground)]">Current</span>}
          </label>
        ))}
      </div>
      {direction && <p className="mt-3 text-xs font-medium text-[var(--muted-foreground)]">{direction} from {currentPriority} to {selected}.</p>}
    </Modal>
  )
}
