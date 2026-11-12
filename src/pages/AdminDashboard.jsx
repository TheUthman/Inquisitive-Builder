import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, BookOpen, Check, ChevronDown, Cpu, FilePlus2, FolderKanban, LayoutDashboard, LogOut, Mail, Pencil, Plus, Settings2, Tags, Trash2, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { LoadingState } from '../components/LoadingState'
import { articles, normalizeCollection, profile, projects } from '../data/portfolio'
import { usePortfolioData } from '../hooks/usePortfolioData'
import { apiRequest } from '../services/api'
import { useClerk } from '@clerk/react'

const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'technologies', label: 'Technologies', icon: Cpu },
  { id: 'articles', label: 'Journal', icon: BookOpen },
  { id: 'messages', label: 'Messages', icon: Mail },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { signOut } = useClerk()
  const [activeSection, setActiveSection] = useState('overview')
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formNotice, setFormNotice] = useState('')
  const profileQuery = usePortfolioData('/profile', profile)
  const projectsQuery = usePortfolioData('/projects', projects)
  const messagesQuery = usePortfolioData('/admin/messages')
  const articlesQuery = usePortfolioData('/articles', articles)
  const technologiesQuery = usePortfolioData('/technologies', [])
  const hasError = messagesQuery.error
  const isLoading = messagesQuery.isLoading
  const needsSignIn = messagesQuery.error?.status === 401 || messagesQuery.error?.status === 403
  const profileData = profileQuery.data?.data || profileQuery.data || profile
  const profileEducation = (Array.isArray(profileData.education) ? profileData.education[0] : profileData.education) || {}
  const profileInterests = Array.isArray(profileData.interests) ? profileData.interests : []
  const profileSocialLinks = Array.isArray(profileData.socialLinks || profileData.social_links) ? (profileData.socialLinks || profileData.social_links) : []
  const projectList = normalizeCollection(projectsQuery.data?.data || projectsQuery.data)
  const messageList = normalizeCollection(messagesQuery.data?.data || messagesQuery.data)
  const articleList = normalizeCollection(articlesQuery.data?.data || articlesQuery.data)
  const technologyList = normalizeCollection(technologiesQuery.data?.data || technologiesQuery.data)
  const ownerName = profileData.name || 'Your name here'
  const ownerInitials = ownerName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()

  async function handleSaveProfile(event) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    setSaving(true)
    setFormNotice('')
    try {
      await apiRequest('/admin/profile', {
        method: 'PUT',
        body: {
          name: values.get('name'),
          role: values.get('role'),
          headline: values.get('headline'),
          shortBio: values.get('shortBio'),
          biography: values.get('biography'),
          location: values.get('location'),
          email: values.get('email'),
          education: [{ qualification: values.get('qualification'), institution: values.get('institution'), year: values.get('educationYear') }],
          interests: String(values.get('interests')).split(',').map((item) => item.trim()).filter(Boolean),
          socialLinks: [
            { label: 'GitHub', url: values.get('githubUrl') },
            { label: 'LinkedIn', url: values.get('linkedinUrl') },
          ].filter((item) => item.url),
        },
      })
      await profileQuery.mutate()
      setFormNotice('Profile updated in the connected portfolio API.')
    } catch (error) {
      setFormNotice(`${error.message} The profile was not saved.`)
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveProject(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const projectId = editingProject?.id || editingProject?.slug
    const title = String(values.get('title')).trim()
    setSaving(true)
    setFormNotice('')
    try {
      await apiRequest(projectId ? `/admin/projects/${encodeURIComponent(projectId)}` : '/admin/projects', {
        method: projectId ? 'PUT' : 'POST',
        body: {
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          category: values.get('category'),
          summary: values.get('summary'),
          description: values.get('summary'),
          goal: values.get('goal'),
          technologies: String(values.get('technologies')).split(',').map((item) => item.trim()).filter(Boolean),
          status: values.get('status'),
          featured: values.get('featured') === 'on',
        },
      })
      await projectsQuery.mutate()
      form.reset()
      setShowProjectForm(false)
      setEditingProject(null)
      setFormNotice(projectId ? 'Project updated in the connected portfolio API.' : 'Project saved to the connected portfolio API.')
    } catch (error) {
      setFormNotice(`${error.message} The project was not saved.`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteProject(project) {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return
    setSaving(true)
    setFormNotice('')
    try {
      await apiRequest(`/admin/projects/${encodeURIComponent(project.id || project.slug)}`, { method: 'DELETE' })
      await projectsQuery.mutate()
      setFormNotice('Project removed from the connected portfolio API.')
    } catch (error) {
      setFormNotice(`${error.message} The project was not deleted.`)
    } finally {
      setSaving(false)
    }
  }

  async function handleCreateArticle(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const title = String(values.get('title')).trim()
    setSaving(true)
    setFormNotice('')
    try {
      await apiRequest('/admin/articles', {
        method: 'POST',
        body: {
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          excerpt: values.get('excerpt'),
          contentMarkdown: values.get('content'),
          tags: String(values.get('tags')).split(',').map((item) => item.trim()).filter(Boolean),
          status: values.get('status'),
        },
      })
      await articlesQuery.mutate()
      form.reset()
      setShowArticleForm(false)
      setFormNotice('Journal entry saved to the connected portfolio API.')
    } catch (error) {
      setFormNotice(`${error.message} The journal entry was not saved.`)
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/admin', { replace: true })
  }

  if (isLoading) return <main className="admin-loading"><LoadingState label="Checking your admin session…" /></main>
  if (hasError || !projectsQuery.data || !messagesQuery.data || !articlesQuery.data) {
    return (
      <main className="admin-locked">
        <div className="admin-locked__mark"><Settings2 aria-hidden="true" /></div>
        <span className="eyebrow">Private workspace</span>
        <h1>{needsSignIn ? 'Your session needs a refresh.' : 'The admin API isn’t connected.'}</h1>
        <p>{needsSignIn ? 'Please sign in again to verify your access.' : 'This page stays locked until the portfolio backend provides your authenticated admin data. No browser-only auth fallback is used.'}</p>
        <Link className="button button--ink" to="/admin">Continue to sign in <ArrowUpRight aria-hidden="true" /></Link>
        <Link className="admin-locked__back" to="/">Back to the public portfolio</Link>
      </main>
    )
  }

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin/dashboard"><span className="brand-mark__symbol">i.</span><span>the inquisitive<br />builder<small>STUDIO DESK</small></span></Link>
        <span className="admin-sidebar__label">WORKSPACE</span>
        <nav aria-label="Admin navigation" className="admin-side-nav">
          {sections.map(({ id, label, icon: Icon }) => <button key={id} className={`admin-side-nav__item${activeSection === id ? ' is-active' : ''}`} type="button" onClick={() => { setActiveSection(id); setShowProjectForm(false); setShowArticleForm(false); setEditingProject(null) }}><Icon aria-hidden="true" />{label}{id === 'messages' && messageList.length > 0 && <span>{messageList.length}</span>}</button>)}
        </nav>
        <div className="admin-sidebar__bottom"><div className="admin-profile"><span className="admin-profile__avatar">{ownerInitials}</span><span><b>{ownerName}</b><small>Portfolio owner</small></span><ChevronDown aria-hidden="true" /></div><button type="button" className="admin-signout" onClick={handleSignOut}><LogOut aria-hidden="true" /> Sign out</button></div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar"><span className="admin-breadcrumb">Studio desk <span>/</span> {sections.find((section) => section.id === activeSection)?.label}</span><div className="admin-topbar__actions"><span className="admin-connected"><span /> API connected</span><Link to="/" className="admin-view-site">View site <ArrowUpRight aria-hidden="true" /></Link></div></header>
        <div className="admin-content">
          {activeSection === 'overview' && <>
            <div className="admin-page-title"><div><span className="eyebrow">YOUR PORTFOLIO / 2026</span><h1>A good day to make something.</h1><p>Here’s a quick look at what’s happening across your site.</p></div><Link className="button button--ink" to="/projects">View portfolio <ArrowUpRight aria-hidden="true" /></Link></div>
            <div className="admin-stats">
              <article><span>Published projects</span><b>{projectList.length.toString().padStart(2, '0')}</b><small><FolderKanban aria-hidden="true" /> From the projects API</small></article>
              <article><span>Journal entries</span><b>{articleList.length.toString().padStart(2, '0')}</b><small><BookOpen aria-hidden="true" /> From the journal API</small></article>
              <article><span>Messages</span><b>{messageList.length.toString().padStart(2, '0')}</b><small><Mail aria-hidden="true" /> In your inbox</small></article>
            </div>
            <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">THE LATEST</span><h2>Recent projects</h2></div><button type="button" className="admin-text-button" onClick={() => setActiveSection('projects')}>View all <ArrowUpRight aria-hidden="true" /></button></div><ProjectTable projects={projectList.slice(0, 4)} onAdd={() => { setActiveSection('projects'); setEditingProject(null); setShowProjectForm(true) }} onEdit={(project) => { setActiveSection('projects'); setEditingProject(project); setShowProjectForm(true) }} onDelete={handleDeleteProject} /></section>
            <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">INCOMING</span><h2>Recent messages</h2></div><button type="button" className="admin-text-button" onClick={() => setActiveSection('messages')}>View inbox <ArrowUpRight aria-hidden="true" /></button></div><MessageList messages={messageList.slice(0, 3)} /></section>
          </>}

          {activeSection === 'profile' && <>
            <div className="admin-page-title"><div><span className="eyebrow">YOUR STORY / PROFILE</span><h1>Public profile</h1><p>Keep the introduction, details, and places to find you up to date.</p></div><span className="admin-count">PROFILE SETTINGS</span></div>
            {formNotice && <p className="admin-inline-notice" role="status"><Check aria-hidden="true" /> {formNotice}</p>}
            <form className="admin-project-form admin-profile-form" onSubmit={handleSaveProfile}>
              <div className="admin-project-form__top"><div><span className="eyebrow">A GOOD INTRODUCTION</span><h2>What should people know?</h2></div></div>
              <label>Display name<input name="name" required maxLength={120} defaultValue={profileData.name || ''} /></label>
              <label>Professional role<input name="role" required maxLength={160} defaultValue={profileData.role || ''} /></label>
              <label>Headline<input name="headline" maxLength={180} defaultValue={profileData.headline || ''} /></label>
              <label>Short introduction<textarea name="shortBio" rows="2" maxLength={300} defaultValue={profileData.shortBio || ''} /></label>
              <label>Biography<textarea name="biography" rows="5" maxLength={5000} defaultValue={profileData.biography || ''} /></label>
              <label>Location<input name="location" maxLength={160} defaultValue={profileData.location || ''} /></label>
              <label>Contact email<input name="email" type="email" maxLength={254} defaultValue={profileData.email || ''} /></label>
              <div className="admin-form-divider"><span className="eyebrow">EDUCATION & INTERESTS</span></div>
              <label>Qualification<input name="qualification" maxLength={180} defaultValue={profileEducation.qualification || ''} /></label>
              <label>Institution<input name="institution" maxLength={180} defaultValue={profileEducation.institution || ''} /></label>
              <label>Year or timeframe<input name="educationYear" maxLength={60} defaultValue={profileEducation.year || ''} /></label>
              <label>Interests, separated by commas<input name="interests" maxLength={500} defaultValue={profileInterests.join(', ')} /></label>
              <label>GitHub URL<input name="githubUrl" type="url" placeholder="https://github.com/your-name" defaultValue={profileSocialLinks.find((item) => item.label === 'GitHub')?.url || ''} /></label>
              <label>LinkedIn URL<input name="linkedinUrl" type="url" placeholder="https://linkedin.com/in/your-name" defaultValue={profileSocialLinks.find((item) => item.label === 'LinkedIn')?.url || ''} /></label>
              <button className="button button--ink" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save profile'} <ArrowUpRight aria-hidden="true" /></button>
            </form>
          </>}

          {activeSection === 'technologies' && <>
            <div className="admin-page-title"><div><span className="eyebrow">YOUR TOOLKIT / CATALOG</span><h1>Technologies</h1><p>These labels can be attached to project entries to help people scan your work.</p></div><span className="admin-count">{technologyList.length} labels</span></div>
            <section className="admin-panel admin-panel--standalone"><div className="admin-panel__heading"><div><span className="eyebrow">AVAILABLE LABELS</span><h2>Technology catalog</h2></div><Cpu aria-hidden="true" /></div><div className="admin-tech-list">{technologyList.map((technology) => { const name = typeof technology === 'string' ? technology : technology.name; return <span className="tag" key={technology.id || name}>{name}</span> })}{!technologyList.length && <p className="admin-empty">Add technology names in the project editor. The catalog will appear here when the API returns them.</p>}</div></section>
          </>}

          {activeSection === 'projects' && <>
            <div className="admin-page-title"><div><span className="eyebrow">YOUR WORK / CONTENT</span><h1>Projects</h1><p>Keep your selected work clear, current, and easy to explore.</p></div><button className="button button--ink" type="button" onClick={() => { setEditingProject(null); setShowProjectForm((shown) => !shown); setFormNotice('') }}><Plus aria-hidden="true" /> New project</button></div>
            {formNotice && <p className="admin-inline-notice" role="status"><Check aria-hidden="true" /> {formNotice}</p>}
            {showProjectForm && <form className="admin-project-form" onSubmit={handleSaveProject}><div className="admin-project-form__top"><div><span className="eyebrow">{editingProject ? 'REFINE THE DETAILS' : 'A NEW IDEA'}</span><h2>{editingProject ? 'Update this project.' : 'Start a project entry.'}</h2></div><button type="button" className="admin-close-form" aria-label="Close project form" onClick={() => { setShowProjectForm(false); setEditingProject(null) }}>×</button></div><label>Project title<input name="title" required maxLength={120} defaultValue={editingProject?.title || ''} placeholder="A name worth remembering" /></label><label>Category<input name="category" required maxLength={80} defaultValue={editingProject?.category || ''} placeholder="Product, experiment…" /></label><label>Short summary<textarea name="summary" rows="3" required maxLength={300} defaultValue={editingProject?.summary || ''} placeholder="What was the question or useful idea?" /></label><label>Project goal<textarea name="goal" rows="3" maxLength={1000} defaultValue={editingProject?.goal || ''} placeholder="What should feel better after this work?" /></label><label>Technologies, separated by commas<input name="technologies" maxLength={300} defaultValue={(editingProject?.technologies || []).map((item) => typeof item === 'string' ? item : item.name).join(', ')} placeholder="React, Vite, CSS" /></label><label>Publication status<select name="status" defaultValue={String(editingProject?.status || 'draft').toLowerCase()}><option value="draft">Draft</option><option value="published">Published</option></select></label><label className="admin-checkbox"><input name="featured" type="checkbox" defaultChecked={Boolean(editingProject?.featured)} /> Feature this project on the homepage</label><button className="button button--ink" type="submit" disabled={saving}>{saving ? 'Saving…' : editingProject ? 'Update project' : 'Save project'} <ArrowUpRight aria-hidden="true" /></button></form>}
            <section className="admin-panel"><div className="admin-panel__heading"><div><span className="eyebrow">CONTENT LIBRARY</span><h2>All projects</h2></div><span className="admin-count">{projectList.length} entries</span></div><ProjectTable projects={projectList} onAdd={() => { setEditingProject(null); setShowProjectForm(true) }} onEdit={(project) => { setEditingProject(project); setShowProjectForm(true); setFormNotice('') }} onDelete={handleDeleteProject} /></section>
          </>}

          {activeSection === 'articles' && <>
            <div className="admin-page-title"><div><span className="eyebrow">YOUR WRITING / CONTENT</span><h1>Journal</h1><p>Publish notes from the work, questions, and ideas you want to keep.</p></div><button className="button button--ink" type="button" onClick={() => { setShowArticleForm((shown) => !shown); setFormNotice('') }}><FilePlus2 aria-hidden="true" /> New entry</button></div>
            {formNotice && <p className="admin-inline-notice" role="status"><Check aria-hidden="true" /> {formNotice}</p>}
            {showArticleForm && <form className="admin-project-form" onSubmit={handleCreateArticle}><div className="admin-project-form__top"><div><span className="eyebrow">A NOTE WORTH KEEPING</span><h2>Start a journal entry.</h2></div><button type="button" className="admin-close-form" aria-label="Close journal form" onClick={() => setShowArticleForm(false)}>×</button></div><label>Title<input name="title" required maxLength={180} placeholder="A useful question, a small discovery…" /></label><label>Short excerpt<textarea name="excerpt" rows="3" required maxLength={500} placeholder="What is this note about?" /></label><label>Article content<textarea name="content" rows="9" required maxLength={30000} placeholder="Write the full note. Markdown is supported by the connected API." /></label><label>Tags, separated by commas<input name="tags" maxLength={300} placeholder="Process, learning, engineering" /></label><label>Publication status<select name="status" defaultValue="draft"><option value="draft">Save as draft</option><option value="published">Publish now</option></select></label><button className="button button--ink" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save entry'} <ArrowUpRight aria-hidden="true" /></button></form>}
            <section className="admin-panel admin-panel--standalone"><div className="admin-panel__heading"><div><span className="eyebrow">PUBLISHED WRITING</span><h2>Journal entries</h2></div><span className="admin-count">{articleList.length} published</span></div><div className="admin-record-list">{articleList.map((article) => <article key={article.id || article.slug}><span className="admin-record-icon"><BookOpen aria-hidden="true" /></span><div><b>{article.title}</b><small>{article.date || article.publishedAt || 'Published'} · {article.status || 'Published'}</small></div><ArrowDownLeft aria-hidden="true" /></article>)}{!articleList.length && <p className="admin-empty">Your next note can start here.</p>}</div></section>
          </>}

          {activeSection === 'messages' && <section className="admin-panel admin-panel--standalone"><div className="admin-panel__heading"><div><span className="eyebrow">INCOMING / YOUR INBOX</span><h1>Messages</h1></div><span className="admin-count">{messageList.length} notes</span></div><MessageList messages={messageList} /></section>}
        </div>
      </section>
    </main>
  )
}

function ProjectTable({ projects, onAdd, onEdit, onDelete }) {
  if (!projects.length) return <div className="admin-empty-state"><FolderKanban aria-hidden="true" /><h3>A little space for what&apos;s next.</h3><p>Add a project to begin your collection.</p><button className="admin-text-button" type="button" onClick={onAdd}>Add a project <Plus aria-hidden="true" /></button></div>

  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>PROJECT</th><th>CATEGORY</th><th>STATUS</th><th>YEAR</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{projects.map((project) => <tr key={project.id || project.slug}><td><span className="admin-project-thumb" aria-hidden="true">{project.title?.charAt(0) || 'P'}</span><span><b>{project.title}</b><small>{project.slug}</small></span></td><td>{project.category || '—'}</td><td><span className={`admin-status${String(project.status || 'published').toLowerCase() === 'published' ? ' is-live' : ''}`}>{project.status || 'Published'}</span></td><td>{project.year || '—'}</td><td className="admin-table__actions"><button className="admin-table-action" type="button" onClick={() => onEdit(project)} aria-label={`Edit ${project.title}`}><Pencil aria-hidden="true" />Edit</button><button className="admin-table-action admin-table-action--danger" type="button" onClick={() => onDelete(project)} aria-label={`Delete ${project.title}`}><Trash2 aria-hidden="true" />Delete</button></td></tr>)}</tbody></table></div>
}

function MessageList({ messages }) {
  if (!messages.length) return <div className="admin-empty-state admin-empty-state--small"><Mail aria-hidden="true" /><h3>Nothing waiting for a reply.</h3><p>New notes from your contact form will show up here.</p></div>
  return <div className="admin-record-list">{messages.map((message) => <article key={message.id || message.email}><span className="admin-record-icon"><Mail aria-hidden="true" /></span><div><b>{message.name || 'New message'} <span>— {message.subject || 'Hello'}</span></b><small>{message.email} · {message.createdAt || message.created_at || 'Recently received'}</small></div><ArrowUpRight aria-hidden="true" /></article>)}</div>
}
