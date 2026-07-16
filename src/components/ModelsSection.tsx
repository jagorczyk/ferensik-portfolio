import { Link } from 'react-router-dom'
import { MODELS } from '../data/models'
import ModelRow from './ModelRow'
import { LongArrowIcon } from './icons'

export default function ModelsSection() {
  const featuredIds = new Set(['domek', 'gurzad', 'lscarstore'])
  const featuredModels = MODELS.filter((model) => featuredIds.has(model.id))

  return (
    <section className="models" id="modele">
      <div className="section-heading">
        <div className="section-label">
          <span>Modele</span>
        </div>
        <span className="section-count">{MODELS.length} obiekty</span>
      </div>
      <div className="model-rows">
        {featuredModels.map((model) => (
          <ModelRow key={model.id} model={model} />
        ))}
      </div>
      <Link className="see-all-link" to="/modele">
        <span>Zobacz wszystkie modele</span>
        <LongArrowIcon />
      </Link>
    </section>
  )
}
