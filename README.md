# 📦 SimpleStock - Sistema de Inventario y Facturación

Sistema completo de gestión de inventario, facturación y clientes construido con React + TypeScript + Material-UI.

---

## 🎉 Estado del Proyecto

```
✅ Especificaciones:  100% (43/43 tareas)
✅ Documentación:     100% (completa)
✅ UI Frontend:       95% (skeleton completo)
🚧 Backend API:       0% (pendiente)
🚧 Funcionalidad:     5% (mock data)
```

**Listo para empezar implementación del backend y conectar con API real.**

---

## 🚀 Quick Start

### Desarrollo

```bash
# Instalar dependencias
npm install

# Arrancar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Ver la App
- **Dev**: http://localhost:5173
- **Login**: (mock - cualquier credencial funciona)

---

## 📚 Documentación del Proyecto

| Archivo | Descripción | Úsalo Para |
|---------|-------------|------------|
| **🎯 QUICK-START-GUIDE.md** | Guía ultra-rápida para empezar | Arrancar implementación |
| **🤖 AI-IMPLEMENTATION-STRATEGY.md** | Estrategia completa de implementación en mini-sprints | Planificar desarrollo |
| **💬 PROMPT-TEMPLATES.md** | Prompts listos para copiar-pegar para IA | Implementar cada tarea |
| **📋 TASK-SPECIFICATIONS.md** | Especificaciones técnicas detalladas (5000+ líneas) | Consultar detalles de tareas |
| **📊 LINEAR-FINAL-REPORT.md** | Resumen de 43 tareas actualizadas en Linear | Ver progreso y estadísticas |
| **📄 LINEAR-UPDATE-SUMMARY.md** | Proceso de actualización y coherencia | Entender el proceso |

---

## 🎯 Empezar Desarrollo (Para IA o Devs)

### Paso 1: Lee la Estrategia (5 min)
```bash
cat AI-IMPLEMENTATION-STRATEGY.md
```

### Paso 2: Usa los Prompts (copy-paste)
```bash
cat PROMPT-TEMPLATES.md
```

### Paso 3: Implementa según Orden
1. **Fase 0**: Setup de infraestructura
2. **Mini-Sprint 1**: Categorías (SIM-52)
3. **Mini-Sprint 2**: Productos (SIM-49, 51, 50, 53)
4. **Mini-Sprint 3**: Clientes (SIM-64, 65, 63)
5. **Mini-Sprint 4**: Inventario (SIM-55, 56)
6. **Mini-Sprint 5**: Facturación (SIM-60, 59, 61)

**→ MVP Completo en ~13 tareas**

---

## 🏗️ Arquitectura

### Stack Técnico

```
Frontend:
├── React 18.2.0           - UI Framework
├── TypeScript 5.4.3       - Type Safety
├── Material-UI 5.15.15    - Component Library
├── React Router 6.23.1    - Routing
├── Vite 5.4.21           - Build Tool
├── dayjs 1.11.10         - Date Handling
└── Emotion               - Styling

