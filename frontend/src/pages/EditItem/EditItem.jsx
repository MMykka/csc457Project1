import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItem, fetchItems, updateItem } from '../../store/itemsSlice.js'
import ItemForm, { toFormValues } from '../../components/ItemForm.jsx'
import Loader from '../../components/Loader.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Icon from '../../components/Icon.jsx'
import './EditItem.css'

export default function EditItem() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { list, status, current, currentStatus, currentError } = useSelector((state) => state.items)

  // GET /items/:id to fill the form with the shoe's current values.
  useEffect(() => {
    dispatch(fetchItem(id))
  }, [id, dispatch])

  // Load the list (if not loaded yet) so the brand field can suggest existing brands.
  useEffect(() => {
    if (status === 'idle') dispatch(fetchItems())
  }, [status, dispatch])

  // Ignore a shoe left in the store from a previous page until this one has loaded.
  const shoe = current && String(current.id) === id ? current : null
  const brands = [...new Set(list.map((item) => item.brand).filter(Boolean))].sort()

  // Sends PUT /items/:id. If it fails, unwrap() throws and ItemForm shows the error.
  const handleSubmit = async (changes) => {
    const updated = await dispatch(updateItem({ id: shoe.id, ...changes })).unwrap()
    navigate(`/items/${updated.id}`, {
      state: { message: `Changes to "${updated.name}" were saved.` },
    })
  }

  const renderContent = () => {
    if (currentStatus === 'failed') {
      if (currentError === 'Item not found') {
        return (
          <EmptyState
            title="Shoe not found"
            text={`There is no shoe with ID ${id}, so there is nothing to edit.`}
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

    return (
      <>
        <header className="page-header">
          <div>
            <h1>Edit shoe</h1>
            <p>
              Update the details of <strong>{shoe.name || 'this shoe'}</strong> and save your changes.
            </p>
          </div>
        </header>

        {/* key makes the form start fresh if a different shoe is loaded */}
        <ItemForm
          key={shoe.id}
          initialValues={toFormValues(shoe)}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          submittingLabel="Saving…"
          cancelTo={`/items/${shoe.id}`}
          brandOptions={brands}
          previewId={shoe.id}
        />
      </>
    )
  }

  return (
    <section className="section edit-item">
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
          <span aria-current="page">Edit</span>
        </nav>

        {renderContent()}
      </div>
    </section>
  )
}
