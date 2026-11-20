import { useState, useMemo, useRef } from 'react'
import { Search, Plus, Pin, PieChart as PieIcon, History as HistoryIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom' // Заглушка, если нет роутера, передай onNavigate из App   react-router-dom
import TerminalGrid from '../components/TerminalGrid'
import StockWidget from '../components/StockWidget'
import InfoWidget from '../components/InfoWidget'
import ChartModal from '../components/ChartModal'
import PieChart from '../components/PieChart'
import { DEMO_STOCK_DATA, DEMO_PORTFOLIO } from '../data/demoData'
import './Home.css'

const ALL_TICKERS = Object.keys(DEMO_STOCK_DATA)
const INITIAL_TICKERS = ['TSLA', 'AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN']

export default function Home({ user, togglePinTicker, onTrade, onNavigate }) {
  const [widgetsData, setWidgetsData] = useState(() => 
    INITIAL_TICKERS.map((t, i) => ({ id: `widget-${t}-${i}`, ticker: t, type: 'chart' }))
  )
  
  const [modalStock, setModalStock] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const gridRef = useRef(null)

  // Считаем количество виджетов для проверки лимита
  const totalWidgets = widgetsData.length;

  const handleAddTicker = (ticker) => {
    if (!DEMO_STOCK_DATA[ticker]) return
    if (totalWidgets >= 6) {
      alert('Максимум 6 окон на экране. Закройте одно, чтобы добавить новое.')
      return
    }
    const exists = widgetsData.some(w => w.ticker === ticker && w.type === 'chart')
    if (!exists) {
      setWidgetsData(prev => [...prev, { id: `widget-${ticker}-${Date.now()}`, ticker, type: 'chart' }])
    }
    setSearchQuery('')
    setShowSearchDropdown(false)
  }

  const handleRemoveWidget = (widgetId) => {
    setWidgetsData(prev => prev.filter(w => w.id !== widgetId))
  }

  const handleShowInfo = (ticker) => {
    setWidgetsData(prev => {
      const sourceIdx = prev.findIndex(w => w.ticker === ticker && w.type === 'chart')
      if (sourceIdx === -1) return prev

      const currentLayout = gridRef.current || {}
      const sourceLayout = currentLayout[prev[sourceIdx].id] || { x: 0, y: 0, w: 1, h: 1 }

      let targetX = sourceLayout.x
      let targetY = sourceLayout.y + 1
      
      if (targetY >= 2) {
        targetY = sourceLayout.y
        targetX = sourceLayout.x + 1
        if (targetX >= 3) {
          targetX = sourceLayout.x - 1
        }
      }

      const isOccupied = Object.values(currentLayout).some(
        pos => pos.x === targetX && pos.y === targetY
      )

      const newId = `info-${ticker}-${Date.now()}`
      const newWidget = { id: newId, ticker, type: 'info' }

      let updatedWidgets = [...prev]
      if (isOccupied) {
        const occupiedId = Object.keys(currentLayout).find(
          id => currentLayout[id].x === targetX && currentLayout[id].y === targetY
        )
        if (occupiedId) {
          updatedWidgets = updatedWidgets.filter(w => w.id !== occupiedId)
        }
      }

      updatedWidgets.push(newWidget)
      return updatedWidgets
    })
  }

  const filteredTickers = useMemo(() => {
    if (!searchQuery) return []
    const query = searchQuery.toLowerCase()
    return ALL_TICKERS.filter(t => {
      const stock = DEMO_STOCK_DATA[t]
      return t.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query)
    })
  }, [searchQuery])

  const widgets = widgetsData.map(w => {
    const stock = DEMO_STOCK_DATA[w.ticker]
    if (!stock) return null

    return {
      id: w.id,
      title: `${stock.ticker} — ${stock.name}`,
      content: w.type === 'chart' ? (
        <StockWidget 
          stock={stock} 
          isPinned={user?.pinnedTickers?.includes(w.ticker) || false}
          onTogglePin={() => togglePinTicker && togglePinTicker(w.ticker)}
          onOpenModal={() => setModalStock(stock)}
        />
      ) : (
        <InfoWidget stock={stock} />
      )
    }
  }).filter(Boolean)

  // Данные для мини-виджетов по краям
  const pieData = DEMO_PORTFOLIO.tickers.map(t => ({ name: t, value: DEMO_PORTFOLIO.weights[t] }))
  
  return (
    <div className="home-page-container">
      
      {/* Левый сайдбар с мини-виджетами */}
      <div className="home-sidebar-left">
         <div className="mini-widget">
           <div className="mini-widget-header">
             <span>Распределение</span>
             <button onClick={() => onNavigate('dashboard')} title="Открыть обзор">
               <PieIcon size={14} />
             </button>
           </div>
           <div className="mini-chart-wrapper">
              <PieChart data={pieData.slice(0, 3)} />
           </div>
         </div>
      </div>

      {/* Центральная часть с сеткой */}
      <div className="home-main-content">
        <div className="home-topbar">
          <div className="home-search-wrapper">
            <div className="home-search">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Поиск акции для добавления..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              />
            </div>
            
            {showSearchDropdown && filteredTickers.length > 0 && (
              <div className="search-dropdown">
                {filteredTickers.map(t => (
                  <button key={t} onClick={() => handleAddTicker(t)}>
                    <span className="sd-ticker">{t}</span>
                    <span className="sd-name">{DEMO_STOCK_DATA[t].name}</span>
                    <div className="sd-add-btn"><Plus size={14} /> На экран</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pinned-tickers">
            {user?.pinnedTickers?.map(ticker => (
              <button 
                key={ticker} 
                className="pinned-chip"
                onClick={() => handleAddTicker(ticker)}
              >
                <Pin size={12} /> {ticker}
              </button>
            ))}
          </div>
        </div>

        <TerminalGrid 
          ref={gridRef}
          widgets={widgets} 
          onRemoveWidget={handleRemoveWidget}
        />
      </div>

      {/* Правый сайдбар с мини-виджетами */}
      <div className="home-sidebar-right">
         <div className="mini-widget">
           <div className="mini-widget-header">
             <span>История</span>
             <button onClick={() => onNavigate('history')} title="Открыть историю">
               <HistoryIcon size={14} />
             </button>
           </div>
           <div className="mini-history-list">
              <div className="mini-history-item">
                <span className="mhi-name">TSLA, AAPL</span>
                <span className="mhi-val pos">+24.5%</span>
              </div>
              <div className="mini-history-item">
                <span className="mhi-name">NVDA, MSFT</span>
                <span className="mhi-val pos">+12.1%</span>
              </div>
              <div className="mini-history-item">
                <span className="mhi-name">GOOGL, AMZN</span>
                <span className="mhi-val neg">-3.4%</span>
              </div>
           </div>
         </div>
      </div>

      {modalStock && (
        <ChartModal 
          stock={modalStock} 
          onClose={() => setModalStock(null)} 
          onShowInfo={() => handleShowInfo(modalStock.ticker)}
          onTrade={onTrade}
        />
      )}
    </div>
  )
}