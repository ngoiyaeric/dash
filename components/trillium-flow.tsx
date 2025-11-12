"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"

function AppPlaceholder({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Sphere ref={meshRef} position={position} args={[0.5, 64, 64]}>
      <meshPhysicalMaterial
        transmission={1}
        roughness={0.1}
        thickness={1.5}
        ior={1.5}
        metalness={0}
        color="white"
        envMapIntensity={1}
      />
    </Sphere>
  )
}

// ✅ NEW: Separate component that renders INSIDE Canvas
function RotatingGroup() {
  const groupRef = useRef<THREE.Group>(null!)

  // ✅ Now useFrame is called inside Canvas context
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y += 0.001
    }
  })

  const apps = Array.from({ length: 3 }, (_, i) => {
    const angle = (i / 3) * Math.PI * 2
    const radius = 1.5
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle)
    return { position: [x, 0, z] as [number, number, number] }
  })

  return (
    <group ref={groupRef}>
      {apps.map((app, index) => (
        <AppPlaceholder key={index} position={app.position} />
      ))}
    </group>
  )
}

export function TrilliumFlow() {
  // ✅ No more useFrame here - just render Canvas
  return (
    <Canvas style={{ height: "500px" }} camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.2} />
      <RotatingGroup />
      <Environment preset="sunset" />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  )
}
