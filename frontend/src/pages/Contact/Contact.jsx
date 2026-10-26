import { useState } from 'react'
import { Link } from 'react-router-dom'
import { media } from '../../utils/media.js'
import HeroBanner from '../../components/HeroBanner.jsx'
import FormField from '../../components/FormField.jsx'
import Icon from '../../components/Icon.jsx'
import './Contact.css'

const SUBJECTS = ['Question about a shoe', 'Sizing help', 'Request a brand or model', 'Feedback', 'Other']
const MESSAGE_MIN = 10
const MESSAGE_MAX = 1000

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' }

const contactDetails = [
  { icon: 'mail', label: 'Email', value: 'hello@stride-shoes.com' },
  { icon: 'phone', label: 'Phone', value: '+1 (555) 014-2290' },
  { icon: 'pin', label: 'Store', value: '120 Market Street, Springfield' },
  { icon: 'clock', label: 'Hours', value: 'Mon–Sat, 10:00–19:00' },
]

function validate(form) {
  const errors = {}
  const message = form.message.trim()

  if (!form.name.trim()) errors.name = 'Name is required'
  else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'

  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Enter a valid email, like name@example.com'

  if (!form.subject) errors.subject = 'Choose what your message is about'

  if (!message) errors.message = 'Message is required'
  else if (message.length < MESSAGE_MIN) errors.message = `Message must be at least ${MESSAGE_MIN} characters`
  else if (message.length > MESSAGE_MAX) errors.message = `Message must be ${MESSAGE_MAX} characters or less`

  return errors
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sentTo, setSentTo] = useState(null) // { name, email } after a successful send

  const errors = validate(form)
  // Show a field's error only after the user has left it or tried to submit.
  const errorFor = (field) => (touched[field] || submitted ? errors[field] : undefined)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)

    const firstError = Object.keys(errors)[0]
    if (firstError) {
      document.getElementById(`contact-${firstError}`)?.focus()
      return
    }

    // The Web API only manages shoes, so the message is not sent to a server.
    // A short delay stands in for the request so the "Sending…" state is visible.
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setSentTo({ name: form.name.trim(), email: form.email.trim() })
    }, 800)
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setTouched({})
    setSubmitted(false)
    setSentTo(null)
  }

  // Props shared by every input
  const inputProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    disabled: isSending,
    'aria-invalid': Boolean(errorFor(name)),
    'aria-describedby': errorFor(name) ? `contact-${name}-error` : undefined,
  })

  const messageLength = form.message.trim().length

  return (
    <div className="contact">
      <HeroBanner
        eyebrow="Contact us"
        title="We’d love to hear from you."
        image={media.contact}
        imageAlt="Runners on a forest trail"
        imagePosition="center 62%"
        tone="forest"
        size="medium"
      />

      <section className="contact-hero">
        <div className="container">
          <p className="lead">
            Questions about a shoe, help with sizing, or a brand you want us to carry? Send us a
            message and we will get back to you within one business day.
          </p>
        </div>
      </section>

      <section className="section contact-body">
        <div className="container contact-layout">
          <aside className="contact-info" aria-label="Contact details">
            <h2>Other ways to reach us</h2>
            <ul className="contact-list">
              {contactDetails.map(({ icon, label, value }) => (
                <li key={label}>
                  <span className="contact-icon">
                    <Icon name={icon} size={18} />
                  </span>
                  <span>
                    <span className="contact-label">{label}</span>
                    <span className="contact-value">{value}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="contact-note">
              Looking for a specific pair? <Link to="/items">Browse the catalog</Link> first. Every
              shoe lists its sizes and stock.
            </p>
          </aside>

          <div className="contact-card">
            {sentTo ? (
              <div className="contact-success" role="status">
                <span className="contact-success-icon" aria-hidden="true">
                  <Icon name="check" size={26} />
                </span>
                <h2>Thanks, {sentTo.name}!</h2>
                <p>
                  Your message was sent. We will reply to <strong>{sentTo.email}</strong> soon.
                </p>
                <div className="contact-success-actions">
                  <button type="button" className="btn btn-lg" onClick={resetForm}>
                    Send another message
                  </button>
                  <Link to="/items" className="btn btn-primary btn-lg">
                    Browse shoes
                  </Link>
                </div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <h2>Send us a message</h2>
                <p className="field-hint">
                  Fields marked <span className="required">*</span> are required.
                </p>

                <div className="contact-grid">
                  <FormField id="contact-name" label="Name" required error={errorFor('name')}>
                    <input {...inputProps('name')} type="text" autoComplete="name" placeholder="Your full name" />
                  </FormField>

                  <FormField id="contact-email" label="Email" required error={errorFor('email')}>
                    <input
                      {...inputProps('email')}
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                    />
                  </FormField>

                  <FormField
                    id="contact-subject"
                    label="Subject"
                    required
                    error={errorFor('subject')}
                    className="span-2"
                  >
                    <select {...inputProps('subject')}>
                      <option value="">Choose a subject</option>
                      {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    id="contact-message"
                    label="Message"
                    required
                    error={errorFor('message')}
                    hint={`At least ${MESSAGE_MIN} characters.`}
                    className="span-2"
                  >
                    <textarea
                      {...inputProps('message')}
                      rows={6}
                      maxLength={MESSAGE_MAX}
                      placeholder="How can we help?"
                    />
                  </FormField>
                </div>

                <div className="contact-actions">
                  <span
                    className={`char-count${messageLength > 0 && messageLength < MESSAGE_MIN ? ' char-count--short' : ''}`}
                    aria-live="polite"
                  >
                    {messageLength} / {MESSAGE_MAX}
                  </span>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isSending}>
                    {isSending ? (
                      <span className="btn-spinner" aria-hidden="true" />
                    ) : (
                      <Icon name="mail" size={16} />
                    )}
                    {isSending ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
