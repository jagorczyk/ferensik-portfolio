import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DffParser, TxdParser } from 'rw-parser-ng'
import { Buffer } from 'buffer'
import * as THREE from 'three'

type DffData = ReturnType<DffParser['parse']>

type RenderGeometry = { geometry: THREE.BufferGeometry; textureName?: string; materialColor?: string; opacity?: number; sourceGeometryIndex: number }
const textureKey = (value: string) => value.trim().toLowerCase().replace(/\.(png|jpg|jpeg|bmp|dds)$/i, '')

function repairKnownDffHeader(bytes: Uint8Array, modelName: string) {
  if (modelName === 'porsche' && bytes.length > 20 && bytes[16] === 12 && bytes[17] === 0 && bytes[18] === 0 && bytes[19] === 1 && bytes[20] === 255 && bytes[21] === 255) {
    bytes[19] = 0
  }
  return bytes
}

function geometryFromDff(geometry: NonNullable<DffData['geometryList']>['geometries'][number], sourceGeometryIndex: number): RenderGeometry[] {
  const result: RenderGeometry[] = []
  const positions = geometry.vertexInformation.flatMap(({ x, y, z }) => [x, y, z])
  const normals = geometry.normalInformation.flatMap(({ x, y, z }) => [x, y, z])
  const uv = geometry.textureMappingInformation[0]?.flatMap(({ u, v }) => [u, 1 - v])
  const meshes = geometry.binMesh?.meshes ?? [{ indices: geometry.triangleInformation.flatMap((triangle) => [triangle.vector.x, triangle.vector.y, triangle.vector.z]), materialIndex: 0 }]
  if (!positions.length) return result
  meshes.forEach((mesh) => {
    if (!mesh.indices.length) return
    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    if (normals.length === positions.length) buffer.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    if (uv?.length === geometry.vertexInformation.length * 2) buffer.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    buffer.setIndex(mesh.indices)
    buffer.computeVertexNormals()
    buffer.computeBoundingSphere()
    const material = geometry.materialList.materialData[mesh.materialIndex]
    const materialTexture = material?.texture?.textureName
    const color = material?.color
    const materialColor = color ? new THREE.Color(color.r / 255, color.g / 255, color.b / 255).getHexString() : undefined
    result.push({ geometry: buffer, textureName: materialTexture ? textureKey(materialTexture) : undefined, materialColor: materialColor ? `#${materialColor}` : undefined, opacity: color?.a === undefined ? 1 : color.a / 255, sourceGeometryIndex })
  })
  return result
}

function matrixFromRw(matrix: any) {
  const result = new THREE.Matrix4()
  result.makeBasis(
    new THREE.Vector3(matrix.right.x, matrix.right.y, matrix.right.z),
    new THREE.Vector3(matrix.up.x, matrix.up.y, matrix.up.z),
    new THREE.Vector3(matrix.at.x, matrix.at.y, matrix.at.z),
  )
  result.setPosition(matrix.transform.x, matrix.transform.y, matrix.transform.z)
  return result
}

function vehicleMaterial({ textureName, texture, geometryColor, opacity, vehicleColor, isWheel = false }: { textureName?: string; texture?: THREE.Texture; geometryColor?: string; opacity: number; vehicleColor: string; isWheel?: boolean }) {
  const name = textureName ?? ''
  const isTyre = name.includes('tyre')
  const isLight = name.includes('light')
  const isPlate = name.includes('plate') || name.includes('carpback')
  const isPaint = name.includes('vehiclegrunge') || name.includes('vehiclegeneric') || geometryColor === '#3cFF00'
  const isRim = isWheel && !isTyre
  const color = isTyre ? '#141414' : isRim ? '#b8b8b8' : isPlate ? '#d8d4c5' : isLight ? (geometryColor ?? '#fff') : isPaint ? vehicleColor : (geometryColor ?? '#b8b8b2')
  return new THREE.MeshPhysicalMaterial({
    map: texture,
    color,
    transparent: opacity < 1 || isLight,
    opacity: Math.min(opacity, isLight ? 0.92 : 1),
    roughness: isTyre ? 0.82 : isRim ? 0.24 : isPaint ? 0.22 : isPlate ? 0.58 : 0.38,
    metalness: isTyre ? 0.05 : isRim ? 0.78 : isPaint ? 0.18 : 0.08,
    clearcoat: isPaint ? 0.65 : 0,
    clearcoatRoughness: 0.18,
    emissive: isLight ? color : '#000000',
    emissiveIntensity: isLight ? 0.32 : 0,
    side: THREE.DoubleSide,
  })
}

