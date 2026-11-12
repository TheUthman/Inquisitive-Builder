import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Compass, Lightbulb, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleCard as JournalCard, ProjectCard, SectionHeading, SourceNote } from '../components/PortfolioUI'
import { articles, explorations, normalizeCollection, profile, projects } from '../data/portfolio'
import { usePortfolioData } from '../hooks/usePortfolioData'

export default function HomePage() {
  const profileResponse = usePortfolioData('/profile', profile)
  const projectResponse = usePortfolioData('/projects', projects)
  const articleResponse = usePortfolioData('/articles', articles)
  const pageProfile = profileResponse.data?.data || profileResponse.data || profile
  const projectList = normalizeCollection(projectResponse.data?.data || projectResponse.data)
  const articleList = normalizeCollection(articleResponse.data?.data || articleResponse.data)
  const featuredCollection = projectList.filter((project) => project.featured)
  const featuredProjects = (featuredCollection.length ? featuredCollection : projectList).slice(0, 3)
  const featuredArticles = articleList.slice(0, 2)

  return (
    <main id="main-content">
      <section className="hero-section page-wrap">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
          <div className="hero-kicker"><span className="status-pulse" /> Software · engineering · exploration</div>
          <h1>Curiosity,<br /><em>in progress.</em></h1>
          <p className="hero-lede">I like understanding things.<br />And building them.</p>
          <div className="hero-actions">
            <Link className="button button--ink" to="/projects">Explore my work <ArrowUpRight aria-hidden="true" /></Link>
            <Link className="text-link" to="/about">A little about me <ArrowRight aria-hidden="true" /></Link>
          </div>
          <p className="hero-caption"><span className="caption-line" /> An evolving collection of things I&apos;ve made, noticed, and wondered about.</p>
        </motion.div>

        <motion.div className="hero-art" aria-label="A small abstract diagram about curiosity" role="img" initial={{ opacity: 0, scale: 0.97, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.12 }}>
          <div className="hero-art__paper" />
          <div className="hero-art__grid" />
          <div className="orbit orbit--one" />
          <div className="orbit orbit--two" />
          <div className="orbit__node orbit__node--one" />
          <div className="orbit__node orbit__node--two" />
          <div className="orbit__node orbit__node--three" />
          <div className="hero-art__center"><Compass aria-hidden="true" /><span>keep<br />looking</span></div>
          <div className="hero-art__annotation hero-art__annotation--top">A useful question</div>
          <div className="hero-art__annotation hero-art__annotation--bottom">often starts here <ArrowUpRight aria-hidden="true" /></div>
          <Sparkles className="hero-art__sparkle" aria-hidden="true" />
          <div className="hero-art__index">FIG. 01 — STILL EXPLORING</div>
        </motion.div>
        <a className="hero-scroll" href="#selected-work"><span>Scroll to wander</span><ArrowDown aria-hidden="true" /></a>
      </section>

      <section className="intro-band page-wrap" aria-label="A note about this portfolio">
        <div className="intro-band__marker"><Lightbulb aria-hidden="true" /><span>THE SHORT VERSION</span></div>
        <p>{pageProfile.shortBio || profile.shortBio}</p>
        <span className="intro-band__aside">{pageProfile.location || profile.location} · sample profile</span>
      </section>

      <section className="section-block page-wrap" id="selected-work">
        <SectionHeading eyebrow="Selected work · 01—03" title="A few things made with care." description="A sample set of projects to show the shape of this portfolio. The details are placeholders, ready for your own work." action={<Link className="text-link" to="/projects">All projects <ArrowRight aria-hidden="true" /></Link>} />
        <div className="project-grid">
          {featuredProjects.map((project, index) => <ProjectCard key={project.id || project.slug} project={project} index={index} />)}
        </div>
      </section>

      <section className="explore-band">
        <div className="page-wrap explore-band__inner">
          <div className="explore-band__copy">
            <span className="eyebrow eyebrow--light">A place for the unfinished</span>
            <h2>Not everything<br />needs a <em>roadmap.</em></h2>
            <p>Small experiments, current questions, and the interesting things that don&apos;t quite fit anywhere else.</p>
            <Link className="button button--paper" to="/exploration">Step inside <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <div className="exploration-preview" aria-label="Three curiosity notes">
            {explorations.map((item) => (
              <div className={`exploration-slip exploration-slip--${item.art}`} key={item.number}>
                <span>{item.number} / {item.type}</span>
                <b>{item.title}</b>
                <i aria-hidden="true">↗</i>
              </div>
            ))}
            <span className="exploration-preview__scribble" aria-hidden="true">work in<br />progress</span>
          </div>
        </div>
      </section>

      <section className="section-block section-block--journal page-wrap">
        <SectionHeading eyebrow="Field notes · 01—02" title="Thinking out loud." description="Notes on making, learning, and paying attention." action={<Link className="text-link" to="/journal">All notes <ArrowRight aria-hidden="true" /></Link>} />
        <SourceNote error={articleResponse.error} />
        <div className="article-grid">
          {featuredArticles.map((article) => <JournalCard key={article.id || article.slug} article={article} compact />)}
        </div>
      </section>

      <section className="contact-invitation page-wrap">
        <div className="contact-invitation__stamp" aria-hidden="true">OPEN<br />TAB</div>
        <span className="eyebrow">The next good question</span>
        <h2>Something on<br /><em>your mind?</em></h2>
        <p>Have a project, an idea, or a curious tangent to share? I&apos;d like to hear it.</p>
        <Link className="button button--ink" to="/contact">Start a conversation <ArrowUpRight aria-hidden="true" /></Link>
      </section>
    </main>
  )
}
