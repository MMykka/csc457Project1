import './Loader.css'

export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="loader" role="status">
      <span className="loader-spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}
