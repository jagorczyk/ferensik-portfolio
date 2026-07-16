import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import DffModel from '../DffModel'
import { LongArrowIcon } from './icons'

function FallbackSkin() {
  return (
    <mesh>
      <capsuleGeometry args={[0.4, 1.1, 4, 12]} />
      <meshStandardMaterial color="#3a3a38" wireframe transparent opacity={0.6} />
    </mesh>
  )
}

function SpinningSkin({ modelName, position }: { modelName: string; position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.16
  })
  return (
    <group ref={group} position={position} rotation={[0, -Math.PI / 2, 0]} scale={1.05}>
      <DffModel modelName={modelName} basePath="/skins" materialColor="#b8b8b2" fallback={<FallbackSkin />} />
    </group>
  )
}

function SkinsStage() {
  return (
    <div className="skins-stage" aria-label="Podgląd 3D dwóch skinów">
      <Canvas camera={{ position: [0, 6.8, 1.1], up: [0, 0, 1], fov: 32 }} dpr={[1, 1.7]} gl={{ antialias: true }}>
        <color attach="background" args={['#080808']} />
        <ambientLight intensity={0.42} />
        <directionalLight position={[3, 4, 5]} intensity={1.15} color="#fff" />
        <directionalLight position={[-4, 1, 2]} intensity={0.35} color="#666" />
        <Suspense fallback={null}>
          <SpinningSkin modelName="agent" position={[-0.82, 0, 0]} />
          <SpinningSkin modelName="randomGang" position={[0.82, -0.38, 0]} />
          <Environment preset="studio" />
          <ContactShadows position={[0, 0, -1.25]} opacity={0.82} scale={4.4} blur={2.2} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default function SkinsTeaser() {
  return (
    <section className="skins-teaser" id="skiny">
      <div className="skins-copy">
        <div className="section-label">
          <span>Skiny</span>
        </div>
        <h2 className="display-heading">Postacie</h2>
        <p>
          Skiny CJ przygotowane pod standardowy szkielet MTA — czytelna sylwetka, ręcznie malowane tekstury i pliki
          gotowe do wgrania na serwer.
        </p>
        <Link className="see-all-link" to="/skiny">
          <span>Zobacz wszystkie skiny</span>
          <LongArrowIcon />
        </Link>
      </div>
      <SkinsStage />
    </section>
  )
}
