export function LoadingState({ label = 'Gathering the latest notes…' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-state__mark" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({ title, detail }) {
  return (
    <div className="empty-state">
      <span className="empty-state__mark" aria-hidden="true">∅</span>
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  )
}
