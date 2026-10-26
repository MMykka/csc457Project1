import Photo from './Photo.jsx'
import './HeroBanner.css'

// Full-bleed photo with a darkening overlay and a headline in the bottom-left corner.
// Pass the buttons as children.
export default function HeroBanner({
  eyebrow,
  title,
  image,
  imageAlt,
  imagePosition,
  tone,
  size = 'full',
  children,
}) {
  return (
    <section className={`hero-banner hero-banner--${size}`}>
      <Photo src={image} alt={imageAlt} position={imagePosition} tone={tone} className="hero-banner-photo" />
      <div className="hero-banner-content">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="hero-banner-title">{title}</h1>
        {children && <div className="hero-banner-actions">{children}</div>}
      </div>
    </section>
  )
}
