import type { DocType } from '../../types/documentation'

interface DocTypeBadgeProps {
  type: DocType
}

const typeStyles: Record<DocType, string> = {
  Runbook: 'bg-blue-50 text-blue-700',
  'Troubleshooting Guide': 'bg-purple-50 text-purple-700',
  Procedure: 'bg-green-50 text-green-700',
  Reference: 'bg-slate-100 text-slate-700',
  Policy: 'bg-amber-50 text-amber-700',
}

export function DocTypeBadge({ type }: DocTypeBadgeProps) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyles[type]}`}>{type}</span>
}
