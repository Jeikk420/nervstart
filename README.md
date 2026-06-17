# nervstart 🤖

**Comparador de precios inteligente para tiendas chilenas** — Jumbo, Santa Isabel, Tottus, Alvi, Acuenta.

## 🎯 Características

- ✅ **Web Scraping Automático** — Búsqueda simultánea en 5 tiendas
- ✅ **Interfaz Retro Win98** — Diseño nostálgico y funcional
- ✅ **Corrección de Typos** — Autocorrección inteligente de búsquedas
- ✅ **Caché de Resultados** — Búsquedas más rápidas
- ✅ **Historial de Búsquedas** — LocalStorage para acceso rápido
- ✅ **Logging Completo** — Sistema de logs con niveles
- ✅ **Animaciones Suaves** — Transiciones con Framer Motion

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 16+ (recomendado 18+)
- npm o yarn
- Chrome/Chromium (para Puppeteer)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/Jeikk420/nervstart.git
cd nervstart

# Backend
cd robot-precios
cp .env.example .env
npm install
npm start

# En otra terminal - Frontend
cd Frontend
cp .env.example .env.local
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
nervstart/
├── robot-precios/          # Backend (Node.js + Puppeteer)
│   ├── server.js           # Express server
│   ├── robot.js            # Web scraping logic
│   ├── logger.js           # Sistema de logging
│   ├── config.js           # Configuración centralizada
│   ├── cache.js            # Caché en memoria
│   ├── package.json        # Dependencias
│   └── .env.example        # Variables de entorno
│
├── Frontend/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── hooks/          # Custom hooks
│   │   ├── App.jsx         # Componente principal
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Estilos globales
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🔧 Configuración

### Backend (`robot-precios/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Puppeteer
HEADLESS=false          # Mostrar navegador durante scraping
TIMEOUT_MS=45000       # Timeout de navegación (ms)
NAV_TIMEOUT=5000       # Timeout de elementos (ms)

# Cache
CACHE_TTL=3600         # TTL de caché (segundos)
CACHE_MAX_ENTRIES=100  # Máximo de entradas en caché

# Logging
LOG_LEVEL=info         # debug, info, warn, error
```

### Frontend (`Frontend/.env.local`)

```env
VITE_API_URL=http://localhost:3000
```

## 📡 API Endpoints

### POST `/buscar`

Busca un producto en todas las tiendas.

**Request:**
```json
{
  "producto": "leche soprole 1 litro"
}
```

**Response:**
```json
{
  "jumbo": {
    "texto": "$1.290",
    "numero": 1290
  },
  "santaisabel": {
    "texto": "$1.350",
    "numero": 1350
  },
  "tottus": null,
  "alvi": {
    "texto": "$1.200",
    "numero": 1200
  },
  "acuenta": null
}
```

### GET `/ping`

Health check del servidor.

**Response:**
```json
{
  "ok": true,
  "timestamp": "2026-06-17T06:46:21Z"
}
```

### GET `/stats`

Estadísticas del servidor.

**Response:**
```json
{
  "cache": {
    "size": 5,
    "maxEntries": 100,
    "ttl": 3600
  },
  "environment": "development",
  "timestamp": "2026-06-17T06:46:21Z"
}
```

## 🎨 Componentes Frontend

### Componentes Principales

- **BinaryRain** — Animación de fondo (lluvia binaria)
- **Ornament** — Decoraciones SVG laterales
- **Win98Window** — Contenedor con estilo Windows 98
- **Win98Button** — Botón con estilo Windows 98
- **Win98Input** — Input con estilo Windows 98
- **Win98Loading** — Pantalla de carga
- **ResultRow** — Fila de resultado de búsqueda

### Custom Hooks

- **useSearch** — Manejo de búsquedas, resultados y historial

## 📝 Logging

Los logs se guardan en `robot-precios/logs/` con el formato:

```
[2026-06-17T06:46:21.000Z] [INFO] Starting search { originalQuery: "leche", correctedQuery: "leche" }
[2026-06-17T06:46:25.200Z] [DEBUG] Jumbo price found { precio: "$1.290" }
[2026-06-17T06:46:28.500Z] [INFO] Search completed and cached { query: "leche" }
```

## 🚀 Despliegue

### Con Docker Compose

```bash
# Crear archivo docker-compose.yml (próximamente)
docker-compose up
```

## 🔍 Características Técnicas

### Backend

- **Puppeteer + Stealth Plugin** — Evita detección anti-bot
- **Corrección de Texto** — Usa distancia de Levenshtein
- **Relevancia Semántica** — Matching inteligente de productos
- **Caché en Memoria** — Con TTL y límite de entradas
- **Logging Multi-nivel** — Con persistencia en archivos

### Frontend

- **React 19** — Con hooks y composición
- **Vite** — Build rápido y dev server
- **Framer Motion** — Animaciones suaves
- **Axios** — HTTP client con timeout
- **LocalStorage** — Historial de búsquedas

## 📊 Performance

- Búsquedas paralelas en 5 tiendas
- Caché para evitar rescraping
- Timeouts optimizados por tienda
- Animaciones GPU-aceleradas
- Bundle size optimizado (<200KB gzip)

## 🐛 Troubleshooting

### Error: "No se pudo conectar con el servidor"

- Verificar que `npm start` está corriendo en `robot-precios/`
- Verificar que `VITE_API_URL` es correcto en `.env.local`

### Error: "Producto no encontrado en ninguna tienda"

- Intentar con un nombre más corto
- Verificar que el producto existe en las tiendas chilenas

### Error: "La búsqueda tardó demasiado"

- Aumentar `TIMEOUT_MS` en `.env`
- Verificar conexión a internet

## 📚 Próximas Mejoras

- [ ] Tests unitarios e integración
- [ ] Docker Compose
- [ ] Notificaciones de cambios de precio
- [ ] Base de datos para historial
- [ ] Autenticación de usuario
- [ ] Búsqueda avanzada con filtros
- [ ] Gráficos de historial de precios

## 📄 Licencia

ISC

## 👥 Autor

Jeicov Diaz (@Jeikk420)

---

**¿Preguntas?** Abre un issue en GitHub.
