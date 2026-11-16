import './InfoWidget.css'

export default function InfoWidget({ stock }) {
  return (
    <div className="info-widget-content">
      <div className="iw-header">
        <div className="iw-title-area">
          <span className="iw-ticker">{stock.ticker}</span>
          <span className="iw-name">{stock.name}</span>
        </div>
      </div>

      <div className="iw-grid">
        <div className="iw-stat">
          <span>Текущая цена</span>
          <strong>${stock.price.toFixed(2)}</strong>
        </div>
        <div className="iw-stat">
          <span>Market Cap</span>
          <strong>${(stock.marketCap / 1e9).toFixed(2)}B</strong>
        </div>
        <div className="iw-stat">
          <span>P/E (TTM)</span>
          <strong>{stock.pe.toFixed(1)}</strong>
        </div>
        <div className="iw-stat">
          <span>Forward P/E</span>
          <strong>{stock.forwardPe.toFixed(1)}</strong>
        </div>
        <div className="iw-stat">
          <span>EPS</span>
          <strong>${stock.eps.toFixed(2)}</strong>
        </div>
        <div className="iw-stat">
          <span>Div Yield</span>
          <strong>{stock.dividendYield.toFixed(2)}%</strong>
        </div>
        <div className="iw-stat">
          <span>Beta</span>
          <strong>{stock.beta.toFixed(2)}</strong>
        </div>
        <div className="iw-stat">
          <span>Target Est</span>
          <strong>${stock.targetEst1y.toFixed(2)}</strong>
        </div>
        <div className="iw-stat">
          <span>Max Drawdown</span>
          <strong className="neg">{stock.maxDrawdown.toFixed(1)}%</strong>
        </div>
        <div className="iw-stat">
          <span>Alpha</span>
          <strong className="pos">+{stock.alpha.toFixed(1)}%</strong>
        </div>
        <div className="iw-stat">
          <span>Sortino</span>
          <strong>{stock.sortino.toFixed(2)}</strong>
        </div>
        <div className="iw-stat">
          <span>VaR (95%)</span>
          <strong className="neg">{stock.var95.toFixed(1)}%</strong>
        </div>
      </div>

      <div className="iw-position">
        <h4>Ваша позиция</h4>
        <div className="iw-pos-row">
          <span>Акций</span><strong>{stock.position.shares}</strong>
        </div>
        <div className="iw-pos-row">
          <span>Средняя цена</span><strong>${stock.position.avgCost.toFixed(2)}</strong>
        </div>
        <div className="iw-pos-row">
          <span>Стоимость</span><strong>${stock.position.marketValue.toFixed(2)}</strong>
        </div>
        <div className="iw-pos-row">
          <span>Общий возврат</span>
          <strong className={stock.position.totalReturn >= 0 ? 'pos' : 'neg'}>
            {stock.position.totalReturn >= 0 ? '+' : ''}${stock.position.totalReturn.toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  )
}