function VehicleDff({ data, geometries, textures, vehicleColor }: { data: DffData; geometries: RenderGeometry[]; textures: Map<string, THREE.Texture>; vehicleColor: string }) {
  const frames = data.frameList?.frames ?? []
  const atomics = data.atomics
  const dummies = data.dummies
  const frameGroups = frames.map((frame) => {
    const group = new THREE.Group()
    group.matrixAutoUpdate = false
    group.matrix.copy(matrixFromRw({ ...frame.rotationMatrix, transform: frame.coordinatesOffset }))
    return group
  })
  frames.forEach((frame, index) => {
    if (frame.parentFrame >= 0 && frameGroups[frame.parentFrame]) frameGroups[frame.parentFrame].add(frameGroups[index])
  })
  const roots = frameGroups.filter((_, index) => frames[index].parentFrame < 0)
  const wheelFrameIndices = dummies.map((name, index) => name?.startsWith('wheel_') && name.endsWith('_dummy') ? index : -1).filter((index) => index >= 0)
  const wheelAtomicIndex = atomics.findIndex((frameIndex) => dummies[frameIndex] === 'wheel')
  const meshForGeometry = (rendered: RenderGeometry, isWheel = false) => {
    const source = data.geometryList?.geometries[rendered.sourceGeometryIndex]
    if (!source) return null
    const material = vehicleMaterial({ textureName: rendered.textureName, texture: rendered.textureName ? textures.get(rendered.textureName) : undefined, geometryColor: rendered.materialColor, opacity: rendered.opacity ?? 1, vehicleColor, isWheel })
    const mesh = new THREE.Mesh(rendered.geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
  }
  data.geometryList?.geometries.forEach((_, geometryIndex) => {
    const frameIndex = atomics[geometryIndex]
    const target = frameGroups[frameIndex]
    if (!target || geometryIndex === wheelAtomicIndex || dummies[frameIndex] === 'chassis_vlo') return
    geometries.filter((rendered) => rendered.sourceGeometryIndex === geometryIndex).forEach((rendered) => {
      const mesh = meshForGeometry(rendered)
      if (mesh) target.add(mesh)
    })
  })
  if (wheelAtomicIndex >= 0) {
    const wheelGeometry = geometries.filter((rendered) => rendered.sourceGeometryIndex === wheelAtomicIndex)
    wheelFrameIndices.forEach((frameIndex) => wheelGeometry.forEach((rendered) => {
      const mesh = meshForGeometry(rendered, true)
      if (mesh) frameGroups[frameIndex].add(mesh.clone())
    }))
  }
  ;[15, 16].forEach((frameIndex) => {
    const frame = frameGroups[frameIndex]
    if (!frame) return
    const target = new THREE.Object3D()
    target.position.set(0, 3.8, -0.08)
    frame.add(target)
    const headlight = new THREE.SpotLight('#fff5d6', 38, 9, Math.PI / 8, 0.5, 1.5)
    headlight.castShadow = true
    headlight.shadow.mapSize.set(512, 512)
    headlight.shadow.bias = -0.0008
    headlight.shadow.normalBias = 0.03
    headlight.target = target
    frame.add(headlight)
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(0.52, 3.8, 20, 1, true),
      new THREE.MeshBasicMaterial({ color: '#fff5d6', transparent: true, opacity: 0.075, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    )
    beam.position.set(0, 1.9, -0.08)
    beam.rotation.z = Math.PI
    frame.add(beam)
  })
  return <group>{roots.map((root, index) => <primitive key={index} object={root} />)}</group>
}

export default function DffModel({ fallback, modelName, basePath = '/models', materialColor, renderMode = 'default', vehicleColor = '#d82020', onLoaded }: { fallback: ReactNode; modelName: string; basePath?: string; materialColor?: string; renderMode?: 'default' | 'vehicle'; vehicleColor?: string; onLoaded?: () => void }) {
  const [data, setData] = useState<DffData | null>(null)
  const [textures, setTextures] = useState<Map<string, THREE.Texture>>(new Map())
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let cancelled = false
    setData(null)
    setTextures(new Map())
    setFailed(false)
    const load = async () => {
      try {
        const [dffResponse, txdResponse] = await Promise.all([
          fetch(`${basePath}/${modelName}.dff`, { cache: 'no-store' }),
          fetch(`${basePath}/${modelName}.txd`, { cache: 'no-store' }).catch(() => null),
        ])
        const loaded = new Map<string, THREE.Texture>()
        const dffBytes = repairKnownDffHeader(new Uint8Array(await dffResponse.arrayBuffer()), modelName)
        const parsed = new DffParser(Buffer.from(dffBytes)).parse()
        if (txdResponse?.ok) {
          const txd = new TxdParser(Buffer.from(await txdResponse.arrayBuffer())).parse()
          txd.textureDictionary.textureNatives.forEach((native) => {
          const source = native.mipmaps[0]
          if (!source?.length) return
          const texture = new THREE.DataTexture(new Uint8Array(source), native.width, native.height, THREE.RGBAFormat)
          texture.colorSpace = THREE.SRGBColorSpace
          texture.flipY = false
          texture.minFilter = THREE.LinearFilter
          texture.magFilter = THREE.LinearFilter
          texture.needsUpdate = true
          texture.wrapS = native.uAddressing === 1 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
          texture.wrapT = native.vAddressing === 1 ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
          loaded.set(textureKey(native.textureName), texture)
          })
        }
        if (!cancelled) {
          setTextures(loaded)
          setData(parsed)
          onLoaded?.()
        }
      } catch { if (!cancelled) setFailed(true) }
    }
    void load()
    return () => { cancelled = true }
  }, [modelName, basePath])
  const geometries = useMemo(() => data?.geometryList?.geometries.flatMap((geometry, index) => geometryFromDff(geometry, index)) ?? [], [data])
  const framing = useMemo(() => {
    const bounds = new THREE.Box3()
    geometries.forEach(({ geometry }) => { geometry.computeBoundingBox(); if (geometry.boundingBox) bounds.union(geometry.boundingBox) })
    const center = bounds.getCenter(new THREE.Vector3())
    const size = bounds.getSize(new THREE.Vector3())
    const largestDimension = Math.max(size.x, size.y, size.z) || 1
    return { center, scale: 2.5 / largestDimension }
  }, [geometries])
  if (failed || !data?.geometryList || !geometries.length) return <>{fallback}</>
  if (renderMode === 'vehicle' && data.frameList && data.atomics.length) {
    return <group position={framing.center.clone().multiplyScalar(-framing.scale)} scale={framing.scale}><VehicleDff data={data} geometries={geometries} textures={textures} vehicleColor={vehicleColor} /></group>
  }
  return <group position={framing.center.clone().multiplyScalar(-framing.scale)} scale={framing.scale}>{geometries.map(({ geometry, textureName, materialColor: geometryColor, opacity = 1 }, index) => <mesh key={index} geometry={geometry} castShadow receiveShadow><meshStandardMaterial map={textureName ? textures.get(textureName) : undefined} color={materialColor ?? (textureName && textures.has(textureName) ? '#fff' : geometryColor ?? (index % 2 ? '#bdbdb8' : '#e8e8e2'))} transparent={opacity < 1} opacity={opacity} roughness={0.3} metalness={0.25} /></mesh>)}</group>
}
