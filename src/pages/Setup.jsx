import { useState } from 'react'
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react'
import './Setup.css'

export default function Setup({ portfolio, onChange, onBack }) {
  const [tickers, setTickers] = useState(portfolio.tickers)
  const [weights, setWeights] = useState(portfolio.weights)
  const [newTicker, setNewTicker] = useState('')

  const addTicker = () => {
    const t = newTicker.trim().toUpperCase()
    if (!t || tickers.includes(t)) return
    setTickers([...tickers, t])
    setWeights({ ...weights, [t]: 10 })
    setNewTicker('')
  }

  const removeTicker = (t) => {
    if (tickers.length <= 2) return
    setTickers(tickers.filter(x => x !== t))
    const w = { ...weights }
    delete w[t]
    setWeights(w)
  }

  const handleSave = () => {
    // Обновляем портфель (демо-режим: пересчитываем метрики "на глаз")
    const totalWeight = Object.values(weights).reduce((s, w) => s + w, 0)
    if (totalWeight !== 100) {
      alert(`Сумма весов должна быть 100% (сейчас ${totalWeight}%)`)
      return
    }
    onChange({
      ...portfolio,
      tickers,
      weights,
      holdings: portfolio.holdings.filter(h => tickers.includes(h.ticker)),
      isDemo: false,
    })
    onBack()
  }

  return (
    <div className="setup-page">
      <div className="setup-header">
        <div>
          <h1 className="page-title">Управление активами</h1>
          <p className="page-subtitle">Добавляйте тикеры и задавайте их доли в портфеле</p>
        </div>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={15} /> Назад
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Добавить актив</h3>
        </div>
        <div className="add-ticker-row">
          <input
            className="text-input"
            type="text"
            value={newTicker}
            onChange={e => setNewTicker(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTicker()}
            placeholder="Например, AMZN"
          />
          <button className="btn-primary" onClick={addTicker}>
            <Plus size={15} /> Добавить
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Веса активов</h3>
          <span className="badge neutral">
            Сумма: {Object.values(weights).reduce((s, w) => s + w, 0)}%
          </span>
        </div>
        <div className="weights-list">
          {tickers.map(t => (
            <div key={t} className="weight-item">
              <div className="weight-ticker-col">
                <span className="weight-ticker">{t}</span>
                <button className="btn-icon danger" onClick={() => removeTicker(t)}>
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights[t] || 0}
                onChange={e => setWeights({ ...weights, [t]: parseInt(e.target.value) })}
                className="weight-slider"
              />
              <span className="weight-value">{weights[t] || 0}%</span>
            </div>
          ))}
        </div>
        <div className="setup-actions">
          <button className="btn-primary" onClick={handleSave}>
            <Save size={15} /> Применить и пересчитать
          </button>
        </div>
      </div>
    </div>
  )
}