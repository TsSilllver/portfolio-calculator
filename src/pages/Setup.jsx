import { useState } from 'react'
import { Plus, Trash2, Save, ArrowLeft, Briefcase } from 'lucide-react'
import Sparkline from '../components/Sparkline'
import ChartModal from '../components/ChartModal'
import { DEMO_STOCK_DATA } from '../data/demoData'
import './Setup.css'

export default function Setup({ portfolio, onChange, onBack, onTrade }) {
  const [tickers, setTickers] = useState(portfolio.tickers)
  const [weights, setWeights] = useState(portfolio.weights)
  const [newTicker, setNewTicker] = useState('')
  const [modalStock, setModalStock] = useState(null)

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
        <button className="btn-secondary" onClick={onBack}><ArrowLeft size={15} /> Назад</button>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Добавить актив</h3></div>
        <div className="add-ticker-row">
          <input className="text-input" type="text" value={newTicker} onChange={e => setNewTicker(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTicker()} placeholder="Например, AMZN" />
          <button className="btn-primary" onClick={addTicker}><Plus size={15} /> Добавить</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Веса активов</h3>
          <span className="badge neutral">Сумма: {Object.values(weights).reduce((s, w) => s + w, 0)}%</span>
        </div>
        <div className="weights-list">
          {tickers.map(t => (
            <div key={t} className="weight-item">
              <div className="weight-ticker-col">
                <span className="weight-ticker">{t}</span>
                <button className="btn-icon danger" onClick={() => removeTicker(t)}><Trash2 size={14} /></button>
              </div>
              <input type="range" min="0" max="100" value={weights[t] || 0} onChange={e => setWeights({ ...weights, [t]: parseInt(e.target.value) })} className="weight-slider" />
              <span className="weight-value">{weights[t] || 0}%</span>
            </div>
          ))}
        </div>
        <div className="setup-actions">
          <button className="btn-primary" onClick={handleSave}><Save size={15} /> Применить и пересчитать</button>
        </div>
      </div>

      {/* Мои активы — заголовок СНАРУЖИ, над прямоугольником */}
      <h2 className="section-title"><Briefcase size={15} /> Мои активы</h2>
      <div className="card">
        <div className="assets-header">
          <span>Актив</span><span></span><span>Кол-во</span><span>Ср. цена</span><span>Стоимость</span>
        </div>
        {portfolio.holdings.map(h => {
          const stockData = DEMO_STOCK_DATA[h.ticker] || h
          const currentPrice = stockData.price || h.price
          const value = h.shares * currentPrice
          return (
            <div key={h.ticker} className="asset-row" style={{ cursor: 'pointer' }} onClick={() => setModalStock(stockData)}>
              <div className="asset-main">
                <div className="asset-ticker">{h.ticker}</div>
                <div className="asset-name">{h.name}</div>
              </div>
              <div className="asset-spark"><Sparkline data={h.sparkline || []} /></div>
              <div className="asset-price">{h.shares}</div>
              <div className="asset-price">${h.avgCost || '—'}</div>
              <div className="asset-price">${value.toFixed(2)}</div>
            </div>
          )
        })}
        {portfolio.holdings.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            У вас пока нет активов. Купите акции во всплывающем окне на главной!
          </div>
        )}
      </div>

      {modalStock && (
        <ChartModal stock={modalStock} onClose={() => setModalStock(null)} onShowInfo={() => {}} onTrade={onTrade} />
      )}
    </div>
  )
}