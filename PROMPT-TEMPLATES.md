# 🎯 Prompt Templates para Implementación

Copia y pega estos prompts para que la IA implemente las tareas de forma efectiva.

---

## 🚀 Prompt Inicial: Fase 0 (Setup)

```markdown
# TAREA: Fase 0 - Setup de Infraestructura

## Contexto
SimpleStock es un sistema de inventario y facturación. Tengo 43 tareas especificadas en `TASK-SPECIFICATIONS.md`.

El frontend está al 95% (UI skeleton completo con mock data), pero necesito:
1. Agregar TODAS las interfaces TypeScript faltantes
2. Crear la estructura base de servicios
3. Configurar el cliente de API
4. Setup de autenticación

## Stack Técnico
- React 18.2.0
- TypeScript 5.4.3
- Material-UI 5.15.15
- React Router 6.23.1
- Vite 5.4.21

## Archivos Existentes Relevantes
- `src/types/index.ts` - Tiene interfaces básicas (Product, Client, Invoice, etc.)
- `src/services/mockApi.ts` - Mock services actuales
- `src/App.tsx` - Routing actual
- `package.json` - Dependencias instaladas

## Tarea Específica
Lee `TASK-SPECIFICATIONS.md` desde la línea 1 hasta el final de "Extended Types (A CREAR)" y:

1. **Actualiza `src/types/index.ts`**:
   - Agrega TODAS las interfaces nuevas definidas en "Extended Types"
   - Mantén las existentes (Product, Client, Invoice, etc.)
   - Total: ~138 interfaces

2. **Crea `src/config/api.ts`**:
   ```typescript
   export const API_CONFIG = {
     baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
     timeout: 10000,
   };
   ```

3. **Crea `src/services/apiClient.ts`**:
   - Wrapper de fetch con configuración base
   - Manejo de errores común
   - Headers automáticos (Authorization si existe token)

4. **Crea `src/contexts/AuthContext.tsx`**:
   - Estado: user, token, isLoading, isAuthenticated
   - Funciones: login, logout, register
   - Provider y hook useAuth()

5. **Actualiza `src/App.tsx`**:
   - Envuelve rutas con AuthProvider
   - Agrega componente ProtectedRoute
   - Rutas de auth (login, register) públicas
   - Rutas de app requieren autenticación

## Validación
- [ ] `npm run build` compila sin errores
- [ ] `npm run dev` arranca sin errores
- [ ] TypeScript está feliz (no hay errores rojos en VSCode)
- [ ] Si intento ir a `/productos` sin login, redirecciona a `/auth/login`

## Output Esperado
- Archivos modificados/creados listados
- Breve explicación de cambios clave
- Confirmación de que compila

## NO Hagas
- No implementes lógica de backend aún
- No modifiques componentes existentes (solo App.tsx)
- No agregues validaciones complejas aún
- No instales librerías nuevas

¿Listo para empezar?
```

---

## 📦 Prompt: Mini-Sprint 1 (Categorías)

```markdown
# TAREA: SIM-52 - Gestión de Categorías CRUD

## Contexto
Fase 0 completa. Ahora implemento la primera feature: Categorías.

Esta es CRÍTICA porque bloquea la creación de productos (SIM-49).

## Referencias
- **Especificación completa**: `TASK-SPECIFICATIONS.md` - busca "SIM-52"
- **Interfaces**: Ya están en `src/types/index.ts` (ProductCategory, CategoryFormData)

## Archivos a Crear/Modificar

### 1. `src/services/categoryService.ts` (nuevo)
Endpoints:
- `getCategories()` → ProductCategory[]
- `createCategory(data: CategoryFormData)` → ProductCategory
- `updateCategory(id, data)` → ProductCategory
- `deleteCategory(id)` → { success: boolean }

Usa apiClient de `src/services/apiClient.ts`

### 2. `src/pages/products/CategoriesPage.tsx` (nuevo)
Features según especificación:
- Tabla de categorías (nombre, descripción, cantidad de productos)
- Botón "Nueva Categoría" → abre modal
- Modal con formulario: name (required), description (optional)
- Editar: click en row o botón edit
- Eliminar: con confirmación, validar que no tenga productos
- Búsqueda por nombre
- Paginación si > 20 categorías

Material-UI components a usar:
- Table, TableBody, TableHead, TableRow, TableCell
- Button, IconButton
- Dialog (para modal)
- TextField (para formulario y búsqueda)
- CircularProgress o LinearProgress (loading)

### 3. `src/App.tsx` (modificar)
Agregar ruta: `/productos/categorias` → CategoriesPage

## Criterios de Aceptación (según TASK-SPECIFICATIONS.md)
Lee la sección completa de SIM-52 y sigue TODOS los criterios.

Key ones:
- [ ] Puedo crear una categoría
- [ ] Puedo editar una categoría
- [ ] Puedo eliminar categoría (con validación)
- [ ] Búsqueda funciona
- [ ] Loading states durante operaciones
- [ ] Mensajes de éxito/error (Snackbar)

## Validación
1. `npm run build` - compila sin errores
2. `npm run dev` - abrir navegador
3. Ir a `/productos/categorias`
4. Probar: Crear → Editar → Buscar → Eliminar
5. Verificar mensajes de éxito/error

## Estilo Visual
Sigue el estilo de páginas existentes:
- `src/pages/products/ProductListPage.tsx` (referencia de tabla)
- `src/theme.ts` (colores y estilos)
- Usa componentes de @mui/material consistentemente

## Commit
Al terminar:
```bash
git add .
git commit -m "feat(products): implement categories CRUD (SIM-52)"
```

## Pregunta Clave
¿Tienes acceso a la especificación completa de SIM-52 en TASK-SPECIFICATIONS.md?
Si no, te la puedo proporcionar.

¡Adelante!
```

