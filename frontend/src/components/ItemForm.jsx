import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from './FormField.jsx'
import ShoeImage from './ShoeImage.jsx'
import { formatPrice, formatSizeRange, getSizes } from '../utils/shoes.js'
import './ItemForm.css'

const CATEGORIES = ['Running', 'Trail', 'Hiking', 'Winter', 'Casual', 'Lifestyle', 'Training', 'Basketball', 'Skate', 'Formal', 'Sandals']

// US sizes 5 to 13 in half sizes
const SIZE_OPTIONS = Array.from({ length: 17 }, (_, index) => 5 + index * 0.5)

const EMPTY_VALUES = {
  name: '',
  brand: '',
  category: '',
  price: '',
  color: '',
  sizes: [],
  inStock: true,
  image: '',
}

// Converts a shoe from the API into form values (the form keeps price as text).
export function toFormValues(shoe) {
  return {
    name: shoe.name ?? '',
    brand: shoe.brand ?? '',
    category: shoe.category ?? '',
    price: shoe.price === undefined || shoe.price === null ? '' : String(shoe.price),
    color: shoe.color ?? '',
    sizes: getSizes(shoe.sizes),
    inStock: Boolean(shoe.inStock),
    image: shoe.image ?? '',
  }
}

function validate(values) {
  const errors = {}
  const price = Number(values.price)
  const image = values.image.trim()

  if (!values.name.trim()) errors.name = 'Enter the shoe name'
  else if (values.name.trim().length > 80) errors.name = 'Keep the name under 80 characters'

  if (!values.brand.trim()) errors.brand = 'Enter the brand'

  if (!values.category) errors.category = 'Choose a category'

  if (values.price === '') errors.price = 'Enter a price'
  else if (!Number.isFinite(price) || price <= 0) errors.price = 'Price must be a number greater than 0'
  else if (price > 10000) errors.price = 'Price must be $10,000 or less'

  if (!values.color.trim()) errors.color = 'Enter the color'

  if (values.sizes.length === 0) errors.sizes = 'Pick at least one size'

  if (image && !/^(\/|https?:\/\/)/.test(image)) {
    errors.image = 'Use a path starting with / or a link starting with http:// or https://'
  }

  return errors
}

// Converts form values into the shoe object sent to the API (with real number/boolean/array types).
function toShoe(values) {
  return {
    name: values.name.trim(),
    brand: values.brand.trim(),
    category: values.category,
    price: Math.round(Number(values.price) * 100) / 100,
    color: values.color.trim(),
    sizes: [...values.sizes].sort((a, b) => a - b),
    inStock: values.inStock,
    image: values.image.trim(),
  }
}

