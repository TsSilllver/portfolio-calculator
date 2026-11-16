import { useRef, useState } from 'react'
import { Camera, MapPin, Calendar, TrendingUp, Award, Target, LogOut, Activity, Shield, Settings, Upload, Edit2, Check, PieChart as PieChartIcon } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Sparkline from '../components/Sparkline'
import { DEMO_HOLDINGS } from '../data/demoData'
import './Profile.css'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Profile({ user, onUpdateUser, onLogout }) {
  const fileInputRef = useRef(null)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bioText, setBioText] = useState(user?.bio || '')

  if (!user) return null

  const initial = user.name[0].toUpperCase()

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onUpdateUser({ avatar: ev.target.result })
    reader.readAsDataURL(file)
  }

  const handleSaveBio = () => {
    onUpdateUser({ bio: bioText })
    setIsEditingBio(false)
  }

  const balanceSparkline = Array.from({ length: 20 }, (_, i) => ({
    value: 100 + i * (user.stats.totalReturn / 20) + Math.random() * 5
  }))

  // Данные для круговой диаграммы распределения
  const pieData = DEMO_HOLDINGS.map(h => ({ name: h.ticker, value: h.weight }))

  return (
    <div className="profile-page">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar"><span>{initial}</span></div>
          )}
          <button className="profile-avatar-edit" onClick={() => fileInputRef.current?.click()}>
            <Camera size={14} />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user.name}</h1>
          <div className="profile-username">{user.username}</div>
          
          {/* Редактирование био */}
          <div className="profile-bio-wrapper">
            {isEditingBio ? (
              <div className="bio-edit-mode">
                <textarea value={bioText} onChange={e => setBioText(e.target.value)} rows={3} />
                <button onClick={handleSaveBio} className="bio-save-btn"><Check size={14} /> Сохранить</button>
              </div>
            ) : (
              <p className="profile-bio">
                {user.bio} 
                <button className="bio-edit-btn" onClick={() => setIsEditingBio(true)}><Edit2 size={12} /></button>
              </p>
            )}
          </div>

          <div className="profile-meta">
            <span><Calendar size={13} /> С нами {user.joined}</span>
            <span><MapPin size={13} /> {user.city}</span>
            <span><Shield size={13} /> Риск-профиль: {user.riskProfile || 'Умеренный'}</span>
          </div>
        </div>
        <div className="profile-balance-card">
          <div className="pbc-label">Баланс</div>
          <div className="pbc-value">${user.balance.toLocaleString()}</div>
          <div className="pbc-change">+{user.stats.totalReturn}% с начала года</div>
          <Sparkline data={balanceSparkline} width={140} height={36} color="#22c55e" />
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-card"><div className="stat-icon"><TrendingUp size={16} /></div><div className="stat-info"><div className="stat-label">Общая доходность</div><div className="stat-value pos">+{user.stats.totalReturn}%</div></div></div>
        <div className="stat-card"><div className="stat-icon"><Award size={16} /></div><div className="stat-info"><div className="stat-label">Лучшая сделка</div><div className="stat-value pos">+{user.stats.bestTrade}%</div></div></div>
        <div className="stat-card"><div className="stat-icon"><Target size={16} /></div><div className="stat-info"><div className="stat-label">Win rate</div><div className="stat-value">{user.stats.winRate}%</div></div></div>
        <div className="stat-card"><div className="stat-info"><div className="stat-label">Всего сделок</div><div className="stat-value">{user.stats.totalTrades}</div></div></div>
      </div>

      <div className="profile-main-grid">
        {/* Топ позиции */}
        <div className="profile-section">
          <div className="section-header"><h3 className="section-title">Топ позиции</h3></div>
          <div className="profile-holdings">
            {DEMO_HOLDINGS.map(h => (
              <div key={h.ticker} className="ph-row">
                <div className="ph-ticker">{h.ticker}</div>
                <div className="ph-name">{h.name}</div>
                <Sparkline data={h.sparkline} width={60} height={20} />
                <div className="ph-price">${h.price.toFixed(2)}</div>
                <div className={`ph-change ${h.change >= 0 ? 'pos' : 'neg'}`}>{h.change >= 0 ? '+' : ''}{h.change.toFixed(2)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Распределение портфеля */}
        <div className="profile-section">
          <div className="section-header">
            <h3 className="section-title">Распределение</h3>
            <PieChartIcon size={14} color="var(--text-tertiary)" />
          </div>
          <div className="profile-pie-container">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1f1f23', border: '1px solid #3f3f46', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {pieData.map((item, idx) => (
                <div key={item.name} className="legend-item">
                  <span className="legend-dot" style={{ background: COLORS[idx % COLORS.length] }} />
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button className="logout-btn" onClick={onLogout}><LogOut size={14} /> Выйти из аккаунта</button>
    </div>
  )
}