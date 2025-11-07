# 🤖 Estrategia de Implementación para IA

## Guía para implementar las 43 tareas de SimpleStock de forma inteligente

---

## 🎯 Principios Fundamentales

### 1. **Divide y Conquista**
No intentes hacer todo a la vez. Trabaja en **mini-sprints verticales** que entreguen valor completo.

### 2. **Fundaciones Primero**
Construye las bases antes que las features avanzadas.

### 3. **Validación Incremental**
Después de cada mini-sprint: **build → test → validate → commit**

### 4. **Mantén Contexto Manejable**
Trabaja en **máximo 3-5 archivos a la vez**.

---

## 📋 Estrategia Recomendada

### Fase 0: Preparación (CRÍTICO - Hacer Primero)

```markdown
🎯 OBJETIVO: Configurar infraestructura base para todo lo demás

TAREAS:
1. Actualizar src/types/index.ts con TODAS las interfaces del TASK-SPECIFICATIONS.md
2. Crear estructura de servicios base (API client, error handling)
3. Configurar variables de entorno (.env con API_BASE_URL)
4. Setup de autenticación (contexto, hooks, rutas protegidas)

ARCHIVOS A TOCAR (~5 archivos):
- src/types/index.ts (agregar todas las interfaces nuevas)
- src/config/api.ts (nuevo - configuración de axios/fetch)
- src/services/apiClient.ts (nuevo - wrapper de API)
- src/contexts/AuthContext.tsx (nuevo - estado de autenticación)
- src/App.tsx (agregar AuthProvider y rutas protegidas)

VALIDACIÓN:
✅ Todas las interfaces TypeScript compilando sin errores
✅ API client puede hacer requests (aunque backend no exista aún)
✅ Rutas protegidas redirigen a login

DURACIÓN: 1 sesión (2-3 horas)
```

---

### 🔄 Mini-Sprints (Implementar en este orden)

## Mini-Sprint 1: Categorías (Fundacional)

**Por qué primero:** Bloquea Productos. Es pequeña y crítica.

```markdown
TAREA: SIM-52 - Gestión de Categorías

CONTEXTO NECESARIO:
- src/types/index.ts (ProductCategory, CategoryFormData)
- src/services/categoryService.ts (nuevo)
- src/pages/products/CategoriesPage.tsx (nuevo)

PASOS:
1. Crear categoryService.ts con endpoints CRUD
2. Crear CategoriesPage.tsx con tabla + modal
3. Agregar ruta en App.tsx
4. Test manual: crear/editar/eliminar categoría

VALIDACIÓN:
✅ Puedo crear una categoría
✅ Puedo editar una categoría
✅ Puedo eliminar una categoría (si no tiene productos)
✅ Búsqueda funciona

COMMIT: "feat(products): implement categories CRUD (SIM-52)"
```

---

## Mini-Sprint 2: Productos Core (3 tareas relacionadas)

**Por qué:** Fundacional para todo el sistema.

```markdown
TAREAS: SIM-49, SIM-50, SIM-51 (Crear, Editar, Detalle)

ESTRATEGIA: Implementar en este orden específico

### Sesión 1: Crear Producto (SIM-49)
CONTEXTO:
- src/types/index.ts (ProductFormData, Product)
- src/services/productService.ts (nuevo)
- src/pages/products/CreateProductPage.tsx (nuevo)
- src/components/products/ProductForm.tsx (nuevo - compartido)

VALIDACIÓN:
✅ Formulario con todas las validaciones
✅ Puedo crear un producto con categoría
✅ Redirecciona a detalle después de crear

COMMIT: "feat(products): implement product creation (SIM-49)"

---

### Sesión 2: Detalle Producto (SIM-51)
CONTEXTO:
- src/pages/products/ProductDetailPage.tsx (nuevo)
- Reutiliza productService

POR QUÉ ANTES DE EDITAR: Necesitas ver el producto creado antes de editarlo.

VALIDACIÓN:
✅ Muestra info completa del producto
✅ Tabs funcionan correctamente
✅ Botón "Editar" existe (aunque no haga nada aún)

COMMIT: "feat(products): implement product detail page (SIM-51)"

---

### Sesión 3: Editar Producto (SIM-50)
CONTEXTO:
- src/pages/products/EditProductPage.tsx (nuevo)
- Reutiliza ProductForm.tsx de SIM-49

VALIDACIÓN:
✅ Formulario pre-poblado con datos existentes
✅ Puedo editar y guardar cambios
✅ Redirecciona a detalle después de editar

COMMIT: "feat(products): implement product editing (SIM-50)"
```

