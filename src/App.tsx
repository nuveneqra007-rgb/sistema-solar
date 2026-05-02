import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line } from '@react-three/drei';
import { Suspense, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import './index.css';

// Planet data with realistic relative sizes and distances (scaled for visualization)
const planetsData = [
  {
    name: 'Mercurio',
    radius: 0.38,
    distance: 8,
    speed: 4.15,
    color: '#b5b5b5',
    emissive: '#3a3a3a',
    description: 'El planeta más cercano al Sol. Muy caliente.',
    moons: 0,
    dayLength: '59 días terrestres',
    temperature: '167°C promedio',
    type: 'Rocoso',
  },
  {
    name: 'Venus',
    radius: 0.95,
    distance: 12,
    speed: 1.62,
    color: '#e6c87a',
    emissive: '#4a3d1f',
    description: 'El más caliente por su atmósfera densa.',
    moons: 0,
    dayLength: '243 días terrestres',
    temperature: '464°C promedio',
    type: 'Rocoso',
  },
  {
    name: 'Tierra',
    radius: 1,
    distance: 16,
    speed: 1,
    color: '#4da6ff',
    emissive: '#0a3d6b',
    description: 'Nuestro hogar. El único con vida conocida.',
    moons: 1,
    dayLength: '24 horas',
    temperature: '15°C promedio',
    type: 'Rocoso',
    rings: false,
    hasAtmosphere: true,
  },
  {
    name: 'Marte',
    radius: 0.53,
    distance: 21,
    speed: 0.53,
    color: '#c1440e',
    emissive: '#3d0f03',
    description: 'El planeta rojo. Futuro destino humano.',
    moons: 2,
    dayLength: '24.6 horas',
    temperature: '-65°C promedio',
    type: 'Rocoso',
  },
  {
    name: 'Júpiter',
    radius: 2.8,
    distance: 32,
    speed: 0.084,
    color: '#d4a574',
    emissive: '#3d2a15',
    description: 'El más grande. Una gigante de gas.',
    moons: 95,
    dayLength: '10 horas',
    temperature: '-110°C promedio',
    type: 'Gigante gaseoso',
    stripes: true,
  },
  {
    name: 'Saturno',
    radius: 2.4,
    distance: 44,
    speed: 0.034,
    color: '#f4d59e',
    emissive: '#4a3a1f',
    description: 'Famoso por sus anillos espectaculares.',
    moons: 146,
    dayLength: '10.7 horas',
    temperature: '-140°C promedio',
    type: 'Gigante gaseoso',
    hasRings: true,
  },
  {
    name: 'Urano',
    radius: 1.6,
    distance: 56,
    speed: 0.012,
    color: '#72c4d4',
    emissive: '#1a3a42',
    description: 'Gigante de hielo inclinado 98°.',
    moons: 28,
    dayLength: '17.2 horas',
    temperature: '-195°C promedio',
    type: 'Gigante de hielo',
  },
  {
    name: 'Neptuno',
    radius: 1.5,
    distance: 66,
    speed: 0.006,
    color: '#3f54ba',
    emissive: '#0f1a4a',
    description: 'El más lejano. Vientos supersónicos.',
    moons: 16,
    dayLength: '16.1 horas',
    temperature: '-200°C promedio',
    type: 'Gigante de hielo',
  },
];

// Sun component with glow effect
function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  
  return (
    <group>
      {/* Core */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial color="#ffdd00" />
      </mesh>
      
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.4} />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.15} />
      </mesh>
      
      {/* Corona */}
      <mesh>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.05} />
      </mesh>
      
      {/* Point light from sun */}
      <pointLight intensity={3} distance={200} decay={0.5} color="#fff5d4" />
      
      {/* Label */}
      <Html position={[0, 5, 0]} center>
        <div className="planet-label sun-label">☀️ SOL</div>
      </Html>
    </group>
  );
}

