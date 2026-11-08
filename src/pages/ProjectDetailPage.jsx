import { ArrowLeft, ArrowUpRight, Check, CircleDot, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { LoadingState } from '../components/LoadingState'
import { SourceNote } from '../components/PortfolioUI'
import { projects } from '../data/portfolio'
import { usePortfolioData } from '../hooks/usePortfolioData'

const galleryFrames = [
  { step: '01 / ORIENT', title: 'Begin with the useful question' },
  { step: '02 / EXPLORE', title: 'Try a quieter arrangement' },
  { step: '03 / REFINE', title: 'Keep the next step clear' },
]

function safeExternalUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null
  } catch {
    return null
  }
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const fallback = projects.find((project) => project.slug === slug)
  const { data, error, isLoading } = usePortfolioData(`/projects/${slug}`, fallback)
  const project = data?.data || data || fallback

  if (isLoading && !project) return <main id="main-content" className="page-wrap inner-page"><LoadingState label="Opening this case study…" /></main>
  if (!project) return <main id="main-content" className="page-wrap inner-page"><div className="empty-state"><h1>We can&apos;t find that project.</h1><p>It may have moved or the link may be incomplete.</p><Link className="text-link" to="/projects"><ArrowLeft aria-hidden="true" /> Back to work</Link></div></main>

  const stack = project.stack || project.technologies || []
  const projectLinks = [
    { label: 'Repository', url: project.repositoryUrl || project.repository_url },
    { label: 'Live project', url: project.liveUrl || project.live_url },
    ...(Array.isArray(project.links) ? project.links.map((link) => ({ label: link.label || link.name || 'Project link', url: link.url || link.href })) : []),
  ].map((link) => ({ ...link, url: safeExternalUrl(link.url) })).filter((link) => link.url)
  return (
    <main id="main-content" className="page-wrap inner-page detail-page">
      <Link className="back-link" to="/projects"><ArrowLeft aria-hidden="true" /> All projects</Link>
      <SourceNote error={error} />
      <header className="detail-hero">
        <div className="detail-hero__meta"><span>{project.category || 'Selected work'}</span><span>{project.year || project.publishedAt || '2026'}</span><span>Sample case study</span></div>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <div className={`detail-art detail-art--${project.art || 'signal'}`} aria-hidden="true"><span className="detail-art__ring" /><span className="detail-art__mark">{project.art === 'tiny' ? '°' : project.art === 'common' ? 'here' : 'signal'}</span><span className="detail-art__foot">AN EXERCISE IN PAYING ATTENTION</span></div>
      </header>

      <div className="detail-overview">
        <div><span className="eyebrow">At a glance</span><p>{project.role || 'Concept · design · development'}</p></div>
        <div><span className="eyebrow">The ingredients</span><div className="tag-list">{stack.map((item) => <span className="tag" key={item}>{typeof item === 'string' ? item : item.name}</span>)}</div></div>
        <div><span className="eyebrow">The outcome</span><p>{project.outcome || 'A useful sample project, ready to be replaced with your own work.'}</p></div>
      </div>

  <section className="detail-gallery-section" aria-labelledby="detail-gallery-title">
  <div className="detail-gallery-heading"><div><span className="eyebrow">A few frames from the process</span><h2 id="detail-gallery-title">A little room to <em>explore.</em></h2></div><span className="detail-gallery-count">FIG. 01—03</span></div>
  <div className="detail-gallery">
  {galleryFrames.map((frame, index) => <figure className={`detail-gallery__frame detail-gallery__frame--${project.art || 'signal'} detail-gallery__frame--${index + 1}`} key={frame.step}>
  <div className="detail-gallery__screen" role="img" aria-label={`Illustrative sample screen ${index + 1} for ${project.title}`}>
  <div className="detail-gallery__top"><span>FIELD NOTES <i> / </i> 0{index + 1}</span><span className="detail-gallery__top-mark">● ● ●</span></div>
  <div className="detail-gallery__layout"><div className="detail-gallery__rail"><i /><i /><i /></div><div className="detail-gallery__content"><span className="detail-gallery__pill">A THOUGHTFUL START</span><span className="detail-gallery__headline">Make room<br />for good ideas.</span><span className="detail-gallery__rule" /><div className="detail-gallery__cards"><i /><i /><i /></div></div></div>
  </div>
  <figcaption><span>{frame.step}</span><b>{frame.title}</b></figcaption>
  </figure>)}
  </div>
  </section>
  <div className="detail-narrative">
  <section><span className="detail-step"><CircleDot aria-hidden="true" /> 01 / THE QUESTION</span><h2>What needed a closer look?</h2><p>{project.challenge || project.description || 'Replace this section with the problem, context, or opportunity behind the project.'}</p></section>
  <section><span className="detail-step"><CircleDot aria-hidden="true" /> 02 / THE GOAL</span><h2>What should feel better?</h2><p>{project.goal || 'Describe the intended change, who it should help, and how success would be recognized.'}</p></section>
  <section><span className="detail-step"><CircleDot aria-hidden="true" /> 03 / THE APPROACH</span><h2>Make the useful thing clear.</h2><p>{project.process || project.approach || project.solution || 'Describe the decisions, research, and engineering that shaped the result.'}</p></section>
  </div>
  <div className="detail-outcome"><span className="detail-step"><Check aria-hidden="true" /> 04 / WHAT CHANGED</span><p>{project.outcome || 'Share the measurable result, the learning, or what you would try next.'}</p><Link className="text-link" to="/contact">Let&apos;s talk about it <ArrowUpRight aria-hidden="true" /></Link></div>
  <div className="detail-links" aria-label="Project links">
  <span className="eyebrow">Go a little further</span>
  {projectLinks.length ? projectLinks.map((link) => <a href={link.url} target="_blank" rel="noreferrer noopener" key={`${link.label}-${link.url}`}>{link.label} <ExternalLink aria-hidden="true" /></a>) : <span className="detail-link-placeholder">Repository and live project links can be added here.</span>}
  </div>

    </main>
  )
}
