/** A single point on a time-series chart (CPU/memory/disk/network history, etc.). */
export interface TimeSeriesPoint {
  time: string
  value: number
}
