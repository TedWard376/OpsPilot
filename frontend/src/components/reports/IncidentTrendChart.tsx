import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '../ChartCard'
import type { TrendPoint } from '../../types/reports'

interface IncidentTrendChartProps {
  data: TrendPoint[]
}

export function IncidentTrendChart({ data }: IncidentTrendChartProps) {
  return (
    <ChartCard title="Incident Trends" description="Incidents opened per month">
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} width={28} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'var(--page-background)' }}
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--foreground)' }}
              labelStyle={{ color: 'var(--muted-foreground)' }}
              formatter={(value) => [`${value} incidents`, undefined]}
            />
            <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