---

## Mini-Sprint 3: Mejorar Lista Productos (SIM-53)

```markdown
TAREA: SIM-53 - ProductListPage mejorada

CONTEXTO:
- src/pages/products/ProductListPage.tsx (modificar existente)
- Ya tienes: CreateProductPage, EditProductPage, ProductDetailPage

PASOS:
1. Agregar paginación
2. Agregar filtros (categoría, precio, stock)
3. Agregar búsqueda
4. Agregar botón "Crear Producto" → va a SIM-49
5. Click en row → va a SIM-51 (detalle)
6. Acciones: editar (SIM-50), eliminar

VALIDACIÓN:
✅ Flujo completo: Lista → Crear → Ver → Editar → Lista

COMMIT: "feat(products): enhance product list with filters and actions (SIM-53)"

CHECKPOINT: 🎉 Módulo de Productos COMPLETO (4/5 tareas)
```

---

## Mini-Sprint 4: Clientes (3 tareas)

**Por qué ahora:** Necesarios para crear facturas.

```markdown
TAREAS: SIM-64, SIM-65, SIM-63 (Crear, Detalle, Lista)

ORDEN: Crear → Detalle → Lista (mismo patrón que Productos)

### Sesión 1: SIM-64 (Crear/Editar Cliente)
CONTEXTO:
- src/services/clientService.ts (nuevo)
- src/pages/clients/CreateClientPage.tsx (nuevo)
- src/pages/clients/EditClientPage.tsx (nuevo)
- src/components/clients/ClientForm.tsx (nuevo - compartido)

VALIDACIÓN:
✅ Formulario con tabs (Básico, Empresa, Crédito)
✅ Puedo crear un cliente

COMMIT: "feat(clients): implement client create/edit (SIM-64)"

---

### Sesión 2: SIM-65 (Detalle Cliente)
CONTEXTO:
- src/pages/clients/ClientDetailPage.tsx (nuevo)

VALIDACIÓN:
✅ Muestra info completa del cliente
✅ Tabs: Facturas, Transacciones, Estadísticas

COMMIT: "feat(clients): implement client detail page (SIM-65)"

---

### Sesión 3: SIM-63 (Lista Clientes)
CONTEXTO:
- src/pages/clients/ClientListPage.tsx (modificar existente)

VALIDACIÓN:
✅ Flujo completo funciona

COMMIT: "feat(clients): enhance client list (SIM-63)"

CHECKPOINT: 🎉 Módulo de Clientes COMPLETO (3/4 tareas)
```

---

## Mini-Sprint 5: Inventario Básico (2 tareas críticas)

```markdown
TAREAS: SIM-55, SIM-56 (Entradas y Salidas de Stock)

POR QUÉ AHORA: Necesario para tener stock antes de facturar.

### Sesión 1: SIM-55 (Entradas)
CONTEXTO:
- src/services/inventoryService.ts (nuevo)
- src/pages/inventory/StockEntryPage.tsx (nuevo)

VALIDACIÓN:
✅ Puedo registrar entrada de stock
✅ Stock del producto se actualiza

COMMIT: "feat(inventory): implement stock entry registration (SIM-55)"

---

### Sesión 2: SIM-56 (Salidas)
CONTEXTO:
- src/pages/inventory/StockExitPage.tsx (nuevo)
- Reutiliza inventoryService

VALIDACIÓN:
✅ Puedo registrar salida de stock
✅ Valida stock disponible

COMMIT: "feat(inventory): implement stock exit registration (SIM-56)"

CHECKPOINT: 🎉 Stock management básico FUNCIONANDO
```

---

## Mini-Sprint 6: Facturación Core (3 tareas MUY importantes)

**ADVERTENCIA:** Este es el sprint MÁS COMPLEJO. Divide en micro-sesiones.

