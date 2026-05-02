# Portfolio Alexander — Futuristic 2026 Edition

## Concept & Vision
Un portafolio web de última generación que combina estéticas cyberpunk con diseño minimalista premium. La experiencia se siente como navegar por una interfaz de una nave espacial del futuro: partículas flotantes, gradientes neon, elementos 3D inmersivos y transiciones fluidas que evocan tecnología de punta. Cada interacción transmite precisión y innovación.

## Design Language

### Aesthetic Direction
Cyberpunk Minimal — Fusión de UI futurista con clean design. Inspirado en interfaces de ciencia ficción (Blade Runner 2049, Westworld) mezclado con la limpieza de Apple.

### Color Palette
- **Primary**: `#00f0ff` (Cyan neón brillante)
- **Secondary**: `#8b5cf6` (Violeta eléctrico)
- **Accent**: `#f0abfc` (Rosa neon suave)
- **Background Dark**: `#030014` (Negro profundo espacial)
- **Background Mid**: `#0f0a1e` (Púrpura oscuro)
- **Text Primary**: `#f8fafc` (Blanco puro)
- **Text Secondary**: `#94a3b8` (Gris azulado)

### Typography
- **Headings**: `Space Grotesk` — Geométrica, futurista
- **Body**: `Inter` — Legible, moderna
- **Code/Tech**: `JetBrains Mono` — Para elementos técnicos

### Motion Philosophy
- **3D Background**: Partículas flotantes y geometría wireframe rotando lentamente
- **Scroll Animations**: Parallax suave con elementos que aparecen con efectos de glitch/scan
- **Hover States**: Glow effects, scale sutil, borders que brillan
- **Page Transitions**: Fade con efecto de "digital dissolve"
- **Micro-interactions**: Ripple effects, cursor personalizado, elementos que responden al mouse

## Layout & Structure

### Hero Section
- Canvas 3D con partículas y geometría flotante
- Nombre con efecto de typing/reveal
- Subtítulo con职位
- CTAs con glow effect
- Scroll indicator animado

### About Section
- Estadísticas animadas (contador)
- Grid de habilidades con iconos 3D-style
- Bio con efecto de typing

### Projects Section
- Cards con efecto glassmorphism
- Hover revela preview con glitch effect
- Filtros por tecnología
- Grid responsive

### Contact Section
- Formulario estilizado como terminal/console
- Links sociales con iconos animados
- Footer minimalista

## Features & Interactions

### 3D Background (Three.js)
- Partículas flotantes conectadas por líneas
- Geometría icosahedron rotando
- Colores que responden al scroll
- Performance optimizado

### GSAP Animations
- ScrollTrigger para reveal de secciones
- TextSplit para efectos de typing
- Parallax en elementos decorativos
- Smooth scroll behavior

### Interactions
- Custom cursor con trail effect
- Magnetic buttons
- Tilt effect en cards
- Sound effects opcionales (toggle)

## Component Inventory

### Navigation
- Fixed, transparente que se solidifica
- Links con underline animado
- Logo con glow
- Mobile: hamburger con overlay

### Hero Card
- Glassmorphism container
- Particle canvas embed
- Animated gradient border

### Project Card
- Image con overlay gradient
- Tags con pill style
- Hover: scale + glow + reveal details
- Tech stack icons

### Skill Badge
- Icon + label
- Glow on hover
- Progress indicator

### Contact Form
- Floating labels
- Input con glow focus
- Submit button con loading state
- Success/error animations

## Technical Approach
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + custom CSS
- **3D**: Three.js + @react-three/fiber
- **Animation**: GSAP + ScrollTrigger
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Space Grotesk, Inter)