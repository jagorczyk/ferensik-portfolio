import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import ModelViewer from '../components/ModelViewer'
import { BackArrowIcon } from '../components/icons'
import { SKINS } from '../data/skins'

export default function SkinsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PageTransition>
      <main>
        <Nav />
        <header className="catalog-header">
          <Link className="back-link" to="/">
            <BackArrowIcon />
            <span>Powrót</span>
          </Link>
          <div className="section-label">
            <span>Katalog</span>
          </div>
          <h1 className="display-heading">Wszystkie skiny.</h1>
          <p>Skiny postaci przygotowane pod standardowy szkielet CJ. Obróć podgląd, aby zobaczyć model z każdej strony.</p>
        </header>
        <div className="catalog-grid catalog-grid-skins">
          {SKINS.map((skin) => (
            <article className="catalog-card" key={skin.id}>
              <div className="catalog-card-stage">
                <ModelViewer modelName={skin.id} basePath="/skins" materialColor="#b8b8b2" label={skin.label} />
              </div>
              <div className="catalog-card-meta">
                <h2>{skin.label}</h2>
                <p>{skin.description}</p>
              </div>
            </article>
          ))}
        </div>
        <Footer />
      </main>
    </PageTransition>
  )
}
