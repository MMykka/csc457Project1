import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, fetchItems } from '../../store/itemsSlice.js'
import ItemForm from '../../components/ItemForm.jsx'
import Icon from '../../components/Icon.jsx'
import './AddItem.css'

export default function AddItem() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { list, status } = useSelector((state) => state.items)

  // Load the list (if not loaded yet) so the brand field can suggest existing brands.
  useEffect(() => {
    if (status === 'idle') dispatch(fetchItems())
  }, [status, dispatch])

  const brands = [...new Set(list.map((shoe) => shoe.brand).filter(Boolean))].sort()

  // Sends POST /items. If it fails, unwrap() throws and ItemForm shows the error.
  const handleSubmit = async (shoe) => {
    const created = await dispatch(addItem(shoe)).unwrap()
    navigate(`/items/${created.id}`, {
      state: { message: `"${created.name}" was added to the store.` },
    })
  }

  return (
    <section className="section add-item">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/items" className="breadcrumb-back">
            <Icon name="back" size={14} /> All shoes
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Add a shoe</span>
        </nav>

        <header className="page-header">
          <div>
            <h1>Add a new shoe</h1>
            <p>
              Fill in the details below. Fields marked <span className="required">*</span> are required.
            </p>
          </div>
        </header>

        <ItemForm
          onSubmit={handleSubmit}
          submitLabel="Add shoe"
          submittingLabel="Adding…"
          cancelTo="/items"
          brandOptions={brands}
        />
      </div>
    </section>
  )
}
