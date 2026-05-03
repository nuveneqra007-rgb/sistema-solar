import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, useTexture } from '@react-three/drei';
import { Suspense, useRef, useState, useMemo, Component, ReactNode } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import './index.css';

// Error Boundary for the 3D Scene
class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'white', padding: '20px', textAlign: 'center', background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2>Error en la visualización 3D</h2>
          <p>Tu navegador o hardware podría tener problemas con los efectos avanzados.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer', background: '#00f2ff', border: 'none', color: '#000', fontWeight: 'bold' }}>REINTENTAR</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TEXTURES = {
  sun: '/textures/sunmap.jpg',
  mercury: '/textures/mercurymap.jpg',
  venus: '/textures/venusmap.jpg',
  earth: '/textures/earthmap1k.jpg',
  mars: '/textures/marsmap1k.jpg',
  jupiter: '/textures/jupitermap.jpg',
  saturn: '/textures/saturnmap.jpg',
  uranus: '/textures/uranusmap.jpg',
  neptune: '/textures/neptunemap.jpg',
  saturnRings: '/textures/saturnringcolor.jpg'
};

const planetsData = [
  {
    name: 'Mercurio', radius: 0.6, distance: 12, speed: 0.8, rotationSpeed: 0.01, texture: TEXTURES.mercury,
    description: 'Un pequeño titán forjado en el fuego del sol, un mundo de extremos donde el silencio es eterno.',
    moons: 0, dayLength: '59 días', temperature: '167°C', type: 'Rocoso', color: '#A5A5A5',
  },
  {
    name: 'Venus', radius: 1.1, distance: 18, speed: 0.6, rotationSpeed: 0.005, texture: TEXTURES.venus,
    description: 'La joya abrasadora oculta tras velos de nubes, un infierno dorado que brilla con luz propia.',
    moons: 0, dayLength: '243 días', temperature: '464°C', type: 'Rocoso', color: '#E3BB76',
  },
  {
    name: 'Tierra', radius: 1.2, distance: 26, speed: 0.4, rotationSpeed: 0.02, texture: TEXTURES.earth,
    description: 'Nuestro oasis de cristal y zafiro, el único rincón del cosmos donde la vida ha florecido en todo su esplendor.',
    moons: 1, dayLength: '24 horas', temperature: '15°C', type: 'Rocoso', color: '#2277FF', hasAtmosphere: true,
  },
  {
    name: 'Marte', radius: 0.8, distance: 34, speed: 0.3, rotationSpeed: 0.018, texture: TEXTURES.mars,
    description: 'El guerrero oxidado, un desierto carmesí que guarda los secretos de ríos antiguos y sueños de colonización.',
    moons: 2, dayLength: '24.6 horas', temperature: '-65°C', type: 'Rocoso', color: '#E27B58',
  },
  {
    name: 'Júpiter', radius: 3.2, distance: 50, speed: 0.15, rotationSpeed: 0.04, texture: TEXTURES.jupiter,
    description: 'El rey de los gigantes, un titán gaseoso cuya Gran Mancha Roja ha devorado tormentas durante siglos.',
    moons: 95, dayLength: '10 horas', temperature: '-110°C', type: 'Gigante gaseoso', color: '#D39C7E',
  },
  {
    name: 'Saturno', radius: 2.8, distance: 68, speed: 0.1, rotationSpeed: 0.038, texture: TEXTURES.saturn,
    description: 'El señor de los anillos, una obra maestra celestial rodeada por un halo de hielo y polvo cósmico.',
    moons: 146, dayLength: '10.7 horas', temperature: '-140°C', type: 'Gigante gaseoso', color: '#C5AB6E', hasRings: true,
  },
  {
    name: 'Urano', radius: 2.0, distance: 85, speed: 0.06, rotationSpeed: 0.03, texture: TEXTURES.uranus,
    description: 'El gigante de hielo inclinado, un mundo esmeralda que gira de lado en las profundidades del espacio.',
    moons: 28, dayLength: '17.2 horas', temperature: '-195°C', type: 'Gigante de hielo', color: '#B5E3E3',
  },
  {
    name: 'Neptuno', radius: 1.9, distance: 98, speed: 0.04, rotationSpeed: 0.032, texture: TEXTURES.neptune,
    description: 'El centinela de los abismos, un mundo de vientos supersónicos y azul profundo en el límite del sistema solar.',
    moons: 16, dayLength: '16.1 horas', temperature: '-200°C', type: 'Gigante de hielo', color: '#6081FF',
  },
];

function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(TEXTURES.sun);
  
  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <mesh scale={1.02}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.1} />
      </mesh>
      <pointLight intensity={1500} distance={400} decay={1.5} color="#fff5d4" />
      <Html position={[0, 7, 0]} center>
        <div className="sun-title">SOL</div>
      </Html>
    </group>
  );
}

