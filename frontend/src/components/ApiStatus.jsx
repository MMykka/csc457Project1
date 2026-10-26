import './ApiStatus.css'

// Shows whether the frontend could reach the backend API.
export default function ApiStatus({ status, count, error, onRetry }) {
  if (status === 'failed') {
    return (
      <div className="api-status api-status--failed" role="alert">
        <span className="api-status-dot" aria-hidden="true" />
        <span>{error}</span>
        <button type="button" className="btn btn-sm btn-secondary" onClick={onRetry}>
          Retry
        </button>
      </div>
    )
  }

  const isConnected = status === 'succeeded'

  return (
    <div
      className={`api-status ${isConnected ? 'api-status--ok' : 'api-status--loading'}`}
      role="status"
    >
      <span className="api-status-dot" aria-hidden="true" />
      {isConnected
        ? `Connected to the API · ${count} ${count === 1 ? 'shoe' : 'shoes'}`
        : 'Connecting to the API…'}
    </div>
  )
}