```markdown
TAREAS: SIM-59, SIM-60, SIM-61 (Crear, Detalle, Pagos)

### Sesión 1: SIM-60 (Detalle de Factura) - PRIMERO!
POR QUÉ PRIMERO: Necesitas poder VER una factura antes de poder CREAR una.

CONTEXTO:
- src/services/invoicingService.ts (nuevo)
- src/pages/invoicing/InvoiceDetailPage.tsx (nuevo)

CREAR FACTURA MOCK MANUALMENTE EN BD para poder verla.

VALIDACIÓN:
✅ Puedo ver detalle de factura
✅ Muestra cliente, items, totales
✅ Botones existen (aunque no funcionen aún)

COMMIT: "feat(invoicing): implement invoice detail page (SIM-60)"

---

### Sesión 2: SIM-59 (Crear Factura) - MICRO-PASOS
ESTE ES COMPLEJO. Hazlo en 5 micro-sesiones:

MICRO-SESIÓN 1: Solo Paso 1 (Seleccionar Cliente)
CONTEXTO:
- src/pages/invoicing/CreateInvoicePage.tsx (nuevo)
- src/components/invoicing/InvoiceWizard.tsx (nuevo)

VALIDACIÓN:
✅ Puedo avanzar de paso 1 a paso 2

---

MICRO-SESIÓN 2: Paso 2 (Agregar Productos)
VALIDACIÓN:
✅ Puedo agregar productos a la factura
✅ Calcula subtotales

---

MICRO-SESIÓN 3: Paso 3 (Descuentos)
VALIDACIÓN:
✅ Puedo aplicar descuentos
✅ Recalcula totales

---

MICRO-SESIÓN 4: Paso 4 (Términos de Pago)
VALIDACIÓN:
✅ Calcula fecha de vencimiento

---

MICRO-SESIÓN 5: Paso 5 (Vista Previa y Submit)
VALIDACIÓN:
✅ Genera factura y redirecciona a detalle

COMMIT ÚNICO: "feat(invoicing): implement invoice creation wizard (SIM-59)"

---

### Sesión 3: SIM-61 (Seguimiento de Pagos)
CONTEXTO:
- src/components/invoicing/RegisterPaymentModal.tsx (nuevo)
- Integrar en InvoiceDetailPage (SIM-60)

VALIDACIÓN:
✅ Puedo registrar pagos desde detalle de factura
✅ Actualiza saldo

COMMIT: "feat(invoicing): implement payment tracking (SIM-61)"

CHECKPOINT: 🎉 MVP de Facturación FUNCIONANDO (flujo completo)
```

---

## 🎉 CHECKPOINT MAYOR: MVP Funcional

**En este punto tienes:**
- ✅ Productos (crear, editar, ver, listar)
- ✅ Categorías
- ✅ Clientes (crear, editar, ver, listar)
- ✅ Stock (entradas y salidas)
- ✅ Facturas (crear, ver, pagar)

**ESTO ES UN MVP USABLE. VALIDA CON USUARIO ANTES DE CONTINUAR.**

---

## Mini-Sprints 7-12: Features Avanzadas

Después del MVP, continúa con:

### Sprint 7: Inventario Avanzado
- SIM-54 (Vista General mejorada)
- SIM-57 (Transferencias)

### Sprint 8: Facturación Avanzada
- SIM-58 (Mejorar lista)
- SIM-62 (Notas de Crédito)

### Sprint 9: Proveedores
- SIM-68, SIM-69, SIM-67, SIM-70 (en ese orden)

### Sprint 10: Reportes Básicos
- SIM-71 (Ventas)
- SIM-72 (Inventario)

### Sprint 11: Dashboard y Análisis
- SIM-73, SIM-74, SIM-75, SIM-76 (widgets)
- SIM-77, SIM-78 (reportes avanzados)

### Sprint 12: Administración
- SIM-80, SIM-79, SIM-81, SIM-82, SIM-83

### Sprint 13: Optimizaciones
- SIM-84 (Códigos de barras)
- SIM-85, SIM-86 (Conteos)
- SIM-66 (Estado de cuenta)
- SIM-87-91 (Ayuda)

---

## 🤖 Prompt para la IA

Cuando estés listo para implementar, usa este prompt:

