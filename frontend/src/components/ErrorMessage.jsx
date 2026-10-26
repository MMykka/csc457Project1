import './ErrorMessage.css'

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
