import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import * as THREE from 'three'
import DffModel from '../DffModel'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/** Shown briefly while domek.dff / domek.txd are fetched and parsed. */
function HeroFallback() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.3
    const material = ref.current.material as THREE.MeshStandardMaterial
    material.opacity = 0.55 + Math.sin(state.clock.elapsedTime * 2) * 0.2
  })
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1.7, 1.7, 1.7]} />
      <meshStandardMaterial color="#4a4a48" wireframe transparent opacity={0.6} />
    </mesh>
  )
}

function RotatingBuilding({ spinning }: { spinning: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (group.current && spinning) group.current.rotation.z += delta * 0.12
  })
  return (
    <group ref={group} position={[0, 0, 0.55]} rotation={[0, 0, Math.PI / 4]} scale={1.3}>
      <DffModel modelName="domek" fallback={<HeroFallback />} />
    </group>
  )
}

const START_POSITION = new THREE.Vector3(0, 7.2, 3.1)
const TARGET_POSITION = new THREE.Vector3(0, 0.35, 1.05)
// Framing aims below the (raised) building so it sits high in the viewport;
// during the flight the look target glides up to the interior point.
const FRAME_LOOK = new THREE.Vector3(0, 0.1, 0.45)
const INTERIOR_LOOK = new THREE.Vector3(0, 0.1, 1.0)
const FADE_START = 0.55

function CameraFlight({
  flying,
  duration,
  overlayRef,
  onArrive,
}: {
  flying: boolean
  duration: number
  overlayRef: MutableRefObject<HTMLDivElement | null>
  onArrive: () => void
}) {
  const { camera } = useThree()
  const startTime = useRef<number | null>(null)
  const arrived = useRef(false)
  const lookTarget = useRef(new THREE.Vector3())

  useEffect(() => {
    camera.up.set(0, 0, 1)
    camera.position.copy(START_POSITION)
    camera.lookAt(FRAME_LOOK)
  }, [camera])

  useFrame((state) => {
    if (!flying || arrived.current) return
    if (startTime.current === null) startTime.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - startTime.current
    const t = Math.min(elapsed / duration, 1)
    const eased = t * t * t
    camera.position.lerpVectors(START_POSITION, TARGET_POSITION, eased)
    camera.lookAt(lookTarget.current.lerpVectors(FRAME_LOOK, INTERIOR_LOOK, eased))
    if (overlayRef.current) {
      const fadeT = Math.max(0, (t - FADE_START) / (1 - FADE_START))
      overlayRef.current.style.opacity = String(Math.min(1, fadeT))
    }
    if (t >= 1 && !arrived.current) {
      arrived.current = true
      onArrive()
    }
  })
  return null
}

/**
 * Full-viewport entry scene. Clicking/pressing Enter "flies" the camera into the
 * building while a black overlay fades in, then calls onComplete once fully covered.
 */
export default function BuildingHero({ onComplete }: { onComplete: () => void }) {
  const [entered, setEntered] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const duration = reducedMotion ? 0.4 : 1.5

  const handleEnter = () => {
    if (entered) return
    setEntered(true)
  }

  const handleArrive = () => {
    window.setTimeout(onComplete, reducedMotion ? 80 : 180)
  }

  return (
    <div
      className="hero-teleport"
      role="button"
      tabIndex={0}
      aria-label="Kliknij, aby wejść do portfolio"
      aria-disabled={entered}
      onClick={handleEnter}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleEnter()
        }
      }}
    >
      <Canvas camera={{ position: [0, 7.2, 3.1], up: [0, 0, 1], fov: 45 }} dpr={[1, 1.7]} gl={{ antialias: true }}>
        <color attach="background" args={['#080808']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 3]} intensity={1.5} color="#fff" />
        <directionalLight position={[-4, -1, -1]} intensity={0.4} color="#888" />
        <Suspense fallback={null}>
          <RotatingBuilding spinning={!entered} />
          <Environment preset="studio" />
        </Suspense>
        <CameraFlight flying={entered} duration={duration} overlayRef={overlayRef} onArrive={handleArrive} />
      </Canvas>
      <div className={`hero-copy${entered ? ' is-leaving' : ''}`}>
        <span className="hero-brand">FERENSIK</span>
        <span className="hero-hint">Kliknij, aby wejść</span>
      </div>
      <div ref={overlayRef} className="hero-blackout" aria-hidden="true" />
    </div>
  )
}
