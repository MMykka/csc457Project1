import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteItem, fetchItem } from '../../store/itemsSlice.js'
import { formatPrice, formatSizeRange } from '../../utils/shoes.js'
import ShoeImage from '../../components/ShoeImage.jsx'
import Loader from '../../components/Loader.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Icon from '../../components/Icon.jsx'
import './DeleteItem.css'

export default function DeleteItem() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current, currentStatus, currentError } = useSelector((state) => state.items)

  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  // Copy of the shoe being deleted, so the card stays on screen while the request finishes.
  const [deletingShoe, setDeletingShoe] = useState(null)

  // GET /items/:id so the user can see exactly what they are about to delete.
  useEffect(() => {
    dispatch(fetchItem(id))
  }, [id, dispatch])

  const loadedShoe = current && String(current.id) === id ? current : null
  const shoe = loadedShoe ?? deletingShoe

  // Sends DELETE /items/:id, then returns to the list with a confirmation message.
  const handleDelete = async () => {
    setDeletingShoe(shoe)
    setIsDeleting(true)
    setDeleteError(null)
    try {
      await dispatch(deleteItem(shoe.id)).unwrap()
      navigate('/items', {
        state: { message: `"${shoe.name || 'The shoe'}" was deleted from the store.` },
      })
    } catch (error) {
      setDeleteError(error.message || 'Something went wrong. Please try again.')
      setIsDeleting(false)
    }
  }

  const renderContent = () => {
    if (!shoe && currentStatus === 'failed') {
      if (currentError === 'Item not found') {
        return (
          <EmptyState
            title="Shoe not found"
            text={`There is no shoe with ID ${id}. It may already have been deleted.`}
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

    const { name, brand, category, price, color, sizes, inStock } = shoe

    return (
      <div className="delete-card" role="alertdialog" aria-labelledby="delete-title" aria-describedby="delete-text">
        <div className="delete-icon" aria-hidden="true">
          <Icon name="trash" size={22} />
        </div>
        <h1 id="delete-title">Delete this shoe?</h1>
        <p id="delete-text" className="delete-text">
          <strong>{name || 'This shoe'}</strong> will be removed from the store. This cannot be undone.
        </p>

        <div className="delete-summary">
          <ShoeImage shoe={shoe} />
          <div className="delete-summary-info">
            <span className="item-card-brand">{brand || 'Unknown brand'}</span>
            <h2>{name || 'Unnamed shoe'}</h2>
            <p>{[color, category].filter(Boolean).join(' · ') || '—'}</p>
            <div className="delete-summary-meta">
              <strong>{formatPrice(price)}</strong>
              <span>{formatSizeRange(sizes)}</span>
              <span className={`badge ${inStock ? 'badge--success' : 'badge--danger'}`}>
                {inStock ? 'In stock' : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>

        {deleteError && (
          <div className="alert alert--error delete-alert" role="alert">
            <p>Could not delete the shoe: {deleteError}</p>
          </div>
        )}

        <div className="delete-actions">
          <Link to={`/items/${shoe.id}`} className="btn btn-lg">
            Cancel, keep it
          </Link>
          <button type="button" className="btn btn-danger btn-lg" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <span className="btn-spinner" aria-hidden="true" />
            ) : (
              <Icon name="trash" size={16} />
            )}
            {isDeleting ? 'Deleting…' : 'Yes, delete shoe'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="section delete-item">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/items" className="breadcrumb-back">
            <Icon name="back" size={14} /> All shoes
          </Link>
          {shoe && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/items/${shoe.id}`} className="breadcrumb-link">
                {shoe.name || 'Unnamed shoe'}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span aria-current="page">Delete</span>
        </nav>

        {renderContent()}
      </div>
    </section>
  )
}
