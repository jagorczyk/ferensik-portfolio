import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ContactProvider } from './context/ContactContext'
import Home from './pages/Home'
import ModelsPage from './pages/ModelsPage'
import SkinsPage from './pages/SkinsPage'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/modele" element={<ModelsPage />} />
        <Route path="/skiny" element={<SkinsPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ContactProvider>
        <AnimatedRoutes />
      </ContactProvider>
    </BrowserRouter>
  )
}
