// PurpleEarth.jsx
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

// Inner Earth model component
const PurpleEarthModel = () => {
  const earthRef = useRef()
  const continentsRef = useRef()
  const reliefRef = useRef()

  // Handle rotation animation
  useFrame(({ mouse, viewport }) => {
    // Auto rotation
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001
    }

    if (continentsRef.current) {
      continentsRef.current.rotation.y += 0.001
    }

    if (reliefRef.current) {
      reliefRef.current.rotation.y += 0.001
    }

    // Mouse rotation control
    const mouseX = (mouse.x * viewport.width) / viewport.width
    const mouseY = (mouse.y * viewport.height) / viewport.height

    const targetRotationY = mouseX * 0.5
    const targetRotationX = mouseY * 0.3

    // Apply rotation to all layers
    if (earthRef.current) {
      earthRef.current.rotation.y = targetRotationY
      earthRef.current.rotation.x = targetRotationX
    }

    if (continentsRef.current) {
      continentsRef.current.rotation.y = targetRotationY
      continentsRef.current.rotation.x = targetRotationX
    }

    if (reliefRef.current) {
      reliefRef.current.rotation.y = targetRotationY
      reliefRef.current.rotation.x = targetRotationX
    }
  })

  const EARTH_RADIUS = 1

  return (
    <>
      {/* Main Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshPhongMaterial 
          color="#ffffff"
          specular="#666666"
          shininess={25}
          emissive="#330066"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Continents layer */}
      <mesh ref={continentsRef}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#8a4fff"
          transparent={true}
          opacity={0.7}
        />
      </mesh>

      {/* Relief wireframe layer */}
      <mesh ref={reliefRef}>
        <sphereGeometry args={[EARTH_RADIUS, 32, 32]} />
        <meshStandardMaterial
          color="#b088ff"
          transparent={true}
          opacity={0.4}
          wireframe={true}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.016, 64, 64]} />
        <meshBasicMaterial
          color="#9040ff"
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Subtle glow effect */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.01, 64, 64]} />
        <meshBasicMaterial
          color="#a364ff"
          transparent={true}
          opacity={0.1}
        />
      </mesh>

      {/* Lights */}
      <ambientLight intensity={0.8} color="#555555" />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <pointLight position={[-2, 1, 1]} intensity={3} color="#9933ff" distance={10} />
    </>
  )
}

// Main component with Canvas
const PurpleEarth = () => {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 75 }}>
        <PurpleEarthModel />

        <EffectComposer>
          <Bloom 
            intensity={0.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            blendFunction={BlendFunction.SCREEN}
          />
        </EffectComposer>

        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minDistance={1.5}
          maxDistance={4}
          enableRotate={false} // Disable orbit controls rotation since we're using mouse control
        />
      </Canvas>
    </div>
  )
}

export default PurpleEarth