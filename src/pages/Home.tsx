import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BuildingHero from '../components/BuildingHero'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import AboutSection from '../components/AboutSection'
import ModelsSection from '../components/ModelsSection'
import SkinsTeaser from '../components/SkinsTeaser'
import ContactSection from '../components/ContactSection'
import PageTransition from '../components/PageTransition'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const HERO_SEEN_KEY = 'ferensik-hero-seen'

function heroAlreadySeen(): boolean {
  try {
    return sessionStorage.getItem(HERO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export default function Home() {
  const [showHero, setShowHero] = useState(() => !heroAlreadySeen())
  const location = useLocation()
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (showHero) return
    const id = location.hash?.slice(1)
    if (!id) {
      window.scrollTo(0, 0)
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    const frame = requestAnimationFrame(() =>
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }),
    )
    return () => cancelAnimationFrame(frame)
  }, [location.hash, showHero, reducedMotion])

  const handleHeroComplete = () => {
    try {
      sessionStorage.setItem(HERO_SEEN_KEY, '1')
    } catch {
      /* sessionStorage unavailable in this context — hero simply replays next time */
    }
    window.scrollTo(0, 0)
    setShowHero(false)
  }

  return (
    <PageTransition>
      {showHero ? (
        <BuildingHero onComplete={handleHeroComplete} />
      ) : (
        <main className="reveal-fade">
          <Nav />
          <AboutSection />
          <ModelsSection />
          <SkinsTeaser />
          <ContactSection />
          <Footer />
        </main>
      )}
    </PageTransition>
  )
}
