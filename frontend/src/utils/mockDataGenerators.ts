/**
 * Deterministic pseudo-random helpers used by the mock data generators
 * (server details, incident details, server logs).
 *
 * These were previously copy-pasted, near-identically, into three separate
 * data files. Centralizing them here means a fix or improvement (e.g. a
 * better hash distribution) only needs to happen once, and any new mock
 * generator gets the same tested behavior for free.
 *
 * Every function here is a pure function — same input always produces the
 * same output — which is what lets a given entity (a server, an incident)
 * render the same "realistic" generated data across reloads instead of
 * flickering between renders on every re-render.
 */

import type { TimeSeriesPoint } from '../types/chart'

/** Simple string hash (Java-style). Used to seed the generators below from an entity's id, so the same id always produces the same mock data. */
export function hashCode(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/** Clamps a number into an inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Deterministically picks an item from a list using a seed, instead of Math.random(). */
export function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length]
}

const SERIES_TIMES = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']

/** Builds a plausible 24h wave (seeded, not random) that lands on the entity's current live value as its final point. */
export function buildSeries(seed: number, current: number, amplitude: number, min: number, max: number): TimeSeriesPoint[] {
  const raw = SERIES_TIMES.map((_, i) => Math.sin((i + seed) * 0.55) * amplitude)
  const offset = current - raw[raw.length - 1]
  return SERIES_TIMES.map((time, i) => ({
    time,
    value: Math.round(clamp(raw[i] + offset, min, max)),
  }))
}
