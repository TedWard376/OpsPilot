interface TagPillProps {
  label: string
  onClick?: () => void
  active?: boolean
}

export function TagPill({ label, onClick, active = false }: TagPillProps) {
  const baseClassName = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors'
  const toneClassName = active
    ? 'bg-[var(--primary)] text-white'
    : 'bg-[var(--page-background)] text-[var(--muted-foreground)]'

  if (!onClick) {
    return <span className={`${baseClassName} ${toneClassName}`}>{label}</span>
  }

  return (
    <button type="button" onClick={onClick} className={`${baseClassName} ${toneClassName} hover:opacity-80`}>
      {label}
    </button>
  )
}
