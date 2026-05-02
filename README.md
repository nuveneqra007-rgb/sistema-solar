# Sistema Solar 3D — Explora el Espacio

Una representación interactiva 3D del Sistema Solar construida con React, Three.js y Tailwind CSS. Explora planetas, órbitas y descubre información astronómica en tiempo real.

## 🚀 Características

- **Visualización 3D Interactiva**: Visualiza los planetas del Sistema Solar en una representación 3D completamente interactiva
- **Información Detallada**: Accede a datos precisos sobre cada planeta incluyendo temperaturas, satélites, tipos de suelo y duración del día
- **Controles Intuitivos**: Navega con el mouse para rotar, zoom para acercarte y explora libremente
- **Diseño Responsivo**: Experiencia optimizada para escritorio, tablet y dispositivos móviles
- **Rendimiento Optimizado**: Utiliza WebGL y optimizaciones de Three.js para fluidez en cualquier dispositivo

## 🛠️ Tecnologías

- **React 19** - Interfaz de usuario moderna
- **Vite** - Bundler de última generación
- **Three.js** - Gráficos 3D WebGL
- **React Three Fiber** - Bindings de React para Three.js
- **Drei** - Utilidades esenciales para Three.js
- **Tailwind CSS** - Estilos modernos y responsivos
- **TypeScript** - Type safety en todo el código

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🔧 Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa del build
npm run preview
```

## 📦 Estructura del Proyecto

```
.
├── src/
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Punto de entrada
│   ├── index.css         # Estilos globales
│   └── utils/
│       └── cn.ts         # Utilidades de estilo
├── index.html            # HTML base
├── vite.config.ts        # Configuración de Vite
├── tsconfig.json         # Configuración de TypeScript
└── package.json          # Dependencias del proyecto
```

## 🌐 Despliegue

El proyecto está optimizado para desplegar en **Vercel**:

```bash
# Commit y push a GitHub
git add .
git commit -m "Tu mensaje"
git push

# Luego conecta el repositorio a Vercel en https://vercel.com
```

### Configuración de Vercel

El proyecto se configura automáticamente:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 📱 Funcionalidades Principales

### Exploración de Planetas
- Visualiza Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno
- Obtén información detallada al seleccionar un planeta
- Observa las órbitas y movimiento realista

### Información Astronómica
- Temperaturas promedio
- Cantidad de satélites (lunas)
- Tipo de planeta (rocoso/gaseoso)
- Duración del día
- Distancia relativa del Sol

### Controles Intuitivos
- **Mouse**: Arrastra para rotar la vista
- **Rueda del mouse**: Zoom in/out
- **Toque**: En dispositivos táctiles, arrastra para rotar
- **Pinch**: En dispositivos táctiles, pinch para zoom

## 🎨 Diseño y Estilos

El proyecto utiliza una paleta de colores espacial con:
- Fondos oscuros para simular el espacio profundo
- Colores vibrantes para representar cada planeta de forma realista
- Efectos de brillo para una experiencia visual envolvente
- Tipografía moderna y legible

## ⚡ Optimización

- **Minificación automática** de assets en build
- **Code splitting** para cargas más rápidas
- **Tree-shaking** para reducir bundle size
- **Lazy loading** de componentes cuando sea posible

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Alexander Nuveneqra - [GitHub](https://github.com/nuveneqra007-rgb)

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.

---

Construido con ❤️ usando React y Three.js
