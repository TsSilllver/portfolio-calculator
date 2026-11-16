// Генератор псевдо-случайного графика
const genSeries = (points, base = 100, volatility = 2) => {
  const out = []
  let v = base
  for (let i = 0; i < points; i++) {
    v += (Math.random() - 0.45) * volatility
    out.push({ value: Math.max(v, base * 0.7) })
  }
  return out
}

export const DEMO_PORTFOLIO = {
  tickers: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'TSLA'],
  weights: { AAPL: 30, MSFT: 25, NVDA: 20, GOOGL: 15, TSLA: 10 },
  metrics: {
    totalValue: 128453.72,
    dayChange: 1423.55,
    dayChangePct: 1.12,
    totalReturn: 28.45,
    risk: 12.7,
    sharpe: 1.84,
    beta: 1.05,
    volatility: 14.2,
    maxDrawdown: -8.4,
    alpha: 3.2,
    sortino: 2.1,
    var95: -2.8,
  }
}

export const DEMO_HOLDINGS = [
  { ticker: 'AAPL', name: 'Apple Inc.', shares: 42, price: 228.5, change: 1.82, weight: 30, sparkline: genSeries(20, 220, 3) },
  { ticker: 'MSFT', name: 'Microsoft Corp.', shares: 28, price: 412.9, change: 0.94, weight: 25, sparkline: genSeries(20, 400, 5) },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', shares: 15, price: 138.6, change: 3.42, weight: 20, sparkline: genSeries(20, 130, 4) },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', shares: 55, price: 174.2, change: -0.61, weight: 15, sparkline: genSeries(20, 175, 2) },
  { ticker: 'TSLA', name: 'Tesla Inc.', shares: 12, price: 248.3, change: -1.27, weight: 10, sparkline: genSeries(20, 250, 6) },
]

export const DEMO_HISTORY = [
  {
    id: 1,
    date: '14 ноя 2026, 18:42',
    name: 'Технологический портфель',
    tickers: ['AAPL', 'MSFT', 'NVDA'],
    returnPct: 34.2,
    riskPct: 15.1,
    sharpe: 1.92,
    value: 94200,
    sparkline: genSeries(15, 90, 4)
  },
  {
    id: 2,
    date: '10 ноя 2026, 09:15',
    name: 'Дивидендный коктейль',
    tickers: ['JNJ', 'KO', 'PG', 'XOM'],
    returnPct: 12.4,
    riskPct: 8.3,
    sharpe: 1.21,
    value: 45600,
    sparkline: genSeries(15, 45, 1)
  },
  {
    id: 3,
    date: '02 ноя 2026, 21:07',
    name: 'Агрессивный рост',
    tickers: ['TSLA', 'NVDA', 'AMD', 'META'],
    returnPct: 48.7,
    riskPct: 24.8,
    sharpe: 1.78,
    value: 31250,
    sparkline: genSeries(15, 30, 6)
  }
]

