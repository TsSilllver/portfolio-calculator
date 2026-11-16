import './Sparkline.css'

export default function Sparkline({ data, color, width = 80, height = 28 }) {
  if (!data || data.length < 2) return <div style={{ width, height }} />

  const values = data.map(d => d.value ?? d.close ?? d)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const isPositive = values[values.length - 1] >= values[0]
  const strokeColor = color || (isPositive ? 'var(--success)' : 'var(--error)')

  return (
    <svg
      className="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}