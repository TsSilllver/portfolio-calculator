import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react'
import { X, GripHorizontal } from 'lucide-react'
import './TerminalGrid.css'

const GAP = 12
const PAD = 16

const isOverlap = (r1, r2) => (
  r1.x < r2.x + r2.w && r1.x + r1.w > r2.x &&
  r1.y < r2.y + r2.h && r1.y + r1.h > r2.y
)

function findFreeSlot(layout, cols, rows) {
  const occupied = new Set()
  Object.values(layout).forEach(p => {
    for (let dx = 0; dx < p.w; dx++)
      for (let dy = 0; dy < p.h; dy++)
        occupied.add(`${p.x + dx},${p.y + dy}`)
  })
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!occupied.has(`${x},${y}`)) return { x, y, w: 1, h: 1 }
    }
  }
  return null
}

const TerminalGrid = forwardRef(({ widgets, onRemoveWidget }, ref) => {
  const [gridConfig, setGridConfig] = useState({ cols: 3, rows: 2 })
  
  // Автоматическое переключение на 6 в столбик на мобильных
  useEffect(() => {
    const updateConfig = () => {
      if (window.innerWidth < 768) {
        setGridConfig({ cols: 1, rows: Math.max(6, widgets.length) })
      } else {
        setGridConfig({ cols: 3, rows: 2 })
      }
    }
    updateConfig()
    window.addEventListener('resize', updateConfig)
    return () => window.removeEventListener('resize', updateConfig)
  }, [widgets.length])

  const [layout, setLayout] = useState(() => {
    const initial = {}
    widgets.forEach((w) => {
      const free = findFreeSlot(initial, gridConfig.cols, gridConfig.rows)
      initial[w.id] = free || { x: 0, y: 0, w: 1, h: 1 }
    })
    return initial
  })

  const [draggedId, setDraggedId] = useState(null)
  const [ghost, setGhost] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const [resizingId, setResizingId] = useState(null)

  const gridRef = useRef(null)
  const dragRef = useRef(null)
  const resizeStartRef = useRef(null)
  const pendingRemovalsRef = useRef([])

  useImperativeHandle(ref, () => layout)

  useEffect(() => {
    setLayout(prev => {
      const next = { ...prev }
      let changed = false
      widgets.forEach(w => {
        if (!next[w.id]) {
          const free = findFreeSlot(next, gridConfig.cols, gridConfig.rows)
          next[w.id] = free || { x: 0, y: 0, w: 1, h: 1 }
          changed = true
        }
      })
      const ids = widgets.map(w => w.id)
      Object.keys(next).forEach(id => { if (!ids.includes(id)) { delete next[id]; changed = true } })
      return changed ? next : prev
    })
  }, [widgets, gridConfig])

  const metrics = () => {
    const rect = gridRef.current.getBoundingClientRect()
    const cellW = (rect.width - 2 * PAD - (gridConfig.cols - 1) * GAP) / gridConfig.cols
    const cellH = (rect.height - 2 * PAD - (gridConfig.rows - 1) * GAP) / gridConfig.rows
    return { rect, cellW, cellH }
  }

  const cellAt = (cx, cy) => {
    const { rect, cellW, cellH } = metrics()
    let col = Math.floor((cx - rect.left - PAD) / (cellW + GAP))
    let row = Math.floor((cy - rect.top - PAD) / (cellH + GAP))
    col = Math.max(0, Math.min(gridConfig.cols - 1, col))
    row = Math.max(0, Math.min(gridConfig.rows - 1, row))
    const point = { x: col, y: row, w: 1, h: 1 }
    let occupiedId = null
    Object.keys(layout).forEach(id => { if (isOverlap(point, layout[id])) occupiedId = id })
    return { col, row, occupiedId }
  }

  // ---------- DRAG ----------
  const startDrag = (e, id) => {
    if (e.button !== 0) return
    if (e.target.closest('.close-btn') || e.target.closest('.resize-handle')) return
    const pos = layout[id]
    if (!pos) return
    const { rect, cellW, cellH } = metrics()
    dragRef.current = {
      id,
      offX: e.clientX - (rect.left + PAD + pos.x * (cellW + GAP)),
      offY: e.clientY - (rect.top + PAD + pos.y * (cellH + GAP)),
      winW: cellW * pos.w,
      winH: cellH * pos.h,
    }
    setDraggedId(id)
    setGhost({ x: e.clientX - dragRef.current.offX, y: e.clientY - dragRef.current.offY, w: dragRef.current.winW, h: dragRef.current.winH })
    e.preventDefault()
  }

  useEffect(() => {
    if (!draggedId) return
    const move = (e) => {
      const d = dragRef.current
      if (!d) return
      setGhost(g => g && { ...g, x: e.clientX - d.offX, y: e.clientY - d.offY })
      const { col, row, occupiedId } = cellAt(e.clientX, e.clientY)
      const cur = layout[draggedId]
      if (!cur) return
      if (occupiedId && occupiedId !== draggedId) { setDropTarget(null); return }
      const tx = Math.min(col, gridConfig.cols - cur.w)
      const ty = Math.min(row, gridConfig.rows - cur.h)
      const rectT = { x: tx, y: ty, w: cur.w, h: cur.h }
      let clash = false
      Object.keys(layout).forEach(id => { if (id !== draggedId && isOverlap(rectT, layout[id])) clash = true })
      setDropTarget(clash ? null : rectT)
    }
    const up = (e) => {
      const { occupiedId } = cellAt(e.clientX, e.clientY)
      const cur = layout[draggedId]
      if (cur) {
        if (occupiedId && occupiedId !== draggedId) {
          setLayout(prev => {
            const n = { ...prev }
            const a = n[draggedId], b = n[occupiedId]
            n[draggedId] = b; n[occupiedId] = a
            return n
          })
        } else if (dropTarget) {
          setLayout(prev => ({ ...prev, [draggedId]: { ...prev[draggedId], x: dropTarget.x, y: dropTarget.y } }))
        }
      }
      setDraggedId(null); setGhost(null); setDropTarget(null); dragRef.current = null
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
  }, [draggedId, dropTarget, layout, gridConfig])

  // ---------- RESIZE (Математически точная модель для всех 8 направлений) ----------
  useEffect(() => {
    if (!resizingId) return
    const move = (e) => {
      const start = resizeStartRef.current
      if (!start) return
      const { cellW, cellH } = metrics()
      const colDelta = Math.round((e.clientX - start.mouseX) / (cellW + GAP))
      const rowDelta = Math.round((e.clientY - start.mouseY) / (cellH + GAP))

      setLayout(prev => {
        const c = prev[resizingId]; if (!c) return prev
        let x = start.startX
        let y = start.startY
        let w = start.startW
        let h = start.startH

        // Вправо
        if (start.corner.includes('right')) {
          const maxRight = gridConfig.cols - start.startX - start.startW
          const shift = Math.max(0, Math.min(colDelta, maxRight))
          w = start.startW + shift
        }
        // Влево
        if (start.corner.includes('left')) {
          const maxLeft = start.startW - 1
          const shift = Math.min(0, Math.max(colDelta, -maxLeft))
          x = Math.max(0, start.startX + shift)
          w = start.startW - (x - start.startX)
        }
        // Вниз
        if (start.corner.includes('bottom')) {
          const maxBottom = gridConfig.rows - start.startY - start.startH
          const shift = Math.max(0, Math.min(rowDelta, maxBottom))
          h = start.startH + shift
        }
        // Вверх
        if (start.corner.includes('top')) {
          const maxTop = start.startH - 1
          const shift = Math.min(0, Math.max(rowDelta, -maxTop))
          y = Math.max(0, start.startY + shift)
          h = start.startH - (y - start.startY)
        }

        const nr = { x, y, w, h }
        const rem = []
        Object.keys(prev).forEach(id => { 
          if (id !== resizingId && isOverlap(nr, prev[id])) rem.push(id) 
        })
        pendingRemovalsRef.current = rem
        return { ...prev, [resizingId]: nr }
      })
    }
    const up = () => {
      if (pendingRemovalsRef.current.length) {
        pendingRemovalsRef.current.forEach(id => onRemoveWidget(id)); pendingRemovalsRef.current = []
      }
      setResizingId(null); resizeStartRef.current = null
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
  }, [resizingId, onRemoveWidget, gridConfig])

  const startResize = (e, id, corner) => {
    e.preventDefault(); e.stopPropagation()
    const c = layout[id]; if (!c) return
    resizeStartRef.current = { mouseX: e.clientX, mouseY: e.clientY, startX: c.x, startY: c.y, startW: c.w, startH: c.h, corner }
    setResizingId(id)
  }

  return (
    <div className="terminal-grid" ref={gridRef}>
      {dropTarget && (
        <div className="drop-target-overlay" style={{
          gridColumn: `${dropTarget.x + 1} / span ${dropTarget.w}`,
          gridRow: `${dropTarget.y + 1} / span ${dropTarget.h}`,
        }} />
      )}

      {widgets.map(widget => {
        const pos = layout[widget.id]; if (!pos) return null
        const isDragging = draggedId === widget.id
        const style = isDragging && ghost
          ? { position: 'fixed', left: ghost.x, top: ghost.y, width: ghost.w, height: ghost.h, zIndex: 1000, margin: 0 }
          : { gridColumn: `${pos.x + 1} / span ${pos.w}`, gridRow: `${pos.y + 1} / span ${pos.h}`, zIndex: resizingId === widget.id ? 50 : 1 }

        return (
          <div key={widget.id} className={`terminal-cell ${isDragging ? 'dragging' : ''} ${resizingId === widget.id ? 'resizing' : ''}`} style={style}>
            <div className="terminal-header" onMouseDown={(e) => startDrag(e, widget.id)}>
              <div className="terminal-header-left">
                <GripHorizontal size={14} className="drag-handle" />
                <span className="terminal-title">{widget.title}</span>
              </div>
              <button className="close-btn" onMouseDown={e => e.stopPropagation()} onClick={() => onRemoveWidget(widget.id)}><X size={14} /></button>
            </div>
            <div className="terminal-body">{widget.content}</div>
            {['top','top-right','right','bottom-right','bottom','bottom-left','left','top-left'].map(c => (
              <div key={c} className={`resize-handle ${c}`} onMouseDown={(e) => startResize(e, widget.id, c)} />
            ))}
          </div>
        )
      })}
    </div>
  )
})

export default TerminalGrid