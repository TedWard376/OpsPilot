import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface BarChartData {
  day: string
  critical: number
  high: number
  medium: number
}

interface SimpleBarChartProps {
  data: BarChartData[]
  height?: number
}

export function SimpleBarChart({ data, height = 220 }: SimpleBarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }} barCategoryGap="22%">
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} width={30} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--foreground)' }}
            labelStyle={{ color: 'var(--muted-foreground)' }}
          />
          <Bar dataKey="medium" stackId="incidents" fill="#FBBF24" radius={[3, 3, 0, 0]} barSize={14} />
          <Bar dataKey="high" stackId="incidents" fill="#F97316" radius={[3, 3, 0, 0]} barSize={14} />
          <Bar dataKey="critical" stackId="incidents" fill="#DC2626" radius={[3, 3, 0, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