```markdown
# Contexto del Proyecto
Estoy trabajando en SimpleStock, un sistema de inventario y facturación.

Tengo 43 tareas especificadas en Linear, todas con interfaces TypeScript,
endpoints de API y criterios de aceptación detallados.

# Documentación Disponible
- TASK-SPECIFICATIONS.md: Especificaciones completas de todas las tareas
- Código existente: UI skeleton 100% completo con mock data
- Stack: React 18 + TypeScript + Material-UI 5

# Estrategia de Implementación
Sigo el plan de AI-IMPLEMENTATION-STRATEGY.md que agrupa tareas en mini-sprints.

# Tarea Actual: [Mini-Sprint X]
Estoy implementando [nombre del mini-sprint] que incluye las tareas:
- SIM-XX: [título]
- SIM-YY: [título]

# Instrucciones
1. Lee la especificación completa de SIM-XX en TASK-SPECIFICATIONS.md
2. Lee los archivos existentes relevantes (máximo 5 archivos)
3. Implementa la tarea siguiendo los criterios de aceptación
4. Valida que compile sin errores TypeScript
5. Prueba manualmente el flujo completo
6. Crea un commit descriptivo

# Restricciones
- Máximo 5 archivos por sesión
- No hagas optimizaciones prematuras
- Sigue las interfaces TypeScript definidas exactamente
- Usa Material-UI componentes (ya instalado)
- Mantén coherencia con código existente

# Output Esperado
- Código implementado con TypeScript estricto
- Validaciones de negocio según especificación
- Manejo de errores básico
- Loading states
- Mensajes de éxito/error
- Commit message: "feat(module): description (SIM-XX)"
```

---

## 💡 Tips Clave para la IA

### 1. **Mantén Contexto Manejable**
```
❌ MAL: "Implementa todo el módulo de productos"
✅ BIEN: "Implementa SIM-49 (Crear Producto) según TASK-SPECIFICATIONS.md líneas 415-525"
```

### 2. **Valida Incrementalmente**
Después de cada tarea:
```bash
# 1. Compila?
npm run build

# 2. TypeScript feliz?
npm run type-check

# 3. Funciona manualmente?
npm run dev  # y prueba en navegador

# 4. Commit
git add .
git commit -m "feat(products): implement product creation (SIM-49)"
```

### 3. **Reutiliza Componentes**
```
Productos tiene: ProductForm.tsx
Clientes necesita: ClientForm.tsx (mismo patrón)
NO reinventes. COPIA y adapta.
```

### 4. **No Optimices Prematuramente**
```
❌ "Voy a agregar caching avanzado..."
✅ "Voy a hacer que funcione primero"
```

### 5. **Checkpoints de Validación**
Cada 3-4 tareas:
```markdown
CHECKPOINT: ¿Funciona el flujo end-to-end?

Ejemplo: Productos
1. Abrir lista de productos
2. Click "Crear Producto"
3. Llenar formulario
4. Guardar
5. Ver detalle del producto creado
6. Click "Editar"
7. Cambiar nombre
8. Guardar
9. Ver cambio reflejado

SI FALLA ALGO: Arreglar antes de continuar.
```

---

## 📊 Tracking de Progreso

Mantén un archivo `PROGRESS.md`:

```markdown
# Progreso de Implementación SimpleStock

## Fase 0: Preparación
- [x] Interfaces TypeScript (todas agregadas)
- [x] API client configurado
- [x] Auth context creado

## Mini-Sprint 1: Categorías
- [x] SIM-52: Gestión de Categorías ✅ (commit: abc123)

## Mini-Sprint 2: Productos Core
- [x] SIM-49: Crear Producto ✅ (commit: def456)
- [x] SIM-51: Detalle Producto ✅ (commit: ghi789)
- [x] SIM-50: Editar Producto ✅ (commit: jkl012)

## Mini-Sprint 3: Lista Productos
- [ ] SIM-53: Mejorar ProductListPage 🚧 EN PROGRESO

## MVP Status: 23% (3/13 tareas críticas)
```

---

## 🎯 Resumen Ejecutivo

### Para la IA:
```
1. Haz Fase 0 primero (interfaces + setup)
2. Implementa mini-sprints en orden
3. Máximo 3-5 archivos por sesión
4. Valida después de cada tarea
5. Commit frecuente
6. Checkpoints cada 3-4 tareas
7. NO continúes si algo falla

REGLA DE ORO: Build → Test → Validate → Commit → Repeat
```

### Orden Óptimo (primeras 13 tareas = MVP):
```
1. Fase 0: Setup
2. SIM-52: Categorías
3. SIM-49: Crear Producto
4. SIM-51: Detalle Producto
5. SIM-50: Editar Producto
6. SIM-53: Lista Productos
7. SIM-64: Crear Cliente
8. SIM-65: Detalle Cliente
9. SIM-63: Lista Clientes
10. SIM-55: Entradas Stock
11. SIM-56: Salidas Stock
12. SIM-60: Detalle Factura
13. SIM-59: Crear Factura
14. SIM-61: Pagos

CHECKPOINT: MVP COMPLETO ✅
```

---

**Fecha**: 2025-10-27
**Versión**: 1.0
**Autor**: Claude Code + Ferced
