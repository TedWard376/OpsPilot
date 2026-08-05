import type { ServerItem } from '../types/server'
import type { LogEntry, LogLevel } from '../types/serverLogs'

function formatMinutesAgo(minutes: number): string {
  if (minutes <= 0) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder === 0 ? `${hours}h ago` : `${hours}h ${remainder}m ago`
}

export function getServerLogs(server: ServerItem, count = 40): LogEntry[] {
  const levels: LogLevel[] = ['INFO', 'WARN', 'ERROR']
  const messageByLevel: Record<LogLevel, string[]> = {
    INFO: [
      'Telemetry stream healthy',
      'Resource measurements synchronized',
      'Service heartbeat confirmed',
    ],
    WARN: [
      'Resource trend above expected threshold',
      'Elevated latency observed in the workload window',
      'Metrics remain under active review',
    ],
    ERROR: [
      'Critical service event detected',
      'Anomalous operating condition reported by the backend',
      'Immediate action recommended for this host',
    ],
  }

  return Array.from({ length: count }, (_, index) => {
    const normalizedIndex = (index + server.cpu + server.memory) % 3
    const level = levels[normalizedIndex]
    const message = messageByLevel[level][(index + server.disk) % messageByLevel[level].length]

    return {
      id: `${server.id}-log-${index}`,
      timestamp: formatMinutesAgo(index * 2),
      level,
      service: server.service,
      message: `${message} on ${server.hostname}`,
    }
  })
}
