import { useState, useRef, useEffect, useMemo } from 'react'
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Bar, Cell
} from 'recharts'
import {
  X, Pencil, Eraser, ArrowUpRight, ArrowDownRight,
  Square, Minus, MousePointer2, ChevronDown, Info, ShoppingCart, DollarSign
} from 'lucide-react'
import DrawingOverlay from './DrawingOverlay'
import './ChartModal.css'

const PERIODS = [
  { id: '1m', label: '1М' }, { id: '15m', label: '15М' },
  { id: '1h', label: '1Ч' }, { id: '1d', label: '1Д' },
  { id: '1w', label: '1Н' }, { id: '1mo', label: '1Мес' },
]
const COLORS = ['#22c55e', '#ef4444', '#6366f1', '#f59e0b', '#ec4899', '#ffffff']

export default function ChartModal({ stock, onClose, onShowInfo, onTrade }) {
  const [period, setPeriod] = useState('1d')
  const [drawingActive, setDrawingActive] = useState(false)
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#6366f1')
  const [showTools, setShowTools] = useState(false)
  const drawingRef = useRef(null)
  
  // Стейты для покупки/продажи
  const [tradeType, setTradeType] = useState('buy') // 'buy' | 'sell'
  const [tradeQty, setTradeQty] = useState(1)

  const isPositive = stock.change >= 0

  useEffect(() => {
    if (drawingRef.current) drawingRef.current.clear()
  }, [period])

  const chartData = useMemo(() => {
    const baseData = stock.chartData
    let sliced = baseData
    switch (period) {
      case '1m': sliced = baseData.slice(-10); break;
      case '15m': sliced = baseData.slice(-20); break;
      case '1h': sliced = baseData.slice(-40); break;
      case '1d': sliced = baseData.slice(-60); break;
      case '1w': sliced = baseData.slice(-90); break;
      case '1mo': sliced = baseData.slice(-90); break;
      default: sliced = baseData;
    }
    
    return sliced.map((item, idx) => {
      const prevValue = idx > 0 ? sliced[idx - 1].value : item.value
      return {
        ...item,
        volume: Math.floor(Math.random() * 50000 + 10000),
        barColor: item.value >= prevValue ? '#22c55e' : '#ef4444'
      }
    })
  }, [stock, period])

  const handleTrade = () => {
    if (tradeQty <= 0) return
    onTrade({
      ticker: stock.ticker,
      type: tradeType,
      qty: tradeQty,
      price: stock.price,
      date: new Date().toISOString()
    })
    alert(`Успешно ${tradeType === 'buy' ? 'куплено' : 'продано'} ${tradeQty} акций ${stock.ticker}`)
  }

  return (
    <div className="chart-modal-overlay" onClick={onClose}>
      <div className="chart-modal" onClick={e => e.stopPropagation()}>
        <div className="chart-modal-toolbar">
          <div className="chart-modal-header">
            <span className="chart-modal-ticker">{stock.ticker}</span>
            <span className="chart-modal-name">{stock.name}</span>
            <span className="chart-modal-price">${stock.price.toFixed(2)}</span>
            <span className={`chart-modal-change ${isPositive ? 'pos' : 'neg'}`}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {isPositive ? '+' : ''}{stock.changePct.toFixed(2)}%
            </span>
          </div>
          
          <div className="chart-modal-periods">
            {PERIODS.map(p => (
              <button key={p.id} className={`period-btn ${period === p.id ? 'active' : ''}`} onClick={() => setPeriod(p.id)}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="chart-modal-tools">
            <div className="tools-dropdown-container">
              <button className={`tool-btn ${drawingActive ? 'active' : ''}`} onClick={() => setShowTools(!showTools)}>
                <Pencil size={16} /><ChevronDown size={12} style={{ marginLeft: 2 }} />
              </button>
              
              {showTools && (
                <div className="tools-dropdown">
                  <div className="tools-section">
                    <span className="tools-label">Инструмент</span>
                    <button className={tool === 'pen' ? 'active' : ''} onClick={() => { setTool('pen'); setDrawingActive(true); }}><MousePointer2 size={14} /> Кисть</button>
                    <button className={tool === 'line' ? 'active' : ''} onClick={() => { setTool('line'); setDrawingActive(true); }}><Minus size={14} /> Линия</button>
                    <button className={tool === 'rect' ? 'active' : ''} onClick={() => { setTool('rect'); setDrawingActive(true); }}><Square size={14} /> Прямоугольник</button>
                  </div>
                  <div className="tools-section">
                    <span className="tools-label">Цвет</span>
                    <div className="color-picker">
                      {COLORS.map(c => (
                        <button key={c} className={`color-dot ${color === c ? 'active' : ''}`} style={{ backgroundColor: c }} onClick={() => setColor(c)} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button className="tool-btn" onClick={() => drawingRef.current?.clear()}><Eraser size={16} /></button>
            <button className="tool-btn" onClick={() => { onShowInfo(); onClose(); }}><Info size={16} /></button>
            <button className="tool-btn close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className="chart-modal-content">
          <div className="chart-modal-chart-area">
            
            {/* График цены */}
            <div className="chart-with-drawing" style={{ height: '60%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="modalStockGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={d => d?.slice(5) || ''} />
                  <YAxis yAxisId="price" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toFixed(0)}`} domain={['auto', 'auto']} />
                  
                  <Tooltip contentStyle={{ background: '#1f1f23', border: '1px solid #3f3f46', borderRadius: 8, color: '#fafafa', fontSize: 12 }} />
                  
                  <Area yAxisId="price" type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} fill="url(#modalStockGradient)" />

                  {stock.trades?.map((t, i) => {
                    const dateInChart = chartData.find(d => d.date === t.date)
                    if (!dateInChart) return null
                    return (
                      <ReferenceLine key={i} yAxisId="price" x={t.date} stroke={t.type === 'buy' ? '#22c55e' : '#ef4444'} strokeDasharray="4 4" label={{ value: t.type === 'buy' ? 'BUY' : 'SELL', fill: t.type === 'buy' ? '#22c55e' : '#ef4444', fontSize: 10, position: 'top' }} />
                    )
                  })}
                </ComposedChart>
              </ResponsiveContainer>
              <DrawingOverlay ref={drawingRef} active={drawingActive} tool={tool} color={color} />
            </div>

            {/* Объемы (отдельно внизу) */}
            <div className="chart-volume-area" style={{ height: '15%', marginTop: '8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={[0, (dataMax) => dataMax * 1.2]} />
                  <Bar dataKey="volume" barSize={period === '1m' || period === '15m' ? 20 : 8} isAnimationActive={false}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.barColor} opacity={0.4} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Блок покупки/продажи */}
            <div className="trade-panel">
              <div className="trade-tabs">
                <button className={tradeType === 'buy' ? 'active buy' : ''} onClick={() => setTradeType('buy')}>Купить</button>
                <button className={tradeType === 'sell' ? 'active sell' : ''} onClick={() => setTradeType('sell')}>Продать</button>
              </div>
              <div className="trade-inputs">
                <div className="trade-qty">
                  <label>Кол-во</label>
                  <input type="number" min="1" value={tradeQty} onChange={e => setTradeQty(parseInt(e.target.value) || 1)} />
                </div>
                <div className="trade-total">
                  <label>Итого</label>
                  <strong>${(tradeQty * stock.price).toFixed(2)}</strong>
                </div>
                <button className={`btn-trade ${tradeType}`} onClick={handleTrade}>
                  {tradeType === 'buy' ? <ShoppingCart size={16} /> : <DollarSign size={16} />}
                  {tradeType === 'buy' ? 'Купить' : 'Продать'}
                </button>
              </div>
            </div>

          </div>

          <div className="chart-modal-info">
            <h3 className="cmi-title">Информация</h3>
            <div className="cmi-price-box">
              <div className="cmi-label">Текущая цена</div>
              <div className="cmi-price">${stock.price.toFixed(2)}</div>
              <div className={`cmi-change ${isPositive ? 'pos' : 'neg'}`}>
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePct.toFixed(2)}%)
              </div>
            </div>

            <div className="cmi-section">
              <h4 className="cmi-section-title">Ваша позиция</h4>
              <div className="cmi-row"><span>Акций</span><strong>{stock.position.shares}</strong></div>
              <div className="cmi-row"><span>Средняя цена</span><strong>${stock.position.avgCost.toFixed(2)}</strong></div>
              <div className="cmi-row"><span>Стоимость</span><strong>${stock.position.marketValue.toFixed(2)}</strong></div>
              <div className="cmi-row"><span>Сегодня</span><strong className={stock.position.todayReturn >= 0 ? 'pos' : 'neg'}>{stock.position.todayReturn >= 0 ? '+' : ''}${stock.position.todayReturn.toFixed(2)}</strong></div>
              <div className="cmi-row"><span>Общий возврат</span><strong className={stock.position.totalReturn >= 0 ? 'pos' : 'neg'}>{stock.position.totalReturn >= 0 ? '+' : ''}${stock.position.totalReturn.toFixed(2)}</strong></div>
            </div>

            <div className="cmi-section">
              <h4 className="cmi-section-title">Риск-метрики</h4>
              <div className="cmi-row"><span>Volatility</span><strong>{stock.historicalVolatility.toFixed(1)}%</strong></div>
              <div className="cmi-row"><span>Max Drawdown</span><strong className="neg">{stock.maxDrawdown.toFixed(1)}%</strong></div>
              <div className="cmi-row"><span>Alpha</span><strong className={stock.alpha >= 0 ? 'pos' : 'neg'}>{stock.alpha >= 0 ? '+' : ''}{stock.alpha.toFixed(1)}%</strong></div>
              <div className="cmi-row"><span>Sortino</span><strong>{stock.sortino.toFixed(2)}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}