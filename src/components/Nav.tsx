import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/#o-mnie', label: 'O mnie' },
  { to: '/#modele', label: 'Modele' },
  { to: '/#skiny', label: 'Skiny' },
  { to: '/#kontakt', label: 'Kontakt' },
]

export default function Nav() {
  return (
    <nav className="nav" aria-label="Nawigacja główna">
      <Link className="brand" to="/" aria-label="FERENSIK — strona główna">
        FERENSIK
      </Link>
      <div className="nav-links">
        {LINKS.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
