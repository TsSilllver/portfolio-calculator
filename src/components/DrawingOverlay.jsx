import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import './DrawingOverlay.css'

const DrawingOverlay = forwardRef(({ active, tool, color }, ref) => {
  const svgRef = useRef(null)
  const [strokes, setStrokes] = useState([])
  const [currentStroke, setCurrentStroke] = useState(null)

  // Метод для очистки рисунков (вызывается при смене периода)
  useImperativeHandle(ref, () => ({
    clear: () => {
      setStrokes([])
      setCurrentStroke(null)
    }
  }))

  const getCoords = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleMouseDown = (e) => {
    if (!active) return
    const { x, y } = getCoords(e)
    setCurrentStroke({ 
      tool, 
      color, 
      start: { x, y }, 
      end: { x, y }, 
      points: [{ x, y }] // для кисти
    })
  }

  const handleMouseMove = (e) => {
    if (!currentStroke) return
    const { x, y } = getCoords(e)
    
    setCurrentStroke(prev => {
      if (prev.tool === 'pen') {
        return { ...prev, points: [...prev.points, { x, y }], end: { x, y } }
      }
      return { ...prev, end: { x, y } }
    })
  }

  const handleMouseUp = () => {
    if (currentStroke) {
      // Сохраняем только если есть движение
      if (currentStroke.tool === 'pen' && currentStroke.points.length > 1) {
        setStrokes(prev => [...prev, currentStroke])
      } else if (currentStroke.tool !== 'pen') {
        setStrokes(prev => [...prev, currentStroke])
      }
    }
    setCurrentStroke(null) // Отпускаем мышь - сбрасываем
  }

  // Рендер фигуры
  const renderShape = (stroke, isCurrent = false) => {
    const opacity = isCurrent ? 0.7 : 1
    
    if (stroke.tool === 'pen') {
      return (
        <polyline
          points={stroke.points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none" stroke={stroke.color} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" opacity={opacity}
        />
      )
    }
    
    if (stroke.tool === 'line') {
      return (
        <line
          x1={stroke.start.x} y1={stroke.start.y} 
          x2={stroke.end.x} y2={stroke.end.y}
          stroke={stroke.color} strokeWidth="2" opacity={opacity}
        />
      )
    }

    if (stroke.tool === 'rect') {
      const x = Math.min(stroke.start.x, stroke.end.x)
      const y = Math.min(stroke.start.y, stroke.end.y)
      const width = Math.abs(stroke.end.x - stroke.start.x)
      const height = Math.abs(stroke.end.y - stroke.start.y)
      return (
        <rect
          x={x} y={y} width={width} height={height}
          fill="none" stroke={stroke.color} strokeWidth="2" opacity={opacity}
        />
      )
    }
  }

  return (
    <svg
      ref={svgRef}
      className={`drawing-overlay ${active ? 'active' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Если увели мышь за пределы - останавливаем рисование
    >
      {strokes.map((s, i) => <g key={i}>{renderShape(s)}</g>)}
      {currentStroke && renderShape(currentStroke, true)}
    </svg>
  )
})

export default DrawingOverlay