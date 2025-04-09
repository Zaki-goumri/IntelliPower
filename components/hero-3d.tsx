"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, PresentationControls, Stars } from "@react-three/drei"
import { BackSide } from "three"

function Earth() {
  const earthRef = useRef(null)
  const atmosphereRef = useRef(null)

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#6b21a8"
          metalness={0.4}
          roughness={0.7}
          emissive="#3b0764"
          emissiveIntensity={0.2}
        />

        {/* Continent details */}
        <mesh>
          <sphereGeometry args={[2.01, 64, 64]} />
          <meshStandardMaterial
            color="#9333ea"
            metalness={0.8}
            roughness={0.3}
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial color="#a855f7" transparent opacity={0.1} side={BackSide} />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial color="#c084fc" transparent opacity={0.05} side={BackSide} />
      </mesh>

      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.08, 16, 100]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

export default function Hero3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c084fc" />

        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Earth />
        </PresentationControls>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
