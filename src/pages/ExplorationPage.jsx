import { ArrowUpRight, MoveDownRight } from 'lucide-react'
import { PageIntro } from '../components/PortfolioUI'
import { explorations } from '../data/portfolio'

export default function ExplorationPage() {
  return (
    <main id="main-content" className="page-wrap inner-page exploration-page">
      <PageIntro eyebrow="The unfinished drawer" title={<>Some things are<br /><em>better as questions.</em></>} description="A place for sketches, side quests, small experiments, and the ideas still finding their shape." />
      <div className="exploration-header-note"><span className="status-pulse" /> A living notebook · nothing here is quite finished</div>
      <div className="exploration-list">
        {explorations.map((item) => (
          <article className={`exploration-row exploration-row--${item.art}`} key={item.number}>
            <div className="exploration-row__index">{item.number}<MoveDownRight aria-hidden="true" /></div>
            <div className={`exploration-row__visual exploration-row__visual--${item.art}`} aria-hidden="true">
              {item.art === 'orbit' && <><i /><i /><i /><b>?</b></>}
              {item.art === 'weather' && <><span className="weather-sun" /><span className="weather-line" /><span className="weather-line" /><span className="weather-line" /></>}
              {item.art === 'notes' && <><span className="note-sheet"><i /><i /><i /></span><span className="note-dot" /></>}
            </div>
            <div className="exploration-row__copy">
              <span className="eyebrow">{item.type}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <span className="exploration-status"><span /> Still curious</span>
            </div>
            <ArrowUpRight className="exploration-row__arrow" aria-hidden="true" />
          </article>
        ))}
      </div>
      <aside className="exploration-bottom-note"><span>Small is a good place to start.</span><p>Have a question you keep coming back to? I&apos;m always happy to hear it.</p></aside>
    </main>
  )
}
