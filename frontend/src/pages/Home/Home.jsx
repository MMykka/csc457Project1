import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItems } from '../../store/itemsSlice.js'
import { media } from '../../utils/media.js'
import HeroBanner from '../../components/HeroBanner.jsx'
import Rail from '../../components/Rail.jsx'
import ItemCard from '../../components/ItemCard.jsx'
import CategoryCard from '../../components/CategoryCard.jsx'
import Photo from '../../components/Photo.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import './Home.css'

const SKELETON_COUNT = 5

// Shoes with a photo first, then newest first, so the rows lead with real product shots.
const photosFirst = (a, b) => Boolean(b.image) - Boolean(a.image) || b.id - a.id

// Groups the shoes by category, e.g. [{ category: 'Winter', count: 3, cover: <a shoe> }, ...]
// The cover is the first shoe in the category that has a photo.
function getCategories(shoes) {
  const groups = {}
  shoes.forEach((shoe) => {
    if (!shoe.category) return
    groups[shoe.category] = [...(groups[shoe.category] ?? []), shoe]
  })
  return Object.entries(groups)
    .map(([category, items]) => ({
      category,
      count: items.length,
      cover: items.find((shoe) => shoe.image) ?? items[0],
    }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
}

export default function Home() {
  const dispatch = useDispatch()
  const { list, status, error } = useSelector((state) => state.items)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchItems())
  }, [status, dispatch])

  const isLoading = status === 'idle' || status === 'loading'
  const newest = [...list].sort(photosFirst)
  const inStock = list.filter((shoe) => shoe.inStock).sort(photosFirst)
  const categories = getCategories(list)

  // A rail of shoe cards, with loading, error and empty states.
  const renderShoeRail = (title, shoes, linkTo = '/items') => {
    if (status === 'failed') {
      return (
        <div className="home-rail-state">
          <ErrorMessage
            title="Could not load shoes"
            message={error}
            onRetry={() => dispatch(fetchItems())}
          />
        </div>
      )
    }

    if (isLoading && list.length === 0) {
      return (
        <Rail title={title} linkTo={linkTo}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <span key={index} className="card-skeleton" aria-hidden="true" />
          ))}
        </Rail>
      )
    }

    if (shoes.length === 0) {
      return (
        <div className="home-rail-state">
          <EmptyState title="Nothing here yet" text="Add a shoe and it will show up in this row.">
            <Link to="/items/new" className="btn">
              Add a shoe
            </Link>
          </EmptyState>
        </div>
      )
    }

    return (
      <Rail title={title} linkTo={linkTo}>
        {shoes.map((shoe) => (
          <ItemCard key={shoe.id} shoe={shoe} showActions={false} />
        ))}
      </Rail>
    )
  }

  return (
    <div className="home">
      <HeroBanner
        eyebrow="New"
        title="Stride – shoes for every step of the season"
        image={media.hero}
        imageAlt="Black trail shoe on a wet forest path"
        imagePosition="center 60%"
        tone="forest"
      >
        <Link to="/about" className="btn">
          Read more
        </Link>
        <Link to="/items" className="btn">
          Shop now
        </Link>
      </HeroBanner>

      <div className="home-block">{renderShoeRail('New arrivals', newest)}</div>

      <section className="welcome">
        <span className="eyebrow">Welcome to Stride</span>
        <h2>Running, court and everyday shoes to get out more.</h2>
        <Link to="/about" className="btn">
          Explore
        </Link>
      </section>

      {categories.length > 0 && (
        <div className="home-block home-block--flush">
          <Rail title="Explore by category" linkTo="/items">
            {categories.map(({ category, count, cover }) => (
              <CategoryCard key={category} category={category} count={count} cover={cover} />
            ))}
          </Rail>
        </div>
      )}

      <HeroBanner
        eyebrow="Alne BUGrip"
        title="A light winter boot with great traction"
        image={media.feature}
        imageAlt="Winter boot with studded sole stepping onto ice"
        imagePosition="center 52%"
        tone="snow"
        size="tall"
      >
        <Link to="/items/1" className="btn">
          Read more
        </Link>
        <Link to="/items?category=Winter" className="btn">
          Shop now
        </Link>
      </HeroBanner>

      <div className="home-block">{renderShoeRail('In stock', inStock)}</div>

      <section className="finder">
        <div className="finder-small">
          <Photo src={media.finderSmall} alt="Muddy trail shoe sole in the forest" tone="forest" />
        </div>
        <div className="finder-large">
          <Photo
            src={media.finderLarge}
            alt="Trail runner jumping over a forest stream"
            position="center 70%"
            tone="forest"
          />
        </div>
        <div className="finder-text">
          <span className="eyebrow">Shoe finder</span>
          <h2>
            Need help finding the right shoe for your next adventure? We’ve got you covered! Send us
            a message here.
          </h2>
          <Link to="/contact" className="btn">
            Find your match
          </Link>
        </div>
      </section>
    </div>
  )
}
