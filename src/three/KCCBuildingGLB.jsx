import { useRef, useState, useEffect } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Center } from '@react-three/drei'
import * as THREE from 'three'

const kccCache = {}

export default function KCCBuilding({ position = [0, 0, 0], scale = 1 }) {
  const [gltf, setGltf] = useState(null)

  useEffect(() => {
    if (kccCache['kcc']) {
      setGltf(kccCache['kcc'])
      return
    }
    const loader = new GLTFLoader()
    loader.load('/models/kcc.glb', (g) => {
      g.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material.envMapIntensity = 1.2
          child.material.needsUpdate = true
        }
      })
      kccCache['kcc'] = g
      setGltf(g)
    })
  }, [])

  if (!gltf) return null

  const scene = gltf.scene.clone(true)

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <Center>
        <primitive object={scene} />
      </Center>
      {/* Interior glow */}
      <pointLight position={[0, 3, 0]} color="#ffeedd" intensity={3} distance={12} decay={2} />
    </group>
  )
}
