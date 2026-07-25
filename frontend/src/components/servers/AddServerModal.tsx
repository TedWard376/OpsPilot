import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../Modal'
import type { NewServerInput, ServerEnvironment } from '../../data/servers'
import { SERVER_ENVIRONMENTS, SERVER_LOCATIONS, SERVER_OS_OPTIONS, SERVER_SERVICES } from '../../data/servers'

interface AddServerModalProps {
  onClose: () => void
  onCreate: (input: NewServerInput) => void
}

const fieldClassName =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20'

export function AddServerModal({ onClose, onCreate }: AddServerModalProps) {
  const [hostname, setHostname] = useState('')
  const [environment, setEnvironment] = useState<ServerEnvironment>('Production')
  const [os, setOs] = useState<string>(SERVER_OS_OPTIONS[0])
  const [service, setService] = useState<string>(SERVER_SERVICES[0])
  const [location, setLocation] = useState<string>(SERVER_LOCATIONS[0])
  const [ipAddress, setIpAddress] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!hostname.trim()) {
      setError('Give the server a hostname.')
      return
    }
    const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
    if (!ipPattern.test(ipAddress.trim())) {
      setError('Enter a valid IPv4 address, e.g. 10.10.1.20.')
      return
    }

    onCreate({ hostname: hostname.trim(), environment, os, service, location, ipAddress: ipAddress.trim() })
  }

  return (
    <Modal title="Add Server" description="Register a new server for monitoring." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="server-hostname" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
            Hostname
          </label>
          <input
            id="server-hostname"
            type="text"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            placeholder="e.g. prod-cache-05"
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="server-environment" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              Environment
            </label>
            <select
              id="server-environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as ServerEnvironment)}
              className={`mt-1.5 ${fieldClassName}`}
            >
              {SERVER_ENVIRONMENTS.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="server-service" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              Service
            </label>
            <select id="server-service" value={service} onChange={(e) => setService(e.target.value)} className={`mt-1.5 ${fieldClassName}`}>
              {SERVER_SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="server-os" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              Operating System
            </label>
            <select id="server-os" value={os} onChange={(e) => setOs(e.target.value)} className={`mt-1.5 ${fieldClassName}`}>
              {SERVER_OS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="server-location" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
              Location
            </label>
            <select id="server-location" value={location} onChange={(e) => setLocation(e.target.value)} className={`mt-1.5 ${fieldClassName}`}>
              {SERVER_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="server-ip" className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
            IP Address
          </label>
          <input
            id="server-ip"
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="e.g. 10.10.1.20"
            className={`mt-1.5 ${fieldClassName}`}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--page-background)]"
          >
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
            Add Server
          </button>
        </div>
      </form>
    </Modal>
  )
}
