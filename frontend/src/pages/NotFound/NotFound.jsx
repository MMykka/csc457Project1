import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <span className="not-found-code">Error 404</span>
        <h1>Page not found</h1>
        <p className="lead">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn">
          Back to home
        </Link>
      </div>
    </section>
  )
}
