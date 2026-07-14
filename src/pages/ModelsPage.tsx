import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import ModelViewer from '../components/ModelViewer'
import { ArrowIcon, BackArrowIcon } from '../components/icons'
import { useContact } from '../context/ContactContext'
import { MODELS, type ModelInfo } from '../data/models'

function CatalogCard({ model }: { model: ModelInfo }) {
  const { requestContact } = useContact()
  return (
    <article className="catalog-card">
      <div className="catalog-card-stage">
        <ModelViewer modelName={model.id} label={model.label} />
      </div>
      <div className="catalog-card-meta">
        <div className="catalog-card-heading">
          <span>{model.number}</span>
          <h2>{model.label}</h2>
        </div>
        <p>{model.description}</p>
        <div className="catalog-card-footer">
          <span className="model-row-price">{model.price}</span>
          <button type="button" className="ghost-button" onClick={() => requestContact(model)}>
            <span>Zapytaj o ten model</span>
            <ArrowIcon />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function ModelsPage() {
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
          <h1 className="display-heading">Wszystkie modele.</h1>
          <p>
            Pełny katalog obiektów 3D gotowych do wgrania na serwer MTA. Każdy podgląd jest interaktywny —
            przeciągnij, aby obrócić, i przybliż scrollem.
          </p>
        </header>
        <div className="catalog-grid">
          {MODELS.map((model) => (
            <CatalogCard key={model.id} model={model} />
          ))}
        </div>
        <Footer />
      </main>
    </PageTransition>
  )
}
