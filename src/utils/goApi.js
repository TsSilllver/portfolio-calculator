const GO_API_URL = import.meta.env.VITE_GO_API_URL || 'http://localhost:8080/api'

// Запрос на оптимизацию портфеля
export async function analyzePortfolio(tickers, prices) {
  try {
    const response = await fetch(`${GO_API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickers, prices })
    })
    if (!response.ok) throw new Error('Ошибка сервера Go')
    return await response.json()
  } catch (error) {
    console.error("Ошибка при запросе к Go:", error)
    return null
  }
}

// Получить историю расчетов
export async function getHistory() {
  try {
    const response = await fetch(`${GO_API_URL}/history`)
    if (!response.ok) throw new Error('Ошибка получения истории')
    return await response.json()
  } catch (error) {
    console.error("Ошибка истории:", error)
    return []
  }
}

// Сохранить расчет в историю
export async function saveToHistory(entry) {
  try {
    await fetch(`${GO_API_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    })
  } catch (error) {
    console.error("Ошибка сохранения истории:", error)
  }
}