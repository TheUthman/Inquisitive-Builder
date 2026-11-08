import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { LoadingState } from '../components/LoadingState'
import { SourceNote } from '../components/PortfolioUI'
import { articles } from '../data/portfolio'
import { usePortfolioData } from '../hooks/usePortfolioData'

export default function ArticlePage() {
  const { slug } = useParams()
  const fallback = articles.find((article) => article.slug === slug)
  const { data, error, isLoading } = usePortfolioData(`/articles/${slug}`, fallback)
  const article = data?.data || data || fallback
  const body = Array.isArray(article?.body)
    ? article.body
    : String(article?.contentMarkdown || article?.content_markdown || article?.content || '').split(/\n\s*\n/).filter(Boolean)

  if (isLoading && !article) return <main id="main-content" className="page-wrap inner-page"><LoadingState label="Opening this note…" /></main>
  if (!article) return <main id="main-content" className="page-wrap inner-page"><div className="empty-state"><h1>That note isn&apos;t here.</h1><p>It may have moved, or it may not be published yet.</p><Link className="text-link" to="/journal"><ArrowLeft aria-hidden="true" /> Back to the journal</Link></div></main>

  return (
    <main id="main-content" className="page-wrap inner-page article-page">
      <Link className="back-link" to="/journal"><ArrowLeft aria-hidden="true" /> All field notes</Link>
      <SourceNote error={error} />
      <article>
        <header className="article-header">
          <div className="article-header__meta"><span>{article.tags?.[0] || 'Field note'}</span><time dateTime={article.date}>{new Date(`${article.date || '2026-03-18'}T12:00:00`).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}</time><span>{article.readTime || 'A short read'}</span></div>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="article-header__rule"><span>NOTE / {String(article.id || '01').slice(0, 2).toUpperCase()}</span><span>THOUGHTS IN PROGRESS</span></div>
        </header>
        <div className="article-body">
          {body.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 16)}`}>{paragraph}</p>)}
        </div>
      </article>
      <aside className="article-end-card"><span className="eyebrow">Still thinking about it?</span><p>There&apos;s always room for another point of view.</p><Link className="text-link" to="/contact">Send a note <ArrowUpRight aria-hidden="true" /></Link></aside>
    </main>
  )
}
