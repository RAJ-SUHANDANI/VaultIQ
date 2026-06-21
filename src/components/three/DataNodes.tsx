'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

function Node({ position, color, size = 0.08 }: { position: [number, number, number]; color: string; size?: number }) {
  return (
    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.3} position={position}>
      <mesh scale={size}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </Float>
  );
}

function Connections() {
  const pairs = useMemo(() => {
    const nodes: [number, number, number][] = [
      [-3, 2, 0], [3, 2, 0], [0, -2, 0], [-2, -1, 1], [2, -1, -1], [0, 3, -1], [0, 0, 2],
    ];
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.5) continue;
        lines.push([
          new THREE.Vector3(...nodes[i]),
          new THREE.Vector3(...nodes[j]),
        ]);
      }
    }
    return lines;
  }, []);

  return (
    <group>
      {pairs.map(([start, end], i) => (
        <Line key={i} points={[start, end]} color="#10B981" lineWidth={0.5} transparent opacity={0.1} />
      ))}
    </group>
  );
}

function FloatingBars() {
  const count = 12;
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.05;
  });

  const bars = useMemo(() => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 2.5;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const height = 0.2 + Math.random() * 0.6;
      result.push({ position: [x, -1 + height / 2, z] as [number, number, number], height });
    }
    return result;
  }, []);

  return (
    <group ref={ref}>
      {bars.map((bar, i) => (
        <mesh key={i} position={bar.position}>
          <boxGeometry args={[0.08, bar.height, 0.08]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.15 + bar.height * 0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const nodes: { position: [number, number, number]; color: string; size?: number }[] = [
    { position: [-3, 2, 0], color: '#10B981', size: 0.1 },
    { position: [3, 2, 0], color: '#3B82F6', size: 0.08 },
    { position: [0, -2, 0], color: '#F59E0B', size: 0.12 },
    { position: [-2, -1, 1], color: '#8B5CF6', size: 0.07 },
    { position: [2, -1, -1], color: '#EC4899', size: 0.09 },
    { position: [0, 3, -1], color: '#10B981', size: 0.06 },
    { position: [0, 0, 2], color: '#3B82F6', size: 0.1 },
  ];

  return (
    <>
      <ambientLight intensity={0.6} />
      <Connections />
      <FloatingBars />
      {nodes.map((n, i) => (
        <Node key={i} position={n.position} color={n.color} size={n.size} />
      ))}
    </>
  );
}

export default function DataNodes() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
