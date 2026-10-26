import { Link } from 'react-router-dom'
import ShoeImage from './ShoeImage.jsx'
import { formatPrice } from '../utils/shoes.js'
import './ItemCard.css'

// One product cell: tag, photo, name and colorway, price.
// The shoe list shows the View / Edit / Delete actions; the home rails leave them out.
export default function ItemCard({ shoe, showActions = true }) {
  const { id, name, brand, category, price, color, inStock } = shoe

  return (
    <article className="item-card">
      <Link to={`/items/${id}`} className="item-card-link">
        <div className="item-card-tags">
          <span className="badge">{category || 'Shoe'}</span>
          {!inStock && <span className="badge badge--danger">Sold out</span>}
        </div>

        <ShoeImage shoe={shoe} className="item-card-image" />

        <div className="item-card-text">
          <h3 className="item-card-title">{name || 'Unnamed shoe'}</h3>
          <span className="item-card-color">{color || '—'}</span>
        </div>

        <div className="item-card-meta">
          <span className="item-card-price">{formatPrice(price)}</span>
          <span className="item-card-brand">{brand || 'Unknown brand'}</span>
        </div>
      </Link>

      {showActions && (
        <div className="item-card-actions">
          <Link to={`/items/${id}`}>View</Link>
          <Link to={`/items/${id}/edit`}>Edit</Link>
          <Link to={`/items/${id}/delete`} className="item-card-delete">
            Delete
          </Link>
        </div>
      )}
    </article>
  )
}
