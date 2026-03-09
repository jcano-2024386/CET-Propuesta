# 🏥 CET - Clínica Estudiantil Técnica
### Centro Educativo Técnico Laboral Kinal

**Proyecto desarrollado por:**
- Jeferson André Cano López (2024386) — Scrum Master / Developer
- Otto Raúl Diaz Batres (2024248) — Product Owner / Developer

---

## 📋 Descripción

Sistema web para la gestión digital de la clínica escolar de Kinal. Permite controlar el inventario de medicamentos y el registro de pacientes/consultas, reemplazando el control manual y en papel.

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express 4 |
| Base de Datos | MongoDB + Mongoose |
| Autenticación | JWT + bcryptjs |
| Estilos | CSS Custom (sin frameworks) |

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18
- MongoDB (local o MongoDB Atlas)
- npm o pnpm

### 1. Clonar y configurar

```bash
git clone <repo>
cd CET
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tu URI de MongoDB
npm install
npm run dev
```

El servidor arranca en `http://localhost:5000`

**Credenciales por defecto creadas automáticamente:**
- Email: `admin@cet.kinal.edu.gt`
- Password: `Admin2025!`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app estará en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
CET/
├── backend/
│   ├── configs/
│   │   ├── app.js          # Configuración Express
│   │   └── db.js           # Conexión MongoDB
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── handle-errors.js     # Error handler global
│   │   └── request-limit.js     # Rate limiter
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── paciente.controller.js
│   │   │   ├── medicamento.controller.js
│   │   │   ├── consulta.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── models/
│   │   │   ├── usuario.model.js
│   │   │   ├── paciente.model.js
│   │   │   ├── medicamento.model.js
│   │   │   └── consulta.model.js
│   │   └── routes/
│   │       ├── auth.routes.js
│   │       ├── paciente.routes.js
│   │       ├── medicamento.routes.js
│   │       ├── consulta.routes.js
│   │       └── dashboard.routes.js
│   ├── utils/
│   │   └── seed-admin.js   # Crea admin por defecto
│   ├── .env.example
│   └── index.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Layout.jsx
        │   └── Sidebar.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── Pacientes.jsx
        │   ├── HistorialPaciente.jsx
        │   ├── Medicamentos.jsx
        │   └── Consultas.jsx
        ├── services/
        │   └── api.js
        └── App.jsx
```

---

## 🔗 API Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | Iniciar sesión |
| GET | `/api/v1/auth/profile` | Ver perfil (🔒) |
| POST | `/api/v1/auth/register` | Crear usuario (🔒 ADMIN) |

### Pacientes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/pacientes` | Listar pacientes |
| GET | `/api/v1/pacientes/codigo/:codigo` | Buscar por código académico |
| GET | `/api/v1/pacientes/:id/historial` | Ver historial médico |
| POST | `/api/v1/pacientes` | Registrar paciente |
| PUT | `/api/v1/pacientes/:id` | Actualizar paciente |
| DELETE | `/api/v1/pacientes/:id` | Desactivar paciente |

### Medicamentos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/medicamentos` | Listar medicamentos |
| GET | `/api/v1/medicamentos/alertas` | Ver alertas de stock |
| POST | `/api/v1/medicamentos` | Registrar medicamento |
| PUT | `/api/v1/medicamentos/:id` | Actualizar medicamento |
| PATCH | `/api/v1/medicamentos/:id/stock` | Ajustar stock |
| DELETE | `/api/v1/medicamentos/:id` | Eliminar medicamento |

### Consultas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/consultas` | Listar consultas |
| POST | `/api/v1/consultas` | Registrar consulta + descuenta stock automáticamente |
| PUT | `/api/v1/consultas/:id` | Actualizar consulta |

### Dashboard
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/dashboard` | Estadísticas generales |

---

## ✅ Funcionalidades Implementadas

- [x] Login con JWT
- [x] Dashboard con estadísticas en tiempo real
- [x] CRUD completo de pacientes
- [x] Búsqueda rápida por código académico
- [x] Historial médico por estudiante
- [x] CRUD completo de medicamentos
- [x] Control de inventario con cantidad mínima
- [x] Alertas de stock bajo, agotado y por vencer
- [x] Descuento automático de stock al registrar consulta
- [x] Registro de consultas con múltiples medicamentos
- [x] Paginación en listas
- [x] Protección de rutas con JWT

---

## 🗓️ Sprints Completados

| Sprint | Contenido |
|--------|-----------|
| Sprint 1 | Análisis, diseño DB, estructura del proyecto |
| Sprint 2 | Módulo de pacientes (CRUD + búsqueda) |
| Sprint 3 | Módulo de inventario de medicamentos |
| Sprint 4 | Integración, consultas y descuento automático de stock |
| Sprint 5 | Pruebas, correcciones y entrega |
