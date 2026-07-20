import type { ServerConfiguration } from '../../../data/serverDetail'
import { DetailField } from './DetailField'

interface ConfigurationSectionProps {
  configuration: ServerConfiguration
}

const backupToneStyles: Record<ServerConfiguration['backupStatus'], string> = {
  Success: 'bg-green-50 text-green-700',
  Warning: 'bg-amber-50 text-amber-700',
  Failed: 'bg-red-50 text-red-700',
}

export function ConfigurationSection({ configuration }: ConfigurationSectionProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <h2 className="text-base font-semibold text-[var(--foreground)]">Configuration</h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
        <DetailField label="CPU Cores" value={`${configuration.cpuCores} vCPU`} />
        <DetailField label="RAM" value={`${configuration.ramGb} GB`} />
        <DetailField label="Storage Capacity" value={`${configuration.storageGb} GB`} />
        <DetailField label="Virtualisation Platform" value={configuration.virtualizationPlatform} />
        <DetailField label="OS Version" value={configuration.osVersion} />
        <DetailField label="Agent Version" value={configuration.agentVersion} />
        <DetailField label="Last Backup" value={configuration.lastBackup} />
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Backup Status</dt>
          <dd className="mt-1">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${backupToneStyles[configuration.backupStatus]}`}>
              {configuration.backupStatus}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  )
}
