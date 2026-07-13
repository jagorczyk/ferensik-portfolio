import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODELS, type ModelInfo } from '../data/models'

const autoSubject = (model: ModelInfo) => `Zakup modelu: ${model.label}`
/** True when the subject is exactly one of the auto-generated "Zakup modelu: …" values. */
const isAutoSubject = (value: string) => MODELS.some((model) => autoSubject(model) === value)

interface ContactContextValue {
  contactModel: ModelInfo | null
  subject: string
  setSubject: (value: string) => void
  sent: boolean
  setSent: (value: boolean) => void
  /**
   * Sets (or clears, with null) the selected model and keeps the subject in sync.
   * Clearing only wipes the subject if it is still an untouched auto-generated one.
   */
  selectModel: (model: ModelInfo | null) => void
  /** Like selectModel, but also jumps to the contact section (from any page). */
  requestContact: (model: ModelInfo) => void
}

const ContactContext = createContext<ContactContextValue | null>(null)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [contactModel, setContactModel] = useState<ModelInfo | null>(null)
  const [subject, setSubject] = useState('')
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  const selectModel = useCallback((model: ModelInfo | null) => {
    setContactModel(model)
    setSent(false)
    if (model) {
      setSubject(autoSubject(model))
    } else {
      setSubject((previous) => (isAutoSubject(previous) ? '' : previous))
    }
  }, [])

  const requestContact = useCallback(
    (model: ModelInfo) => {
      selectModel(model)
      navigate('/#kontakt')
    },
    [selectModel, navigate],
  )

  const value = useMemo<ContactContextValue>(
    () => ({ contactModel, subject, setSubject, sent, setSent, selectModel, requestContact }),
    [contactModel, subject, sent, selectModel, requestContact],
  )

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}

export function useContact(): ContactContextValue {
  const ctx = useContext(ContactContext)
  if (!ctx) throw new Error('useContact must be used within a ContactProvider')
  return ctx
}
