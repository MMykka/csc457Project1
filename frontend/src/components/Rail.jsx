import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Rail.css'

// A horizontal row of cells with a "TITLE  SHOP ALL ... Prev Next" header.
// Pass each cell as a child; they scroll sideways and snap into place.
export default function Rail({ title, linkTo, linkLabel = 'Shop all', children }) {
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const cellCount = Children.count(children)

  const updateButtons = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateButtons()
    window.addEventListener('resize', updateButtons)
    return () => window.removeEventListener('resize', updateButtons)
  }, [updateButtons, cellCount])

  const scrollByPage = (direction) => {
    const track = trackRef.current
    track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="rail" aria-label={title}>
      <div className="rail-header">
        <div className="rail-titles">
          <h2 className="rail-title">{title}</h2>
          {linkTo && (
            <Link to={linkTo} className="rail-link">
              {linkLabel}
            </Link>
          )}
        </div>
        <div className="rail-controls">
          <button type="button" onClick={() => scrollByPage(-1)} disabled={!canPrev}>
            Prev
          </button>
          <button type="button" onClick={() => scrollByPage(1)} disabled={!canNext}>
            Next
          </button>
        </div>
      </div>

      <div className="rail-track" ref={trackRef} onScroll={updateButtons}>
        {Children.map(children, (child) => (
          <div className="rail-cell">{child}</div>
        ))}
      </div>
    </section>
  )
}
