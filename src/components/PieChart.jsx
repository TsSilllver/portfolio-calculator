import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import './PieChart.css'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function PieChart({ data, compact = false, height = 220 }) {
  return (
    <div className={`pie-chart-wrapper ${compact ? 'compact' : ''}`}>
      <ResponsiveContainer width="100%" height={compact ? 110 : height}>
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={compact ? 42 : 80}
            innerRadius={compact ? 22 : 40}
            paddingAngle={2}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          {!compact && (
            <Tooltip
              contentStyle={{
                background: '#1f1f23',
                border: '1px solid #3f3f46',
                borderRadius: 8,
                color: '#fafafa',
                fontSize: 13
              }}
              formatter={(val) => `${val}%`}
            />
          )}
        </RePieChart>
      </ResponsiveContainer>
      {!compact && (
        <div className="pie-legend">
          {data.map((item, idx) => (
            <div key={item.name} className="legend-item">
              <span className="legend-dot" style={{ background: COLORS[idx % COLORS.length] }} />
              <span className="legend-label">{item.name}</span>
              <span className="legend-value">{item.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}