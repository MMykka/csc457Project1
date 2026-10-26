import { Link } from 'react-router-dom'
import ShoeImage from './ShoeImage.jsx'
import './CategoryCard.css'

// Portrait tile that opens the shoe list filtered to one category.
// Shows the category's cover shoe (its photo, or the drawn placeholder).
export default function CategoryCard({ category, count, cover }) {
  return (
    <Link to={`/items?category=${encodeURIComponent(category)}`} className="category-card">
      <div className="category-card-media">
        <ShoeImage shoe={cover} />
      </div>
      <div className="category-card-text">
        <h3>{category}</h3>
        <span>
          {count} {count === 1 ? 'shoe' : 'shoes'}
        </span>
      </div>
    </Link>
  )
}
