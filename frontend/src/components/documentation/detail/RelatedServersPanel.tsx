import { ChevronRight, Server as ServerIcon } from 'lucide-react'
import type { RelatedServerRef } from '../../../types/documentation'

interface RelatedServersPanelProps {
  servers: RelatedServerRef[]
  onServerClick: (server: RelatedServerRef) => void
}

const statusStyles: Record<string, string> = {
  Healthy: 'bg-green-50 text-green-700',
  Warning: 'bg-amber-50 text-amber-700',
  Critical: 'bg-red-50 text-red-700',
}

export function RelatedServersPanel({ servers, onServerClick }: RelatedServersPanelProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Related Servers</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Servers this doc is commonly used with</p>
      </div>

      {servers.length === 0 ? (
        <p className="px-5 py-6 text-center text-sm text-[var(--muted-foreground)]">No related servers.</p>
      ) : (
        <ul>
          {servers.map((server) => (
            <li key={server.id}>
              <button
                type="button"
                onClick={() => onServerClick(server)}
                className="flex w-full items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--page-background)]"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  <ServerIcon size={14} className="text-[var(--muted-foreground)]" />
                  {server.hostname}
                </span>
                <span className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[server.status] ?? ''}`}>{server.status}</span>
                  <ChevronRight size={14} className="text-[var(--muted-foreground)]" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