export default function ItemForm({
  initialValues = EMPTY_VALUES,
  onSubmit,
  submitLabel,
  submittingLabel,
  cancelTo,
  brandOptions = [],
  previewId = 0,
}) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const errors = validate(values)
  // Show a field's error only after the user has left it or tried to submit.
  const errorFor = (field) => (touched[field] || submitted ? errors[field] : undefined)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const setSizes = (sizes) => {
    setValues((prev) => ({ ...prev, sizes: [...sizes].sort((a, b) => a - b) }))
    setTouched((prev) => ({ ...prev, sizes: true }))
  }

  const toggleSize = (size) => {
    const isSelected = values.sizes.includes(size)
    setSizes(isSelected ? values.sizes.filter((s) => s !== size) : [...values.sizes, size])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(true)

    const firstError = Object.keys(errors)[0]
    if (firstError) {
      document.getElementById(`shoe-${firstError}`)?.focus()
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await onSubmit(toShoe(values))
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Keep sizes or a category that came from the API even if they are not in the default lists.
  const sizeChoices = [...new Set([...SIZE_OPTIONS, ...values.sizes])].sort((a, b) => a - b)
  const categoryChoices = values.category && !CATEGORIES.includes(values.category)
    ? [...CATEGORIES, values.category]
    : CATEGORIES

  const previewShoe = {
    id: previewId,
    name: values.name.trim() || 'Shoe name',
    image: values.image.trim(),
  }

  // Props shared by the text inputs
  const inputProps = (name) => ({
    id: `shoe-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': Boolean(errorFor(name)),
    'aria-describedby': errorFor(name) ? `shoe-${name}-error` : undefined,
  })

  return (
    <form className="item-form" onSubmit={handleSubmit} noValidate>
      <div className="form-card">
        {submitError && (
          <div className="alert alert--error form-alert" role="alert">
            <p>Could not save the shoe: {submitError}</p>
          </div>
        )}

        <div className="form-grid">
          <FormField id="shoe-name" label="Name" required error={errorFor('name')} className="span-2">
            <input {...inputProps('name')} type="text" placeholder="e.g. Alne BUGrip" maxLength={80} />
          </FormField>

          <FormField id="shoe-brand" label="Brand" required error={errorFor('brand')}>
            <input {...inputProps('brand')} type="text" placeholder="e.g. Icebug" list="brand-options" />
          </FormField>
          <datalist id="brand-options">
            {brandOptions.map((brand) => (
              <option key={brand} value={brand} />
            ))}
          </datalist>

          <FormField id="shoe-category" label="Category" required error={errorFor('category')}>
            <select {...inputProps('category')}>
              <option value="">Select a category</option>
              {categoryChoices.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="shoe-price" label="Price (USD)" required error={errorFor('price')}>
            <div className="input-prefix">
              <span aria-hidden="true">$</span>
              <input {...inputProps('price')} type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" />
            </div>
          </FormField>

          <FormField id="shoe-color" label="Color" required error={errorFor('color')}>
            <input {...inputProps('color')} type="text" placeholder="e.g. Black/White" />
          </FormField>

          <fieldset
            id="shoe-sizes"
            tabIndex={-1}
            className={`field span-2 size-fieldset${errorFor('sizes') ? ' field--error' : ''}`}
            aria-describedby={errorFor('sizes') ? 'shoe-sizes-error' : undefined}
          >
            <legend>
              Sizes (US) <span className="required" aria-hidden="true">*</span>
            </legend>
            <div className="size-tools">
              <span className="field-hint">
                {values.sizes.length} selected
              </span>
              <button type="button" className="link-button" onClick={() => setSizes(SIZE_OPTIONS)}>
                Select all
              </button>
              <button type="button" className="link-button" onClick={() => setSizes([])}>
                Clear
              </button>
            </div>
            <div className="size-picker">
              {sizeChoices.map((size) => (
                <button
                  key={size}
                  type="button"
                  className="size-option"
                  aria-pressed={values.sizes.includes(size)}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {errorFor('sizes') && (
              <p id="shoe-sizes-error" className="field-error" role="alert">
                {errorFor('sizes')}
              </p>
            )}
          </fieldset>

          <FormField
            id="shoe-image"
            label="Image"
            error={errorFor('image')}
            hint="Optional. A path like /images/shoes/alne-bugrip-black.jpg or a full https:// link. Leave empty to use the placeholder."
            className="span-2"
          >
            <input {...inputProps('image')} type="text" placeholder="/images/shoes/alne-bugrip-black.jpg" />
          </FormField>

          <label className="switch span-2">
            <input
              id="shoe-inStock"
              type="checkbox"
              name="inStock"
              checked={values.inStock}
              onChange={handleChange}
            />
            <span>
              <strong>In stock</strong>
              <span className="field-hint">
                {values.inStock ? 'Customers can buy this shoe now.' : 'Shown as out of stock.'}
              </span>
            </span>
          </label>
        </div>

        <div className="form-actions">
          <Link to={cancelTo} className="btn btn-lg">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
            {isSubmitting && <span className="btn-spinner" aria-hidden="true" />}
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </div>

      <aside className="form-preview" aria-label="Preview">
        <span className="form-preview-label">Preview</span>
        <div className="form-preview-card">
          {/* key resets the image's error state whenever the path changes */}
          <ShoeImage key={previewShoe.image} shoe={previewShoe} />
          <div className="form-preview-body">
            <div className="form-preview-top">
              <span className="item-card-brand">{values.brand.trim() || 'Brand'}</span>
              {values.category && <span className="badge">{values.category}</span>}
            </div>
            <h3>{previewShoe.name}</h3>
            <p className="form-preview-color">{values.color.trim() || 'Color'}</p>
            <div className="form-preview-meta">
              <strong>{formatPrice(values.price === '' ? 0 : values.price)}</strong>
              <span>{formatSizeRange(values.sizes)}</span>
            </div>
            <span className={`badge ${values.inStock ? 'badge--success' : 'badge--danger'}`}>
              {values.inStock ? 'In stock' : 'Out of stock'}
            </span>
          </div>
        </div>
      </aside>
    </form>
  )
}
