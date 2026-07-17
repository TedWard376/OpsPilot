import type { HealthDataPoint } from '../data/dashboard'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface SimpleLineChartProps {
  data: HealthDataPoint[]
  height?: number
}

export function SimpleLineChart({ data, height = 220 }: SimpleLineChartProps) {
  const xTicks = data.filter((_, index) => index % 2 === 0).map((point) => point.time)

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.24} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="time"
            ticks={xTicks}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            padding={{ left: 12, right: 12 }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} width={30} />
          <Tooltip
            cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }}
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--foreground)' }}
            labelStyle={{ color: 'var(--muted-foreground)' }}
            formatter={(value) => [`${Number(value)}%`, 'Health %']}
            labelFormatter={(label) => `${label}`}
          />
          <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fill="url(#healthGradient)" dot={false} activeDot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
