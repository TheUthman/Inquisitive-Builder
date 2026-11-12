import { useMemo, useState } from 'react'
import { ArrowDown, SlidersHorizontal } from 'lucide-react'
import { PageIntro, ProjectCard, SourceNote } from '../components/PortfolioUI'
import { EmptyState } from '../components/LoadingState'
import { normalizeCollection, projects } from '../data/portfolio'
import { usePortfolioData } from '../hooks/usePortfolioData'

const filters = ['All work', 'Product', 'Community', 'Experiment']

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All work')
  const { data, error } = usePortfolioData('/projects', projects)
  const projectList = normalizeCollection(data)
  const visibleProjects = useMemo(() => activeFilter === 'All work'
    ? projectList
    : projectList.filter((project) => project.category?.toLowerCase() === activeFilter.toLowerCase()), [activeFilter, projectList])

  return (
    <main id="main-content" className="page-wrap inner-page projects-page">
      <PageIntro eyebrow="Selected work · 2023—26" title={<>A collection of<br /><em>curiosity, made visible.</em></>} description="A few projects, experiments and useful questions turned into things you can click on. Sample projects are used here until your own work is ready." />
      <div className="projects-toolbar">
        <div className="projects-toolbar__label"><SlidersHorizontal aria-hidden="true" /><span>Browse by kind</span></div>
        <div className="filter-list" role="group" aria-label="Filter projects">
          {filters.map((filter) => (
            <button className={`filter-chip${activeFilter === filter ? ' is-active' : ''}`} type="button" key={filter} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
              {filter}
            </button>
          ))}
        </div>
        <span className="projects-count">{visibleProjects.length.toString().padStart(2, '0')} PROJECTS</span>
      </div>
      {visibleProjects.length ? (
        <div className="project-grid project-grid--listing">
          {visibleProjects.map((project, index) => <ProjectCard key={project.id || project.slug} project={project} index={index} />)}
        </div>
      ) : (
        <EmptyState title="Nothing in this corner yet." detail="Try another filter, or check back after the next experiment." />
      )}
      <div className="projects-footnote"><ArrowDown aria-hidden="true" /><span>Each project is a snapshot of a question, a process, and what I learned along the way.</span></div>
    </main>
  )
}