// Planet component with orbit
function Planet({ data, index }: { data: typeof planetsData[0]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  
  // Create orbit path points
  const orbitPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * data.distance,
        0,
        Math.sin(angle) * data.distance
      ));
    }
    return points;
  }, [data.distance]);

  // Saturn rings geometry
  const ringsGeometry = useMemo(() => {
    if (!data.hasRings) return null;
    return new THREE.RingGeometry(data.radius + 0.5, data.radius + 2, 64);
  }, [data.hasRings, data.radius]);

  return (
    <group ref={groupRef}>
      {/* Orbit line */}
      <Line
        points={orbitPoints}
        color="#ffffff"
        opacity={0.08}
        transparent
        lineWidth={1}
      />
      
      {/* Planet group that rotates around sun */}
      <group rotation={[0, index * 0.7, 0]}>
        <group position={[data.distance, 0, 0]}>
          {/* Planet body */}
          <mesh
            ref={meshRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => setSelected(!selected)}
            scale={hovered ? 1.2 : 1}
          >
            <sphereGeometry args={[data.radius, 32, 32]} />
            <meshStandardMaterial
              color={data.color}
              emissive={data.emissive}
              emissiveIntensity={hovered ? 0.8 : 0.3}
              metalness={0.2}
              roughness={0.7}
            />
          </mesh>
          
          {/* Saturn rings */}
          {data.hasRings && ringsGeometry && (
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
              <primitive object={ringsGeometry} />
              <meshStandardMaterial
                color="#c9b896"
                emissive="#4a3d25"
                emissiveIntensity={0.2}
                side={THREE.DoubleSide}
                transparent
                opacity={0.7}
              />
            </mesh>
          )}
          
          {/* Earth's moon */}
          {data.name === 'Tierra' && (
            <group>
              <mesh position={[1.5, 0, 0]}>
                <sphereGeometry args={[0.27, 16, 16]} />
                <meshStandardMaterial
                  color="#cccccc"
                  emissive="#222222"
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
              <Line
                points={[[0, 0, 0], [1.5, 0, 0]]}
                color="#ffffff"
                opacity={0.1}
                transparent
              />
            </group>
          )}
          
          {/* Earth atmosphere glow */}
          {data.hasAtmosphere && (
            <mesh>
              <sphereGeometry args={[data.radius + 0.1, 32, 32]} />
              <meshBasicMaterial
                color="#88ccff"
                transparent
                opacity={0.15}
              />
            </mesh>
          )}
          
          {/* Planet label */}
          <Html position={[0, data.radius + 1.5, 0]} center>
            <div className={`planet-label ${hovered ? 'hovered' : ''} ${selected ? 'selected' : ''}`}>
              {data.name}
            </div>
          </Html>
          
          {/* Info panel on click */}
          {selected && (
            <Html position={[data.radius + 3, 2, 0]} center={false}>
              <div className="planet-info">
                <h3>{data.name}</h3>
                <div className="info-row">
                  <span className="label">Tipo:</span>
                  <span className="value">{data.type}</span>
                </div>
                <div className="info-row">
                  <span className="label">Distancia al Sol:</span>
                  <span className="value">{data.distance} AU (escala)</span>
                </div>
                <div className="info-row">
                  <span className="label">Día:</span>
                  <span className="value">{data.dayLength}</span>
                </div>
                <div className="info-row">
                  <span className="label">Temperatura:</span>
                  <span className="value">{data.temperature}</span>
                </div>
                <div className="info-row">
                  <span className="label">Lunas:</span>
                  <span className="value">{data.moons}</span>
                </div>
                <p className="desc">{data.description}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelected(false); }}
                  className="close-btn"
                >
                  Cerrar
                </button>
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}

// Asteroid Belt
function AsteroidBelt() {
  const asteroids = useMemo(() => {
    const items: { pos: [number, number, number]; size: number }[] = [];
    for (let i = 0; i < 300; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 25 + Math.random() * 4;
      items.push({
        pos: [
          Math.cos(angle) * distance,
          (Math.random() - 0.5) * 1,
          Math.sin(angle) * distance,
        ],
        size: Math.random() * 0.1 + 0.02,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {asteroids.map((a, i) => (
        <mesh key={i} position={a.pos}>
          <sphereGeometry args={[a.size, 4, 4]} />
          <meshStandardMaterial
            color="#555555"
            emissive="#111111"
            metalness={0.3}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

// Animated planets with rotation
function AnimatedPlanets() {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <group ref={groupRef}>
      {planetsData.map((planet, index) => (
        <Planet key={planet.name} data={planet} index={index} />
      ))}
    </group>
  );
}

// HUD UI
function HUD({ timeSpeed, setTimeSpeed }: { timeSpeed: number; setTimeSpeed: (v: number) => void }) {
  return (
    <div className="hud">
      <div className="hud-top-left">
        <div className="hud-title">
          <span className="icon">🌌</span>
          <span>SISTEMA SOLAR 3D</span>
        </div>
        <div className="hud-subtitle">Representación interactiva del espacio</div>
      </div>
      
      <div className="hud-top-right">
        <div className="speed-control">
          <span className="label">Velocidad</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={timeSpeed}
            onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
          />
          <span className="value">{timeSpeed.toFixed(1)}x</span>
        </div>
        <div className="legend">
          <div className="legend-item">
            <div className="dot rocky" /> Rocosos
          </div>
          <div className="legend-item">
            <div className="dot gas" /> Gaseosos
          </div>
          <div className="legend-item">
            <div className="dot ice" /> Helados
          </div>
        </div>
      </div>
      
      <div className="hud-bottom">
        <div className="controls-hint">
          <span>🖱️ Arrastra para rotar</span>
          <span>🔍 Scroll para zoom</span>
          <span>👆 Click en planeta para info</span>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [timeSpeed, setTimeSpeed] = useState(1);
  
  return (
    <div className="solar-system-app">
      <HUD timeSpeed={timeSpeed} setTimeSpeed={setTimeSpeed} />
      
      <Canvas
        camera={{ position: [0, 50, 80], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#000005']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.05} />
        
        {/* Stars background */}
        <Stars radius={300} depth={100} count={8000} factor={5} saturation={0} fade speed={1} />
        
        <Suspense fallback={null}>
          <Sun />
          <AnimatedPlanets />
          <AsteroidBelt />
        </Suspense>
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={200}
          autoRotate
          autoRotateSpeed={0.2 * timeSpeed}
        />
      </Canvas>
    </div>
  );
}