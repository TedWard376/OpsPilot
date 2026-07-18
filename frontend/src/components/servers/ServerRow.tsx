import { MoreHorizontal } from 'lucide-react'
import type { ServerItem } from '../../data/servers'
import { ResourceProgressBar } from './ResourceProgressBar'
import { ServerHealthIndicator } from './ServerHealthIndicator'
import { ServerStatusBadge } from './ServerStatusBadge'

interface ServerRowProps {
  server: ServerItem
  onClick: (server: ServerItem) => void
}

export function ServerRow({ server, onClick }: ServerRowProps) {
  return (
    <tr
      onClick={() => onClick(server)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(server)
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`View details for ${server.hostname}`}
      className="cursor-pointer border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--page-background)] focus:bg-[var(--page-background)] focus:outline-none"
    >
      <td className="px-3 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <ServerHealthIndicator status={server.status} />
          <span className="overflow-hidden whitespace-nowrap text-[13px] font-medium text-[var(--foreground)]">
            {server.hostname}
          </span>
        </div>
      </td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">
        {server.environment}
      </td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">
        {server.os}
      </td>
      <td className="px-3 py-3">
        <ResourceProgressBar value={server.cpu} label="CPU" />
      </td>
      <td className="px-3 py-3">
        <ResourceProgressBar value={server.memory} label="Memory" />
      </td>
      <td className="px-3 py-3">
        <ResourceProgressBar value={server.disk} label="Disk" />
      </td>
      <td className="px-3 py-3">
        <ServerStatusBadge status={server.status} />
      </td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">
        {server.location}
      </td>
      <td className="overflow-hidden whitespace-nowrap px-3 py-3 text-[13px] text-[var(--muted-foreground)]">
        {server.lastSeen}
      </td>
      <td className="px-2 py-3 text-right">
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Actions for ${server.hostname}`}
          className="rounded p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--border)] hover:text-[var(--foreground)]"
        >
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  )
}