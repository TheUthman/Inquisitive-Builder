import { MotionConfig } from 'framer-motion'
import { Route, Routes } from 'react-router-dom'
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

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </MotionConfig>
  )
}
