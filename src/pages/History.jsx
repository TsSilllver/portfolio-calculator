import { useState, useEffect } from 'react'
import { TrendingUp, RefreshCw } from 'lucide-react'
import { getHistory } from '../utils/goApi'
import './History.css'

export default function History() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const loadHistory = async () => {
    setLoading(true)
    const data = await getHistory()
    setEntries(data.reverse()) // Сначала новые
    setLoading(false)
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1 className="page-title">История расчетов</h1>
          <p className="page-subtitle">Сохраненные анализы и оптимизации портфеля</p>
        </div>
        <button onClick={loadHistory} className="btn-secondary" disabled={loading}>
          <RefreshCw size={14} /> {loading ? 'Обновление...' : 'Обновить'}
        </button>
      </div>

      {entries.length === 0 && !loading ? (
        <div className="history-empty">
          <p>Вы еще не сохраняли расчеты портфеля.</p>
          <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text-tertiary)' }}>
            Перейдите в раздел «Обзор» и запустите анализ, чтобы сохранить первый результат.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {entries.map((entry, idx) => (
            <div key={idx} className="history-card">
              <div className="history-card-main">
                <div className="history-card-title">
                  <TrendingUp size={16} color="var(--accent)" />
                  <span>Оптимизация: {entry.tickers?.join(', ')}</span>
                </div>
                <div className="history-card-date">{entry.timestamp}</div>
              </div>
              <div className="history-card-metrics">
                <div className="hm">
                  <span className="hm-label">Коэф. Шарпа</span>
                  <span className="hm-value pos">{entry.bestSharpe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}