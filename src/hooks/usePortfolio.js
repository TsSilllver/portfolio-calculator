// Хук для расчёта метрик портфеля
export function usePortfolio() {
  // Расчёт доходностей из цен
  const calculateReturns = (prices) => {
    if (!prices || prices.length < 2) return []
    const returns = []
    for (let i = 1; i < prices.length; i++) {
      const prev = prices[i - 1].close
      const curr = prices[i].close
      if (prev > 0) {
        returns.push((curr - prev) / prev)
      }
    }
    return returns
  }

  // Среднее значение
  const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length

  // Стандартное отклонение (выборочное)
  const stdDev = (arr) => {
    if (arr.length < 2) return 0
    const m = mean(arr)
    const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1)
    return Math.sqrt(variance)
  }

  // Корреляция Пирсона между двумя массивами
  const correlation = (x, y) => {
    const n = Math.min(x.length, y.length)
    if (n < 2) return 0
    const mx = mean(x.slice(0, n))
    const my = mean(y.slice(0, n))
    let num = 0, dx = 0, dy = 0
    for (let i = 0; i < n; i++) {
      const a = x[i] - mx
      const b = y[i] - my
      num += a * b
      dx += a * a
      dy += b * b
    }
    return num / Math.sqrt(dx * dy) || 0
  }

  // Основной расчёт
  const calculateMetrics = (tickers, weights, rawData) => {
    // Извлекаем цены для каждого тикера
    const priceSeries = {}
    tickers.forEach(t => {
      priceSeries[t] = rawData[t]?.prices || []
    })

    // Доходности по каждому тикеру
    const returnsMap = {}
    tickers.forEach(t => {
      returnsMap[t] = calculateReturns(priceSeries[t])
    })

    // Общая доходность за период (упрощённо: по первой и последней цене)
    const totalReturns = {}
    tickers.forEach(t => {
      const prices = priceSeries[t]
      if (prices.length >= 2) {
        totalReturns[t] = (prices[prices.length - 1].close - prices[0].close) / prices[0].close
      } else {
        totalReturns[t] = 0
      }
    })

    // Средняя доходность портфеля (взвешенная)
    let portfolioReturn = 0
    tickers.forEach(t => {
      portfolioReturn += (totalReturns[t] || 0) * (weights[t] / 100)
    })

    // Волатильность портфеля (упрощённо: взвешенная сумма std каждого актива)
    // Для точного расчёта нужна ковариационная матрица, но для MVP используем это
    let portfolioRisk = 0
    tickers.forEach(t => {
      const r = returnsMap[t]
      if (r.length > 1) {
        portfolioRisk += stdDev(r) * (weights[t] / 100)
      }
    })

    // Коэффициент Шарпа (безрисковая ставка 5% годовых, но у нас дневные данные — упрощаем)
    const riskFreeRate = 0.05
    const sharpe = portfolioRisk > 0
      ? (portfolioReturn - riskFreeRate) / portfolioRisk
      : 0

    // Корреляционная матрица
    const corrMatrix = {}
    tickers.forEach(t1 => {
      corrMatrix[t1] = {}
      tickers.forEach(t2 => {
        if (t1 === t2) {
          corrMatrix[t1][t2] = 1
        } else {
          const r1 = returnsMap[t1]
          const r2 = returnsMap[t2]
          const minLen = Math.min(r1.length, r2.length)
          corrMatrix[t1][t2] = correlation(r1.slice(0, minLen), r2.slice(0, minLen))
        }
      })
    })

    // Данные для линейного графика: стоимость портфеля во времени
    // Берём первый тикер как базу по датам (все должны совпадать)
    const baseDates = priceSeries[tickers[0]]?.map(p => p.date) || []
    const portfolioValueSeries = []

    baseDates.forEach((date, idx) => {
      let totalValue = 0
      tickers.forEach(t => {
        const priceAtDate = priceSeries[t]?.find(p => p.date === date)
        if (priceAtDate) {
          totalValue += priceAtDate.close * (weights[t] / 100)
        }
      })
      portfolioValueSeries.push({
        date,
        value: Math.round(totalValue * 100) / 100
      })
    })

    return {
      portfolioReturn: portfolioReturn * 100, // в процентах
      portfolioRisk: portfolioRisk * 100,
      sharpe: sharpe,
      totalReturns,
      corrMatrix,
      portfolioValueSeries,
      tickers,
      weights,
      priceSeries
    }
  }

  return { calculateMetrics }
}