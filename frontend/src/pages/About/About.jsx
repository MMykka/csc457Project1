import { media } from '../../utils/media.js'
import HeroBanner from '../../components/HeroBanner.jsx'
import StatCard from '../../components/StatCard.jsx'
import CallToAction from '../../components/CallToAction.jsx'
import './About.css'

const stats = [
  { label: 'Founded', value: '2014' },
  { label: 'Pairs sold', value: '62,400+' },
  { label: 'Feet measured in store', value: '38,000' },
  { label: 'Old pairs recycled', value: '3,100' },
]

const milestones = [
  {
    year: '2014',
    title: 'One wall, forty pairs',
    text: 'Stride opens in an old bicycle repair shop at 120 Market Street. The whole stock fits on one wall, and the counter is a door laid across two crates.',
  },
  {
    year: '2016',
    title: 'The first Ice Walk',
    text: 'After a week of black ice, we lend out studded shoes for a free evening walk around town. Sixty people show up. It has happened every January since.',
  },
  {
    year: '2019',
    title: 'Knocking through the wall',
    text: 'The bakery next door moves out and we take over its space, adding a fitting bench, a treadmill for gait checks and a corner for shoe repairs.',
  },
  {
    year: '2022',
    title: 'Second life for old pairs',
    text: 'We start taking back worn-out shoes. Every pair is resoled, donated or sent for recycling, and the customer gets money off their next pair.',
  },
  {
    year: '2025',
    title: 'Pair 60,000',
    text: 'A mail carrier who walks twelve miles a day buys our 60,000th pair: a set of Alne BUGrips for the winter round. The pair was on the house.',
  },
]

export default function About() {
  return (
    <div className="about">
      <HeroBanner
        eyebrow="Our story"
        title="Shoes for every stride."
        image={media.about}
        imageAlt="Commuters walking past shoe posters in a subway station"
        tone="earth"
        size="medium"
      />

      <section className="section">
        <div className="container about-intro">
          <p>
            Stride is a small shoe store on Market Street in Springfield. Since 2014 we have helped
            runners, hikers, dog walkers and winter commuters find shoes that keep them on their
            feet, whatever the ground is doing.
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-text">
          <span className="eyebrow">How it started</span>
          <h2>A borrowed pair of shoes on a frozen lake</h2>
          <p>
            In the winter of 2012, Elin Berg and Sam Ortega were both running a 10 km race across a
            frozen lake outside Springfield. Halfway around, Sam slipped on the ice for the third
            time. Elin, who had grown up running orienteering races in the Swedish forests, always
            carried a spare pair of studded shoes. Sam finished the race in them, a size too big,
            with a personal best.
          </p>
          <p>
            Over coffee afterwards, they realised nobody in town sold shoes that could handle a
            real winter. Elin knew the shoes, and Sam knew everyone who walked to work. Two years
            later, with their savings and a loan from Sam’s aunt, they signed the lease on an empty
            bike shop and opened Stride.
          </p>
          <p>
            Today we are a team of nine. We still measure every foot by hand, we still test shoes
            on the frozen lake each December, and Elin’s spare pair hangs above the counter.
          </p>
        </div>

        <div className="about-stats" aria-label="Stride in numbers">
          {stats.map(({ label, value }) => (
            <StatCard key={label} label={label} value={value} />
          ))}
        </div>
      </section>

      <section className="about-name">
        <span className="eyebrow">Where the name came from</span>
        <blockquote>
          <p>“Don’t fight the hill. Find your stride.”</p>
        </blockquote>
        <div className="about-name-text">
          <p>
            Elin’s first running coach shouted it from the side of every uphill. When she and Sam
            were standing in the empty shop trying to name it, Sam wrote “STRIDE” in chalk on the
            floor, and it stuck. The original sign was painted by hand on a piece of the old shop
            counter, and it still hangs over our front door.
          </p>
        </div>
      </section>

      <section className="about-block">
        <div className="about-block-header">
          <span className="eyebrow">Along the way</span>
          <h2>Twelve years on Market Street</h2>
        </div>
        <ol className="timeline">
          {milestones.map(({ year, title, text }) => (
            <li key={year} className="timeline-item">
              <span className="timeline-year">{year}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-cta">
        <CallToAction
          eyebrow="Visit us"
          title="Come by and get your feet measured."
          text="120 Market Street, Springfield. Open Monday to Saturday, 10:00–19:00. The coffee is free."
          to="/contact"
          linkLabel="Get in touch"
        />
      </section>
    </div>
  )
}
