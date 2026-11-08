import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main id="main-content" className="page-wrap not-found-page">
      <Compass aria-hidden="true" />
      <span className="eyebrow">A little off the map</span>
      <h1>This page wandered<br /><em>somewhere else.</em></h1>
      <p>The link may be old, or this is a new path still finding its way.</p>
      <Link className="button button--ink" to="/"><ArrowLeft aria-hidden="true" /> Back to the beginning</Link>
    </main>
  )
}
