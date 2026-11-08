import { useState } from 'react'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../components/ThemeProvider'

const links = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Work' },
  { to: '/exploration', label: 'Explore' },
  { to: '/journal', label: 'Journal' },
]

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="preview-ribbon" role="note">
        <span className="preview-ribbon__dot" aria-hidden="true" />
        Sample portfolio · replace this draft content with your own before launch
      </div>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand-mark" to="/" aria-label="The Inquisitive Builder home" onClick={closeMenu}>
            <span className="brand-mark__symbol" aria-hidden="true">i.</span>
            <span className="brand-mark__wordmark">the inquisitive<br />builder</span>
          </Link>

          <button
            className="icon-button nav-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <nav id="primary-navigation" className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={closeMenu} className={({ isActive }) => `primary-nav__link${isActive ? ' is-active' : ''}`}>
                {link.label}
              </NavLink>
            ))}
            <Link className="nav-contact" to="/contact" onClick={closeMenu}>
              Say hello <ArrowUpRight aria-hidden="true" />
            </Link>
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            </button>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="site-footer__inner">
          <Link className="footer-brand" to="/">The Inquisitive Builder<span>Curiosity, in progress.</span></Link>
          <p className="footer-note">Made with care, and a few unanswered questions.</p>
          <div className="footer-links">
            <Link to="/projects">Work</Link>
            <Link to="/journal">Journal</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <span className="footer-copyright">© {new Date().getFullYear()} · Sample portfolio</span>
        </div>
      </footer>
    </div>
  )
}
