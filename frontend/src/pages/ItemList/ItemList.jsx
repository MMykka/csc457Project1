import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems } from '../../store/itemsSlice.js'
import ItemCard from '../../components/ItemCard.jsx'
import Loader from '../../components/Loader.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Icon from '../../components/Icon.jsx'
import './ItemList.css'

export default function ItemList() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { list, status, error } = useSelector((state) => state.items)

  // Message passed by the Delete view, e.g. '"Old Skool" was deleted from the store.'
  const flashMessage = location.state?.message
  const dismissFlash = () => navigate(location.pathname, { replace: true })

  const [search, setSearch] = useState('')
  const [stock, setStock] = useState('all')

  // The category lives in the URL (?category=Running) so the home page can link to a filtered list.
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'
  const setCategory = (value) =>
    setSearchParams(value === 'all' ? {} : { category: value }, { replace: true })

  // Always reload when the page opens so the list matches the server.
  useEffect(() => {
    dispatch(fetchItems())
  }, [dispatch])

  const categories = [...new Set(list.map((shoe) => shoe.category).filter(Boolean))].sort()
  // Keep a category from the URL in the menu even if no shoe has it any more.
  if (category !== 'all' && !categories.includes(category)) categories.push(category)
  const query = search.trim().toLowerCase()

  const filteredShoes = list.filter((shoe) => {
    const text = `${shoe.name ?? ''} ${shoe.brand ?? ''} ${shoe.color ?? ''}`.toLowerCase()
    const matchesText = !query || text.includes(query)
    const matchesCategory = category === 'all' || shoe.category === category
    const matchesStock = stock === 'all' || (stock === 'in' ? shoe.inStock : !shoe.inStock)
    return matchesText && matchesCategory && matchesStock
  })

  const hasFilters = query !== '' || category !== 'all' || stock !== 'all'

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setStock('all')
  }

  const renderContent = () => {
    if (status === 'failed') {
      return (
        <ErrorMessage
          title="Could not load shoes"
          message={error}
          onRetry={() => dispatch(fetchItems())}
        />
      )
    }

    // Show the spinner only on the first load; later reloads keep the current list on screen.
    if (list.length === 0 && status !== 'succeeded') {
      return <Loader text="Loading shoes…" />
    }

    if (list.length === 0) {
      return (
        <EmptyState title="No shoes yet" text="The store is empty. Add the first pair to get started.">
          <Link to="/items/new" className="btn btn-primary">
            <Icon name="plus" size={18} /> Add a shoe
          </Link>
        </EmptyState>
      )
    }

    if (filteredShoes.length === 0) {
      return (
        <EmptyState title="No matching shoes" text="Try a different search or clear the filters.">
          <button type="button" className="btn btn-secondary" onClick={clearFilters}>
            Clear filters
          </button>
        </EmptyState>
      )
    }

    return (
      <div className="item-grid">
        {filteredShoes.map((shoe) => (
          <ItemCard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    )
  }

  return (
    <section className="item-list">
      <div className="item-list-head">
        <header className="page-header">
          <div>
            <span className="eyebrow">Shop</span>
            <h1>{category === 'all' ? 'All shoes' : category}</h1>
            <p>Browse the collection, open a pair for details, or edit and remove entries.</p>
          </div>
          <Link to="/items/new" className="btn btn-lg">
            <Icon name="plus" size={16} /> Add a shoe
          </Link>
        </header>

        {flashMessage && (
          <div className="alert alert--success flash" role="status">
            <p>{flashMessage}</p>
            <button type="button" className="alert-close" aria-label="Dismiss message" onClick={dismissFlash}>
              ×
            </button>
          </div>
        )}
      </div>

      {list.length > 0 && status !== 'failed' && (
        <div className="toolbar">
          <div className="field field--search">
            <label htmlFor="search">Search</label>
            <div className="search-input">
              <Icon name="search" size={18} />
              <input
                id="search"
                type="search"
                placeholder="Name, brand or color"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="stock">Availability</label>
            <select id="stock" value={stock} onChange={(event) => setStock(event.target.value)}>
              <option value="all">All</option>
              <option value="in">In stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>

          <p className="toolbar-count" aria-live="polite">
            {filteredShoes.length} of {list.length} {list.length === 1 ? 'shoe' : 'shoes'}
            {hasFilters && (
              <button type="button" className="link-button" onClick={clearFilters}>
                Clear
              </button>
            )}
          </p>
        </div>
      )}

      <div className="item-list-body">{renderContent()}</div>
    </section>
  )
}
