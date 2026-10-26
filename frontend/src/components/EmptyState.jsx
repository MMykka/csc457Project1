import Icon from './Icon.jsx'
import './EmptyState.css'

// Shown when there is nothing to list. Pass an action button or link as children.
export default function EmptyState({ title, text, children }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <Icon name="bag" size={28} />
      </span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {children}
    </div>
  )
}
