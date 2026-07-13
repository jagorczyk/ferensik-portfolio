import type { ModelInfo } from '../data/models'
import { useContact } from '../context/ContactContext'
import ModelViewer from './ModelViewer'
import { ArrowIcon } from './icons'

export default function ModelRow({ model }: { model: ModelInfo }) {
  const { requestContact } = useContact()
  return (
    <article className="model-row">
      <div className="model-row-copy">
        <span className="model-row-number">{model.number}</span>
        <h3>{model.label}</h3>
        <p>{model.description}</p>
        <div className="model-row-footer">
          <span className="model-row-price">{model.price}</span>
          <button type="button" className="ghost-button" onClick={() => requestContact(model)}>
            <span>Zapytaj o ten model</span>
            <ArrowIcon />
          </button>
        </div>
      </div>
      <div className="model-row-stage">
        <ModelViewer modelName={model.id} interactive={false} label={model.label} />
      </div>
    </article>
  )
}