---

## 🎨 Prompt: Mini-Sprint 2.1 (Crear Producto)

```markdown
# TAREA: SIM-49 - Crear Página de Crear Producto

## Contexto
- Categorías implementadas (SIM-52) ✅
- Ahora creo productos que usan esas categorías

## Referencias
- **Especificación**: `TASK-SPECIFICATIONS.md` - busca "SIM-49" para detalles completos
- **Interfaces**: ProductFormData, Product (ya en types)

## Archivos a Crear

### 1. `src/services/productService.ts` (nuevo)
Endpoints:
- `getProducts()` → Product[]
- `getProduct(id)` → ProductDetail
- `createProduct(data: ProductFormData)` → Product
- `updateProduct(id, data)` → Product
- `deleteProduct(id)` → { success: boolean }

### 2. `src/components/products/ProductForm.tsx` (nuevo - IMPORTANTE)
Este componente será REUTILIZADO en Edit (SIM-50).

Props:
```typescript
interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel?: string; // "Crear Producto" o "Guardar Cambios"
}
```

Formulario organizado en Tabs o Secciones:
- **Tab 1 - Básico**: name, sku, categoryId, description
- **Tab 2 - Precios**: costPrice, salePrice, wholesalePrice, taxRate
- **Tab 3 - Stock**: initialStock, minimumStock, maximumStock
- **Tab 4 - Proveedores**: supplierIds (multi-select)
- **Tab 5 - Imágenes**: imageUrls (upload preview)

Validaciones clave:
- salePrice >= costPrice (mostrar error)
- initialStock >= 0
- minimumStock > 0
- taxRate entre 0-100

### 3. `src/pages/products/CreateProductPage.tsx` (nuevo)
Usa ProductForm.tsx
Maneja submit → createProduct()
Redirecciona a ProductDetailPage (aunque no exista aún, usa `/productos/${id}`)

### 4. Agregar ruta en `src/App.tsx`
`/productos/crear` → CreateProductPage

## Datos Necesarios
Para popular dropdowns:
- Categorías: usa categoryService.getCategories()
- Proveedores: usa supplierService.getSuppliers() (puedes usar mock si no existe aún)

## Validación Manual
1. Ir a `/productos/crear`
2. Llenar formulario completo
3. Validar que:
   - Si salePrice < costPrice → muestra error
   - Si dejo campos requeridos vacíos → muestra error
   - Al guardar → muestra loading
   - Si éxito → muestra mensaje y redirecciona
   - Si error → muestra mensaje de error

## Criterios de Aceptación
Lee SIM-49 completo en TASK-SPECIFICATIONS.md. Los más críticos:
- [ ] Formulario con todas las validaciones
- [ ] Dropdown de categorías poblado
- [ ] Generación automática de SKU si vacío
- [ ] LoadingButton durante submit
- [ ] Mensajes de éxito/error
- [ ] Redirección después de crear

## Commit
```bash
git commit -m "feat(products): implement product creation form (SIM-49)"
```

¿Empezamos?
```

---

## 🔄 Prompt: Mini-Sprint 2.2 (Detalle Producto)

