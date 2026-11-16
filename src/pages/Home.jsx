import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import {
  ArrowUpRight, ArrowDownRight, Search, TrendingUp, TrendingDown,
  DollarSign, Percent, Activity, BarChart3, Clock, Shield, Target,
  AlertTriangle, Zap
} from 'lucide-react'
import { DEMO_STOCK_DATA } from '../data/demoData'
import './Home.css'

const AVAILABLE_TICKERS = ['TSLA', 'AAPL', 'NVDA', 'MSFT', 'GOOGL']

export default function Home() {
  const [selectedTicker, setSelectedTicker] = useState('TSLA')
  const [searchQuery, setSearchQuery] = useState('')

  const stock = DEMO_STOCK_DATA[selectedTicker]
  const isPositive = stock.change >= 0

  const filteredTickers = useMemo(() =>
    AVAILABLE_TICKERS.filter(t =>
      t.toLowerCase().includes(searchQuery.toLowerCase()) ||
      DEMO_STOCK_DATA[t].name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  )

  return (
    <div className="home-page">
      {/* Поиск / выбор акции */}
      <div className="stock-selector">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Поиск акции (TSLA, AAPL...)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="stock-search"
        />
        <div className="stock-suggestions">
          {filteredTickers.map(t => (
            <button
              key={t}
              className={`suggestion-chip ${selectedTicker === t ? 'active' : ''}`}
              onClick={() => { setSelectedTicker(t); setSearchQuery('') }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Основная карточка с ценой и графиком */}
      <div className="stock-main-card">
        <div className="stock-header">
          <div>
            <div className="stock-ticker-row">
              <span className="stock-ticker">{stock.ticker}</span>
              <span className="stock-exchange">{stock.exchange}</span>
              <span className="stock-name">{stock.name}</span>
            </div>
            <div className="stock-price-row">
              <span className="stock-price">${stock.price.toFixed(2)}</span>
              <span className={`stock-change ${isPositive ? 'pos' : 'neg'}`}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePct.toFixed(2)}%)
              </span>
            </div>
            <div className="stock-bid-ask">
              <span>Bid: <strong>${stock.bid.toFixed(2)}</strong> × {stock.bidSize}</span>
              <span>Ask: <strong>${stock.ask.toFixed(2)}</strong> × {stock.askSize}</span>
            </div>
          </div>
          <div className="stock-actions">
            <button className="btn-primary">Купить</button>
            <button className="btn-secondary">Продать</button>
          </div>
        </div>

        {/* График цены */}
        <div className="stock-chart-large">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={stock.chartData} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} interval={14} tickFormatter={d => d?.slice(5) || ''} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toFixed(0)}`} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#1f1f23', border: '1px solid #3f3f46', borderRadius: 8, color: '#fafafa', fontSize: 12 }} formatter={(val) => [`$${val.toFixed(2)}`, 'Цена']} />
              <Area type="monotone" dataKey="value" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} fill="url(#stockGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Объёмы */}
        <div className="stock-volume-chart">
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={stock.chartData.slice(-30)} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <Bar dataKey="value" fill="#3f3f46" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Профессиональная статистика */}
      <div className="stock-stats-grid">
        <div className="stat-box"><div className="stat-box-label">Market Cap</div><div className="stat-box-value">${(stock.marketCap / 1e9).toFixed(2)}B</div></div>
        <div className="stat-box"><div className="stat-box-label">P/E (TTM)</div><div className="stat-box-value">{stock.pe.toFixed(1)}</div></div>
        <div className="stat-box"><div className="stat-box-label">Forward P/E</div><div className="stat-box-value">{stock.forwardPe.toFixed(1)}</div></div>
        <div className="stat-box"><div className="stat-box-label">EPS (TTM)</div><div className="stat-box-value">${stock.eps.toFixed(2)}</div></div>
        <div className="stat-box"><div className="stat-box-label">Dividend Yield</div><div className="stat-box-value">{stock.dividendYield.toFixed(2)}%</div></div>
        <div className="stat-box"><div className="stat-box-label">Payout Ratio</div><div className="stat-box-value">{stock.payoutRatio.toFixed(1)}%</div></div>
        <div className="stat-box"><div className="stat-box-label">Beta</div><div className="stat-box-value">{stock.beta.toFixed(2)}</div></div>
        <div className="stat-box"><div className="stat-box-label">Volume</div><div className="stat-box-value">{(stock.volume / 1e6).toFixed(1)}M</div></div>
        <div className="stat-box"><div className="stat-box-label">Avg Volume</div><div className="stat-box-value">{(stock.avgVolume / 1e6).toFixed(1)}M</div></div>
        <div className="stat-box"><div className="stat-box-label">52W High</div><div className="stat-box-value">${stock.high52.toFixed(2)}</div></div>
        <div className="stat-box"><div className="stat-box-label">52W Low</div><div className="stat-box-value">${stock.low52.toFixed(2)}</div></div>
        <div className="stat-box"><div className="stat-box-label">Open</div><div className="stat-box-value">${stock.open.toFixed(2)}</div></div>
        <div className="stat-box"><div className="stat-box-label">Prev Close</div><div className="stat-box-value">${stock.prevClose.toFixed(2)}</div></div>
        <div className="stat-box"><div className="stat-box-label">Day High</div><div className="stat-box-value">${stock.dayHigh.toFixed(2)}</div></div>
        <div className="stat-box"><div className="stat-box-label">Day Low</div><div className="stat-box-value">${stock.dayLow.toFixed(2)}</div></div>
        <div className="stat-box"><div className="stat-box-label">1y Target Est</div><div className="stat-box-value">${stock.targetEst1y.toFixed(2)}</div></div>
      </div>

      {/* Риск-метрики */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Риск и производительность</h3>
        </div>
        <div className="risk-grid">
          <div className="risk-item">
            <Shield size={16} />
            <div><div className="risk-label">Max Drawdown</div><div className="risk-value neg">{stock.maxDrawdown.toFixed(1)}%</div></div>
          </div>
          <div className="risk-item">
            <Activity size={16} />
            <div><div className="risk-label">Alpha</div><div className={`risk-value ${stock.alpha >= 0 ? 'pos' : 'neg'}`}>{stock.alpha >= 0 ? '+' : ''}{stock.alpha.toFixed(1)}%</div></div>
          </div>
          <div className="risk-item">
            <Zap size={16} />
            <div><div className="risk-label">Sortino Ratio</div><div className="risk-value">{stock.sortino.toFixed(2)}</div></div>
          </div>
          <div className="risk-item">
            <AlertTriangle size={16} />
            <div><div className="risk-label">VaR (95%)</div><div className="risk-value neg">{stock.var95.toFixed(1)}%</div></div>
          </div>
        </div>
      </div>

      {/* Позиция пользователя */}
      {stock.position && (
        <div className="position-card">
          <h3 className="section-title">Ваша позиция</h3>
          <div className="position-grid">
            <div className="position-item"><span className="pos-label">Акций</span><span className="pos-value">{stock.position.shares}</span></div>
            <div className="position-item"><span className="pos-label">Средняя цена</span><span className="pos-value">${stock.position.avgCost.toFixed(2)}</span></div>
            <div className="position-item"><span className="pos-label">Рыночная стоимость</span><span className="pos-value">${stock.position.marketValue.toFixed(2)}</span></div>
            <div className="position-item"><span className="pos-label">Сегодня</span><span className={`pos-value ${stock.position.todayReturn >= 0 ? 'pos' : 'neg'}`}>{stock.position.todayReturn >= 0 ? '+' : ''}${stock.position.todayReturn.toFixed(2)}</span></div>
            <div className="position-item"><span className="pos-label">Общий возврат</span><span className={`pos-value ${stock.position.totalReturn >= 0 ? 'pos' : 'neg'}`}>{stock.position.totalReturn >= 0 ? '+' : ''}${stock.position.totalReturn.toFixed(2)}</span></div>
          </div>
        </div>
      )}
    </div>
  )
}