import type { DocSection } from '../../../types/documentation'

interface DocContentSectionProps {
  section: DocSection
}

export function DocContentSection({ section }: DocContentSectionProps) {
  return (
    <div className="border-b border-[var(--border)] p-5 last:border-b-0">
      <h3 className="text-sm font-semibold text-[var(--foreground)]">{section.heading}</h3>
      <ul className="mt-2 space-y-1.5">
        {section.body.map((line) => (
          <li key={line} className="flex gap-2 text-sm leading-6 text-[var(--foreground)]">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--primary)]" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}
