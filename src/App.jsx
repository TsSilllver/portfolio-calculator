import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Setup from './pages/Setup'
import History from './pages/History'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Onboarding from './pages/Onboarding'
import { useUser } from './hooks/useUser'
import { DEMO_PORTFOLIO, DEMO_HOLDINGS } from './data/demoData'
import './App.css'

export default function App() {
  // Достаем из хука все нужные функции, включая togglePinTicker
  const { user, loading, saveUser, updateUser, togglePinTicker, logout } = useUser()
  
  // Стартовая страница - "Главная" (Home)
  const [page, setPage] = useState('home')
  
  // Стейт портфеля (пока демо, позже заменим на реальные данные)
  const [portfolio, setPortfolio] = useState({
    tickers: DEMO_PORTFOLIO.tickers,
    weights: DEMO_PORTFOLIO.weights,
    holdings: DEMO_HOLDINGS,
    metrics: DEMO_PORTFOLIO.metrics,
    isDemo: true,
  })

  // Пока грузится user из localStorage - показываем пустой экран (чтобы не было мигания)
  if (loading) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} />
  }

  // Если пользователя нет - показываем форму регистрации
  if (!user) {
    return <Onboarding onComplete={saveUser} />
  }

  return (
    <Layout page={page} onNavigate={setPage} user={user}>
      {/* Главная - терминал с акциями */}
      {page === 'home' && (
        <Home user={user} togglePinTicker={togglePinTicker} />
      )}
      
      {/* Обзор портфеля */}
      {page === 'dashboard' && (
        <Dashboard portfolio={portfolio} onEdit={() => setPage('assets')} />
      )}
      
      {/* Управление активами */}
      {page === 'assets' && (
        <Setup
          portfolio={portfolio}
          onChange={setPortfolio}
          onBack={() => setPage('dashboard')}
        />
      )}
      
      {/* История расчетов */}
      {page === 'history' && <History />}
      
      {/* Профиль (передаем функцию обновления и выхода) */}
      {page === 'profile' && (
        <Profile user={user} onUpdateUser={updateUser} onLogout={logout} />
      )}
      
      {/* ИИ-Помощник */}
      {page === 'chat' && <Chat />}
    </Layout>
  )
}