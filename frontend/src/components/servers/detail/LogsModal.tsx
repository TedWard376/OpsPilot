import { useMemo, useState } from 'react'
import { Modal } from '../../Modal'
import type { LogEntry, LogLevel } from '../../../data/serverLogs'

interface LogsModalProps {
  hostname: string
  logs: LogEntry[]
  onClose: () => void
}

const LEVEL_FILTERS: Array<LogLevel | 'ALL'> = ['ALL', 'INFO', 'WARN', 'ERROR']

const levelStyles: Record<LogLevel, string> = {
  INFO: 'text-blue-600',
  WARN: 'text-amber-600',
  ERROR: 'text-red-600',
}

export function LogsModal({ hostname, logs, onClose }: LogsModalProps) {
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL')
  const [query, setQuery] = useState('')

  const filteredLogs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return logs.filter((log) => {
      const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter
      const matchesQuery = q === '' || log.message.toLowerCase().includes(q) || log.service.toLowerCase().includes(q)
      return matchesLevel && matchesQuery
    })
  }, [logs, levelFilter, query])

  return (
    <Modal title={`Logs — ${hostname}`} description="Recent log output from services running on this server" onClose={onClose} width="lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search logs…"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20 sm:max-w-xs"
        />
        <div className="flex shrink-0 gap-1.5">
          {LEVEL_FILTERS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setLevelFilter(level)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                levelFilter === level
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--page-background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 max-h-[50vh] overflow-y-auto rounded-lg bg-[var(--page-background)] font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">No log lines match your filters.</p>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-3 border-b border-[var(--border)] px-3 py-1.5 last:border-b-0">
              <span className="shrink-0 text-[var(--muted-foreground)]">{log.timestamp}</span>
              <span className={`shrink-0 font-semibold ${levelStyles[log.level]}`}>{log.level}</span>
              <span className="shrink-0 text-[var(--muted-foreground)]">[{log.service}]</span>
              <span className="text-[var(--foreground)]">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}
