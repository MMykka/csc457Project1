import { useState } from 'react'
import './Photo.css'

// A photo that fills its parent. If the file is missing or fails to load, shows a tinted
// placeholder with the path the photo should be saved to.
// `position` sets which part of the photo stays visible when it is cropped, e.g. 'center 70%'.
export default function Photo({ src, alt = '', tone = 'forest', position, className = '' }) {
  const [hasError, setHasError] = useState(false)

  if (src && !hasError) {
    return (
      <div className={`photo ${className}`}>
        <img src={src} alt={alt} style={{ objectPosition: position }} onError={() => setHasError(true)} />
      </div>
    )
  }

  return (
    <div
      className={`photo photo--placeholder photo--${tone} ${className}`}
      role={alt ? 'img' : undefined}
      aria-label={alt ? `${alt} (photo coming soon)` : undefined}
    >
      <span className="photo-hint" aria-hidden="true">
        Photo · {src || 'not set'}
      </span>
    </div>
  )
}
