import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const EASE_OUT = [0.16, 1, 0.3, 1] as const
const EASE_IN = [0.7, 0, 0.84, 0] as const

/**
 * Full-screen monochrome curtain wipe: two panels meet in the middle to cover the
 * outgoing page, then part again to reveal the incoming one. Content fades/slides
 * in just behind the parting curtain.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()

  const panelTop = reducedMotion
    ? { initial: { y: '-100%' }, animate: { y: '-100%' }, exit: { y: '-100%' } }
    : {
        initial: { y: '0%' },
        animate: { y: '-100%', transition: { duration: 0.46, ease: EASE_OUT, delay: 0.06 } },
        exit: { y: '0%', transition: { duration: 0.36, ease: EASE_IN } },
      }

  const panelBottom = reducedMotion
    ? { initial: { y: '100%' }, animate: { y: '100%' }, exit: { y: '100%' } }
    : {
        initial: { y: '0%' },
        animate: { y: '100%', transition: { duration: 0.46, ease: EASE_OUT, delay: 0.06 } },
        exit: { y: '0%', transition: { duration: 0.36, ease: EASE_IN } },
      }

  const content = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.24 } },
        exit: { opacity: 0, y: -14, transition: { duration: 0.22, ease: EASE_IN } },
      }

  return (
    <motion.div className="page-transition" initial="initial" animate="animate" exit="exit">
      <motion.div className="page-panel page-panel-top" variants={panelTop} aria-hidden="true" />
      <motion.div className="page-panel page-panel-bottom" variants={panelBottom} aria-hidden="true" />
      <motion.div variants={content}>{children}</motion.div>
    </motion.div>
  )
}
