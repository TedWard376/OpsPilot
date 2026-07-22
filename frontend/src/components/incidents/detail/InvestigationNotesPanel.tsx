import { useState } from 'react'
import type { FormEvent } from 'react'
import { Send } from 'lucide-react'
import type { InvestigationNote } from '../../../data/incidentDetail'

interface InvestigationNotesPanelProps {
  notes: InvestigationNote[]
  onAddNote: (content: string) => void
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function InvestigationNotesPanel({ notes, onAddNote }: InvestigationNotesPanelProps) {
  const [draft, setDraft] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onAddNote(trimmed)
    setDraft('')
  }

  return (
    <section id="investigation-notes" className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Investigation Notes</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">Shared notes from engineers working this incident</p>

      <ul className="mt-4 space-y-4">
        {notes.map((note) => (
          <li key={note.id} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--active-nav-bg)] text-xs font-semibold text-[var(--primary)]">
              {initials(note.author)}
            </span>
            <div className="min-w-0 flex-1 rounded-lg bg-[var(--page-background)] p-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--foreground)]">{note.author}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{note.timestamp}</p>
              </div>
              <p className="mt-1 text-sm leading-6 text-[var(--foreground)]">{note.content}</p>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-4 flex items-start gap-2 border-t border-[var(--border)] pt-4">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add an investigation note…"
          rows={2}
          className="flex-1 resize-none rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Add note"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </form>
    </section>
  )
}
