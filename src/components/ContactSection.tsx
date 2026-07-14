import { useContact } from '../context/ContactContext'
import { MODELS } from '../data/models'
import { ArrowIcon, GithubIcon, InstagramIcon } from './icons'

function SelectCaret() {
  return (
    <svg className="select-caret" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 4l4 4 4-4" />
    </svg>
  )
}

export default function ContactSection() {
  const { contactModel, subject, setSubject, sent, setSent, selectModel } = useContact()

  return (
    <section className="contact" id="kontakt">
      <div className="contact-intro">
        <div className="section-label">
          <span>Kontakt</span>
        </div>
        <h2 className="display-heading">Napisz do mnie.</h2>
        <div className="socials">
          <a href="https://instagram.com/ferensik" target="_blank" rel="noreferrer">
            <InstagramIcon /> Instagram <ArrowIcon />
          </a>
          <a href="https://github.com/ferensik" target="_blank" rel="noreferrer">
            <GithubIcon /> GitHub <ArrowIcon />
          </a>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSent(true)
        }}
      >
        <div className={`selected-model${contactModel ? ' has-selection' : ''}`} aria-live="polite">
          {contactModel ? (
            <>
              <span>
                Wybrany model: <strong>{contactModel.label}</strong>
              </span>
              <span className="selected-model-price">{contactModel.price}</span>
            </>
          ) : (
            <span>Zapytanie ogólne — model możesz wybrać w polu poniżej.</span>
          )}
        </div>
        <label>
          Model
          <div className="select-wrap">
            <select
              name="model"
              value={contactModel?.id ?? ''}
              onChange={(event) => selectModel(MODELS.find((model) => model.id === event.target.value) ?? null)}
            >
              <option value="">Zapytanie ogólne</option>
              {MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.number} — {model.label} · {model.price}
                </option>
              ))}
            </select>
            <SelectCaret />
          </div>
        </label>
        <label>
          Imię
          <input required name="name" placeholder="Twoje imię" />
        </label>
        <label>
          E-mail
          <input required type="email" name="email" placeholder="twoj@email.com" />
        </label>
        <label>
          Temat
          <input
            required
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Temat wiadomości"
          />
        </label>
        <label>
          Wiadomość
          <textarea required name="message" rows={5} placeholder="Treść wiadomości" />
        </label>
        <button type="submit">{sent ? 'Wysłano ✓' : 'Wyślij wiadomość ↗'}</button>
      </form>
    </section>
  )
}
