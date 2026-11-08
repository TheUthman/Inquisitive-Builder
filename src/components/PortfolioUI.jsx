import { ArrowUpRight, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function SourceNote({ error, className = '' }) {
  if (!error) return null
  return (
    <p className={`source-note ${className}`} role="status">
      <span className="source-note__dot" aria-hidden="true" />
      Showing sample content · the portfolio API is not connected yet
    </p>
  )
}

export function ProjectCard({ project, index = 0 }) {
  return (
    <Link className={`project-card project-card--${project.art || 'signal'}`} to={`/projects/${project.slug}`}>
      <div className="project-card__art" aria-hidden="true">
        <div className="project-art__grid" />
        {project.art === 'signal' && <div className="signal-art"><span /><span /><span /><span /><b>signal<br />/ noise</b></div>}
        {project.art === 'common' && <div className="common-art"><span className="common-art__sun" /><span className="common-art__path" /><i /><i /><i /></div>}
        {project.art === 'tiny' && <div className="tiny-art"><span /><span /><span /><span /><b>°</b></div>}
        <span className="project-card__art-index">0{index + 1}</span>
      </div>
      <div className="project-card__meta">
        <span>{project.category || 'Selected work'} · {project.year || '2026'}</span>
        <MoveUpRight aria-hidden="true" />
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="tag-list" aria-label="Project technologies">
        {(project.stack || []).slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
    </Link>
  )
}

export function ArticleCard({ article, compact = false }) {
  return (
    <Link className={`article-card${compact ? ' article-card--compact' : ''}`} to={`/journal/${article.slug}`}>
      <div className="article-card__topline">
        <span>{article.tags?.[0] || 'Field note'}</span>
        <ArrowUpRight aria-hidden="true" />
      </div>
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      <div className="article-card__meta">
        <time dateTime={article.date}>{new Date(`${article.date}T12:00:00`).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</time>
        <span>{article.readTime || 'A short read'}</span>
      </div>
    </Link>
  )
}

export function PageIntro({ eyebrow, title, description, children }) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}
