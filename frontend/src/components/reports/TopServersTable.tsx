import { useNavigate } from 'react-router-dom'
import type { TopAffectedServer } from '../../types/reports'
import { ServerHealthIndicator } from '../servers/ServerHealthIndicator'

interface TopServersTableProps {
  servers: TopAffectedServer[]
}

export function TopServersTable({ servers }: TopServersTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Top Affected Servers</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Ranked by combined incidents and alerts for the selected period</p>
      </div>

      {servers.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]">No server activity for the selected filters.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)]">
              <th scope="col" className="px-5 py-2.5 font-medium">
                Server Name
              </th>
              <th scope="col" className="px-5 py-2.5 font-medium">
                Incidents
              </th>
              <th scope="col" className="px-5 py-2.5 font-medium">
                Alerts
              </th>
              <th scope="col" className="px-5 py-2.5 font-medium">
                Current Health
              </th>
            </tr>
          </thead>
          <tbody>
            {servers.map((server) => (
              <tr
                key={server.hostname}
                onClick={() => navigate('/servers')}
                className="cursor-pointer border-b border-[var(--border)] transition-colors last:border-b-0 hover:bg-[var(--page-background)]"
              >
                <td className="px-5 py-3 font-medium text-[var(--foreground)]">{server.hostname}</td>
                <td className="px-5 py-3 text-[var(--foreground)]">{server.incidents}</td>
                <td className="px-5 py-3 text-[var(--foreground)]">{server.alerts}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-2">
                    <ServerHealthIndicator status={server.healthStatus} />
                    {server.healthStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
