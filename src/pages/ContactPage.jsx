import { useState } from 'react'
import { ArrowUpRight, Check, Globe, Mail, Send } from 'lucide-react'
import { PageIntro, SourceNote } from '../components/PortfolioUI'
import { profile } from '../data/portfolio'
import { usePortfolioData } from '../hooks/usePortfolioData'
import { apiRequest } from '../services/api'

function safeExternalUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null
  } catch {
    return null
  }
}

export default function ContactPage() {
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState(null)
  const profileResponse = usePortfolioData('/profile', profile)
  const person = profileResponse.data?.data || profileResponse.data || profile
  const email = person.email || profile.email
  const socialLinks = person.socialLinks || person.social_links || profile.socialLinks

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setSending(true)
    setNotice(null)

    try {
      await apiRequest('/messages', {
        method: 'POST',
        body: {
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        },
      })
      form.reset()
      setNotice({ type: 'success', text: 'Your note was sent. Thanks for reaching out.' })
    } catch (error) {
      setNotice({ type: 'error', text: `${error.message} Your note was not saved.` })
    } finally {
      setSending(false)
    }
  }

  return (
    <main id="main-content" className="page-wrap inner-page contact-page">
      <PageIntro eyebrow="A good place to start" title={<>Tell me what<br />you&apos;re <em>thinking about.</em></>} description="A project, a question, a collaboration, or just an interesting tangent — my inbox is open." />
      <SourceNote error={profileResponse.error} />
      <div className="contact-layout">
        <aside className="contact-aside">
          <div className="contact-aside__icon"><Mail aria-hidden="true" /></div>
          <span className="eyebrow">The easiest way in</span>
          <p>Send a note using the form. The message will only be saved when the portfolio API is connected.</p>
          <a className="contact-email" href={`mailto:${email}`}>{email} <ArrowUpRight aria-hidden="true" /></a>
          <span className="contact-aside__hint">Sample address · replace before launch</span>
          <div className="contact-aside__availability"><span className="status-pulse" /> {person.availability || profile.availability}</div>
          <div className="contact-socials">
            <span className="eyebrow">Around the web</span>
            <div className="contact-socials__list">
              {socialLinks.map((social) => {
                const url = safeExternalUrl(social.url || social.href)
                const Icon = Globe
                return url ? (
                  <a className="contact-social" href={url} target="_blank" rel="noreferrer noopener" key={social.label}>
                    <Icon aria-hidden="true" /> {social.label} <ArrowUpRight aria-hidden="true" />
                  </a>
                ) : (
                  <span className="contact-social contact-social--placeholder" key={social.label}>
                    <Icon aria-hidden="true" /> {social.label} <small>Add profile URL</small>
                  </span>
                )
              })}
            </div>
          </div>
        </aside>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="contact-name">Your name <span aria-hidden="true">*</span></label>
            <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="A name I can use" maxLength={120} required />
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">Email address <span aria-hidden="true">*</span></label>
            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required />
          </div>
          <div className="form-field">
            <label htmlFor="contact-subject">What&apos;s this about? <span className="optional-label">OPTIONAL</span></label>
            <input id="contact-subject" name="subject" type="text" placeholder="A project, a question, an idea…" maxLength={180} />
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">Your note <span aria-hidden="true">*</span></label>
            <textarea id="contact-message" name="message" rows="5" placeholder="A little context helps me get back to you…" maxLength={5000} required />
            <span className="form-field__hint">Up to 5,000 characters</span>
          </div>
          {notice && <div className={`form-notice form-notice--${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
            {notice.type === 'success' ? <Check aria-hidden="true" /> : <span aria-hidden="true">!</span>}{notice.text}
          </div>}
          <button className="button button--ink contact-submit" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send your note'} {sending ? <span className="button-spinner" aria-hidden="true" /> : <Send aria-hidden="true" />}
          </button>
          <p className="form-privacy">Your details are only used to reply to this message.</p>
        </form>
      </div>
    </main>
  )
}
