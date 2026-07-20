interface DetailFieldProps {
  label: string
  value: string
}

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">{value}</dd>
    </div>
  )
}
