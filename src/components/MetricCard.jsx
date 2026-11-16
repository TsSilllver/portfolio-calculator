import './MetricCard.css'

export default function MetricCard({ label, value, positive }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${positive ? 'positive' : 'negative'}`}>
        {value}
      </div>
    </div>
  )
}