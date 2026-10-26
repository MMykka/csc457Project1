import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItem } from '../../store/itemsSlice.js'
import { formatPrice, getSizes } from '../../utils/shoes.js'
import ShoeImage from '../../components/ShoeImage.jsx'
import Loader from '../../components/Loader.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Icon from '../../components/Icon.jsx'
import './ItemDetails.css'

export default function ItemDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Success message passed by the Add and Edit views, e.g. '"Dune" was added to the store.'
  const flashMessage = location.state?.message
  const dismissFlash = () => navigate(location.pathname, { replace: true })
  const { current, currentStatus, currentError } = useSelector((state) => state.items)

  useEffect(() => {
    dispatch(fetchItem(id))
  }, [id, dispatch])

  // Ignore a shoe left in the store from a previous page until this one has loaded.
  const shoe = current && String(current.id) === id ? current : null

  const renderContent = () => {
    if (currentStatus === 'failed') {
      if (currentError === 'Item not found') {
        return (
          <EmptyState
            title="Shoe not found"
            text={`There is no shoe with ID ${id}. It may have been removed.`}
          >
            <Link to="/items" className="btn btn-primary">
              See all shoes
            </Link>
          </EmptyState>
        )
      }
      return (
        <ErrorMessage
          title="Could not load this shoe"
          message={currentError}
          onRetry={() => dispatch(fetchItem(id))}
        />
      )
    }

    if (!shoe) return <Loader text="Loading shoe…" />

    const { name, brand, category, price, color, inStock } = shoe
    const sizes = getSizes(shoe.sizes)

    return (
      <article className="details">
        <div className="details-media">
          <ShoeImage shoe={shoe} />
        </div>

        <div className="details-info">
          <div className="details-tags">
            {category && <span className="badge">{category}</span>}
            <span className={`badge ${inStock ? 'badge--success' : 'badge--danger'}`}>
              {inStock ? 'In stock' : 'Out of stock'}
            </span>
          </div>

          <p className="details-brand">{brand || 'Unknown brand'}</p>
          <h1>{name || 'Unnamed shoe'}</h1>
          {color && <p className="details-color">{color}</p>}
          <p className="details-price">{formatPrice(price)}</p>

          <div className="details-sizes">
            <h2>Available sizes (US)</h2>
            {sizes.length > 0 ? (
              <ul className="size-list">
                {sizes.map((size) => (
                  <li key={size} className="size-chip">
                    {size}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="details-muted">No sizes listed.</p>
            )}
          </div>

          <dl className="details-facts">
            <div>
              <dt>Brand</dt>
              <dd>{brand || '—'}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{category || '—'}</dd>
            </div>
            <div>
              <dt>Color</dt>
              <dd>{color || '—'}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{inStock ? 'In stock' : 'Out of stock'}</dd>
            </div>
            <div>
              <dt>Sizes</dt>
              <dd>
                {sizes.length} {sizes.length === 1 ? 'size' : 'sizes'}
              </dd>
            </div>
            <div>
              <dt>Product ID</dt>
              <dd>#{shoe.id}</dd>
            </div>
          </dl>

          <div className="details-actions">
            <Link to={`/items/${shoe.id}/edit`} className="btn btn-primary btn-lg">
              <Icon name="edit" size={16} /> Edit shoe
            </Link>
            <Link to={`/items/${shoe.id}/delete`} className="btn btn-danger-ghost btn-lg">
              <Icon name="trash" size={16} /> Delete
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <section className="section item-details">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/items" className="breadcrumb-back">
            <Icon name="back" size={14} /> All shoes
          </Link>
          {shoe && (
            <>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{shoe.name || 'Unnamed shoe'}</span>
            </>
          )}
        </nav>

        {flashMessage && shoe && (
          <div className="alert alert--success flash" role="status">
            <p>{flashMessage}</p>
            <button type="button" className="alert-close" aria-label="Dismiss message" onClick={dismissFlash}>
              ×
            </button>
          </div>
        )}

        {renderContent()}
      </div>
    </section>
  )
}
