# 🚀 PROMPT PARA ARRANCAR IMPLEMENTACIÓN

Copia y pega este prompt completo a la IA para empezar.

---

# SimpleStock - Implementación Completa

## 📋 Contexto del Proyecto

Soy el desarrollador de **SimpleStock**, un sistema de inventario y facturación empresarial.

### Estado Actual
- ✅ Frontend: 95% completo (UI skeleton con 9 páginas, mock data)
- ✅ Especificaciones: 100% completo (43 tareas detalladas)
- ✅ Interfaces TypeScript: Definidas pero faltan agregar al código
- ✅ Documentación: 8 archivos de estrategia e implementación
- 🚧 Funcionalidad: 5% (todo es mock, necesito conectar con API real)

### Stack Técnico
- **Frontend**: React 18.2.0 + TypeScript 5.4.3 + Material-UI 5.15.15
- **Routing**: React Router 6.23.1
- **Build**: Vite 5.4.21
- **Styling**: Emotion + MUI Theme
- **Backend**: Pendiente (Express/NestJS + PostgreSQL sugerido)

---

## 📚 Documentación Disponible

Tengo 8 archivos clave en la raíz del proyecto:

1. **README.md** - Overview completo del proyecto
2. **TASK-SPECIFICATIONS.md** (5000+ líneas) - Especificaciones técnicas detalladas de las 43 tareas
3. **AI-IMPLEMENTATION-STRATEGY.md** - Estrategia de implementación en mini-sprints
4. **PROMPT-TEMPLATES.md** - Prompts específicos para cada tipo de tarea
5. **QUICK-START-GUIDE.md** - Guía ultra-rápida
6. **LINEAR-FINAL-REPORT.md** - Estado de tareas en Linear
7. **LINEAR-UPDATE-SUMMARY.md** - Proceso de actualización
8. **update-linear-tasks.cjs** - Script de automatización

---

## 🎯 Mi Objetivo

Necesito que me ayudes a **implementar SimpleStock de forma incremental e inteligente**, siguiendo la estrategia definida en `AI-IMPLEMENTATION-STRATEGY.md`.

**CRÍTICO**: No podemos hacer todo a la vez porque perderías contexto. Debemos trabajar en **mini-sprints** de 3-5 archivos a la vez.

---

## 🚀 Primera Tarea: Fase 0 (Setup de Infraestructura)

### Objetivo
Preparar la base técnica para todas las implementaciones posteriores.

### Archivos Existentes que Necesitas Leer

Por favor lee estos archivos para entender el código actual:

1. **`src/types/index.ts`** (138 líneas) - Interfaces TypeScript base actuales
2. **`src/services/mockApi.ts`** (60 líneas) - Servicios mock actuales
3. **`src/App.tsx`** (48 líneas) - Routing actual
4. **`package.json`** - Dependencias instaladas
5. **`src/theme.ts`** - Tema de MUI

### Especificación Completa

Lee la sección "Extended Types (A CREAR)" en **`TASK-SPECIFICATIONS.md`** (aproximadamente líneas 50-400).

Allí encontrarás TODAS las interfaces TypeScript nuevas que debemos agregar al proyecto.

---

## 📝 Tareas Específicas de Fase 0

### 1. Actualizar `src/types/index.ts`

**Acción**: Agregar TODAS las interfaces definidas en la sección "Extended Types" de `TASK-SPECIFICATIONS.md`

**Resultado esperado**:
- Archivo pasa de ~138 líneas a ~800+ líneas
- Se agregan interfaces como:
  - `ProductFormData`, `ProductDetail`, `PriceChange`
  - `ClientFormData`, `ClientDetail`, `ClientStatistics`
  - `InvoiceFormData`, `InvoiceDetail`, `Payment`
  - `StockEntryFormData`, `StockExitFormData`, `StockTransferFormData`
  - `InventoryCountFormData`, `InventoryDiscrepancy`
  - Y todas las demás (~100 interfaces nuevas)

**IMPORTANTE**: NO elimines las interfaces existentes, solo AGREGA las nuevas.

---

### 2. Crear `src/config/api.ts`

```typescript
// Configuración base de la API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
};
```

---

### 3. Crear `src/services/apiClient.ts`

**Requisitos**:
- Wrapper de `fetch` con configuración base
- Manejo de errores común
- Headers automáticos (Content-Type: application/json)
- Authorization header si existe token en localStorage
- Funciones helper: `get()`, `post()`, `put()`, `delete()`

**Template sugerido**:
```typescript
import { API_CONFIG } from '../config/api';

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    // Implementar con fetch
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    // Implementar con fetch
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    // Implementar con fetch
  }

  async delete<T>(endpoint: string): Promise<T> {
    // Implementar con fetch
  }
}

export const apiClient = new ApiClient();
```

---