Backend (Pendiente):
└── Express/NestJS + PostgreSQL/MongoDB (sugerido)
```

### Estructura del Proyecto

```
simpleStock-fe/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── layout/       # AppLayout, AuthLayout
│   │   ├── navigation/   # Sidebar, Topbar
│   │   └── common/       # StatCard, SectionHeader
│   ├── pages/            # Páginas por módulo
│   │   ├── auth/         # Login, Register, etc.
│   │   ├── dashboard/    # MainDashboard
│   │   ├── products/     # Gestión de productos
│   │   ├── inventory/    # Control de inventario
│   │   ├── invoicing/    # Facturación
│   │   ├── clients/      # Gestión de clientes
│   │   ├── suppliers/    # Gestión de proveedores
│   │   ├── reports/      # Reportes y análisis
│   │   ├── admin/        # Administración
│   │   └── help/         # Ayuda y soporte
│   ├── services/         # Servicios de API
│   │   └── mockApi.ts    # Mock services (temporal)
│   ├── types/            # Interfaces TypeScript
│   │   └── index.ts      # 138 interfaces definidas
│   ├── constants/        # Constantes
│   │   └── navigation.ts # Definición de menú
│   ├── mocks/            # Datos mock
│   │   └── data.ts       # Mock data para todas las entidades
│   ├── theme.ts          # Tema de Material-UI
│   ├── App.tsx           # Configuración de rutas
│   └── main.tsx          # Entry point
├── docs/                 # Documentación del proyecto
│   ├── TASK-SPECIFICATIONS.md
│   ├── AI-IMPLEMENTATION-STRATEGY.md
│   ├── PROMPT-TEMPLATES.md
│   ├── LINEAR-FINAL-REPORT.md
│   └── QUICK-START-GUIDE.md
└── package.json
```

---

## 📦 Módulos del Sistema

### 1. 🔐 Autenticación
- Login / Registro
- Recuperar contraseña
- Restablecer contraseña

### 2. 🎨 Dashboard
- KPIs principales
- Alertas de stock
- Movimientos recientes
- Gráficos de ventas

### 3. 📦 Productos
- CRUD de productos
- Gestión de categorías
- Códigos de barras
- Historial de precios y stock

### 4. 📊 Inventario
- Entradas y salidas de stock
- Transferencias entre ubicaciones
- Conteo físico y cíclico
- Valorización de inventario

### 5. 💰 Facturación
- Crear facturas (wizard de 5 pasos)
- Seguimiento de pagos
- Notas de crédito
- Estados: draft, sent, paid, overdue

### 6. 👥 Clientes
- CRUD de clientes
- Estado de cuenta
- Historial de transacciones
- Estadísticas de compras

### 7. 🏭 Proveedores
- CRUD de proveedores
- Órdenes de compra
- Historial de órdenes
- Catálogo de productos

### 8. 📈 Reportes
- Reportes de ventas
- Reportes de inventario
- Reportes financieros
- Dashboard analítico

### 9. ⚙️ Administración
- Gestión de usuarios
- Gestión de roles y permisos
- Configuración del sistema
- Backup y restauración
- Log de auditoría

### 10. ❓ Ayuda
- Guía de usuario
- Tutoriales en video
- FAQ
- Contactar soporte

---

## 🎯 Interfaces TypeScript Clave

### Productos
```typescript
interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  taxRate: number;
  stock: number;
  suppliers: SupplierSummary[];
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  sku: string;
  categoryId: string;
  costPrice: number;
  salePrice: number;
  wholesalePrice?: number;
  taxRate: number;
  initialStock: number;
  minimumStock: number;
  supplierIds: string[];
  imageUrls?: string[];
}
```

### Facturación
```typescript
interface Invoice {
  id: string;
  clientId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  total: number;
  dueDate: string;
  createdAt: string;
  items: InvoiceItem[];
}

interface InvoiceFormData {
  clientId: string;
  items: InvoiceItem[];
  totalDiscount?: number;
  paymentTerms: 'cash' | '30days' | '60days' | '90days';
  notes?: string;
}
```

**Ver `src/types/index.ts` para las 138 interfaces completas.**

---

## 🔌 Endpoints de API (a Implementar)

### Productos
```
GET    /api/products              → Product[]
GET    /api/products/:id          → ProductDetail
POST   /api/products              → Product
PUT    /api/products/:id          → Product
DELETE /api/products/:id          → { success: boolean }
```

### Inventario
```
POST   /api/inventory/entry       → StockMovement
POST   /api/inventory/exit        → StockMovement
POST   /api/inventory/transfer    → StockMovement[]
POST   /api/inventory/count       → InventoryDiscrepancy[]
```

### Facturación
```
GET    /api/invoices              → Invoice[]
GET    /api/invoices/:id          → InvoiceDetail
POST   /api/invoices              → Invoice
POST   /api/invoices/:id/payments → Payment
GET    /api/invoices/:id/payments → Payment[]
```

**Ver `TASK-SPECIFICATIONS.md` para todos los endpoints.**

---

## 📋 Tareas en Linear

### Estado: 100% Especificadas ✅

**Total**: 43 tareas únicas
- **Productos**: 5 tareas
- **Inventario**: 6 tareas
- **Facturación**: 5 tareas
- **Clientes**: 4 tareas
- **Proveedores**: 4 tareas
- **Reportes**: 4 tareas
- **Dashboard**: 4 tareas
- **Administración**: 5 tareas
- **Ayuda**: 5 tareas

### Prioridades

🔴 **Fase 1 - MVP Core** (19 tareas)
- Productos, Inventario, Facturación, Clientes

🟠 **Fase 2 - Operaciones Avanzadas** (8 tareas)
- Proveedores, Reportes básicos

🟡 **Fase 3 - Análisis y Admin** (11 tareas)
- Dashboard avanzado, Reportes financieros, Administración

🟢 **Fase 4 - Optimizaciones** (8 tareas)
- Códigos de barras, Conteos de inventario, Ayuda

### Ver Tareas en Linear
👉 https://linear.app/simplestock/team/SIM

---

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (port 5173)
npm run build        # Build para producción
npm run preview      # Preview del build
npm run type-check   # Verificar TypeScript

# Linear (si tienes linearctl instalado)
linearctl issue list --team SIM       # Listar tareas
linearctl issue get SIM-XX            # Ver detalle de tarea
```

