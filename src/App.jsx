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
  const { user, loading, saveUser, updateUser, logout } = useUser()
  const [page, setPage] = useState('home')
  const [portfolio, setPortfolio] = useState({
    tickers: DEMO_PORTFOLIO.tickers,
    weights: DEMO_PORTFOLIO.weights,
    holdings: DEMO_HOLDINGS,
    metrics: DEMO_PORTFOLIO.metrics,
    isDemo: true,
  })

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} />
  if (!user) return <Onboarding onComplete={saveUser} />

  return (
    <Layout page={page} onNavigate={setPage} user={user}>
      {page === 'home' && <Home />}
      {page === 'dashboard' && <Dashboard portfolio={portfolio} onEdit={() => setPage('assets')} />}
      {page === 'assets' && <Setup portfolio={portfolio} onChange={setPortfolio} onBack={() => setPage('dashboard')} />}
      {page === 'history' && <History />}
      {page === 'profile' && <Profile user={user} onUpdateUser={updateUser} onLogout={logout} />}
      {page === 'chat' && <Chat />}
    </Layout>
  )
}