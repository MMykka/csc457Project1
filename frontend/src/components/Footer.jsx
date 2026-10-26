import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems } from '../store/itemsSlice.js'
import ApiStatus from './ApiStatus.jsx'
import Logo from './Logo.jsx'
import './Footer.css'

const columns = [
  {
    title: 'Shop',
    links: [
      { to: '/items', label: 'All shoes' },
      { to: '/items?category=Winter', label: 'Winter' },
      { to: '/items?category=Running', label: 'Running' },
      { to: '/items/new', label: 'Add a shoe' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/contact', label: 'Contact us' },
    ],
  },
]

export default function Footer() {
  const dispatch = useDispatch()
  const { list, status, error } = useSelector((state) => state.items)

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-intro">
          <Logo />
          <p>Shoes for ice, trail and everyday walking, fitted by people who wear them. On Market Street since 2014.</p>
        </div>

        {columns.map(({ title, links }) => (
          <nav key={title} className="footer-col" aria-label={title}>
            <span className="footer-title">{title}</span>
            {links.map(({ to, label }) => (
              <Link key={label} to={to}>
                {label}
              </Link>
            ))}
          </nav>
        ))}

        <div className="footer-col">
          <span className="footer-title">Store</span>
          <span>120 Market Street, Springfield</span>
          <span>Mon–Sat, 10:00–19:00</span>
          <span>hello@stride-shoes.com</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Stride · CSC457 Project 1</span>
        <ApiStatus
          status={status}
          count={list.length}
          error={error}
          onRetry={() => dispatch(fetchItems())}
        />
      </div>
    </footer>
  )
}
