import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems } from '../store/itemsSlice.js'
import Logo from './Logo.jsx'
import './Navbar.css'

const leftLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/items', label: 'Shop all', end: true },
  { to: '/items/new', label: 'Add shoe' },
]

const rightLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

// Transparent over the home hero; turns solid once the page scrolls or on other views.
export default function Navbar({ overHero = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const dispatch = useDispatch()
  const { list, status } = useSelector((state) => state.items)
  const closeMenu = () => setIsOpen(false)

  // Load the catalog once so the counter works on every view, not only after visiting the list.
  useEffect(() => {
    if (status === 'idle') dispatch(fetchItems())
  }, [status, dispatch])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isSolid = !overHero || isScrolled || isOpen
  const catalogCount = status === 'succeeded' ? list.length : '–'

  const renderLinks = (links) =>
    links.map(({ to, label, end }) => (
      <NavLink key={to} to={to} end={end} className="nav-link" onClick={closeMenu}>
        {label}
      </NavLink>
    ))

  return (
    <header className={`navbar${isSolid ? ' navbar--solid' : ''}`}>
      <div className="navbar-inner">
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>

        <nav className="nav-group nav-group--left" aria-label="Shop">
          {renderLinks(leftLinks)}
        </nav>

        <Link to="/" className="brand" aria-label="Stride home" onClick={closeMenu}>
          <Logo />
        </Link>

        <nav className="nav-group nav-group--right" aria-label="Company">
          {renderLinks(rightLinks)}
          <Link to="/items" className="nav-link nav-count" onClick={closeMenu}>
            Catalog {catalogCount}
          </Link>
        </nav>

        <Link to="/items" className="nav-link nav-count nav-count--mobile" onClick={closeMenu}>
          Catalog {catalogCount}
        </Link>
      </div>

      <nav id="nav-menu" className={`nav-menu${isOpen ? ' open' : ''}`} aria-label="Menu">
        {renderLinks([...leftLinks, ...rightLinks])}
      </nav>
    </header>
  )
}
