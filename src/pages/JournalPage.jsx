import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleCard, PageIntro, SourceNote } from '../components/PortfolioUI'
import { EmptyState } from '../components/LoadingState'
import { articles, normalizeCollection } from '../data/portfolio'
import { usePortfolioData } from '../hooks/usePortfolioData'

export default function JournalPage() {
  const { data, error } = usePortfolioData('/articles', articles)
  const articleList = normalizeCollection(data)

  return (
    <main id="main-content" className="page-wrap inner-page journal-page">
      <PageIntro eyebrow="Notes from the margins" title={<>A little room<br />to <em>think out loud.</em></>} description="Thoughts on building, learning, and the small details worth paying attention to." />
      <div className="journal-intro-note"><span>NOTEBOOK / 001</span><p>Not quite a blog. More like a place to leave the interesting bits.</p><ArrowDown aria-hidden="true" /></div>
      {articleList.length ? (
        <div className="journal-list">
          {articleList.map((article, index) => (
            <div className="journal-list__row" key={article.id || article.slug}>
              <span className="journal-list__number">{String(index + 1).padStart(2, '0')}</span>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="The notebook is open." detail="There are no published notes here yet. Check back after the next thought finds its way onto the page." />
      )}
      <div className="journal-cta"><span className="eyebrow">A conversation is a kind of note</span><p>Have a different take? I&apos;d like to hear it.</p><Link className="text-link" to="/contact">Get in touch <ArrowUpRight aria-hidden="true" /></Link></div>
    </main>
  )
}
