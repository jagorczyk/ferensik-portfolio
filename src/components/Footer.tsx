import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <span>© 2026 FERENSIK</span>
      <span>Modele 3D do MTA / GTA San Andreas</span>
      <span className="footer-links">
        <Link to="/polityka-prywatnosci">Polityka prywatności</Link>
        <a href="https://jagorczyk.pl" target="_blank" rel="noreferrer">Made by jagorczyk.pl</a>
        <a href="https://brbn.pl" target="_blank" rel="noreferrer">brbn.pl</a>
      </span>
    </footer>
  )
}
