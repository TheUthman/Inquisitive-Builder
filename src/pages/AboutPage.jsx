import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Code2, Coffee, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro, SourceNote } from '../components/PortfolioUI'
import { profile } from '../data/portfolio'
import { usePortfolioData } from '../hooks/usePortfolioData'

const principles = [
  { icon: Lightbulb, title: 'Stay curious', text: 'Ask better questions before reaching for the obvious answer.' },
  { icon: Code2, title: 'Make it useful', text: 'Let the details serve a person, not just the technology.' },
  { icon: BookOpen, title: 'Keep learning', text: 'Treat every project as a chance to update the mental model.' },
]

export default function AboutPage() {
  const profileResponse = usePortfolioData('/profile', profile)
  const person = profileResponse.data?.data || profileResponse.data || profile
  const education = (Array.isArray(person.education) ? person.education[0] : person.education) || profile.education[0]
  const interests = Array.isArray(person.interests) ? person.interests : profile.interests

  return (
    <main id="main-content" className="page-wrap inner-page">
      <PageIntro eyebrow="A little about me" title={<>A mind that likes<br />to <em>pull things apart.</em></>} description={person.shortBio || 'The short version: I enjoy understanding how things work, then finding a thoughtful way to make them work better.'} />
      <section className="about-story">
        <div className="about-story__aside">
          <span className="about-aside__index">01 / THE STORY SO FAR</span>
          <figure className="about-portrait">
            <img src="/images/curiosity-portrait.png" alt="An abstract paper collage of a figure looking toward an orbiting sun." />
            <figcaption>Curiosity, in the making</figcaption>
          </figure>
          <span className="about-location"><Coffee aria-hidden="true" /> {person.location || profile.location}</span>
        </div>
        <div className="about-story__body">
          <p className="story-lede">I&apos;m <mark>{person.name || profile.name}</mark> — {person.role || profile.role}, drawn to ideas that ask for both logic and imagination.</p>
          <p>{person.biography || profile.biography}</p>
          <p>This is a living profile. Add the moments that shaped how you work, the problems you like to solve, and the small discoveries that keep you interested.</p>
          <div className="about-story__signature">Curious by default <span>— updated as I go</span></div>
        </div>
      </section>

      <section className="principles-section">
        <div className="section-heading">
          <div><span className="eyebrow">A few useful reminders</span><h2>How I like to work.</h2></div>
          <span className="principles-section__aside">Notes to self, mostly.</span>
        </div>
        <div className="principles-grid">
          {principles.map(({ icon: Icon, title, text }, index) => (
            <motion.article className="principle-card" key={title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.08 }}>
              <span className="principle-card__number">0{index + 1}</span>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about-details">
        <div><span className="eyebrow">Learning, always</span><h2>What I&apos;m exploring.</h2></div>
        <ul className="detail-list">
          <li><span>01</span><div><b>{education.qualification || education.degree || 'Education'}</b><p>{education.institution || education.school || 'Add a course, degree, or learning path that matters to you.'}</p></div><span className="detail-list__year">{education.year || 'YOUR STORY'}</span></li>
          <li><span>02</span><div><b>Current focus</b><p>{person.currentFocus || 'Building for the web, shaping useful systems, and learning in public.'}</p></div><span className="detail-list__year">IN PROGRESS</span></li>
          <li><span>03</span><div><b>Interests</b><p>{interests.join(' · ')}</p></div><span className="detail-list__year">OFFLINE</span></li>
        </ul>
      </section>

      <section className="page-end-note">
        <span className="eyebrow">Want to make something?</span>
        <p>Tell me what you&apos;re thinking about.</p>
        <Link className="text-link" to="/contact">Get in touch <ArrowUpRight aria-hidden="true" /></Link>
      </section>
    </main>
  )
}
