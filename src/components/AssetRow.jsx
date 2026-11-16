import Sparkline from './Sparkline'
import './AssetRow.css'

export default function AssetRow({ asset }) {
  const isPositive = asset.change >= 0

  return (
    <div className="asset-row">
      <div className="asset-main">
        <div className="asset-ticker">{asset.ticker}</div>
        <div className="asset-name">{asset.name}</div>
      </div>
      <div className="asset-spark">
        <Sparkline data={asset.sparkline} />
      </div>
      <div className="asset-price">${asset.price.toFixed(2)}</div>
      <div className={`asset-change ${isPositive ? 'pos' : 'neg'}`}>
        {isPositive ? '+' : ''}{asset.change.toFixed(2)}%
      </div>
      <div className="asset-weight">{asset.weight}%</div>
    </div>
  )
}