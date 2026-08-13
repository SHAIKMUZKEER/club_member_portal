import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, Torus, TorusKnot } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { Group, Mesh } from "three";

const POINTER = { x: 0, y: 0, dist: 0.6 };

function usePointerTracking() {
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      POINTER.x = nx;
      POINTER.y = ny;
      POINTER.dist = Math.min(1, Math.hypot(nx, ny) / Math.SQRT2);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

function Rig() {
  const { camera } = useThree();
  useFrame((_s, delta) => {
    // zoom in near the centre, out toward the edges
    const targetZ = 5.4 + POINTER.dist * 2.4;
    const k = 1 - Math.exp(-delta * 3);
    camera.position.z += (targetZ - camera.position.z) * k;
    camera.position.x += (POINTER.x * 0.6 - camera.position.x) * k;
    camera.position.y += (-POINTER.y * 0.4 - camera.position.y) * k;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Nodes() {
  const group = useRef<Group>(null);
  useFrame((_s, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });
  const nodes = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const r = 3.1 + (i % 3) * 0.55;
    return [Math.cos(a) * r, Math.sin(a * 1.7) * 1.5, Math.sin(a) * r] as const;
  });
  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <Float key={i} speed={1.2} floatIntensity={1.4} rotationIntensity={0.4}>
          <Icosahedron args={[0.075, 1]} position={[p[0], p[1], p[2]]}>
            <meshStandardMaterial
              color="#9333EA"
              emissive="#7C3AED"
              emissiveIntensity={0.45}
              transparent
              opacity={0.75}
            />
          </Icosahedron>
        </Float>
      ))}
    </group>
  );
}

function Cluster() {
  const group = useRef<Group>(null);
  const knot = useRef<Mesh>(null);

  useFrame((_s, delta) => {
    if (knot.current) {
      knot.current.rotation.y += delta * 0.22;
      knot.current.rotation.x += delta * 0.1;
    }
    if (group.current) {
      const k = 1 - Math.exp(-delta * 2.5);
      group.current.rotation.y += (POINTER.x * 0.45 - group.current.rotation.y) * k;
      group.current.rotation.x += (POINTER.y * 0.35 - group.current.rotation.x) * k;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.9}>
        <TorusKnot ref={knot} args={[1.25, 0.075, 220, 32]}>
          <meshStandardMaterial
            color="#7C3AED"
            wireframe
            transparent
            opacity={0.5}
            emissive="#9333EA"
            emissiveIntensity={0.35}
          />
        </TorusKnot>
      </Float>
      <Torus args={[2.35, 0.012, 12, 140]} rotation={[Math.PI / 2.5, 0, 0]}>
        <meshStandardMaterial color="#9333EA" transparent opacity={0.55} />
      </Torus>
      <Torus args={[2.85, 0.01, 12, 140]} rotation={[Math.PI / 1.7, 0.5, 0]}>
        <meshStandardMaterial color="#7C3AED" transparent opacity={0.4} />
      </Torus>
      <Nodes />
    </group>
  );
}

export default function SceneBackground() {
  usePointerTracking();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 5, 5]} intensity={1.6} color="#c4b5fd" />
        <pointLight position={[-5, -3, -2]} intensity={14} color="#9333EA" />
        <Cluster />
        <Rig />
      </Canvas>
    </div>
  );
}
