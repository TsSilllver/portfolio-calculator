import './CorrelationHeatmap.css'

// Цвет для корреляции: -1 (синий) → 0 (серый) → 1 (красный)
function corrToColor(val) {
  if (val > 0.5) return 'rgba(239, 68, 68, 0.8)'   // сильная положительная
  if (val > 0.2) return 'rgba(239, 68, 68, 0.4)'
  if (val < -0.5) return 'rgba(59, 130, 246, 0.8)' // сильная отрицательная
  if (val < -0.2) return 'rgba(59, 130, 246, 0.4)'
  return 'rgba(113, 113, 122, 0.15)'
}

export default function CorrelationHeatmap({ tickers, matrix }) {
  return (
    <div className="heatmap-wrapper">
      <div
        className="heatmap-grid"
        style={{ gridTemplateColumns: `60px repeat(${tickers.length}, 1fr)` }}
      >
        {/* Пустая ячейка в левом верхнем углу */}
        <div />
        {tickers.map(t => (
          <div key={t} className="heatmap-header">{t}</div>
        ))}

        {tickers.map(rowTicker => (
          <>
            <div key={`row-${rowTicker}`} className="heatmap-row-label">
              {rowTicker}
            </div>
            {tickers.map(colTicker => {
              const val = matrix[rowTicker]?.[colTicker] ?? 0
              return (
                <div
                  key={`${rowTicker}-${colTicker}`}
                  className="heatmap-cell"
                  style={{ background: corrToColor(val) }}
                  title={`${rowTicker} / ${colTicker}: ${val.toFixed(2)}`}
                >
                  {val.toFixed(2)}
                </div>
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}