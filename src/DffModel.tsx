import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DffParser, TxdParser } from 'rw-parser-ng'
import { Buffer } from 'buffer'
import * as THREE from 'three'

type DffData = ReturnType<DffParser['parse']>

type RenderGeometry = { geometry: THREE.BufferGeometry; textureName?: string; materialColor?: string; opacity?: number; sourceGeometryIndex: number }
const textureKey = (value: string) => value.trim().toLowerCase().replace(/\.(png|jpg|jpeg|bmp|dds)$/i, '')

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

export default function DffModel({ fallback, modelName, basePath = '/models', materialColor }: { fallback: ReactNode; modelName: string; basePath?: string; materialColor?: string }) {
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
        const parsed = new DffParser(Buffer.from(await dffResponse.arrayBuffer())).parse()
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
  return <group position={framing.center.clone().multiplyScalar(-framing.scale)} scale={framing.scale}>{geometries.map(({ geometry, textureName, materialColor: geometryColor, opacity = 1 }, index) => <mesh key={index} geometry={geometry} castShadow receiveShadow><meshStandardMaterial map={textureName ? textures.get(textureName) : undefined} color={materialColor ?? (textureName && textures.has(textureName) ? '#fff' : geometryColor ?? (index % 2 ? '#bdbdb8' : '#e8e8e2'))} transparent={opacity < 1} opacity={opacity} roughness={0.3} metalness={0.25} /></mesh>)}</group>
}
