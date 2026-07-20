import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TimeSeriesPoint } from '../../../data/serverDetail'

interface PerformanceLineChartProps {
  data: TimeSeriesPoint[]
  color: string
  unit: string
  height?: number
  gradientId: string
}

export function PerformanceLineChart({ data, color, unit, height = 160, gradientId }: PerformanceLineChartProps) {
  const xTicks = data.filter((_, index) => index % 3 === 0).map((point) => point.time)

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.22} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="time"
            ticks={xTicks}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            padding={{ left: 8, right: 8 }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} width={28} />
          <Tooltip
            cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }}
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--foreground)' }}
            labelStyle={{ color: 'var(--muted-foreground)' }}
            formatter={(value) => [`${Number(value)}${unit}`, undefined]}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
