export function useLocalStorage(key) {
  const save = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Failed to save to localStorage', e)
    }
  }

  const load = () => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  }

  const remove = () => {
    localStorage.removeItem(key)
  }

  return { save, load, remove }
}