### 4. Crear `src/contexts/AuthContext.tsx`

**Requisitos**:
- Estado: `user`, `token`, `isLoading`, `isAuthenticated`
- Funciones: `login()`, `logout()`, `register()`
- Persistencia: guardar token en localStorage
- Provider que envuelve la app
- Hook personalizado: `useAuth()`

**Interfaces necesarias**:
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}
```

---

### 5. Crear `src/components/ProtectedRoute.tsx`

**Requisitos**:
- Componente que envuelve rutas protegidas
- Si usuario NO autenticado → redirect a `/auth/login`
- Si usuario autenticado → renderiza children

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

---

### 6. Actualizar `src/App.tsx`

**Cambios**:
- Importar y envolver todo con `<AuthProvider>`
- Importar `ProtectedRoute`
- Rutas públicas: `/auth/*` (login, register, etc.)
- Rutas protegidas: todas las demás (`/`, `/productos`, `/clientes`, etc.)

**Estructura sugerida**:
```tsx
<AuthProvider>
  <Routes>
    {/* Rutas públicas */}
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/registro" element={<RegisterPage />} />

    {/* Rutas protegidas */}
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/" element={<MainDashboard />} />
      <Route path="/productos" element={<ProductListPage />} />
      {/* ... resto de rutas */}
    </Route>
  </Routes>
</AuthProvider>
```

---

## ✅ Criterios de Aceptación - Fase 0

Cuando termines, el proyecto debe:

### Compilación
- [ ] `npm run build` compila SIN errores de TypeScript
- [ ] `npm run dev` arranca sin errores

### TypeScript
- [ ] VSCode no muestra errores rojos en ningún archivo
- [ ] Todas las interfaces nuevas están disponibles para importar

### Funcionalidad
- [ ] Si intento ir a `/productos` sin login → redirecciona a `/auth/login`
- [ ] Si hago login (aunque sea mock) → puedo acceder a `/productos`
- [ ] `apiClient` está listo para usar (aunque backend no exista aún)

---

## 🚫 Restricciones IMPORTANTES

### NO Hagas:
1. ❌ NO implementes lógica de backend (solo preparar frontend)
2. ❌ NO modifiques componentes existentes (excepto App.tsx)
3. ❌ NO agregues validaciones complejas aún (solo setup base)
4. ❌ NO instales librerías nuevas (todo está instalado ya)
5. ❌ NO optimices prematuramente (primero que funcione)
6. ❌ NO toques archivos de páginas existentes (solo setup de infraestructura)

### SÍ Haz:
1. ✅ Agrega TODAS las interfaces de TASK-SPECIFICATIONS.md
2. ✅ Crea estructura sólida de servicios
3. ✅ Implementa auth context funcional
4. ✅ Configura rutas protegidas correctamente
5. ✅ Asegúrate de que TODO compile sin errores

---

## 📤 Output Esperado

Al finalizar, dame:

1. **Lista de archivos modificados/creados** con un resumen breve de cada uno
2. **Confirmación de compilación**: resultado de `npm run build`
3. **Validación de TypeScript**: confirma que no hay errores
4. **Test básico**: describe cómo probar que las rutas protegidas funcionan
5. **Próximos pasos**: qué mini-sprint sigue según `AI-IMPLEMENTATION-STRATEGY.md`

---

## 🎯 Preguntas para Asegurarnos

Antes de empezar, confirma:

1. ¿Tienes acceso a leer `TASK-SPECIFICATIONS.md`? (necesitas la sección "Extended Types")
2. ¿Entiendes que esto es SOLO setup de infraestructura, no implementación de features?
3. ¿Puedes leer los archivos existentes que mencioné arriba?
4. ¿Está claro que NO debemos tocar las páginas existentes en esta fase?

---

## 🚀 ¿Listo para Empezar?

Si todo está claro, por favor:

1. **Confirma** que tienes acceso a los archivos necesarios
2. **Lee** `src/types/index.ts` actual
3. **Lee** la sección "Extended Types" de `TASK-SPECIFICATIONS.md`
4. **Implementa** los 6 puntos de Fase 0
5. **Valida** que todo compila

**Tiempo estimado**: 2-3 horas

**Objetivo**: Tener la base técnica lista para empezar con features reales (Categorías, Productos, etc.)

---

## 📋 Después de Fase 0

Una vez completada esta fase, continuaremos con:

- **Mini-Sprint 1**: SIM-52 (Categorías) - 1-2 horas
- **Mini-Sprint 2**: SIM-49, 51, 50, 53 (Productos) - 6-8 horas
- **Mini-Sprint 3**: SIM-64, 65, 63 (Clientes) - 6-8 horas
- ... y así sucesivamente según `AI-IMPLEMENTATION-STRATEGY.md`

---

**¿Empezamos con Fase 0?** 🚀
