import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import DffModel from './DffModel'

const MODELS = [
  { id: 'sara', label: 'Sara', number: '01', price: '149 zł' },
  { id: 'domek', label: 'Domek', number: '02', price: '249 zł' },
  { id: 'sv', label: 'SV', number: '03', price: '199 zł' },
]

function FallbackObject() { return <group><mesh rotation={[0.2, 0, 0]}><icosahedronGeometry args={[1.45, 2]} /><meshStandardMaterial color="#e9e9e9" roughness={0.28} metalness={0.3} wireframe /></mesh><mesh position={[0, 0.15, 0]} scale={[0.78, 1.4, 0.78]}><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color="#222" roughness={0.22} metalness={0.5} /></mesh></group> }

function RotatingModel({ modelName, paused, resetSignal }: { modelName: string; paused: boolean; resetSignal: number }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => { if (group.current && !paused) group.current.rotation.z += delta * 0.34 })
  useEffect(() => { if (group.current && resetSignal > 0) group.current.rotation.z = Math.PI / 2 }, [resetSignal])
  return <group ref={group} rotation={[0, 0, Math.PI / 2]} scale={1.2}><DffModel modelName={modelName} fallback={<FallbackObject />} /></group>
}

function ModelCanvas({ modelName, interactive = true }: { modelName: string; interactive?: boolean }) {
  const controls = useRef<any>(null)
  const [paused, setPaused] = useState(!interactive)
  const [resetSignal, setResetSignal] = useState(0)
  const resetView = () => { controls.current?.reset(); setResetSignal((value) => value + 1) }
  return <div className={`model-viewer${interactive && paused ? ' is-active' : ''}${interactive ? ' is-interactive' : ' is-static'}`}>
    <Canvas camera={{ position: [0, 4.6, 0], up: [0, 0, 1], fov: 38 }} dpr={[1, 1.7]} gl={{ antialias: true }}>
      <color attach="background" args={['#080808']} /><ambientLight intensity={0.55} /><directionalLight position={[3, 4, 2]} intensity={1.65} color="#fff" /><directionalLight position={[-3, 0, -2]} intensity={0.55} color="#777" />
      <Suspense fallback={null}><RotatingModel modelName={modelName} paused={paused} resetSignal={resetSignal} /><Environment preset="studio" /><ContactShadows position={[0, -1.8, 0]} opacity={0.55} scale={5} blur={2.5} /></Suspense>
      <OrbitControls ref={controls} enabled={interactive} target={[0, 0, 0]} enablePan={false} minDistance={1.3} maxDistance={6} autoRotate={false} makeDefault onStart={() => setPaused(true)} onEnd={() => setPaused(false)} />
    </Canvas>
    {interactive && <div className="viewer-overlay"><span>{paused ? 'Sterowanie aktywne' : 'Przeciągnij, aby obrócić · scroll, aby przybliżyć'}</span><button type="button" onClick={resetView}>Reset widoku</button></div>}
  </div>
}

