import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import DffModel from '../DffModel'

function FallbackObject() {
  return (
    <group>
      <mesh rotation={[0.2, 0, 0]}>
        <icosahedronGeometry args={[1.45, 2]} />
        <meshStandardMaterial color="#e9e9e9" roughness={0.28} metalness={0.3} wireframe />
      </mesh>
      <mesh position={[0, 0.15, 0]} scale={[0.78, 1.4, 0.78]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial color="#222" roughness={0.22} metalness={0.5} />
      </mesh>
    </group>
  )
}

function RotatingModel({
  modelName,
  basePath,
  materialColor,
  paused,
  resetSignal,
  rotationSpeed,
}: {
  modelName: string
  basePath?: string
  materialColor?: string
  paused: boolean
  resetSignal: number
  rotationSpeed: number
}) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (group.current && !paused) group.current.rotation.z += delta * rotationSpeed
  })
  useEffect(() => {
    if (group.current && resetSignal > 0) group.current.rotation.z = Math.PI / 2
  }, [resetSignal])
  return (
    <group ref={group} rotation={[0, 0, Math.PI / 2]} scale={1.2}>
      <DffModel modelName={modelName} basePath={basePath} materialColor={materialColor} fallback={<FallbackObject />} />
    </group>
  )
}

export default function ModelViewer({
  modelName,
  basePath = '/models',
  materialColor,
  interactive = true,
  rotationSpeed = 0.34,
  label,
  className,
}: {
  modelName: string
  basePath?: string
  materialColor?: string
  interactive?: boolean
  rotationSpeed?: number
  label?: string
  className?: string
}) {
  const controls = useRef<any>(null)
  // Always starts false so every viewer rotates continuously; interactive viewers
  // pause only while dragged (OrbitControls onStart/onEnd — never fired when disabled).
  const [paused, setPaused] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const resetView = () => {
    controls.current?.reset()
    setResetSignal((value) => value + 1)
  }
  return (
    <div
      className={`model-viewer${interactive && paused ? ' is-active' : ''}${interactive ? ' is-interactive' : ' is-static'}${className ? ` ${className}` : ''}`}
      aria-label={label ? `Podgląd 3D modelu ${label}` : undefined}
    >
      <Canvas camera={{ position: [0, 4.6, 0], up: [0, 0, 1], fov: 38 }} dpr={[1, 1.7]} gl={{ antialias: true }}>
        <color attach="background" args={['#080808']} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 2]} intensity={1.65} color="#fff" />
        <directionalLight position={[-3, 0, -2]} intensity={0.55} color="#777" />
        <Suspense fallback={null}>
          <RotatingModel
            modelName={modelName}
            basePath={basePath}
            materialColor={materialColor}
            paused={paused}
            resetSignal={resetSignal}
            rotationSpeed={rotationSpeed}
          />
          <Environment preset="studio" />
          <ContactShadows position={[0, -1.8, 0]} opacity={0.55} scale={5} blur={2.5} />
        </Suspense>
        <OrbitControls
          ref={controls}
          enabled={interactive}
          target={[0, 0, 0]}
          enablePan={false}
          minDistance={1.3}
          maxDistance={6}
          autoRotate={false}
          makeDefault
          onStart={() => setPaused(true)}
          onEnd={() => setPaused(false)}
        />
      </Canvas>
      {interactive && (
        <div className="viewer-overlay">
          <span>{paused ? 'Sterowanie aktywne' : 'Przeciągnij, aby obrócić · scroll, aby przybliżyć'}</span>
          <button type="button" onClick={resetView}>
            Reset widoku
          </button>
        </div>
      )}
    </div>
  )
}
