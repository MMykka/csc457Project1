import { Link } from 'react-router-dom'
import './CallToAction.css'

// Centered block with a small label, a big heading, a short line of text and one button.
export default function CallToAction({ eyebrow, title, text, to, linkLabel }) {
  return (
    <div className="cta">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      <Link to={to} className="btn">
        {linkLabel}
      </Link>
    </div>
  )
}
