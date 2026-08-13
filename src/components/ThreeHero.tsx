import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Torus } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function Cluster() {
  const group = useRef<Group>(null);

  useFrame((_state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.1}>
        <Icosahedron args={[1.35, 4]}>
          <MeshDistortMaterial
            color="#8C52FF"
            roughness={0.15}
            metalness={0.65}
            distort={0.35}
            speed={1.6}
          />
        </Icosahedron>
      </Float>
      <Torus args={[2.15, 0.035, 16, 120]} rotation={[Math.PI / 2.6, 0, 0]}>
        <meshStandardMaterial color="#b79bff" emissive="#5b2ecf" emissiveIntensity={0.7} />
      </Torus>
      <Torus args={[2.6, 0.02, 16, 120]} rotation={[Math.PI / 1.8, 0.6, 0]}>
        <meshStandardMaterial color="#7ea6ff" emissive="#2b4fcf" emissiveIntensity={0.5} />
      </Torus>
    </group>
  );
}

export default function ThreeHero() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 5]} intensity={2.1} color="#c9b4ff" />
      <pointLight position={[-5, -3, -2]} intensity={18} color="#8C52FF" />
      <Cluster />
    </Canvas>
  );
}
