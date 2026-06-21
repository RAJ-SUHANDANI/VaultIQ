'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const symbols = ['₹', '$', '€', '£', '¥', '₿', '📈', '📊', '💹'];

function ParticleField() {
  const count = 200;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      siz[i] = Math.random() * 0.15 + 0.02;
      const c = new THREE.Color().setHSL(0.42 + Math.random() * 0.08, 0.7, 0.5 + Math.random() * 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, siz, col];
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const attr = meshRef.current.geometry.attributes.position;
    if (!attr) return;
    const positions = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += Math.sin(clock.elapsedTime * 0.3 + i) * 0.002;
      positions[i * 3] += Math.cos(clock.elapsedTime * 0.2 + i * 0.5) * 0.002;
    }
    attr.needsUpdate = true;
    meshRef.current.rotation.y = clock.elapsedTime * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} />
        <bufferAttribute args={[sizes, 1]} />
        <bufferAttribute args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function FloatingSymbol({ position, symbol }: { position: [number, number, number]; symbol: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1.5} position={position}>
      <mesh>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial transparent opacity={0.15}>
          <canvasTexture
            attach="map"
            image={(() => {
              const c = document.createElement('canvas');
              c.width = 64;
              c.height = 64;
              const ctx = c.getContext('2d')!;
              ctx.fillStyle = '#10B981';
              ctx.font = 'bold 40px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(symbol, 32, 32);
              return c;
            })()}
          />
        </meshBasicMaterial>
      </mesh>
    </Float>
  );
}

function DataNode({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.5} position={position}>
      <mesh scale={scale}>
        <octahedronGeometry args={[0.15, 0]} />
        <MeshDistortMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.4} distort={0.2} speed={1.5} />
      </mesh>
    </Float>
  );
}

function NetworkLines() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 30; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20
      );
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20
      );
      pts.push(start, end);
    }
    return pts;
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [points]);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#10B981" transparent opacity={0.08} />
    </lineSegments>
  );
}

function GraphCurve() {
  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = (t - 0.5) * 8;
      const y = Math.sin(t * Math.PI * 4) * 0.8 + Math.cos(t * Math.PI * 2) * 0.4;
      pts.push(new THREE.Vector3(x, y, -3));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  const points = useMemo(() => curve.getPoints(50), [curve]);

  return (
    <mesh position={[0, -1, 0]}>
      <tubeGeometry args={[curve, 64, 0.015, 8, false]} />
      <meshBasicMaterial color="#3B82F6" transparent opacity={0.2} />
    </mesh>
  );
}

function Scene() {
  const symbolPositions: [number, number, number, string][] = [
    [-3, 2, -2, '₹'],
    [4, -1, -3, '$'],
    [-2, -3, -4, '€'],
    [5, 3, -5, '₿'],
    [-4, 1, -1, '£'],
    [1, -2, -6, '¥'],
  ];

  const nodePositions: [number, number, number, number][] = [
    [-4, 3, -3, 0.8],
    [3, 4, -4, 1],
    [5, -3, -2, 0.7],
    [-5, -4, -5, 0.9],
    [0, 5, -4, 1.1],
    [-3, -5, -2, 0.6],
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <ParticleField />
      <NetworkLines />
      <GraphCurve />
      {symbolPositions.map(([x, y, z, sym], i) => (
        <FloatingSymbol key={i} position={[x, y, z]} symbol={sym} />
      ))}
      {nodePositions.map(([x, y, z, s], i) => (
        <DataNode key={i} position={[x, y, z]} scale={s} />
      ))}
    </>
  );
}

export default function FinancialParticles() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
