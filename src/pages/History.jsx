import { useState, useEffect } from 'react'
import { Trash2, TrendingUp } from 'lucide-react'
import Sparkline from '../components/Sparkline'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEMO_HISTORY } from '../data/demoData'
import './History.css'

export default function History() {
  const { load, save } = useLocalStorage('portfolio_history')
  const [entries, setEntries] = useState([])

  useEffect(() => {
    const stored = load()
    setEntries(Array.isArray(stored) && stored.length > 0 ? stored : DEMO_HISTORY)
  }, [])

  const handleDelete = (id) => {
    const updated = entries.filter(e => e.id !== id)
    save(updated)
    setEntries(updated)
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1 className="page-title">История</h1>
          <p className="page-subtitle">Сохранённые портфели и расчёты</p>
        </div>
        <span className="badge neutral">{entries.length} записей</span>
      </div>

      <div className="history-list">
        {entries.map(entry => (
          <div key={entry.id} className="history-card">
            <div className="history-card-main">
              <div className="history-card-title">
                <TrendingUp size={16} color="var(--accent)" />
                <span>{entry.name || entry.tickers.join(' · ')}</span>
              </div>
              <div className="history-card-date">{entry.date}</div>
              <div className="history-card-tickers">
                {entry.tickers.map(t => (
                  <span key={t} className="ticker-pill">{t}</span>
                ))}
              </div>
            </div>
            <div className="history-card-spark">
              <Sparkline data={entry.sparkline || []} width={100} height={36} />
            </div>
            <div className="history-card-metrics">
              <div className="hm">
                <span className="hm-label">Доходность</span>
                <span className="hm-value pos">+{entry.returnPct.toFixed(1)}%</span>
              </div>
              <div className="hm">
                <span className="hm-label">Риск</span>
                <span className="hm-value">{entry.riskPct.toFixed(1)}%</span>
              </div>
              <div className="hm">
                <span className="hm-label">Шарп</span>
                <span className="hm-value">{entry.sharpe.toFixed(2)}</span>
              </div>
            </div>
            <button className="btn-icon danger" onClick={() => handleDelete(entry.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}