```markdown
# TAREA: SIM-51 - Página de Detalle de Producto

## Por Qué Ahora
Antes de Editar (SIM-50), necesito poder VER el producto.

## Referencias
- **Spec**: `TASK-SPECIFICATIONS.md` - SIM-51
- **Interfaces**: ProductDetail (extends Product con historial)

## Archivos a Crear

### `src/pages/products/ProductDetailPage.tsx` (nuevo)

Layout con Tabs:
- **Tab 1 - Info General**:
  - Galería de imágenes
  - Cards: Info Básica, Precios, Stock, Impuestos

- **Tab 2 - Historial de Stock**:
  - Tabla últimos 20 movimientos
  - Filtro por tipo

- **Tab 3 - Historial de Precios**:
  - Line Chart con evolución de precios
  - Tabla de cambios

- **Tab 4 - Proveedores**:
  - Lista de proveedores vinculados

Header con:
- Nombre producto + SKU
- Badge de estado (En Stock / Stock Bajo / Sin Stock)
- Botón "Editar" (va a `/productos/${id}/editar`)
- Botón "Eliminar" (con confirmación)
- Botón "Ajustar Stock" (modal - simplificado)

## Indicadores Visuales
- Stock Bajo: Badge rojo si `stock < minimumStock`
- Sin Stock: Badge gris si `stock === 0`
- Stock OK: Badge verde si `stock >= minimumStock`

## Datos Mock (temporal)
Si no tienes historial aún:
```typescript
const mockHistory: StockMovement[] = [
  {
    id: '1',
    productId: productId,
    productName: product.name,
    type: 'in',
    quantity: 100,
    source: 'Proveedor ABC',
    createdAt: new Date().toISOString()
  }
];
```

## Validación
1. Crear un producto (desde SIM-49)
2. Ir a detalle `/productos/${id}`
3. Verificar que muestra toda la info
4. Tabs funcionan
5. Botón "Editar" existe (aunque no haga nada aún)

## Commit
```bash
git commit -m "feat(products): implement product detail page with tabs (SIM-51)"
```
```

---

## 🎯 Prompt: Checkpoint de Validación

```markdown
# CHECKPOINT: Validación de Flujo Completo

## Acabé Mini-Sprint X. Antes de continuar:

### Test End-to-End Manual

**Flujo a Probar**: [describe el flujo según el módulo]

Ejemplo para Productos:
1. [ ] Abrir `/productos`
2. [ ] Click "Crear Producto"
3. [ ] Llenar formulario completo
4. [ ] Guardar
5. [ ] Redirecciona a detalle
6. [ ] Veo info completa del producto
7. [ ] Click "Editar"
8. [ ] Cambio el nombre
9. [ ] Guardar
10. [ ] Vuelve a detalle
11. [ ] Veo el cambio reflejado
12. [ ] Vuelvo a lista `/productos`
13. [ ] Veo el producto en la lista

### Checklist Técnico
- [ ] `npm run build` - compila sin errores
- [ ] `npm run type-check` - TypeScript feliz
- [ ] No hay console.errors en navegador
- [ ] Todos los criterios de aceptación cumplidos
- [ ] Loading states funcionan
- [ ] Mensajes de error/éxito funcionan

### Si TODO funciona:
✅ CONTINUAR al siguiente mini-sprint

### Si ALGO falla:
❌ DETENER y arreglar antes de continuar

## Siguiente Mini-Sprint
[Indicar cuál sigue según AI-IMPLEMENTATION-STRATEGY.md]

¿Pasamos el checkpoint?
```

---

## 💰 Prompt: Mini-Sprint 6 (Facturación - COMPLEJO)

```markdown
# TAREA: SIM-59 - Crear Factura (Wizard de 5 Pasos)

## ⚠️ ADVERTENCIA
Esta es la tarea MÁS COMPLEJA del MVP. Vamos a hacerla en MICRO-PASOS.

## Estrategia
Implementar 1 paso a la vez. NO intentes hacer todo junto.

## MICRO-PASO 1: Solo Paso 1 (Seleccionar Cliente)

### Archivos a Crear
- `src/pages/invoicing/CreateInvoicePage.tsx`
- `src/components/invoicing/InvoiceWizard.tsx`
- `src/components/invoicing/steps/Step1SelectClient.tsx`

### Step1SelectClient Features
- Autocomplete de clientes (usa clientService.getClients())
- Mostrar: nombre, empresa, email
- Botón "Nuevo Cliente" (opcional - puede ir a /clientes/crear)
- Validación: cliente requerido
- Botón "Siguiente" habilitado solo si cliente seleccionado

### State Management Temporal
```typescript
const [formData, setFormData] = useState({
  clientId: '',
  items: [],
  totalDiscount: 0,
  paymentTerms: 'cash',
  notes: ''
});