// Профессиональные данные по акциям (как на Yahoo Finance / Т-Инвестиции)
export const DEMO_STOCK_DATA = {
  TSLA: {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    price: 248.30,
    change: -3.20,
    changePct: -1.27,
    bid: 248.25,
    ask: 248.40,
    bidSize: 1200,
    askSize: 800,
    marketCap: 791.2e9,
    pe: 62.4,
    forwardPe: 48.2,
    eps: 3.98,
    dividendYield: 0,
    payoutRatio: 0,
    beta: 2.34,
    volume: 98.4e6,
    avgVolume: 112.3e6,
    high52: 299.29,
    low52: 138.80,
    open: 251.20,
    prevClose: 251.50,
    dayHigh: 253.80,
    dayLow: 246.10,
    targetEst1y: 285.00,
    historicalVolatility: 48.2,
    maxDrawdown: -32.5,
    alpha: -2.1,
    sortino: 1.4,
    var95: -4.2,
    chartData: genSeries(90, 240, 6).map((p, i) => ({
      ...p,
      date: `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
    })),
    position: { shares: 12, avgCost: 210.50, marketValue: 2979.60, todayReturn: -38.10, totalReturn: 453.60 },
    trades: [
      { date: '2026-01-15', type: 'buy', price: 210.50, shares: 5 },
      { date: '2026-02-10', type: 'buy', price: 195.30, shares: 4 },
      { date: '2026-03-05', type: 'sell', price: 240.10, shares: 2 },
      { date: '2026-03-20', type: 'buy', price: 230.00, shares: 5 },
    ]
  },
  AAPL: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    price: 228.50,
    change: 4.08,
    changePct: 1.82,
    bid: 228.45,
    ask: 228.55,
    bidSize: 2400,
    askSize: 1800,
    marketCap: 3.45e12,
    pe: 35.8,
    forwardPe: 31.2,
    eps: 6.38,
    dividendYield: 0.44,
    payoutRatio: 15.2,
    beta: 1.24,
    volume: 52.1e6,
    avgVolume: 58.4e6,
    high52: 260.10,
    low52: 164.08,
    open: 225.10,
    prevClose: 224.42,
    dayHigh: 229.80,
    dayLow: 224.50,
    targetEst1y: 250.00,
    historicalVolatility: 22.4,
    maxDrawdown: -15.8,
    alpha: 2.4,
    sortino: 2.8,
    var95: -1.8,
    chartData: genSeries(90, 220, 3).map((p, i) => ({
      ...p,
      date: `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
    })),
    position: { shares: 42, avgCost: 195.20, marketValue: 9597.00, todayReturn: 171.36, totalReturn: 1398.60 },
    trades: [
      { date: '2026-01-05', type: 'buy', price: 195.20, shares: 10 },
      { date: '2026-02-18', type: 'buy', price: 205.40, shares: 15 },
      { date: '2026-03-10', type: 'buy', price: 215.00, shares: 17 },
    ]
  },
  NVDA: {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    currency: 'USD',
    price: 138.60,
    change: 4.58,
    changePct: 3.42,
    bid: 138.55,
    ask: 138.65,
    bidSize: 5600,
    askSize: 4200,
    marketCap: 3.40e12,
    pe: 55.2,
    forwardPe: 38.5,
    eps: 2.51,
    dividendYield: 0.03,
    payoutRatio: 1.2,
    beta: 1.68,
    volume: 312.5e6,
    avgVolume: 289.1e6,
    high52: 153.13,
    low52: 66.25,
    open: 134.80,
    prevClose: 134.02,
    dayHigh: 139.90,
    dayLow: 134.50,
    targetEst1y: 165.00,
    historicalVolatility: 45.8,
    maxDrawdown: -28.4,
    alpha: 8.2,
    sortino: 3.1,
    var95: -3.5,
    chartData: genSeries(90, 130, 4).map((p, i) => ({
      ...p,
      date: `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
    })),
    position: { shares: 15, avgCost: 112.40, marketValue: 2079.00, todayReturn: 68.70, totalReturn: 393.00 },
    trades: [
      { date: '2026-01-20', type: 'buy', price: 115.00, shares: 5 },
      { date: '2026-02-15', type: 'buy', price: 108.50, shares: 10 },
    ]
  },
  MSFT: {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    currency: 'USD',
    price: 412.90,
    change: 3.84,
    changePct: 0.94,
    bid: 412.85,
    ask: 412.95,
    bidSize: 900,
    askSize: 700,
    marketCap: 3.07e12,
    pe: 38.1,
    forwardPe: 32.8,
    eps: 10.84,
    dividendYield: 0.72,
    payoutRatio: 24.8,
    beta: 0.91,
    volume: 18.7e6,
    avgVolume: 21.3e6,
    high52: 468.35,
    low52: 344.77,
    open: 409.50,
    prevClose: 409.06,
    dayHigh: 414.20,
    dayLow: 408.80,
    targetEst1y: 480.00,
    historicalVolatility: 24.1,
    maxDrawdown: -18.2,
    alpha: 1.8,
    sortino: 2.2,
    var95: -1.5,
    chartData: genSeries(90, 400, 5).map((p, i) => ({
      ...p,
      date: `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
    })),
    position: { shares: 28, avgCost: 380.60, marketValue: 11561.20, todayReturn: 107.52, totalReturn: 904.40 },
    trades: [
      { date: '2026-01-08', type: 'buy', price: 380.60, shares: 10 },
      { date: '2026-02-22', type: 'buy', price: 395.20, shares: 18 },
    ]
  },
  GOOGL: {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    currency: 'USD',
    price: 174.20,
    change: -1.07,
    changePct: -0.61,
    bid: 174.15,
    ask: 174.25,
    bidSize: 1800,
    askSize: 2200,
    marketCap: 2.15e12,
    pe: 24.6,
    forwardPe: 21.4,
    eps: 7.08,
    dividendYield: 0.46,
    payoutRatio: 10.5,
    beta: 1.06,
    volume: 28.4e6,
    avgVolume: 31.2e6,
    high52: 208.70,
    low52: 127.90,
    open: 175.80,
    prevClose: 175.27,
    dayHigh: 176.50,
    dayLow: 173.40,
    targetEst1y: 210.00,
    historicalVolatility: 26.8,
    maxDrawdown: -22.1,
    alpha: 4.1,
    sortino: 2.0,
    var95: -2.1,
    chartData: genSeries(90, 170, 2).map((p, i) => ({
      ...p,
      date: `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
    })),
    position: { shares: 55, avgCost: 145.30, marketValue: 9581.00, todayReturn: -58.85, totalReturn: 1589.50 },
    trades: [
      { date: '2026-01-12', type: 'buy', price: 145.30, shares: 25 },
      { date: '2026-03-01', type: 'buy', price: 155.00, shares: 30 },
    ]
  }
}

export const DEMO_PROFILE = {
  name: 'Савелий',
  username: '@savely_dev',
  bio: 'Начинающий инвестор и разработчик. Собираю долгосрочный портфель из технологических компаний.',
  balance: 128453.72,
  joined: 'Сентябрь 2025',
  city: 'Москва, Россия',
  riskProfile: 'Умеренный',
  stats: {
    totalReturn: 28.45,
    bestTrade: 142.8,
    winRate: 68,
    totalTrades: 47,
  }
}

export const DEMO_MAIN_CHART = Array.from({ length: 90 }, (_, i) => {
  const base = 100000
  const trend = i * 320
  const noise = (Math.random() - 0.4) * 2400
  return {
    date: `2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
    value: Math.round(base + trend + noise),
    volume: Math.round(5000 + Math.random() * 20000)
  }
})