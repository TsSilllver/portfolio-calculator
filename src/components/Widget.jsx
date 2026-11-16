import './Widget.css'

export default function Widget({ title, children, onExpand, onDragStart, onDragOver, onDrop, id }) {
  return (
    <div
      className="widget"
      draggable
      onDragStart={(e) => onDragStart?.(e, id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, id)}
    >
      <div className="widget-header">
        <span className="widget-title">{title}</span>
        <div className="widget-actions">
          {onExpand && (
            <button className="widget-btn" onClick={onExpand} title="Развернуть">⛶</button>
          )}
        </div>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  )
}