import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, KeyRound, LockKeyhole } from 'lucide-react'
import { useSignIn, useAuth } from '@clerk/react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminPage() {
  const navigate = useNavigate()
  const { signIn, fetchStatus } = useSignIn()
  const { isLoaded, isSignedIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [requiresEmailCode, setRequiresEmailCode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate('/admin/dashboard', { replace: true })
  }, [isLoaded, isSignedIn, navigate])

  const busy = !isLoaded || submitting || fetchStatus === 'fetching'

  async function finishSignIn() {
    await signIn.finalize({
      navigate: () => navigate('/admin/dashboard', { replace: true }),
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    try {
      const { error } = await signIn.password({ emailAddress: email.trim(), password })
      if (error) throw error

      if (signIn.status === 'complete') {
        await finishSignIn()
        return
      }

      if (signIn.status === 'needs_client_trust' || signIn.status === 'needs_second_factor') {
        const emailCodeFactor = signIn.supportedSecondFactors?.find((factor) => factor.strategy === 'email_code')
        if (emailCodeFactor || signIn.status === 'needs_client_trust') {
          await signIn.mfa.sendEmailCode()
          setRequiresEmailCode(true)
          return
        }
        setErrorMessage('Your account requires another verification method. Configure email-code verification or use the Clerk account portal to complete sign-in.')
        return
      }

      setErrorMessage('The sign-in process needs an additional step that is not configured in this login screen.')
    } catch (error) {
      setErrorMessage(error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error?.message || 'Unable to sign in. Check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVerify(event) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')
    try {
      const { error } = await signIn.mfa.verifyEmailCode({ code: verificationCode.trim() })
      if (error) throw error
      if (signIn.status === 'complete') await finishSignIn()
      else setErrorMessage('The verification step is not complete yet. Check the code and try again.')
    } catch (error) {
      setErrorMessage(error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error?.message || 'The verification code could not be confirmed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-topbar">
        <Link className="admin-back-link" to="/"><ArrowLeft aria-hidden="true" /> Back to portfolio</Link>
        <span className="admin-preview-label"><span /> CLERK AUTHENTICATION</span>
      </div>
      <div className="admin-login-layout">
        <section className="admin-login-card" aria-labelledby="admin-heading">
          <div className="admin-login-card__mark"><KeyRound aria-hidden="true" /></div>
          <span className="eyebrow">Private workspace</span>
          <h1 id="admin-heading">Good to see<br /><em>you again.</em></h1>
          <p className="admin-login-intro">Sign in to manage your portfolio. Your credentials and session are securely handled by Clerk.</p>
          {requiresEmailCode ? (
            <form className="admin-form" onSubmit={handleVerify}>
              <div className="form-field">
                <label htmlFor="admin-verification-code">Verification code</label>
                <input id="admin-verification-code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} placeholder="Enter the code sent to your email" required />
              </div>
              {errorMessage && <p className="admin-form-error" role="alert">{errorMessage}</p>}
              <button className="button button--ink admin-submit" type="submit" disabled={busy || !verificationCode.trim()}>
                {busy ? 'Verifying…' : 'Verify and continue'} <ArrowUpRight aria-hidden="true" />
              </button>
              <button className="admin-text-button" type="button" onClick={() => signIn.mfa.sendEmailCode()} disabled={busy}>Send a new code</button>
              <button className="admin-text-button" type="button" onClick={() => { signIn.reset(); setRequiresEmailCode(false); setVerificationCode(''); setErrorMessage('') }}>Use a different sign-in attempt</button>
            </form>
          ) : (
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="admin-email">Email address</label>
                <input id="admin-email" name="email" type="email" autoComplete="username" autoCapitalize="none" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" maxLength={254} required />
              </div>
              <div className="form-field">
                <label htmlFor="admin-password">Password</label>
                <div className="password-field">
                  <input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
                  <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </button>
                </div>
              </div>
              {errorMessage && <p className="admin-form-error" role="alert">{errorMessage}</p>}
              <button className="button button--ink admin-submit" type="submit" disabled={busy || !email.trim() || !password}>
                {busy ? 'Checking credentials…' : 'Sign in'} <ArrowUpRight aria-hidden="true" />
              </button>
            </form>
          )}
          <p className="admin-security-note"><LockKeyhole aria-hidden="true" /> No passwords are stored by this portfolio.</p>
        </section>
        <aside className="admin-login-aside" aria-label="Admin workspace information">
          <div className="admin-aside-stamp">A / 01</div>
          <div className="admin-aside-art" aria-hidden="true"><span /><span /><b>edit<br />with care</b></div>
          <span className="eyebrow">The back of the notebook</span>
          <h2>A quieter way<br />to keep things<br /><em>up to date.</em></h2>
          <p>Only your invited administrator account should have access to this private workspace.</p>
          <Link className="admin-aside-link" to="/">Return to the public site <ArrowUpRight aria-hidden="true" /></Link>
        </aside>
      </div>
      <footer className="admin-login-footer"><span>THE INQUISITIVE BUILDER</span><span>PRIVATE ADMIN · CLERK</span></footer>
    </main>
  )
}
