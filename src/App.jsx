import { useAuth } from '@clerk/react'
import { MotionConfig } from 'framer-motion'
import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import SiteLayout from './layouts/SiteLayout'
import AboutPage from './pages/AboutPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminPage from './pages/AdminPage'
import ArticlePage from './pages/ArticlePage'
import ContactPage from './pages/ContactPage'
import ExplorationPage from './pages/ExplorationPage'
import HomePage from './pages/HomePage'
import JournalPage from './pages/JournalPage'
import NotFoundPage from './pages/NotFoundPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProjectsPage from './pages/ProjectsPage'
import { setAuthTokenGetter } from './services/api'

function AuthTokenBridge() {
  const { getToken } = useAuth()
  // Keep the latest Clerk token getter available to the shared API client.
  setAuthTokenGetter(getToken)
  return null
}

function ClerkSetupNotice() {
  return (
    <main className="admin-locked">
      <div className="admin-locked__mark">i.</div>
      <span className="eyebrow">Private workspace</span>
      <h1>Authentication needs configuration.</h1>
      <p>Add your Clerk publishable key to the local environment file to activate the administrator sign-in. Public portfolio pages remain available.</p>
      <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code>
      <a className="admin-locked__back" href="/">Back to the public portfolio</a>
    </main>
  )
}

function AdminLoginRoute({ clerkConfigured }) {
  return clerkConfigured ? <AdminPage /> : <ClerkSetupNotice />
}

function AdminProtectedRoute({ clerkConfigured }) {
  if (!clerkConfigured) return <ClerkSetupNotice />
  return <AdminAccessGate />
}

function AdminAccessGate() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const adminUserId = import.meta.env.VITE_CLERK_ADMIN_USER_ID?.trim()

  if (!isLoaded) {
    return <main className="admin-loading"><p>Checking your administrator session…</p></main>
  }

  if (!isSignedIn) return <Navigate to="/admin" replace />

  if (!adminUserId) {
    return (
      <main className="admin-locked">
        <span className="eyebrow">Private workspace</span>
        <h1>Administrator access is not configured.</h1>
        <p>Set VITE_CLERK_ADMIN_USER_ID to the Clerk user ID of your administrator account. This is a frontend route check only; the future backend must independently enforce the same administrator allowlist.</p>
      </main>
    )
  }

  if (userId !== adminUserId) {
    return (
      <main className="admin-locked">
        <span className="eyebrow">Access restricted</span>
        <h1>This account is not authorised.</h1>
        <p>Your account is signed in, but it is not the configured portfolio administrator.</p>
        <a className="button button--ink" href="/">Return to portfolio</a>
      </main>
    )
  }

  return <AdminDashboard />
}

export default function App({ clerkConfigured = false }) {
  return (
    <MotionConfig reducedMotion="user">
      {clerkConfigured && <AuthTokenBridge />}
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/exploration" element={<ExplorationPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:slug" element={<ArticlePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin" element={<AdminLoginRoute clerkConfigured={clerkConfigured} />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute clerkConfigured={clerkConfigured} />} />
      </Routes>
    </MotionConfig>
  )
}
