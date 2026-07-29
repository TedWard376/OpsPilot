import type { AffectedResource } from '../../../types/alertDetail'
import { DetailField } from '../../servers/detail/DetailField'

interface AffectedResourcePanelProps {
  resource: AffectedResource
}

export function AffectedResourcePanel({ resource }: AffectedResourcePanelProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Affected Resources</h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">Infrastructure this alert originated from</p>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <DetailField label="Server" value={resource.hostname} />
        <DetailField label="Cluster" value={resource.cluster} />
        <DetailField label="Environment" value={resource.environment} />
        <DetailField label="Region" value={resource.region} />
        <DetailField label="IP Address" value={resource.ipAddress} />
      </dl>
    </section>
  )
}
