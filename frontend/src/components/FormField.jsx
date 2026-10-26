// Wraps one form control with its label, hint and validation error.
// The control itself is passed as children and should use `id`, plus
// aria-describedby={`${id}-error`} so screen readers read the error.
export default function FormField({ id, label, required = false, hint, error, className = '', children }) {
  return (
    <div className={`field${error ? ' field--error' : ''} ${className}`}>
      <label htmlFor={id}>
        {label} {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="field-hint">{hint}</p>
      )}
    </div>
  )
}
