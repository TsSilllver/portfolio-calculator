import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react'
import { X, GripHorizontal } from 'lucide-react'
import './TerminalGrid.css'

const COLS = 3
const ROWS = 2

const TerminalGrid = forwardRef(({ widgets, onRemoveWidget }, ref) => {
  const [layout, setLayout] = useState(() => {
    const initial = {}
    widgets.forEach((w, i) => {
      initial[w.id] = { x: i % COLS, y: Math.floor(i / COLS), w: 1, h: 1 }
    })
    return initial
  })

  const [draggedId, setDraggedId] = useState(null)
  const [resizingId, setResizingId] = useState(null)
  const resizeStartRef = useRef(null)
  const gridRef = useRef(null)
  const pendingRemovalsRef = useRef([])

  // Пробрасываем layout наружу, чтобы Home мог узнать позиции окон
  useImperativeHandle(ref, () => layout)

  useEffect(() => {
    setLayout(prev => {
      const newLayout = { ...prev }
      let changed = false
      widgets.forEach((w, i) => {
        if (!newLayout[w.id]) {
          newLayout[w.id] = { x: i % COLS, y: Math.floor(i / COLS), w: 1, h: 1 }
          changed = true
        }
      })
      const widgetIds = widgets.map(w => w.id)
      Object.keys(newLayout).forEach(id => {
        if (!widgetIds.includes(id)) {
          delete newLayout[id]
          changed = true
        }
      })
      return changed ? newLayout : prev
    })
  }, [widgets])

  const isOverlap = (r1, r2) => {
    return (
      r1.x < r2.x + r2.w &&
      r1.x + r1.w > r2.x &&
      r1.y < r2.y + r2.h &&
      r1.y + r1.h > r2.y
    )
  }

  useEffect(() => {
    if (!resizingId) return

    const handleMouseMove = (e) => {
      if (!resizeStartRef.current || !gridRef.current) return
      
      const start = resizeStartRef.current
      const dx = e.clientX - start.mouseX
      const dy = e.clientY - start.mouseY

      const cellWidth = (gridRef.current.offsetWidth - 32) / COLS
      const cellHeight = (gridRef.current.offsetHeight - 32) / ROWS

      const colDelta = Math.round(dx / cellWidth)
      const rowDelta = Math.round(dy / cellHeight)

      setLayout(prev => {
        const current = prev[resizingId]
        if (!current) return prev

        let newX = start.startX
        let newY = start.startY
        let newW = start.startW
        let newH = start.startH

        if (start.corner.includes('right')) {
          newW = Math.max(1, Math.min(COLS - newX, start.startW + colDelta))
        }
        if (start.corner.includes('left')) {
          const deltaW = start.startW - colDelta
          if (deltaW >= 1 && newX + (start.startW - deltaW) >= 0) {
            newX = start.startX + (start.startW - deltaW)
            newW = deltaW
          }
        }
        if (start.corner.includes('bottom')) {
          newH = Math.max(1, Math.min(ROWS - newY, start.startH + rowDelta))
        }
        if (start.corner.includes('top')) {
          const deltaH = start.startH - rowDelta
          if (deltaH >= 1 && newY + (start.startH - deltaH) >= 0) {
            newY = start.startY + (start.startH - deltaH)
            newH = deltaH
          }
        }

        const newRect = { x: newX, y: newY, w: newW, h: newH }

        // Запоминаем перекрытые окна, но НЕ удаляем
        const overlaps = []
        Object.keys(prev).forEach(id => {
          if (id !== resizingId && isOverlap(newRect, prev[id])) {
            overlaps.push(id)
          }
        })
        pendingRemovalsRef.current = overlaps

        return { ...prev, [resizingId]: newRect }
      })
    }

    const handleMouseUp = () => {
      // Удаляем только при отпускании мыши
      if (pendingRemovalsRef.current.length > 0) {
        pendingRemovalsRef.current.forEach(id => onRemoveWidget(id))
        pendingRemovalsRef.current = []
      }
      setResizingId(null)
      resizeStartRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizingId, onRemoveWidget])

  const startResize = (e, id, corner) => {
    e.preventDefault()
    e.stopPropagation()
    setResizingId(id)
    const current = layout[id]
    if (!current) return
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: current.x,
      startY: current.y,
      startW: current.w,
      startH: current.h,
      corner
    }
  }

  const handleDragStart = (e, id) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver = (e) => e.preventDefault()
  
  const handleDrop = (e, targetId) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return

    setLayout(prev => {
      const newLayout = { ...prev }
      if (!newLayout[draggedId] || !newLayout[targetId]) return prev;
      const temp = newLayout[draggedId]
      newLayout[draggedId] = newLayout[targetId]
      newLayout[targetId] = temp
      return newLayout
    })
    setDraggedId(null)
  }

  return (
    <div className="terminal-grid" ref={gridRef}>
      {widgets.map(widget => {
        const pos = layout[widget.id]
        if (!pos) return null 

        return (
          <div
            key={widget.id}
            className={`terminal-cell ${draggedId === widget.id ? 'dragging' : ''} ${resizingId === widget.id ? 'resizing' : ''}`}
            style={{
              gridColumn: `${pos.x + 1} / span ${pos.w}`,
              gridRow: `${pos.y + 1} / span ${pos.h}`,
              zIndex: resizingId === widget.id ? 50 : 1
            }}
          >
            <div 
              className="terminal-header"
              draggable
              onDragStart={(e) => handleDragStart(e, widget.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, widget.id)}
            >
              <div className="terminal-header-left">
                <GripHorizontal size={14} className="drag-handle" />
                <span className="terminal-title">{widget.title}</span>
              </div>
              <button className="close-btn" onClick={() => onRemoveWidget(widget.id)}>
                <X size={14} />
              </button>
            </div>

            <div className="terminal-body">
              {widget.content}
            </div>

            <div className="resize-handle top-left" onMouseDown={(e) => startResize(e, widget.id, 'top-left')} />
            <div className="resize-handle top" onMouseDown={(e) => startResize(e, widget.id, 'top')} />
            <div className="resize-handle top-right" onMouseDown={(e) => startResize(e, widget.id, 'top-right')} />
            <div className="resize-handle right" onMouseDown={(e) => startResize(e, widget.id, 'right')} />
            <div className="resize-handle bottom-right" onMouseDown={(e) => startResize(e, widget.id, 'bottom-right')} />
            <div className="resize-handle bottom" onMouseDown={(e) => startResize(e, widget.id, 'bottom')} />
            <div className="resize-handle bottom-left" onMouseDown={(e) => startResize(e, widget.id, 'bottom-left')} />
            <div className="resize-handle left" onMouseDown={(e) => startResize(e, widget.id, 'left')} />
          </div>
        )
      })}
    </div>
  )
})

export default TerminalGrid