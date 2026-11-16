import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Pin, PinOff, Maximize2, ArrowLeft } from 'lucide-react'
import './StockWidget.css'

export default function StockWidget({ stock, isPinned, onTogglePin, onOpenModal, showInfo, onShowInfo }) {
  const isPositive = stock.change >= 0
  const [showFullInfo, setShowFullInfo] = useState(false)

  // Синхронизация локального стейта с пропсом из Home.jsx
  useEffect(() => {
    setShowFullInfo(showInfo)
  }, [showInfo])

  if (showFullInfo) {
    return (
      <div className="stock-widget-info-mode">
        <div className="swi-header">
          <div className="sw-title-area">
            <span className="sw-ticker">{stock.ticker}</span>
            <span className="sw-name">{stock.name}</span>
          </div>
          <button className="sw-btn" onClick={() => { setShowFullInfo(false); onShowInfo(false); }}>
             <ArrowLeft size={14} /> К графику
          </button>
        </div>
        
        <div className="swi-grid">
           <div className="sw-stat"><span>Market Cap</span><strong>${(stock.marketCap / 1e9).toFixed(2)}B</strong></div>
           <div className="sw-stat"><span>P/E</span><strong>{stock.pe.toFixed(1)}</strong></div>
           <div className="sw-stat"><span>Forward P/E</span><strong>{stock.forwardPe.toFixed(1)}</strong></div>
           <div className="sw-stat"><span>EPS</span><strong>${stock.eps.toFixed(2)}</strong></div>
           <div className="sw-stat"><span>Beta</span><strong>{stock.beta.toFixed(2)}</strong></div>
           <div className="sw-stat"><span>Div Yield</span><strong>{stock.dividendYield.toFixed(2)}%</strong></div>
           <div className="sw-stat"><span>Target Est</span><strong>${stock.targetEst1y.toFixed(2)}</strong></div>
           <div className="sw-stat"><span>Max Drawdown</span><strong className="neg">{stock.maxDrawdown.toFixed(1)}%</strong></div>
           <div className="sw-stat"><span>Alpha</span><strong className="pos">+{stock.alpha.toFixed(1)}%</strong></div>
           <div className="sw-stat"><span>Sortino</span><strong>{stock.sortino.toFixed(2)}</strong></div>
        </div>
      </div>
    )
  }

  return (
    <div className="stock-widget-content">
      <div className="sw-header">
        <div className="sw-title-area">
          <span className="sw-ticker">{stock.ticker}</span>
          <span className="sw-price">${stock.price.toFixed(2)}</span>
          <span className={`sw-change ${isPositive ? 'pos' : 'neg'}`}>
            {isPositive ? '+' : ''}{stock.changePct.toFixed(2)}%
          </span>
        </div>
        <div className="sw-actions">
          <button className="sw-btn" onClick={onTogglePin} title={isPinned ? 'Открепить' : 'Закрепить'}>
            {isPinned ? <PinOff size={14} className="pinned" /> : <Pin size={14} />}
          </button>
          <button className="sw-btn" onClick={onOpenModal} title="Развернуть график">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
      
      <div className="sw-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stock.chartData.slice(-30)} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: '#1f1f23', border: '1px solid #3f3f46' }} />
            <Area type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} fill={`url(#grad-${stock.ticker})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="sw-stats-grid">
        <div className="sw-stat"><span>Market Cap</span><strong>${(stock.marketCap / 1e9).toFixed(1)}B</strong></div>
        <div className="sw-stat"><span>P/E</span><strong>{stock.pe.toFixed(1)}</strong></div>
        <div className="sw-stat"><span>Div Yield</span><strong>{stock.dividendYield.toFixed(2)}%</strong></div>
        <div className="sw-stat"><span>Beta</span><strong>{stock.beta.toFixed(2)}</strong></div>
      </div>
    </div>
  )
}