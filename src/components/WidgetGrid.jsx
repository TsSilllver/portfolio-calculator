import { useState } from 'react'
import Widget from './Widget'
import './WidgetGrid.css'

export default function WidgetGrid({ widgets }) {
  // widgets — массив объектов { id, title, content, expandable }
  const [order, setOrder] = useState(widgets.map(w => w.id))
  const [draggedId, setDraggedId] = useState(null)

  const handleDragStart = (e, id) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetId) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return
    const newOrder = [...order]
    const dragIdx = newOrder.indexOf(draggedId)
    const targetIdx = newOrder.indexOf(targetId)
    newOrder.splice(dragIdx, 1)
    newOrder.splice(targetIdx, 0, draggedId)
    setOrder(newOrder)
    setDraggedId(null)
  }

  return (
    <div className="widget-grid">
      {order.map(id => {
        const widget = widgets.find(w => w.id === id)
        if (!widget) return null
        return (
          <Widget
            key={id}
            id={id}
            title={widget.title}
            onExpand={widget.onExpand}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {widget.content}
          </Widget>
        )
      })}
    </div>
  )
}