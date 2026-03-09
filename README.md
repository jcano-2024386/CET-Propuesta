# 🏥 CET — Clínica Estudiantil Técnica


## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Metodología SCRUM](#-metodología-scrum)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Modelos de Datos](#-modelos-de-datos)
- [Roles del Sistema](#-roles-del-sistema)
- [Seguridad](#-seguridad)
- [Administrador por Defecto](#-administrador-por-defecto)
- [Equipo](#-equipo)

---

## 📌 Descripción

**CET (Clínica Estudiantil Técnica)** es un sistema de gestión médica escolar desarrollado como proyecto de Práctica Supervisada en el **Centro Educativo Técnico Laboral Kinal**. Permite digitalizar y centralizar las operaciones de la clínica escolar que antes se realizaban de forma manual:

- **Registro y autenticación** de usuarios encargados de la clínica con JWT
- **Gestión de pacientes** con datos académicos y personales completos por estudiante
- **Búsqueda rápida** de pacientes mediante código académico
- **Historial médico** completo con trazabilidad de consultas, síntomas y tratamientos
- **Inventario de medicamentos** con control de stock, fechas de vencimiento y alertas automáticas
- **Registro de consultas** con descuento automático de inventario al suministrar medicamentos
- **Alertas de stock** para medicamentos agotados, con bajo stock o próximos a vencer
- **Dashboard** con estadísticas en tiempo real: pacientes atendidos, consultas del día, disponibilidad de medicamentos
- **Control de roles**: ADMIN y ENCARGADO con accesos diferenciados

---

## 🏗️ Arquitectura

CET utiliza una **arquitectura monolítica por capas** con separación clara de responsabilidades entre frontend y backend:

```
CET/
├── 🖥️  Backend (Node.js + Express)
│   ├── Autenticación con JWT
│   ├── Gestión de pacientes (CRUD + búsqueda por código)
│   ├── Historial médico por estudiante
│   ├── Inventario de medicamentos con alertas
│   ├── Registro de consultas con descuento automático de stock
│   └── Dashboard con estadísticas en tiempo real
│
└── 🎨 Frontend (React + Vite)
    ├── Login con autenticación JWT
    ├── Dashboard principal con estadísticas
    ├── Módulo de pacientes con búsqueda y paginación
    ├── Historial médico detallado por estudiante
    ├── Módulo de medicamentos con control de inventario
    └── Módulo de consultas con selector de medicamentos
```

---

## 🛠️ Tecnologías

### Backend — Node.js

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18 | Runtime de JavaScript |
| Express | ^4.18 | Framework HTTP |
| MongoDB + Mongoose | ^8.2 | Base de datos NoSQL |
| JWT (jsonwebtoken) | ^9.0 | Autenticación con tokens |
| bcryptjs | ^2.4 | Hash seguro de contraseñas |
| Helmet | ^7.1 | Protección de cabeceras HTTP |
| express-rate-limit | ^7.2 | Limitación de solicitudes por IP |
| express-validator | ^7.1 | Validación estricta de campos |
| Morgan | ^1.10 | Logging de peticiones HTTP |
| dotenv | ^16.4 | Gestión de variables de entorno |

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | ^18.3 | Biblioteca de interfaz de usuario |
| Vite | ^5.2 | Bundler y servidor de desarrollo |
| React Router DOM | ^6.23 | Enrutamiento del lado del cliente |
| Axios | ^1.6 | Cliente HTTP para consumo de la API |
| React Hot Toast | ^2.4 | Notificaciones de usuario |

### DevOps y Herramientas

| Herramienta | Uso |
|---|---|
| Docker + Docker Compose | Contenedorización del sistema completo |
| Nginx | Servidor web para el frontend en producción |
| GitHub | Control de versiones |
| Postman | Pruebas de la API |
| Visual Studio Code | Entorno de desarrollo principal |

---

## 📁 Estructura del Proyecto

```
CET/
├── backend/
│   ├── configs/
│   │   ├── app.js                      # Configuración de Express y rutas
│   │   └── db.js                       # Conexión a MongoDB con eventos de estado
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js           # Validación y decodificación de JWT
│   │   ├── handle-errors.js             # Middleware global de errores
│   │   └── request-limit.js             # Rate limiting (100 req / 15 min)
│   │
│   ├── utils/
│   │   └── seed-admin.js               # Creación automática del administrador
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js       # Registro, login, perfil y cambio de contraseña
│   │   │   ├── paciente.controller.js   # CRUD de pacientes + búsqueda por código
│   │   │   ├── medicamento.controller.js # CRUD de medicamentos + ajuste de stock
│   │   │   ├── consulta.controller.js   # Registro de consultas + descuento de stock
│   │   │   └── dashboard.controller.js  # Estadísticas y alertas en tiempo real
│   │   │
│   │   ├── models/
│   │   │   ├── usuario.model.js         # Esquema de usuario con hash de contraseña
│   │   │   ├── paciente.model.js        # Esquema de paciente con índices de búsqueda
│   │   │   ├── medicamento.model.js     # Esquema de medicamento con estado virtual
│   │   │   └── consulta.model.js        # Esquema de consulta con sub-documento de medicamentos
│   │   │
│   │   └── routes/
│   │       ├── auth.routes.js           # Rutas de autenticación
│   │       ├── paciente.routes.js       # Rutas de pacientes
│   │       ├── medicamento.routes.js    # Rutas de medicamentos
│   │       ├── consulta.routes.js       # Rutas de consultas
│   │       └── dashboard.routes.js      # Ruta del dashboard
│   │
│   ├── .env.example                    # Plantilla de variables de entorno
│   ├── Dockerfile                      # Imagen Docker del backend
│   ├── package.json
│   └── index.js                        # Entry point del servidor
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Layout.jsx               # Contenedor principal con Outlet
│       │   └── Sidebar.jsx              # Barra lateral de navegación
│       │
│       ├── context/
│       │   └── AuthContext.jsx          # Estado global de autenticación
│       │
│       ├── pages/
│       │   ├── Login.jsx                # Pantalla de inicio de sesión
│       │   ├── Dashboard.jsx            # Estadísticas y alertas generales
│       │   ├── Pacientes.jsx            # Listado y gestión de pacientes
│       │   ├── HistorialPaciente.jsx    # Historial médico individual
│       │   ├── Medicamentos.jsx         # Inventario de medicamentos
│       │   └── Consultas.jsx            # Registro de consultas médicas
│       │
│       ├── services/
│       │   └── api.js                   # Instancia de Axios con interceptores
│       │
│       ├── App.jsx                      # Rutas y protección de acceso
│       └── index.css                    # Estilos globales con variables CSS
│
├── docker-compose.yml                  # Orquestación de servicios (MongoDB + backend + frontend)
└── README.md
```

---

## 🔄 Metodología SCRUM

El proyecto se desarrolla en **4 sprints de 1 semana** más 1 semana de pruebas finales (duración total: 5 semanas):

| Sprint | Semana | Objetivo | Estado |
|---|---|---|---|
| **Sprint 1** | 1 | Análisis de requisitos, diseño de base de datos, configuración del entorno y estructura del proyecto | ✅ Completo |
| **Sprint 2** | 2 | Módulo de pacientes: registro, edición, eliminación y búsqueda por código académico | ✅ Completo |
| **Sprint 3** | 3 | Módulo de inventario: registro de medicamentos, control de stock y alertas de vencimiento | ✅ Completo |
| **Sprint 4** | 4 | Integración total: consultas médicas, descuento automático de stock y dashboard | ✅ Completo |
| **Sprint 5** | 5 | Pruebas finales, corrección de errores, documentación y presentación | 🔄 En progreso |

### Roles SCRUM

| Rol | Integrante | Responsabilidades |
|---|---|---|
| **Scrum Master** | Jeferson Cano | Elimina impedimentos, facilita procesos, coordina reuniones, asegura el cumplimiento de la metodología |
| **Product Owner** | Otto Díaz | Define y prioriza el Product Backlog, valida que el producto cumpla los objetivos |

### Medición del Progreso

El avance se mide mediante:
- Número de tareas completadas por sprint
- Comparación entre tareas pendientes y terminadas
- Revisión semanal del backlog

---

## ✅ Requisitos Previos

- **Node.js** ≥ 18 y **npm**
- **MongoDB** (local o MongoDB Atlas)
- **Docker** (opcional, para levantar con Docker Compose)

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/CET.git
cd CET
```

### 2. Configurar e iniciar el Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tu URI de MongoDB y clave JWT
npm install
npm run dev
```

El servidor arranca en `http://localhost:5000`

Al iniciar por primera vez, el sistema crea automáticamente el usuario administrador por defecto.

### 3. Configurar e iniciar el Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. (Opcional) Levantar con Docker Compose

```bash
docker-compose up -d
```

Esto levanta MongoDB, el backend y el frontend en contenedores listos para producción.

> ⚠️ **Nunca subas tu `.env` real al repositorio.** Agrégalo al `.gitignore`.

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la carpeta `/backend` basándote en `.env.example`:

```env
PORT=5000
URI_MONGO=mongodb://localhost:27017/cet_clinica
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRES_IN=24h
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde escucha el servidor (default: 5000) |
| `URI_MONGO` | URI de conexión a MongoDB |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej: `24h`, `7d`) |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) |
| `FRONTEND_URL` | URL del frontend para configuración de CORS |

---

## 🔌 Endpoints de la API

Base URL: `/api/v1`

Los endpoints protegidos requieren: `Authorization: Bearer <token>`

---

### 🔐 Autenticación — `/auth`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión, retorna JWT | No |
| `POST` | `/auth/register` | Crear nuevo usuario encargado | ✅ ADMIN |
| `GET` | `/auth/profile` | Ver perfil del usuario autenticado | ✅ JWT |
| `PUT` | `/auth/change-password` | Cambiar contraseña del usuario | ✅ JWT |

---

### 👤 Pacientes — `/pacientes`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| `GET` | `/pacientes` | Listar pacientes con paginación y búsqueda | ✅ JWT |
| `GET` | `/pacientes/codigo/:codigo` | Buscar paciente por código académico | ✅ JWT |
| `GET` | `/pacientes/:id` | Obtener paciente por ID | ✅ JWT |
| `GET` | `/pacientes/:id/historial` | Ver historial médico completo del paciente | ✅ JWT |
| `POST` | `/pacientes` | Registrar nuevo paciente | ✅ JWT |
| `PUT` | `/pacientes/:id` | Actualizar datos del paciente | ✅ JWT |
| `DELETE` | `/pacientes/:id` | Desactivar paciente (soft delete) | ✅ JWT |

**Parámetros de búsqueda (`GET /pacientes`):**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `search` | String | Busca por nombre, apellido o código académico |
| `page` | Number | Número de página (default: 1) |
| `limit` | Number | Resultados por página (default: 12) |
| `activo` | Boolean | Filtrar por estado activo/inactivo |

---

### 💊 Medicamentos — `/medicamentos`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| `GET` | `/medicamentos` | Listar medicamentos con filtros | ✅ JWT |
| `GET` | `/medicamentos/alertas` | Obtener medicamentos con alertas de stock | ✅ JWT |
| `GET` | `/medicamentos/:id` | Obtener medicamento por ID | ✅ JWT |
| `POST` | `/medicamentos` | Registrar nuevo medicamento | ✅ JWT |
| `PUT` | `/medicamentos/:id` | Actualizar medicamento | ✅ JWT |
| `PATCH` | `/medicamentos/:id/stock` | Ajustar stock (entrada o salida manual) | ✅ JWT |
| `DELETE` | `/medicamentos/:id` | Eliminar medicamento (soft delete) | ✅ JWT |

**Estados calculados del medicamento:**

| Estado | Condición |
|---|---|
| `DISPONIBLE` | Stock mayor al mínimo y sin riesgo de vencimiento |
| `BAJO_STOCK` | Stock igual o menor a la cantidad mínima configurada |
| `AGOTADO` | Stock en cero |
| `POR_VENCER` | Fecha de vencimiento dentro de los próximos 30 días |

---

### 📋 Consultas — `/consultas`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| `GET` | `/consultas` | Listar consultas con paginación | ✅ JWT |
| `GET` | `/consultas/:id` | Obtener consulta por ID | ✅ JWT |
| `POST` | `/consultas` | Registrar nueva consulta médica | ✅ JWT |
| `PUT` | `/consultas/:id` | Actualizar estado u observaciones | ✅ JWT |

**Reglas de negocio:**
- Al registrar una consulta, el sistema **verifica disponibilidad** de cada medicamento seleccionado
- Si el stock es insuficiente para cualquier medicamento, la operación es **rechazada completamente**
- Al confirmar la consulta, el inventario se **descuenta automáticamente** por cada medicamento suministrado
- El campo `encargado` se asigna automáticamente desde el token JWT del usuario autenticado

---

### 📊 Dashboard — `/dashboard`

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| `GET` | `/dashboard` | Obtener estadísticas y alertas generales | ✅ JWT |

**Respuesta del Dashboard:**

| Campo | Descripción |
|---|---|
| `totalPacientes` | Total de pacientes activos registrados |
| `consultasHoy` | Consultas realizadas en el día actual |
| `consultasMes` | Consultas realizadas en el mes en curso |
| `totalMedicamentos` | Total de medicamentos en el sistema |
| `medicamentosDisponibles` | Medicamentos con estado DISPONIBLE |
| `medicamentosAgotados` | Medicamentos con stock en cero |
| `medicamentosBajoStock` | Medicamentos por debajo del mínimo |
| `medicamentosPorVencer` | Medicamentos con vencimiento en ≤ 30 días |
| `alertas` | Lista completa de medicamentos que requieren atención |
| `ultimasConsultas` | Las 5 consultas más recientes |

---

### ❤️ Health Check

```
GET /api/v1/health
```

Retorna el estado del servidor, timestamp y nombre del servicio.

---

## 🗄️ Modelos de Datos

### Usuario (`Usuario`)

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | String | Nombre completo del encargado |
| `email` | String | Correo electrónico único (minúsculas) |
| `password` | String | Contraseña hasheada con bcrypt (salt: 10) |
| `rol` | Enum | `ADMIN` / `ENCARGADO` |
| `activo` | Boolean | Estado activo / desactivado (soft delete) |

> 🔒 La contraseña nunca se retorna en respuestas gracias al método `toJSON` del modelo.

---

### Paciente (`Paciente`)

| Campo | Tipo | Descripción |
|---|---|---|
| `codigoAcademico` | String | Código único del estudiante, en mayúsculas (inmutable como identificador) |
| `nombre` | String | Nombre del estudiante |
| `apellido` | String | Apellido del estudiante |
| `edad` | Number | Edad (entre 5 y 30 años) |
| `grado` | String | Grado académico del estudiante |
| `seccion` | String | Sección del grado (ej: A, B, C) |
| `genero` | Enum | `M` / `F` |
| `telefono` | String | Teléfono del estudiante |
| `telefonoEmergencia` | String | Teléfono de contacto de emergencia |
| `alergias` | String | Alergias conocidas (default: "Ninguna") |
| `activo` | Boolean | Estado activo / desactivado (soft delete) |

---

### Medicamento (`Medicamento`)

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | String | Nombre del medicamento (único) |
| `descripcion` | String | Descripción opcional |
| `categoria` | Enum | `ANALGESICO` / `ANTIBIOTICO` / `ANTIINFLAMATORIO` / `ANTIHISTAMINICO` / `ANTIACIDO` / `VITAMINAS` / `OTRO` |
| `cantidad` | Number | Stock actual (mínimo 0) |
| `cantidadMinima` | Number | Umbral de alerta de stock bajo (default: 5) |
| `unidad` | Enum | `PASTILLAS` / `ML` / `SOBRES` / `CAPSULAS` / `AMPOLLAS` / `OTRO` |
| `fechaVencimiento` | Date | Fecha de vencimiento del lote |
| `proveedor` | String | Proveedor del medicamento |
| `activo` | Boolean | Estado activo / desactivado (soft delete) |
| `estado` _(virtual)_ | String | Calculado automáticamente: `DISPONIBLE` / `BAJO_STOCK` / `AGOTADO` / `POR_VENCER` |

---

### Consulta (`Consulta`)

| Campo | Tipo | Descripción |
|---|---|---|
| `paciente` | ObjectId | Referencia al paciente atendido |
| `encargado` | ObjectId | Referencia al usuario que registró la consulta |
| `fechaConsulta` | Date | Fecha y hora de la consulta (default: ahora) |
| `sintomas` | String | Descripción de los síntomas presentados |
| `diagnostico` | String | Diagnóstico del encargado |
| `tratamiento` | String | Tratamiento indicado |
| `medicamentosSuministrados` | Array | Sub-documentos con medicamento, cantidad y dosis |
| `observaciones` | String | Observaciones adicionales |
| `seguimientoRequerido` | Boolean | Indica si el caso requiere seguimiento posterior |
| `estado` | Enum | `ACTIVA` / `CERRADA` / `SEGUIMIENTO` |

---

## 👥 Roles del Sistema

| Rol | Descripción | Acceso |
|---|---|---|
| `ADMIN` | Administrador del sistema | Acceso total — usuarios, pacientes, medicamentos, consultas y dashboard |
| `ENCARGADO` | Docente o enfermero encargado de la clínica | Acceso operativo — pacientes, medicamentos, consultas e historial médico |

---

## 🔒 Seguridad

- Contraseñas hasheadas con **bcryptjs** (salt rounds: 10)
- Autenticación mediante **JWT** con expiración configurable (default: 24h)
- Token requerido vía header `Authorization: Bearer <token>`
- Cabeceras HTTP protegidas con **Helmet**
- **Rate Limiting** activo: 100 solicitudes por IP cada 15 minutos
- **CORS** configurado explícitamente para el origen del frontend
- Manejo global de excepciones con middleware dedicado
- Rutas protegidas con middleware de verificación de token y rol
- Conexión a MongoDB con pool de 10 conexiones y timeout de 5 segundos
- Cierre controlado de la base de datos ante señales `SIGINT` y `SIGTERM`
- La contraseña nunca se retorna en respuestas gracias al método `toJSON` del modelo
- Soft delete en pacientes y medicamentos para conservar integridad referencial del historial

---

## 🔑 Administrador por Defecto

Al iniciar el servidor por primera vez, el sistema crea automáticamente un usuario administrador:

| Campo | Valor |
|---|---|
| Email | `admin@cet.kinal.edu.gt` |
| Password | `Admin2025!` |
| Rol | `ADMIN` |

> ⚠️ Se recomienda cambiar la contraseña del administrador inmediatamente después del primer inicio.

---

## 👥 Equipo

| Integrante | Carné | Rol SCRUM | Área | Responsabilidades |
|---|---|---|---|---|
| **Jeferson André Cano López** | 2024386 | Scrum Master | Backend & Base de Datos | Desarrollo de endpoints, modelado de base de datos, lógica de descuento de stock, configuración del servidor |
| **Otto Raúl Díaz Batres** | 2024248 | Product Owner | Frontend & Integración | Definición de requerimientos, diseño de UI en React, integración frontend-backend, validaciones |

---

## 📄 Información Académica

| Campo | Detalle |
|---|---|
| **Institución** | Centro Educativo Técnico Laboral Kinal |
| **Curso** | Tecnología — Práctica Supervisada |
| **Profesor** | Braulio Echeverría |
| **Fecha de Planificación** | 27 de febrero de 2026 |

---
