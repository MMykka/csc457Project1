import { useId, useState } from 'react'
import { getShoeColor } from '../utils/shoes.js'
import './ShoeImage.css'

// Shows the shoe's photo. If it has no photo (or the file fails to load),
// shows a side-view shoe drawing in the shoe's color instead.
export default function ShoeImage({ shoe, className = '' }) {
  const { id, name, image } = shoe
  const [hasError, setHasError] = useState(false)
  // useId() can contain characters that break url(#id), so keep only safe ones
  const shadowId = `shadow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  if (image && !hasError) {
    return (
      <div className={`shoe-image ${className}`}>
        <img src={image} alt={name || 'Shoe'} loading="lazy" onError={() => setHasError(true)} />
      </div>
    )
  }

  // Alternate gum and dark outsoles so the placeholders don't all look the same
  const outsole = Number(id) % 2 === 0 ? '#3a3632' : '#b08a5a'

  return (
    <div
      className={`shoe-image shoe-image--placeholder ${className}`}
      style={{ '--shoe-color': getShoeColor(id) }}
      role="img"
      aria-label={`${name || 'Shoe'} (photo coming soon)`}
    >
      <svg viewBox="0 0 240 140" aria-hidden="true">
        <defs>
          <filter id={shadowId} x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <ellipse cx="124" cy="132" rx="100" ry="6" fill="#000" opacity="0.55" filter={`url(#${shadowId})`} />
        {/* heel pull loop */}
        <path d="M36 26c-7-12 2-20 9-12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* upper */}
        <path
          d="M32 101 28 40c0-12 6-18 16-20l26-2c6 0 10 4 10 10l2 20c4 10 14 14 26 12l22-2c18-2 30 4 44 14l28 14c12 6 18 10 20 15z"
          fill="currentColor"
        />
        {/* heel counter, toe cap and collar opening */}
        <path d="M32 101 28 40c0-6 2-10 5-13l9 74z" fill="#000" opacity="0.22" />
        <path d="M170 70l30 14c12 6 18 10 20 15h-52c-2-10-2-20 2-29z" fill="#000" opacity="0.16" />
        <path d="M44 21c12-5 26-5 35 1" fill="none" stroke="#1d1d1d" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
        {/* side stripe */}
        <path d="M98 86c24-9 50-9 78 2" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
        {/* laces */}
        <path
          d="M83 34l10-6M85 46l11-8M90 58l11-12M104 58l10-12M118 57l10-11"
          stroke="#f2f2f2"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* midsole */}
        <path
          d="M22 99h202c6 0 8 6 6 12l-2 5c-2 4-6 7-12 7H30c-6 0-10-4-10-10v-10c0-3 1-4 2-4z"
          fill="#ebe6dc"
        />
        <path d="M40 111h170" stroke="#000" strokeWidth="1.5" opacity="0.1" />
        {/* outsole with lugs */}
        <path d="M28 123h188c4 0 6 2 4 5l-2 2H32l-4-3z" fill={outsole} />
        <path d="M40 130v3M58 130v3M76 130v3M94 130v3M112 130v3M130 130v3M148 130v3M166 130v3M184 130v3M202 130v3" stroke={outsole} strokeWidth="5" />
      </svg>
    </div>
  )
}
