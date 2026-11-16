import { useRef } from 'react'
import { Camera, MapPin, Calendar, TrendingUp, Award, Target, LogOut, Activity, Shield, Settings, Upload } from 'lucide-react'
import Sparkline from '../components/Sparkline'
import { DEMO_HOLDINGS } from '../data/demoData'
import './Profile.css'

export default function Profile({ user, onUpdateUser, onLogout }) {
  const fileInputRef = useRef(null)

  if (!user) return null

  const initial = user.name[0].toUpperCase()

  // Обработка загрузки аватарки
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onUpdateUser({ avatar: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  const balanceSparkline = Array.from({ length: 20 }, (_, i) => ({
    value: 100 + i * (user.stats.totalReturn / 20) + Math.random() * 5
  }))

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
          <button className="profile-avatar-edit" title="Сменить аватар" onClick={() => fileInputRef.current?.click()}>
            <Camera size={14} />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user.name}</h1>
          <div className="profile-username">{user.username}</div>
          <p className="profile-bio">{user.bio}</p>
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

      {/* Настройки профиля */}
      <div className="profile-section">
        <div className="section-header">
          <h3 className="section-title">Настройки профиля</h3>
          <Settings size={14} color="var(--text-tertiary)" />
        </div>
        <div className="settings-list">
          <div className="setting-item">
            <div><div className="setting-name">Загрузить аватар</div><div className="setting-desc">JPG, PNG до 2 МБ</div></div>
            <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} /> Загрузить
            </button>
          </div>
          <div className="setting-item">
            <div><div className="setting-name">Риск-профиль</div><div className="setting-desc">Определяет рекомендации</div></div>
            <span className="badge neutral">{user.riskProfile || 'Умеренный'}</span>
          </div>
        </div>
      </div>

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

      <button className="logout-btn" onClick={onLogout}><LogOut size={14} /> Выйти из аккаунта</button>
    </div>
  )
}