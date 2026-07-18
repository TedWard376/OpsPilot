import type { ServerItem } from '../data/servers'
import { MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ServerTableProps {
  servers: ServerItem[]
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-24 rounded-full bg-[var(--muted-foreground)/10]">
        <div className={`h-2 rounded-full`} style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs text-[var(--muted-foreground)]">{value}%</span>
    </div>
  )
}

export function ServerTable({ servers }: ServerTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Servers</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{servers.length} of {servers.length} servers</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-lg bg-[var(--card)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)]">All</button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">+ Add Server</button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input placeholder="Search servers..." className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-4 py-2 text-sm" />
          <select className="rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-3 py-2 text-sm">
            <option>All</option>
            <option>Production</option>
            <option>Staging</option>
            <option>Development</option>
          </select>
          <select className="rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-3 py-2 text-sm">
            <option>All</option>
            <option>East US</option>
            <option>West US</option>
            <option>West EU</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-b border-[var(--border)] bg-[var(--page-background)]">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]">Hostname</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]">Environment</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]">OS</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]">CPU</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]">Memory</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]">Disk</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]">Location</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]">Last seen</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-[var(--muted-foreground)]"> </th>
            </tr>
          </thead>
          <tbody>
            {servers.map((s) => (
              <tr key={s.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--page-background)]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${s.status === 'Healthy' ? 'bg-green-500' : s.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <Link to={`/servers/${s.id}`} className="text-sm font-medium text-blue-600 hover:underline">{s.hostname}</Link>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{s.environment}</td>
                <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{s.os}</td>
                <td className="px-6 py-4">
                  <ProgressBar value={s.cpu} color={s.cpu > 85 ? '#ef4444' : s.cpu > 65 ? '#f59e0b' : '#3b82f6'} />
                </td>
                <td className="px-6 py-4">
                  <ProgressBar value={s.memory} color={s.memory > 85 ? '#ef4444' : s.memory > 65 ? '#f59e0b' : '#3b82f6'} />
                </td>
                <td className="px-6 py-4">
                  <ProgressBar value={s.disk} color={s.disk > 85 ? '#ef4444' : s.disk > 65 ? '#f59e0b' : '#3b82f6'} />
                </td>

                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${s.status === 'Healthy' ? 'bg-green-50 text-green-700' : s.status === 'Warning' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{s.status}</span>
                </td>

                <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{s.location}</td>
                <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{s.lastSeen}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"><MoreHorizontal /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ServerTable
