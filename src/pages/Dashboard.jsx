import { useMemo, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart as RePieChart, Pie } from 'recharts'
import { ArrowUpRight, Edit3, Cpu, Play, CheckCircle } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import PieChart from '../components/PieChart'
import AssetRow from '../components/AssetRow'
import { DEMO_MAIN_CHART, DEMO_STOCK_DATA } from '../data/demoData'
import { analyzePortfolio, saveToHistory } from '../utils/goApi'
import './Dashboard.css'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Dashboard({ portfolio, onEdit }) {
  const { holdings, metrics, tickers, weights } = portfolio
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [goResult, setGoResult] = useState(null)

  const pieData = useMemo(() => tickers.map(t => ({ name: t, value: weights[t] })), [tickers, weights])
  const chartData = DEMO_MAIN_CHART

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setProgress(0)
    setGoResult(null)

    const interval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + 15))
    }, 100)

    const pricesMap = {}
    tickers.forEach(t => {
      pricesMap[t] = DEMO_STOCK_DATA[t].chartData.map(p => p.value)
    })

    const result = await analyzePortfolio(tickers, pricesMap)
    clearInterval(interval)
    setProgress(100)

    setTimeout(() => {
      setGoResult(result)
      setIsAnalyzing(false)
      if (result) saveToHistory({ tickers, bestSharpe: result.bestSharpe, bestWeights: result.bestWeights })
    }, 400)
  }

  // Данные для графика рисков
  const riskData = goResult ? Object.entries(goResult.bestWeights).map(([ticker, weight]) => {
    const stock = DEMO_STOCK_DATA[ticker]
    return { name: ticker, weight: (weight * 100).toFixed(1), risk: stock.historicalVolatility }
  }) : []

  return (
    <div className="dashboard-page">
      <div className="dashboard-topbar">
        <div>
          <div className="topbar-label">Общая стоимость портфеля</div>
          <div className="topbar-value">${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="topbar-change positive"><ArrowUpRight size={14} />+${metrics.dayChange.toFixed(2)} ({metrics.dayChangePct}%) за сегодня</div>
        </div>
        <div className="topbar-actions">
          <button className="btn-secondary" onClick={onEdit}><Edit3 size={15} /> Редактировать</button>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard label="Доходность (YTD)" value={`+${metrics.totalReturn}%`} positive />
        <MetricCard label="Риск (волатильность)" value={`${metrics.risk}%`} positive={false} />
        <MetricCard label="Коэф. Шарпа" value={metrics.sharpe.toFixed(2)} positive />
        <MetricCard label="Бета (к S&P 500)" value={metrics.beta.toFixed(2)} positive />
      </div>

      <div className="dashboard-grid-main">
        <div className="card chart-large">
          <div className="card-header"><h3 className="card-title">Динамика портфеля</h3></div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} interval={14} tickFormatter={d => d?.slice(5) || ''} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#1f1f23', border: '1px solid #3f3f46', borderRadius: 8, color: '#fafafa', fontSize: 12 }} formatter={(val) => [`$${val.toLocaleString()}`, 'Стоимость']} />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#portfolioGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-pie">
          <div className="card-header"><h3 className="card-title">Распределение</h3></div>
          <PieChart data={pieData} />
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Активы портфеля</h3></div>
        <div className="assets-header">
          <span>Актив</span><span></span><span>Цена</span><span>Изм.</span><span>Доля</span>
        </div>
        {holdings.map(asset => <AssetRow key={asset.ticker} asset={asset} />)}
      </div>

      {/* Блок анализа */}
      <div className="analysis-section">
        <div className="analysis-divider"><span>Анализ портфеля</span></div>

        {!isAnalyzing && !goResult && (
          <div className="analysis-start">
            <div className="analysis-icon"><Cpu size={32} /></div>
            <h3>Оптимизация весов</h3>
            <p>Наш алгоритм проанализирует {tickers.length} активов и найдет баланс с лучшим соотношением риска и доходности.</p>
            <button className="btn-primary btn-large" onClick={handleAnalyze}><Play size={16} /> Запустить анализ</button>
          </div>
        )}

        {isAnalyzing && (
          <div className="analysis-loading">
            <h3>Считаем оптимальные веса...</h3>
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
            <span className="progress-text">{progress}%</span>
            <p className="loading-subtext">Сервер обрабатывает данные...</p>
          </div>
        )}

        {goResult && !isAnalyzing && (
          <div className="analysis-result">
            <div className="result-header">
              <CheckCircle size={20} color="var(--success)" />
              <h3>Анализ завершен!</h3>
            </div>
            
            {/* Новые графики для анализа */}
            <div className="analysis-charts-grid">
              <div className="analysis-chart-card">
                <h4>Оптимальное распределение</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <RePieChart>
                    <Pie data={Object.entries(goResult.bestWeights).map(([name, val]) => ({ name, value: val * 100 }))} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                      {Object.keys(goResult.bestWeights).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(val) => `${val.toFixed(1)}%`} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="analysis-chart-card">
                <h4>Уровень риска (Волатильность)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={riskData}>
                    <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#71717a', fontSize: 10 }} />
                    <Tooltip formatter={(val) => `${val}%`} />
                    <Bar dataKey="risk" fill="#ef4444" radius={[4, 4, 0, 0]}>
                      {riskData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="go-result-grid" style={{ marginTop: '20px' }}>
              <div className="go-metric main-metric">
                <span>Лучший коэффициент Шарпа</span>
                <strong>{goResult.bestSharpe}</strong>
              </div>
              {Object.entries(goResult.bestWeights).map(([t, w]) => (
                <div className="go-metric" key={t}>
                  <span>Доля {t}</span>
                  <strong>{(w * 100).toFixed(1)}%</strong>
                </div>
              ))}
            </div>
            <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={() => setGoResult(null)}>Запустить заново</button>
          </div>
        )}
      </div>
    </div>
  )
}