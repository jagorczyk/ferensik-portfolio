import { useState } from 'react'
import { MODELS } from '../data/models'
import ModelRow from './ModelRow'
import { DownArrowIcon } from './icons'

export default function ModelsSection() {
  const [expanded, setExpanded] = useState(false)
  const featuredModels = MODELS.slice(0, 3)
  const remainingModels = MODELS.slice(3)

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
        {remainingModels.length > 0 && (
          <div id="additional-models" className={`additional-models${expanded ? ' is-expanded' : ''}`} aria-hidden={!expanded}>
            <div className="additional-models-inner">
              {remainingModels.map((model) => (
                <ModelRow key={model.id} model={model} />
              ))}
            </div>
          </div>
        )}
      </div>
      {remainingModels.length > 0 && (
        <button
          type="button"
          className="expand-models-button"
          aria-expanded={expanded}
          aria-controls="additional-models"
          onClick={() => setExpanded((value) => !value)}
        >
          <span>{expanded ? 'Zwiń dodatkowe modele' : 'Pokaż pozostałe modele'}</span>
          <DownArrowIcon expanded={expanded} />
        </button>
      )}
    </section>
  )
}
