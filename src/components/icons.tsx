export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.51c.48.09.66-.2.66-.46v-1.67c-2.7.59-3.27-1.15-3.27-1.15-.44-1.12-1.08-1.42-1.08-1.42-.88-.6.07-.59.07-.59.97.07 1.48.99 1.48.99.86 1.47 2.26 1.05 2.81.8.09-.63.34-1.05.61-1.29-2.15-.24-4.41-1.08-4.41-4.8 0-1.06.38-1.92 1-2.6-.1-.24-.43-1.23.1-2.56 0 0 .82-.26 2.67.99a9.3 9.3 0 0 1 4.86 0c1.85-1.25 2.67-.99 2.67-.99.53 1.33.2 2.32.1 2.56.62.68 1 1.54 1 2.6 0 3.73-2.27 4.56-4.43 4.8.35.3.66.87.66 1.75v2.59c0 .26.18.55.67.46A9.5 9.5 0 0 0 12 2.5Z" />
    </svg>
  )
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={`external-arrow${className ? ` ${className}` : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function BackArrowIcon() {
  return (
    <svg className="back-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 7 7 17M16 17H7V8" />
    </svg>
  )
}

export function LongArrowIcon() {
  return (
    <svg className="long-arrow" viewBox="0 0 32 12" aria-hidden="true">
      <path d="M0.5 6H30.5M24 1l6.5 5-6.5 5" />
    </svg>
  )
}
