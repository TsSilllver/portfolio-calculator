import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import './LineChart.css'

export default function LineChart({ data }) {
  // Показываем только каждую N-ю дату, чтобы ось не забивалась
  const step = Math.ceil(data.length / 6)

  return (
    <div className="line-chart-wrapper">
      <ResponsiveContainer width="100%" height={240}>
        <ReLineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#27272a' }}
            interval={step - 1}
          />
          <YAxis
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#27272a' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: '#1f1f23',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              color: '#fafafa',
              fontSize: 13
            }}
            formatter={(val) => [`$${val}`, 'Стоимость']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#818cf8' }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}