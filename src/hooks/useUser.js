import { useState, useEffect } from 'react'

const STORAGE_KEY = 'portfolio_user'

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const saveUser = (userData) => {
    const newUser = {
      ...userData,
      joined: new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }),
      balance: 128453.72,
      avatar: null, // base64 или null — если null, показываем букву
      riskProfile: 'Умеренный', // заполнится позже при подключении
      stats: {
        totalReturn: 28.45,
        bestTrade: 142.8,
        winRate: 68,
        totalTrades: 47,
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const updateUser = (updates) => {
    if (!user) return
    const updated = { ...user, ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setUser(updated)
    return updated
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return { user, loading, saveUser, updateUser, logout }
}