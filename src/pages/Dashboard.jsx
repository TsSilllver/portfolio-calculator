import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import {
  ArrowUpRight, Edit3, Eye, Download
} from 'lucide-react'
import MetricCard from '../components/MetricCard'
import PieChart from '../components/PieChart'
import AssetRow from '../components/AssetRow'
import { DEMO_MAIN_CHART } from '../data/demoData'
import './Dashboard.css'

export default function Dashboard({ portfolio, onEdit }) {
  const { holdings, metrics, tickers, weights } = portfolio

  const pieData = useMemo(
    () => tickers.map(t => ({ name: t, value: weights[t] })),
    [tickers, weights]
  )

  const chartData = DEMO_MAIN_CHART

  return (
    <div className="dashboard-page">
      {/* === Верхняя полоса === */}
      <div className="dashboard-topbar">
        <div>
          <div className="topbar-label">Общая стоимость портфеля</div>
          <div className="topbar-value">
            ${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="topbar-change positive">
            <ArrowUpRight size={14} />
            +${metrics.dayChange.toFixed(2)} ({metrics.dayChangePct}%) за сегодня
          </div>
        </div>
        <div className="topbar-actions">
          <button className="btn-secondary" onClick={onEdit}>
            <Edit3 size={15} /> Редактировать
          </button>
          <button className="btn-primary" onClick={onEdit}>
            <Eye size={15} /> Новый расчёт
          </button>
        </div>
      </div>

      {/* === Метрики === */}
      <div className="metrics-grid">
        <MetricCard label="Доходность (YTD)" value={`+${metrics.totalReturn}%`} positive />
        <MetricCard label="Риск (волатильность)" value={`${metrics.risk}%`} positive={false} />
        <MetricCard label="Коэф. Шарпа" value={metrics.sharpe.toFixed(2)} positive />
        <MetricCard label="Бета (к S&P 500)" value={metrics.beta.toFixed(2)} positive />
      </div>

      {/* === Основной график + круговая === */}
      <div className="dashboard-grid-main">
        <div className="card chart-large">
          <div className="card-header">
            <h3 className="card-title">Динамика портфеля</h3>
            <div className="card-badges">
              <span className="badge success">1Y +28.4%</span>
              <span className="badge neutral">Объём</span>
            </div>
          </div>
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
          <div className="card-header">
            <h3 className="card-title">Распределение</h3>
          </div>
          <PieChart data={pieData} />
        </div>
      </div>

      {/* === Объёмы === */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Объёмы торгов</h3>
          <span className="badge neutral">24h</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData.slice(-30)} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <Bar dataKey="volume" fill="#3f3f46" radius={[2, 2, 0, 0]} />
            <Tooltip contentStyle={{ background: '#1f1f23', border: '1px solid #3f3f46', borderRadius: 8, color: '#fafafa', fontSize: 12 }} formatter={(v) => [v.toLocaleString(), 'Объём']} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* === Таблица активов === */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Активы портфеля</h3>
          <span className="badge neutral">{holdings.length} позиций</span>
        </div>
        <div className="assets-header">
          <span>Актив</span>
          <span></span>
          <span>Цена</span>
          <span>Изм.</span>
          <span>Доля</span>
        </div>
        {holdings.map(asset => (
          <AssetRow key={asset.ticker} asset={asset} />
        ))}
      </div>
    </div>
  )
}