function StaticSkinsScene() {
  return <div className="skins-stage" aria-label="Statyczne modele skinów"><Canvas camera={{ position: [0, 6.8, 1.1], up: [0, 0, 1], fov: 32 }} dpr={[1, 1.7]} gl={{ antialias: true }}><color attach="background" args={['#080808']} /><ambientLight intensity={0.42} /><directionalLight position={[3, 4, 5]} intensity={1.15} color="#fff" /><directionalLight position={[-4, 1, 2]} intensity={0.35} color="#666" /><Suspense fallback={null}><group position={[-0.82, 0, 0]} rotation={[0, 0, Math.PI / 2 + Math.PI / 4]} scale={1.05}><DffModel modelName="AzusaGibbous" basePath="/skins" materialColor="#b8b8b2" fallback={<FallbackObject />} /></group><group position={[0.82, -0.38, 0]} rotation={[0, 0, Math.PI / 2 + Math.PI / 4 + Math.PI / 12]} scale={1.05}><DffModel modelName="tung" basePath="/skins" materialColor="#b8b8b2" fallback={<FallbackObject />} /></group><Environment preset="studio" /><ContactShadows position={[0, 0, -1.25]} opacity={0.82} scale={4.4} blur={2.2} /></Suspense></Canvas></div>
}
function InstagramIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg> }
function GithubIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.51c.48.09.66-.2.66-.46v-1.67c-2.7.59-3.27-1.15-3.27-1.15-.44-1.12-1.08-1.42-1.08-1.42-.88-.6.07-.59.07-.59.97.07 1.48.99 1.48.99.86 1.47 2.26 1.05 2.81.8.09-.63.34-1.05.61-1.29-2.15-.24-4.41-1.08-4.41-4.8 0-1.06.38-1.92 1-2.6-.1-.24-.43-1.23.1-2.56 0 0 .82-.26 2.67.99a9.3 9.3 0 0 1 4.86 0c1.85-1.25 2.67-.99 2.67-.99.53 1.33.2 2.32.1 2.56.62.68 1 1.54 1 2.6 0 3.73-2.27 4.56-4.43 4.8.35.3.66.87.66 1.75v2.59c0 .26.18.55.67.46A9.5 9.5 0 0 0 12 2.5Z" /></svg> }
function ArrowIcon() { return <svg className="external-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg> }function CartIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg> }

export default function App() {
  const [sent, setSent] = useState(false)
  const [modalModel, setModalModel] = useState<(typeof MODELS)[number] | null>(null)
  const [contactModel, setContactModel] = useState<(typeof MODELS)[number] | null>(null)
  const [subject, setSubject] = useState('')
  useEffect(() => {
    if (!modalModel) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setModalModel(null) }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', closeOnEscape) }
  }, [modalModel])
  const chooseModel = (model: (typeof MODELS)[number]) => { setContactModel(model); setSubject(`Zakup modelu: ${model.label}`); setSent(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }
  return <main>
    <nav className="nav"><a className="brand" href="#top">FERENSIK</a><div className="nav-links"><a href="#models">Modele</a><a href="#about">O mnie</a><a href="#contact">Kontakt</a></div></nav>
    <header className="intro" id="top"><div className="intro-copy-block"><h1>Modele<br /><span>3D.</span></h1><p className="intro-copy">Obiekty tworzone do świata MTA.</p></div></header>
    <section className="models" id="models"><div className="section-heading"><h2>Modele</h2><span>{MODELS.length} obiekty</span></div><div className="models-grid">{MODELS.map((model) => <article className="model-card" key={model.id} tabIndex={0} role="button" aria-label={`Otwórz podgląd modelu ${model.label}`} onClick={(event) => { if (!(event.target as HTMLElement).closest('button')) setModalModel(model) }} onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && event.target === event.currentTarget) { event.preventDefault(); setModalModel(model) } }}><div className="model-canvas"><ModelCanvas modelName={model.id} interactive={false} /></div><div className="model-meta"><div className="model-card-heading"><span>{model.number}</span><h2>{model.label}</h2></div><p className="model-price">{model.price}</p><button className="buy-button" type="button" onClick={() => chooseModel(model)}><CartIcon /><span>Dodaj do koszyka</span></button></div></article>)}</div></section>
    <section className="about" id="about"><div className="about-copy"><h2>O mnie</h2><p>Modeluję obiekty 3D do MTA od 2020 roku. Zajmuję się całym procesem — od bryły i tekstur po przygotowanie modelu do użycia w grze.</p></div><StaticSkinsScene /></section>
    <section className="contact" id="contact"><div><h2>Kontakt</h2><div className="socials"><a href="https://instagram.com/ferensik" target="_blank" rel="noreferrer"><InstagramIcon /> Instagram <ArrowIcon /></a><a href="https://github.com/ferensik" target="_blank" rel="noreferrer"><GithubIcon /> GitHub <ArrowIcon /></a></div></div><form onSubmit={(event) => { event.preventDefault(); setSent(true) }}><div className={`selected-model${contactModel ? ' has-selection' : ''}`} aria-live="polite">{contactModel ? <>Wybrany model: <strong>{contactModel.label}</strong><span>{contactModel.price}</span></> : 'Wybierz model powyżej albo napisz bezpośrednio.'}</div><label>Imię<input required name="name" placeholder="Twoje imię" /></label><label>E-mail<input required type="email" name="email" placeholder="twoj@email.com" /></label><label>Temat<input required name="subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Temat wiadomości" /></label><label>Wiadomość<textarea required name="message" rows={5} placeholder="Treść wiadomości" /></label><button type="submit">{sent ? <>Wysłano ✓</> : <>Wyślij wiadomość <ArrowIcon /></>}</button></form></section>
    {modalModel && <div className="model-modal" role="presentation" onClick={() => setModalModel(null)}><div className="model-modal-panel" role="dialog" aria-modal="true" aria-labelledby="model-modal-title" onClick={(event) => event.stopPropagation()}><div className="model-modal-header"><div><span>{modalModel.number}</span><h2 id="model-modal-title">{modalModel.label}</h2></div><button className="modal-close" type="button" aria-label="Zamknij podgląd" onClick={() => setModalModel(null)}>×</button></div><div className="model-modal-canvas"><ModelCanvas modelName={modalModel.id} /></div><div className="model-modal-footer"><span>{modalModel.price}</span><span>Przeciągnij, aby obracać · scroll, aby przybliżyć</span></div></div></div>}
    <footer><span>© 2026 FERENSIK</span></footer>
  </main>
}