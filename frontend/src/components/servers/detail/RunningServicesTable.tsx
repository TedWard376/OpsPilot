import type { RunningServiceItem, ServiceStatus } from '../../../data/serverDetail'

interface RunningServicesTableProps {
  services: RunningServiceItem[]
}

const statusStyles: Record<ServiceStatus, string> = {
  Running: 'bg-green-50 text-green-700',
  Degraded: 'bg-amber-50 text-amber-700',
  Stopped: 'bg-red-50 text-red-700',
}

export function RunningServicesTable({ services }: RunningServicesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Running Services</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Processes and services detected on this server</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--page-background)]">
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Service</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Status</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">CPU</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Memory</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Last Restart</th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Port</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b border-[var(--border)] last:border-b-0 transition-colors hover:bg-[var(--page-background)]">
              <td className="px-5 py-3 text-sm font-medium text-[var(--foreground)]">{service.name}</td>
              <td className="px-5 py-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[service.status]}`}>
                  {service.status}
                </span>
              </td>
              <td className="px-5 py-3 text-sm text-[var(--muted-foreground)]">{service.cpu}%</td>
              <td className="px-5 py-3 text-sm text-[var(--muted-foreground)]">{service.memory}%</td>
              <td className="px-5 py-3 text-sm text-[var(--muted-foreground)]">{service.lastRestart}</td>
              <td className="px-5 py-3 font-mono text-xs text-[var(--muted-foreground)]">{service.port}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
