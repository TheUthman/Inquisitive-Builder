import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, KeyRound, LockKeyhole } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'

export default function AdminPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setSubmitting(true)
    setErrorMessage('')

    try {
      await apiRequest('/auth/login', {
        method: 'POST',
        body: { email: formData.get('email'), password: formData.get('password') },
      })
      navigate('/admin/dashboard')
    } catch (error) {
      setErrorMessage(`${error.message} This frontend preview does not include authentication.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-topbar">
        <Link className="admin-back-link" to="/"><ArrowLeft aria-hidden="true" /> Back to portfolio</Link>
        <span className="admin-preview-label"><span /> FRONTEND PREVIEW</span>
      </div>
      <div className="admin-login-layout">
        <section className="admin-login-card" aria-labelledby="admin-heading">
          <div className="admin-login-card__mark"><KeyRound aria-hidden="true" /></div>
          <span className="eyebrow">Private workspace</span>
          <h1 id="admin-heading">Good to see<br /><em>you again.</em></h1>
          <p className="admin-login-intro">Sign in to manage your portfolio. Authentication and session security are handled by the connected backend.</p>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="admin-email">Email address</label>
              <input id="admin-email" name="email" type="email" autoComplete="username" placeholder="you@example.com" maxLength={254} required />
            </div>
            <div className="form-field">
              <label htmlFor="admin-password">Password</label>
              <div className="password-field">
                <input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required />
                <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </button>
              </div>
            </div>
            {errorMessage && <p className="admin-form-error" role="alert">{errorMessage}</p>}
            <button className="button button--ink admin-submit" type="submit" disabled={submitting}>
              {submitting ? 'Checking credentials…' : 'Sign in'} <ArrowUpRight aria-hidden="true" />
            </button>
          </form>
          <p className="admin-security-note"><LockKeyhole aria-hidden="true" /> No credentials are stored in this browser.</p>
        </section>
        <aside className="admin-login-aside" aria-label="Admin preview information">
          <div className="admin-aside-stamp">A / 01</div>
          <div className="admin-aside-art" aria-hidden="true"><span /><span /><b>edit<br />with care</b></div>
          <span className="eyebrow">The back of the notebook</span>
          <h2>A quieter way<br />to keep things<br /><em>up to date.</em></h2>
          <p>This sign-in screen is ready to connect to the planned authentication API. It intentionally does not simulate a logged-in user.</p>
          <Link className="admin-aside-link" to="/">Return to the public site <ArrowUpRight aria-hidden="true" /></Link>
        </aside>
      </div>
      <footer className="admin-login-footer"><span>THE INQUISITIVE BUILDER</span><span>FRONTEND ONLY · SAMPLE CONTENT</span></footer>
    </main>
  )
}