function Planet({ data, timeSpeed }: { data: typeof planetsData[0]; timeSpeed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  
  const texture = useTexture(data.texture);
  const ringTexture = useTexture(TEXTURES.saturnRings);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * timeSpeed * data.speed * 0.1;
    if (orbitRef.current) {
      orbitRef.current.position.x = Math.cos(t) * data.distance;
      orbitRef.current.position.z = Math.sin(t) * data.distance;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += data.rotationSpeed * timeSpeed;
    }
  });

  const orbitPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * data.distance, 0, Math.sin(angle) * data.distance));
    }
    return points;
  }, [data.distance]);

  return (
    <group>
      <Line points={orbitPoints} color="white" opacity={0.1} transparent lineWidth={1} />
      <group ref={orbitRef}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setSelected(!selected)}
          scale={hovered ? 1.1 : 1}
        >
          <sphereGeometry args={[data.radius, 64, 64]} />
          <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} color="#ffffff" />
        </mesh>
        {data.hasRings && (
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[data.radius + 0.5, data.radius + 3.5, 64]} />
            <meshStandardMaterial map={ringTexture} transparent opacity={0.8} side={THREE.DoubleSide} color="#ffffff" />
          </mesh>
        )}
        <Html position={[0, data.radius + 1.5, 0]} center>
          <div className={`planet-label ${hovered ? 'hovered' : ''} ${selected ? 'selected' : ''}`}>
            {data.name}
          </div>
        </Html>
        {selected && (
          <Html position={[data.radius + 2, 0, 0]}>
            <div className="epic-info-panel">
              <div className="epic-header">
                <span className="type-tag">{data.type}</span>
                <h2>{data.name}</h2>
              </div>
              <p className="epic-desc">{data.description}</p>
              <div className="epic-stats">
                <div className="stat"><span>Temp</span> <strong>{data.temperature}</strong></div>
                <div className="stat"><span>Día</span> <strong>{data.dayLength}</strong></div>
                <div className="stat"><span>Lunas</span> <strong>{data.moons}</strong></div>
              </div>
              <button onClick={() => setSelected(false)} className="epic-close">CERRAR EXPLORACIÓN</button>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

function AsteroidBelt() {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const asteroids = useMemo(() => {
    return Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      distance: 40 + Math.random() * 6,
      speed: 0.01 + Math.random() * 0.02,
      offsetY: (Math.random() - 0.5) * 2,
      scale: Math.random() * 0.06 + 0.02,
      rotationSpeed: (Math.random() - 0.5) * 0.01
    }));
  }, []);

  useFrame(({ clock }) => {
    asteroids.forEach((a, i) => {
      const t = clock.getElapsedTime() * a.speed;
      const x = Math.cos(a.angle + t) * a.distance;
      const z = Math.sin(a.angle + t) * a.distance;
      dummy.position.set(x, a.offsetY, z);
      dummy.rotation.y += a.rotationSpeed;
      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#555555" roughness={1} />
    </instancedMesh>
  );
}

function StarBackground() {
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 100 + Math.random() * 700;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={1} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene() {
  const [timeSpeed, setTimeSpeed] = useState(1);
  return (
    <>
      <HUD timeSpeed={timeSpeed} setTimeSpeed={setTimeSpeed} />
      <Canvas camera={{ position: [0, 60, 120], fov: 45 }} gl={{ antialias: false }}>
        <color attach="background" args={['#000000']} />
        <Suspense fallback={<Html center><div style={{ color: '#00f2ff', letterSpacing: '0.2em', textAlign: 'center' }}>CARGANDO SISTEMA SOLAR...</div></Html>}>
          <Sun />
          <AsteroidBelt />
          {planetsData.map((p) => <Planet key={p.name} data={p} timeSpeed={timeSpeed} />)}
          <StarBackground />
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.5} />
            <Vignette darkness={0.6} />
          </EffectComposer>
        </Suspense>
        <OrbitControls enablePan={false} maxDistance={400} minDistance={20} autoRotate autoRotateSpeed={0.05} />
        <ambientLight intensity={0.6} />
      </Canvas>
    </>
  );
}

function HUD({ timeSpeed, setTimeSpeed }: { timeSpeed: number; setTimeSpeed: (v: number) => void }) {
  return (
    <div className="hud-container">
      <div className="hud-header">
        <div className="hud-logo">
          <div className="logo-icon"></div>
          <div className="logo-text">
            <h1>SOLARIS EXPLORER</h1>
            <p>SISTEMA DE MONITOREO DE ESPACIO PROFUNDO</p>
          </div>
        </div>
        <div className="hud-time">
          <label>VELOCIDAD TEMPORAL</label>
          <input 
            type="range" min="0" max="5" step="0.1" 
            value={timeSpeed} 
            onChange={(e) => setTimeSpeed(parseFloat(e.target.value))} 
          />
          <span className="time-val">{timeSpeed.toFixed(1)}x</span>
        </div>
      </div>
      <div className="hud-footer">
        <div className="scan-line"></div>
        <div className="hud-hints">
          <span>// NAVEGACIÓN ACTIVA</span>
          <span>// ROTAR: CLICK + ARRASTRAR</span>
          <span>// ZOOM: SCROLL</span>
          <span>// SELECCIONAR: CLICK EN PLANETA</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <SceneErrorBoundary>
        <Scene />
      </SceneErrorBoundary>
    </div>
  );
}