const [currentStep, setCurrentStep] = useState(0);
```

### Validación de MICRO-PASO 1
- [ ] Puedo seleccionar un cliente del autocomplete
- [ ] Botón "Siguiente" se habilita
- [ ] Click "Siguiente" avanza a step 2 (aunque esté vacío)

### Commit MICRO-PASO 1
```bash
git commit -m "feat(invoicing): implement invoice wizard step 1 - select client (SIM-59 WIP)"
```

---

## DESPUÉS del Micro-Paso 1:

### PREGUNTA PARA MÍ
¿Funcionó el Micro-Paso 1? ¿Puedo avanzar?

SI SÍ → Pídeme Micro-Paso 2
SI NO → Arreglamos Micro-Paso 1 primero

---

## MICRO-PASO 2: Paso 2 (Agregar Productos)

[Lo proporcionaré SOLO DESPUÉS de validar Micro-Paso 1]

---

## MICRO-PASO 3: Paso 3 (Descuentos)

[Después de Micro-Paso 2]

---

## MICRO-PASO 4: Paso 4 (Términos)

[Después de Micro-Paso 3]

---

## MICRO-PASO 5: Paso 5 (Vista Previa y Submit)

[Después de Micro-Paso 4]

---

## COMMIT FINAL (después de los 5 micro-pasos)
```bash
git commit --amend -m "feat(invoicing): implement complete invoice creation wizard (SIM-59)"
```

¿Empezamos con Micro-Paso 1?
```

---

## 🎪 Prompt: Debugging / Algo Salió Mal

```markdown
# DEBUGGING: Algo No Funciona

## Síntoma
[Describe qué está fallando]

## Archivos Involucrados
[Lista los archivos que tocaste en la última sesión]

## Errores
### Console del Navegador
```
[Pegar errores de console.log]
```

### TypeScript
```
[Pegar errores de TS si hay]
```

### Build
```
[Pegar output de npm run build si falla]
```

## Último Cambio que Hice
[Describe brevemente]

## ¿Qué Debería Pasar?
[Comportamiento esperado según especificación]

## ¿Qué Está Pasando?
[Comportamiento actual]

## Por Favor
1. Analiza los errores
2. Identifica el problema
3. Dame la solución paso a paso
4. Explica POR QUÉ falló (para aprender)

## Contexto Adicional
- Tarea actual: [SIM-XX]
- Mini-Sprint: [número]
- Último commit exitoso: [hash o descripción]
```

---

## 🎓 Prompt: Code Review / Validación

```markdown
# CODE REVIEW: Validar Implementación

## Acabé de Implementar
- Tareas: [SIM-XX, SIM-YY]
- Commits: [listar commits]

## Archivos Modificados/Creados
[Listar archivos]

## Checklist de Validación

### Funcionalidad
- [ ] Cumple TODOS los criterios de aceptación de la especificación
- [ ] Flujo end-to-end funciona
- [ ] Validaciones de negocio implementadas
- [ ] Loading states en todos los requests async
- [ ] Mensajes de éxito/error apropiados

### Código
- [ ] TypeScript sin errores
- [ ] Sigue convenciones del proyecto
- [ ] Componentes reutilizables donde tiene sentido
- [ ] No hay código duplicado
- [ ] Nombres de variables/funciones descriptivos

### UX
- [ ] Sigue diseño de Material-UI
- [ ] Colores del theme aplicados
- [ ] Responsive (funciona en mobile)
- [ ] No hay flash de contenido sin estilo
- [ ] Accesibilidad básica (labels, aria)

### Performance
- [ ] No hay re-renders innecesarios
- [ ] Imágenes optimizadas (si aplica)
- [ ] Debounce en búsquedas (si aplica)

## Por Favor
Revisa si algo falta o se puede mejorar SIN sobre-optimizar.

## Pregunta Clave
¿Está listo para merge/deploy o falta algo CRÍTICO?
```

---

## 📝 Cómo Usar Estos Prompts

### 1. **Copia el prompt completo** según la tarea que vayas a hacer

### 2. **Personaliza las partes entre [corchetes]**

### 3. **Adjunta contexto específico** si es necesario:
   - Output de errores
   - Código actual de un archivo
   - Especificación de Linear

### 4. **Ejecuta en sesión limpia** (contexto fresco) cuando sea posible

### 5. **Valida después de cada micro-tarea**

---

## 🚦 Señales de Alerta

### 🔴 DETENER si:
- TypeScript tiene errores
- Build falla
- Algo que funcionaba dejó de funcionar
- No entiendes lo que el código hace

### 🟡 CUIDADO si:
- La IA sugiere instalar librerías nuevas (pregúntale por qué)
- Quiere refactorizar código que funciona
- Propone patrones muy diferentes a los existentes
- El código es muy complejo para la tarea

### 🟢 CONTINUAR si:
- Todo compila
- Tests manuales pasan
- Entiendes el código
- Sigue convenciones del proyecto

---

**Listo para usar. ¡Buena suerte con la implementación!** 🚀
