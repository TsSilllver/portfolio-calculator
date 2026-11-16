import { useState } from 'react'
import { TrendingUp, ArrowRight } from 'lucide-react'
import './Onboarding.css'

export default function Onboarding({ onComplete }) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onComplete({
      name: name.trim(),
      username: username.trim() || `@${name.trim().toLowerCase().replace(/\s+/g, '_')}`,
      bio: bio.trim() || 'Инвестор. Собираю портфель мечты.',
      city: city.trim() || 'Москва, Россия',
    })
  }

  const initial = name.trim() ? name.trim()[0].toUpperCase() : '?'

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="onboarding-logo">
          <div className="app-logo-icon"><TrendingUp size={22} strokeWidth={2.5} /></div>
          <span>Portfolio Calc</span>
        </div>
        <h1 className="onboarding-title">Добро пожаловать</h1>
        <p className="onboarding-subtitle">Расскажите о себе, чтобы персонализировать профиль</p>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="onboarding-avatar-preview">
            <div className="onboarding-avatar">
              <span>{initial}</span>
            </div>
            <span className="onboarding-avatar-hint">Ваша будущая аватарка</span>
          </div>

          <div className="form-group">
            <label>Имя *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например, Александр"
              required
            />
          </div>

          <div className="form-group">
            <label>Никнейм (необязательно)</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="@username"
            />
          </div>

          <div className="form-group">
            <label>О себе</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Пара слов о ваших инвестиционных целях..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Город</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Москва, Россия"
            />
          </div>

          <button type="submit" className="btn-primary onboarding-submit" disabled={!name.trim()}>
            Начать работу <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}