---

## 🎨 Tema y Diseño

### Colores
```typescript
Primary: #2c3e9b (Deep Blue)
Secondary: #12a3b8 (Teal)
Background: #f5f7fb (Light Blue-Gray)
Text Primary: #0f172a (Dark Blue-Gray)
Text Secondary: #475569 (Gray)
```

### Componentes MUI Usados
- Layout: Box, Stack, Grid, Card
- Forms: TextField, Select, Autocomplete, Checkbox
- Feedback: Snackbar, Dialog, LinearProgress
- Navigation: Drawer, AppBar, Tabs
- Data: Table, List, Chip, Badge

---

## 🔧 Configuración

### Variables de Entorno

Crea `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=SimpleStock
VITE_APP_VERSION=1.0.0
```

### TypeScript Config

El proyecto usa TypeScript estricto:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

---

## 📖 Cómo Contribuir

### Para Desarrolladores

1. **Lee la estrategia**:
   ```bash
   cat AI-IMPLEMENTATION-STRATEGY.md
   ```

2. **Elige una tarea** del backlog de Linear

3. **Lee la especificación** en `TASK-SPECIFICATIONS.md`

4. **Implementa siguiendo** los criterios de aceptación

5. **Valida**:
   ```bash
   npm run build    # Compila?
   npm run dev      # Funciona?
   ```

6. **Commit**:
   ```bash
   git commit -m "feat(module): description (SIM-XX)"
   ```

### Para IA

1. **Usa los prompts** de `PROMPT-TEMPLATES.md`

2. **Sigue el orden** de `AI-IMPLEMENTATION-STRATEGY.md`

3. **Máximo 3-5 archivos** por sesión

4. **Valida después** de cada tarea

---

## 🚦 Roadmap

### ✅ Fase 0: Preparación (COMPLETADO)
- [x] UI skeleton completo (9 páginas)
- [x] 138 interfaces TypeScript definidas
- [x] Especificaciones de 43 tareas
- [x] Estrategia de implementación
- [x] Prompts para IA

### 🚧 Fase 1: MVP Core (EN PROGRESO)
- [ ] Setup de infraestructura (API client, Auth)
- [ ] Módulo de Productos completo
- [ ] Módulo de Clientes completo
- [ ] Inventario básico (entradas/salidas)
- [ ] Facturación core

### 📅 Fase 2: Operaciones Avanzadas
- [ ] Módulo de Proveedores
- [ ] Órdenes de compra
- [ ] Reportes básicos
- [ ] Notas de crédito

### 📅 Fase 3: Análisis y Administración
- [ ] Dashboard analítico
- [ ] Reportes financieros
- [ ] Gestión de usuarios y roles
- [ ] Configuración del sistema

### 📅 Fase 4: Optimizaciones
- [ ] Códigos de barras
- [ ] Conteos de inventario
- [ ] Módulo de ayuda
- [ ] Performance y UX

---

## 📞 Soporte

### Documentación
- **Quick Start**: `QUICK-START-GUIDE.md`
- **Estrategia**: `AI-IMPLEMENTATION-STRATEGY.md`
- **Prompts**: `PROMPT-TEMPLATES.md`
- **Especificaciones**: `TASK-SPECIFICATIONS.md`

### Linear
- **Board**: https://linear.app/simplestock/team/SIM
- **CLI**: `linearctl` instalado y configurado

### Issues
- Reporta issues en GitHub (si público)
- O usa Linear para tracking interno

---

## 📜 Licencia

[Especificar licencia]

---

## 👏 Créditos

Desarrollado por Ferced con asistencia de Claude Code (Anthropic).

**Herramientas utilizadas:**
- Claude Code para especificaciones y documentación
- Linear para gestión de tareas
- React + TypeScript + Material-UI para el frontend

---

## 🎉 Estado Actual

```
📊 PROYECTO READY FOR DEVELOPMENT

✅ UI Skeleton:        100% (9 páginas)
✅ Especificaciones:   100% (43 tareas)
✅ Interfaces TS:      100% (138 interfaces)
✅ Documentación:      100% (completa)
✅ Estrategia:         100% (definida)

🚧 Implementación:     0% (listo para empezar)
🚧 Backend API:        0% (pendiente)

PRÓXIMO PASO: Ejecutar Fase 0 (Setup)
```

**Última actualización**: 2025-10-27

---

**🚀 ¡Listo para arrancar la implementación!**
