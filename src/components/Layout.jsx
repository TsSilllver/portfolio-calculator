import { useState } from 'react'
import { TrendingUp, LayoutDashboard, Home, Wallet, History, User, MessageCircle, Menu, X } from 'lucide-react'
import './Layout.css'

const NAV_ITEMS = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'dashboard', label: 'Обзор', icon: LayoutDashboard },
  { id: 'assets', label: 'Активы', icon: Wallet },
  { id: 'history', label: 'История', icon: History },
  { id: 'chat', label: 'ИИ-помощник', icon: MessageCircle },
  { id: 'profile', label: 'Профиль', icon: User },
]

export default function Layout({ page, onNavigate, user, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = (id) => {
    onNavigate(id)
    setMobileOpen(false)
  }

  const initial = user?.name?.[0]?.toUpperCase() || '?'

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">
            <TrendingUp size={18} strokeWidth={2.5} />
          </div>
          <span>Portfolio Calc</span>
        </div>

        <nav className="app-nav-desktop">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={page === id ? 'active' : ''}
              onClick={() => navigate(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="app-header-right">
          <div
            className="app-user-avatar"
            onClick={() => navigate('profile')}
            title="Профиль"
          >
            {initial}
          </div>
          <button className="burger-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-drawer">
            <div className="mobile-drawer-header">
              <div className="app-logo">
                <div className="app-logo-icon">
                  <TrendingUp size={18} strokeWidth={2.5} />
                </div>
                <span>Меню</span>
              </div>
              <button className="burger-btn" onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`drawer-item ${page === id ? 'active' : ''}`}
                onClick={() => navigate(id)}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      <main className="app-main">{children}</main>
    </div>
  )
}