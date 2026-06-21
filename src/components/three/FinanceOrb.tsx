'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Orb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.2;
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={0.6}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial
          color="#10B981"
          emissive="#10B981"
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.8}
          distort={0.15}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function Ring() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.3;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} rotation-x={Math.PI / 3}>
      <torusGeometry args={[1.8, 0.015, 16, 100]} />
      <meshBasicMaterial color="#3B82F6" transparent opacity={0.3} />
    </mesh>
  );
}

function Particles() {
  const count = 80;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.2 + Math.random() * 0.5;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#10B981" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <Orb />
      <Ring />
      <Particles />
    </>
  );
}

export default function FinanceOrb() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
