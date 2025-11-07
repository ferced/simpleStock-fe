# Especificaciones Técnicas Coherentes - SimpleStock

Este documento define las interfaces TypeScript, endpoints de API y especificaciones técnicas coherentes para todas las tareas del proyecto SimpleStock.

## 📋 Índice

1. [Interfaces TypeScript Completas](#interfaces-typescript-completas)
2. [Endpoints de API](#endpoints-de-api)
3. [Especificaciones por Módulo](#especificaciones-por-módulo)
4. [Dependencias entre Tareas](#dependencias-entre-tareas)

---

## 🎯 Interfaces TypeScript Completas

### Core Types (Existentes - No modificar)

```typescript
// src/types/index.ts (EXISTENTES)

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavItem[];
}

export interface WidgetStat {
  id: string;
  title: string;
  value: string;
  trend?: number;
  helperText?: string;
}

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
}

export interface SupplierSummary {
  id: string;
  name: string;
  contactEmail: string;
  phone?: string;
}

export interface Product {
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

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  source?: string;
  destination?: string;
  createdAt: string;
}

export interface InventorySnapshot {
  id: string;
  location: string;
  totalItems: number;
  totalValue: number;
  updatedAt: string;
}

export interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  total: number;
  dueDate: string;
  createdAt: string;
  items: InvoiceItem[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  totalBalance: number;
  activeInvoices: number;
}

export interface PaymentReminder {
  id: string;
  invoiceId: string;
  clientName: string;
  amount: number;
  dueDate: string;
}

export interface ReportSummary {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  tags: string[];
}

export interface HelpResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'faq' | 'support';
  actionLabel?: string;
}
```

### Extended Types (A CREAR)

```typescript
// src/types/index.ts (NUEVAS INTERFACES A AGREGAR)

// ===== PRODUCTOS =====

export interface ProductFormData {
  name: string;
  sku: string;
  categoryId: string;
  description?: string;
  // Precios
  costPrice: number;
  salePrice: number;
  wholesalePrice?: number;
  // Impuestos
  taxRate: number;
  // Stock
  initialStock: number;
  minimumStock: number;
  maximumStock?: number;
  // Proveedores
  supplierIds: string[];
  // Imágenes
  imageUrls?: string[];
  // Códigos
  barcode?: string;
  internalCode?: string;
}

export interface ProductDetail extends Product {
  description?: string;
  costPrice: number;
  wholesalePrice?: number;
  minimumStock: number;
  maximumStock?: number;
  imageUrls: string[];
  barcode?: string;
  internalCode?: string;
  category: ProductCategory;
  stockHistory: StockMovement[];
  priceHistory: PriceChange[];
  createdAt: string;
}

export interface PriceChange {
  id: string;
  productId: string;
  previousPrice: number;
  newPrice: number;
  changedBy: string;
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentCategoryId?: string;
}

// ===== INVENTARIO =====

export interface StockEntryFormData {
  productId: string;
  quantity: number;
  type: 'purchase' | 'adjustment' | 'return';
  cost?: number;
  supplierId?: string;
  location: string;
  notes?: string;
}

export interface StockExitFormData {
  productId: string;
  quantity: number;
  type: 'sale' | 'adjustment' | 'damage' | 'loss';
  location: string;
  notes?: string;
}

export interface StockTransferFormData {
  productId: string;
  quantity: number;
  sourceLocation: string;
  destinationLocation: string;
  notes?: string;
}

export interface InventoryCountFormData {
  location: string;
  type: 'physical' | 'cycle';
  countedItems: {
    productId: string;
    countedQuantity: number;
    systemQuantity: number;
  }[];
  notes?: string;
}

export interface InventoryDiscrepancy {
  id: string;
  productId: string;
  productName: string;
  systemQuantity: number;
  countedQuantity: number;
  difference: number;
  location: string;
  createdAt: string;
}

export interface StockValuation {
  productId: string;
  productName: string;
  quantity: number;
  averageCost: number;
  totalValue: number;
}

// ===== FACTURACIÓN =====

export interface InvoiceFormData {
  clientId: string;
  items: InvoiceItem[];
  totalDiscount?: number;
  paymentTerms: 'cash' | '30days' | '60days' | '90days';
  notes?: string;
}

export interface InvoiceDetail extends Invoice {
  clientName: string;
  clientEmail: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  itemsDetail: InvoiceItemDetail[];
  payments: Payment[];
}

export interface InvoiceItemDetail extends InvoiceItem {
  productName: string;
  subtotal: number;
  taxAmount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'cash' | 'transfer' | 'card' | 'check';
  reference?: string;
  createdAt: string;
}

export interface PaymentFormData {
  invoiceId: string;
  amount: number;
  method: 'cash' | 'transfer' | 'card' | 'check';
  reference?: string;
  notes?: string;
}

export interface CreditNote {
  id: string;
  invoiceId: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface CreditNoteFormData {
  invoiceId: string;
  amount: number;
  reason: string;
}

// ===== CLIENTES =====

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  // Empresa
  company?: string;
  taxId?: string;
  // Dirección
  address?: string;
  city?: string;
  country?: string;
  // Crédito
  creditLimit?: number;
  paymentTerms?: 'cash' | '30days' | '60days' | '90days';
}

export interface ClientDetail extends Client {
  taxId?: string;
  address?: string;
  city?: string;
  country?: string;
  creditLimit: number;
  availableCredit: number;
  paymentTerms: string;
  transactions: Transaction[];
  invoices: Invoice[];
  statistics: ClientStatistics;
  createdAt: string;
}

export interface ClientStatistics {
  totalPurchases: number;
  averageTicket: number;
  lastPurchaseDate: string;
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
}

export interface Transaction {
  id: string;
  clientId: string;
  type: 'invoice' | 'payment' | 'credit_note';
  amount: number;
  balance: number;
  createdAt: string;
}

// ===== PROVEEDORES =====

export interface Supplier extends SupplierSummary {
  taxId?: string;
  address?: string;
  website?: string;
  paymentTerms?: string;
  productsCount: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface SupplierFormData {
  name: string;
  contactEmail: string;
  phone?: string;
  taxId?: string;
  address?: string;
  website?: string;
  paymentTerms?: string;
}

export interface SupplierDetail extends Supplier {
  products: Product[];
  purchaseOrders: PurchaseOrder[];
  statistics: SupplierStatistics;
}

export interface SupplierStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  onTimeDeliveryRate: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  total: number;
  expectedDate: string;
  receivedDate?: string;
  createdAt: string;
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrderFormData {
  supplierId: string;
  items: PurchaseOrderItem[];
  expectedDate: string;
  notes?: string;
}

// ===== REPORTES =====

export interface SalesReport {
  period: string;
  totalSales: number;
  totalInvoices: number;
  averageTicket: number;
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
  topClients: {
    clientId: string;
    clientName: string;
    totalPurchases: number;
  }[];
  salesByCategory: {
    categoryId: string;
    categoryName: string;
    revenue: number;
  }[];
}

export interface InventoryReport {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  lowStockProducts: StockAlert[];
  stockByCategory: {
    categoryId: string;
    categoryName: string;
    quantity: number;
    value: number;
  }[];
  stockByLocation: {
    location: string;
    quantity: number;
    value: number;
  }[];
  deadStock: {
    productId: string;
    productName: string;
    quantity: number;
    lastMovement: string;
  }[];
}

export interface FinancialReport {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  accountsReceivable: number;
  accountsPayable: number;
  cashFlow: number;
}

// ===== ADMINISTRACIÓN =====

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface UserFormData {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface RoleFormData {
  name: string;
  permissionIds: string[];
}

export interface SystemSettings {
  companyName: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  taxRate: number;
  invoicePrefix: string;
  invoiceNumbering: number;
  logoUrl?: string;
}

export interface BackupData {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress: string;
  createdAt: string;
}
```

---

## 🔌 Endpoints de API

Todos los endpoints seguirán el patrón RESTful y retornarán las interfaces definidas arriba.

### Productos

```typescript
// src/services/productService.ts

GET    /api/products              → Product[]
GET    /api/products/:id          → ProductDetail
POST   /api/products              → Product (body: ProductFormData)
PUT    /api/products/:id          → Product (body: Partial<ProductFormData>)
DELETE /api/products/:id          → { success: boolean }

GET    /api/categories            → ProductCategory[]
POST   /api/categories            → ProductCategory (body: CategoryFormData)
PUT    /api/categories/:id        → ProductCategory (body: CategoryFormData)
DELETE /api/categories/:id        → { success: boolean }

GET    /api/products/:id/history  → StockMovement[]
GET    /api/products/:id/prices   → PriceChange[]
```

### Inventario

```typescript
// src/services/inventoryService.ts

GET    /api/inventory/snapshots   → InventorySnapshot[]
GET    /api/inventory/movements   → StockMovement[]

POST   /api/inventory/entry       → StockMovement (body: StockEntryFormData)
POST   /api/inventory/exit        → StockMovement (body: StockExitFormData)
POST   /api/inventory/transfer    → StockMovement (body: StockTransferFormData)

POST   /api/inventory/count       → InventoryDiscrepancy[] (body: InventoryCountFormData)
GET    /api/inventory/valuation   → StockValuation[]
```

### Facturación

```typescript
// src/services/invoicingService.ts

GET    /api/invoices              → Invoice[]
GET    /api/invoices/:id          → InvoiceDetail
POST   /api/invoices              → Invoice (body: InvoiceFormData)
PUT    /api/invoices/:id          → Invoice (body: Partial<InvoiceFormData>)
DELETE /api/invoices/:id          → { success: boolean }

POST   /api/invoices/:id/payments → Payment (body: PaymentFormData)
GET    /api/invoices/:id/payments → Payment[]

POST   /api/credit-notes          → CreditNote (body: CreditNoteFormData)
GET    /api/invoices/:id/credit-notes → CreditNote[]

GET    /api/payment-reminders     → PaymentReminder[]
```

### Clientes

```typescript
// src/services/clientService.ts

GET    /api/clients               → Client[]
GET    /api/clients/:id           → ClientDetail
POST   /api/clients               → Client (body: ClientFormData)
PUT    /api/clients/:id           → Client (body: Partial<ClientFormData>)
DELETE /api/clients/:id           → { success: boolean }

GET    /api/clients/:id/transactions → Transaction[]
GET    /api/clients/:id/invoices  → Invoice[]
GET    /api/clients/:id/statistics → ClientStatistics
```

### Proveedores

```typescript
// src/services/supplierService.ts

GET    /api/suppliers             → Supplier[]
GET    /api/suppliers/:id         → SupplierDetail
POST   /api/suppliers             → Supplier (body: SupplierFormData)
PUT    /api/suppliers/:id         → Supplier (body: Partial<SupplierFormData>)
DELETE /api/suppliers/:id         → { success: boolean }

GET    /api/purchase-orders       → PurchaseOrder[]
GET    /api/purchase-orders/:id   → PurchaseOrder
POST   /api/purchase-orders       → PurchaseOrder (body: PurchaseOrderFormData)
PUT    /api/purchase-orders/:id/status → PurchaseOrder (body: { status: string })

POST   /api/purchase-orders/:id/receive → StockMovement[]
```

### Reportes

```typescript
// src/services/reportService.ts

GET    /api/reports/sales?period=:period           → SalesReport
GET    /api/reports/inventory                       → InventoryReport
GET    /api/reports/financial?period=:period        → FinancialReport

GET    /api/reports/sales/daily                     → SalesReport
GET    /api/reports/sales/monthly                   → SalesReport
GET    /api/reports/sales/by-product/:productId     → SalesReport
GET    /api/reports/sales/by-client/:clientId       → SalesReport
GET    /api/reports/sales/by-category/:categoryId   → SalesReport

GET    /api/reports/inventory/low-stock             → StockAlert[]
GET    /api/reports/inventory/dead-stock            → Product[]
GET    /api/reports/inventory/valuation             → StockValuation[]
```

### Administración

```typescript
// src/services/adminService.ts

GET    /api/users                 → User[]
POST   /api/users                 → User (body: UserFormData)
PUT    /api/users/:id             → User (body: Partial<UserFormData>)
DELETE /api/users/:id             → { success: boolean }

GET    /api/roles                 → Role[]
POST   /api/roles                 → Role (body: RoleFormData)
PUT    /api/roles/:id             → Role (body: RoleFormData)
DELETE /api/roles/:id             → { success: boolean }

GET    /api/settings              → SystemSettings
PUT    /api/settings              → SystemSettings (body: SystemSettings)

POST   /api/backup                → BackupData
GET    /api/backups               → BackupData[]
POST   /api/restore/:id           → { success: boolean }

GET    /api/audit-logs            → AuditLog[]
```

### Dashboard

```typescript
// src/services/dashboardService.ts

GET    /api/dashboard/widgets     → WidgetStat[]
GET    /api/dashboard/alerts      → StockAlert[]
GET    /api/dashboard/movements   → StockMovement[]
GET    /api/dashboard/top-products → Product[]
GET    /api/dashboard/pending-invoices → Invoice[]
```

---

## 📦 Especificaciones por Módulo

### MÓDULO: Productos

#### SIM-49: [Productos] Crear página de Crear Producto

**Interfaces utilizadas:**
- `ProductFormData` (input)
- `Product` (output)
- `ProductCategory[]` (para dropdown)
- `SupplierSummary[]` (para selección múltiple)

**Endpoints:**
- `POST /api/products` (body: ProductFormData) → Product
- `GET /api/categories` → ProductCategory[]
- `GET /api/suppliers` → Supplier[]

**Archivo a crear:**
- `src/pages/products/CreateProductPage.tsx`

**Criterios de aceptación:**
- [ ] Formulario con validación de todos los campos requeridos (name, sku, categoryId, costPrice, salePrice, taxRate, initialStock)
- [ ] Dropdown de categorías poblado desde API
- [ ] Selección múltiple de proveedores
- [ ] Campo numérico para precios con formato de moneda
- [ ] Campo numérico para tasas de impuesto (%)
- [ ] Subida de imágenes (máx 5)
- [ ] Generación automática de SKU si se deja vacío
- [ ] Validación: salePrice >= costPrice
- [ ] Validación: initialStock >= 0
- [ ] Loading state durante submit
- [ ] Mensaje de éxito/error
- [ ] Redirección a ProductDetail después de crear

**Dependencias:**
- SIM-52 (Gestión de Categorías) - para poblar dropdown

---

#### SIM-50: [Productos] Crear página de Editar Producto

**Interfaces utilizadas:**
- `ProductFormData` (input)
- `Product` (output)
- `ProductDetail` (para cargar datos iniciales)

**Endpoints:**
- `GET /api/products/:id` → ProductDetail
- `PUT /api/products/:id` (body: Partial<ProductFormData>) → Product

**Archivo a crear:**
- `src/pages/products/EditProductPage.tsx`

**Criterios de aceptación:**
- [ ] Cargar datos del producto existente
- [ ] Mismo formulario que CreateProductPage pero con datos pre-poblados
- [ ] Permitir editar todos los campos excepto SKU (readonly)
- [ ] Mostrar historial de cambios de precio
- [ ] Ajustar stock desde esta página (con confirmación)
- [ ] Validación de cambios de precio (mostrar advertencia si es > 20% diferencia)
- [ ] Loading state durante carga y submit
- [ ] Mensaje de éxito/error

**Dependencias:**
- SIM-49 (Crear Producto) - comparte componentes de formulario

---

#### SIM-51: [Productos] Crear página de Detalle de Producto

**Interfaces utilizadas:**
- `ProductDetail` (main data)
- `StockMovement[]` (historial)
- `PriceChange[]` (historial de precios)

**Endpoints:**
- `GET /api/products/:id` → ProductDetail
- `GET /api/products/:id/history` → StockMovement[]
- `GET /api/products/:id/prices` → PriceChange[]

**Archivo a crear:**
- `src/pages/products/ProductDetailPage.tsx`

**Criterios de aceptación:**
- [ ] Mostrar toda la información del producto en cards organizadas
- [ ] Galería de imágenes del producto
- [ ] Tabla de historial de stock (últimos 20 movimientos)
- [ ] Gráfico de historial de precios (line chart)
- [ ] Lista de proveedores vinculados con links
- [ ] Botón "Editar" que lleva a EditProductPage
- [ ] Botón "Ajustar Stock" que abre modal
- [ ] Indicador visual si stock < minimumStock
- [ ] Tabs: Info General | Historial | Proveedores

**Dependencias:**
- Ninguna (puede implementarse independientemente)

---

#### SIM-52: [Productos] Gestión de Categorías - CRUD completo

**Interfaces utilizadas:**
- `ProductCategory` (main data)
- `CategoryFormData` (input)

**Endpoints:**
- `GET /api/categories` → ProductCategory[]
- `POST /api/categories` (body: CategoryFormData) → ProductCategory
- `PUT /api/categories/:id` (body: CategoryFormData) → ProductCategory
- `DELETE /api/categories/:id` → { success: boolean }

**Archivo a crear:**
- `src/pages/products/CategoriesPage.tsx`

**Criterios de aceptación:**
- [ ] Tabla de categorías con nombre, descripción, cantidad de productos
- [ ] Botón "Nueva Categoría" que abre modal
- [ ] Modal con formulario: name (requerido), description (opcional)
- [ ] Editar categoría (click en row o botón edit)
- [ ] Eliminar categoría (con confirmación)
- [ ] Validación: no eliminar si tiene productos asociados
- [ ] Búsqueda/filtro de categorías
- [ ] Paginación si > 20 categorías

**Dependencias:**
- Ninguna

---

#### SIM-53: [Productos] Mejorar ProductListPage

**Archivo a modificar:**
- `src/pages/products/ProductListPage.tsx`

**Mejoras a implementar:**
- [ ] Agregar paginación (10/20/50 items por página)
- [ ] Filtro por rango de precios (slider)
- [ ] Filtro por stock bajo (checkbox)
- [ ] Ordenamiento por columnas (nombre, precio, stock, fecha)
- [ ] Vista switcheable: tabla/grid
- [ ] Exportar a CSV/Excel
- [ ] Botón "Crear Producto" que lleva a CreateProductPage
- [ ] Click en row lleva a ProductDetailPage
- [ ] Acciones rápidas en cada row: editar, eliminar
- [ ] Indicador visual de productos con stock bajo

**Dependencias:**
- SIM-49, SIM-51 (para navegación)

---

#### SIM-84: [Productos] Gestión de Códigos de Barras

**Interfaces nuevas:**
```typescript
export interface BarcodeData {
  productId: string;
  barcode: string;
  type: 'EAN13' | 'UPC' | 'CODE128';
}
```

**Endpoints:**
- `POST /api/products/:id/barcode` → Product
- `GET /api/products/barcode/:barcode` → Product

**Archivo a crear:**
- `src/pages/products/BarcodePage.tsx`

**Criterios de aceptación:**
- [ ] Generar código de barras para productos
- [ ] Escanear códigos de barras (usando cámara o lector)
- [ ] Imprimir etiquetas con códigos de barras
- [ ] Búsqueda de productos por código de barras
- [ ] Soportar EAN13, UPC, CODE128
- [ ] Validación de formato de código

**Dependencias:**
- SIM-49 (para asignar códigos a productos)

---

### MÓDULO: Inventario

#### SIM-54: [Inventario] Vista General de Stock mejorada

**Archivo a modificar:**
- `src/pages/inventory/InventoryOverviewPage.tsx`

**Interfaces utilizadas:**
- `InventorySnapshot[]`
- `StockValuation[]`
- `StockAlert[]`

**Endpoints:**
- `GET /api/inventory/snapshots` → InventorySnapshot[]
- `GET /api/inventory/valuation` → StockValuation[]
- `GET /api/dashboard/alerts` → StockAlert[]

**Mejoras a implementar:**
- [ ] Cards de resumen: Total SKUs, Total Items, Valor Total
- [ ] Gráfico de distribución de stock por categoría (pie chart)
- [ ] Tabla de stock por ubicación
- [ ] Lista de productos con stock bajo (top 10)
- [ ] KPIs: Rotación de stock, Días de inventario
- [ ] Filtro por ubicación
- [ ] Exportar reporte a PDF

**Dependencias:**
- Ninguna

---

#### SIM-55: [Inventario] Registro de Entradas de Stock

**Interfaces utilizadas:**
- `StockEntryFormData` (input)
- `StockMovement` (output)

**Endpoints:**
- `POST /api/inventory/entry` (body: StockEntryFormData) → StockMovement

**Archivo a crear:**
- `src/pages/inventory/StockEntryPage.tsx`

**Criterios de aceptación:**
- [ ] Formulario con tipo de entrada: compra/ajuste/devolución
- [ ] Búsqueda y selección de producto
- [ ] Cantidad (validación > 0)
- [ ] Costo unitario (opcional para ajustes)
- [ ] Selección de proveedor (requerido para compras)
- [ ] Selección de ubicación
- [ ] Notas/observaciones
- [ ] Confirmación antes de registrar
- [ ] Actualización automática de stock del producto
- [ ] Registro en historial de movimientos

**Dependencias:**
- Ninguna

---

#### SIM-56: [Inventario] Registro de Salidas de Stock

**Interfaces utilizadas:**
- `StockExitFormData` (input)
- `StockMovement` (output)

**Endpoints:**
- `POST /api/inventory/exit` (body: StockExitFormData) → StockMovement

**Archivo a crear:**
- `src/pages/inventory/StockExitPage.tsx`

**Criterios de aceptación:**
- [ ] Formulario con tipo de salida: venta/ajuste/daño/pérdida
- [ ] Búsqueda y selección de producto
- [ ] Validación: cantidad <= stock disponible
- [ ] Selección de ubicación
- [ ] Notas/observaciones (requerido para daño/pérdida)
- [ ] Confirmación antes de registrar
- [ ] Actualización automática de stock del producto
- [ ] Para ventas: vincular con factura (opcional)

**Dependencias:**
- Ninguna

---

#### SIM-57: [Inventario] Sistema de Transferencias

**Interfaces utilizadas:**
- `StockTransferFormData` (input)
- `StockMovement` (output)

**Endpoints:**
- `POST /api/inventory/transfer` (body: StockTransferFormData) → StockMovement

**Archivo a crear:**
- `src/pages/inventory/StockTransferPage.tsx`

**Criterios de aceptación:**
- [ ] Selección de producto
- [ ] Ubicación origen (dropdown)
- [ ] Ubicación destino (dropdown, excluir origen)
- [ ] Cantidad (validar <= stock en origen)
- [ ] Notas
- [ ] Mostrar stock disponible en origen
- [ ] Confirmación con resumen de transferencia
- [ ] Crear 2 movimientos: salida de origen + entrada a destino
- [ ] Historial de transferencias

**Dependencias:**
- Ninguna

---

#### SIM-85: [Inventario] Conteo de Inventario Físico

**Interfaces utilizadas:**
- `InventoryCountFormData` (input)
- `InventoryDiscrepancy[]` (output)

**Endpoints:**
- `POST /api/inventory/count` (body: InventoryCountFormData) → InventoryDiscrepancy[]

**Archivo a crear:**
- `src/pages/inventory/PhysicalCountPage.tsx`

**Criterios de aceptación:**
- [ ] Selección de ubicación
- [ ] Cargar todos los productos de esa ubicación con stock actual
- [ ] Input para ingresar cantidad contada por producto
- [ ] Comparación automática: contado vs sistema
- [ ] Highlight de discrepancias (diferente de 0)
- [ ] Confirmación de conteo
- [ ] Generar ajustes automáticos para discrepancias
- [ ] Reporte de discrepancias en PDF
- [ ] Registrar quién hizo el conteo y cuándo

**Dependencias:**
- Ninguna

---

#### SIM-86: [Inventario] Conteo Cíclico

**Similar a SIM-85 pero:**
- [ ] Permite seleccionar productos específicos (no todos)
- [ ] Programar conteos recurrentes
- [ ] Priorizar productos de alto valor o alta rotación

**Dependencias:**
- SIM-85 (puede compartir componentes)

---

### MÓDULO: Facturación

#### SIM-58: [Facturación] Mejorar lista de facturas

**Archivo a modificar:**
- `src/pages/invoicing/InvoiceListPage.tsx`

**Mejoras a implementar:**
- [ ] Paginación
- [ ] Filtro por rango de fechas
- [ ] Filtro por cliente (autocomplete)
- [ ] Filtro por rango de montos
- [ ] Ordenamiento por columnas
- [ ] Búsqueda por número de factura
- [ ] Exportar lista a CSV/Excel
- [ ] Acciones rápidas: ver detalle, enviar, marcar como pagada
- [ ] Badge de estado coloreado

**Dependencias:**
- SIM-60 (para navegación a detalle)

---

#### SIM-59: [Facturación] Crear Factura - Flujo completo

**Interfaces utilizadas:**
- `InvoiceFormData` (input)
- `Invoice` (output)
- `Client[]` (para selección)
- `Product[]` (para agregar items)

**Endpoints:**
- `POST /api/invoices` (body: InvoiceFormData) → Invoice
- `GET /api/clients` → Client[]
- `GET /api/products` → Product[]

**Archivo a crear:**
- `src/pages/invoicing/CreateInvoicePage.tsx`

**Criterios de aceptación:**
- [ ] Wizard de 5 pasos con navegación (back/next)
- [ ] Paso 1: Seleccionar cliente (autocomplete con búsqueda)
- [ ] Paso 2: Agregar productos (tabla con búsqueda, cantidad, precio, subtotal)
- [ ] Validación: no agregar productos sin stock
- [ ] Mostrar stock disponible por producto
- [ ] Paso 3: Aplicar descuentos (por item o descuento total)
- [ ] Paso 4: Términos de pago (contado/30/60/90 días) → calcular dueDate
- [ ] Paso 5: Vista previa de factura completa
- [ ] Cálculo automático: subtotal, impuestos, descuentos, total
- [ ] Botón "Generar Factura"
- [ ] Confirmación y redirección a InvoiceDetailPage

**Dependencias:**
- SIM-64 (para crear clientes si no existen)
- SIM-60 (para redireccionar después de crear)

---

#### SIM-60: [Facturación] Detalle de Factura completo

**Interfaces utilizadas:**
- `InvoiceDetail` (main data)
- `Payment[]` (pagos registrados)

**Endpoints:**
- `GET /api/invoices/:id` → InvoiceDetail
- `GET /api/invoices/:id/payments` → Payment[]

**Archivo a crear:**
- `src/pages/invoicing/InvoiceDetailPage.tsx`

**Criterios de aceptación:**
- [ ] Información del cliente (nombre, email, dirección)
- [ ] Tabla de items con productos, cantidades, precios, subtotales
- [ ] Desglose: subtotal, descuentos, impuestos, total
- [ ] Estado de factura (badge coloreado)
- [ ] Historial de pagos (tabla)
- [ ] Saldo pendiente
- [ ] Botones de acción: Enviar, Imprimir, Exportar PDF, Registrar Pago
- [ ] Botón "Editar" (solo si estado = draft)
- [ ] Vista previa para impresión (plantilla profesional)

**Dependencias:**
- SIM-61 (para registrar pagos)

---

#### SIM-61: [Facturación] Sistema de Seguimiento de Pagos

**Interfaces utilizadas:**
- `PaymentFormData` (input)
- `Payment` (output)

**Endpoints:**
- `POST /api/invoices/:id/payments` (body: PaymentFormData) → Payment

**Componente a crear:**
- `src/components/invoicing/RegisterPaymentModal.tsx`

**Criterios de aceptación:**
- [ ] Modal abierto desde InvoiceDetailPage
- [ ] Mostrar monto total y saldo pendiente
- [ ] Input de monto (validar <= saldo pendiente)
- [ ] Selección de método: efectivo/transferencia/tarjeta/cheque
- [ ] Campo de referencia (opcional)
- [ ] Notas
- [ ] Al confirmar: registrar pago y actualizar saldo
- [ ] Si saldo = 0, cambiar estado a "paid"
- [ ] Soportar pagos parciales
- [ ] Historial de pagos visible en detalle de factura

**Dependencias:**
- SIM-60 (se integra en detalle de factura)

---

#### SIM-62: [Facturación] Notas de Crédito

**Interfaces utilizadas:**
- `CreditNoteFormData` (input)
- `CreditNote` (output)

**Endpoints:**
- `POST /api/credit-notes` (body: CreditNoteFormData) → CreditNote

**Archivo a crear:**
- `src/pages/invoicing/CreditNotesPage.tsx`

**Criterios de aceptación:**
- [ ] Lista de notas de crédito
- [ ] Botón "Crear Nota de Crédito"
- [ ] Modal: seleccionar factura, monto (validar <= total factura), razón
- [ ] Al crear: reducir saldo de factura
- [ ] Vincular nota de crédito con factura original
- [ ] Exportar nota a PDF
- [ ] Filtros: por cliente, por fecha

**Dependencias:**
- SIM-60 (integración con facturas)

---

### MÓDULO: Clientes

#### SIM-63: [Clientes] Mejorar lista de clientes

**Archivo a modificar:**
- `src/pages/clients/ClientListPage.tsx`

**Mejoras a implementar:**
- [ ] Paginación
- [ ] Búsqueda por nombre, email, empresa
- [ ] Filtro por saldo > 0
- [ ] Ordenamiento por columnas
- [ ] Mostrar saldo total y facturas activas
- [ ] Indicador visual de clientes con deuda vencida
- [ ] Exportar a CSV
- [ ] Acciones: ver detalle, crear factura, editar
- [ ] Botón "Nuevo Cliente"

**Dependencias:**
- SIM-64, SIM-65 (para navegación)

---

#### SIM-64: [Clientes] Crear/Editar Cliente - Formulario completo

**Interfaces utilizadas:**
- `ClientFormData` (input)
- `Client` (output)

**Endpoints:**
- `POST /api/clients` (body: ClientFormData) → Client
- `PUT /api/clients/:id` (body: Partial<ClientFormData>) → Client

**Archivo a crear:**
- `src/pages/clients/CreateClientPage.tsx`
- `src/pages/clients/EditClientPage.tsx`

**Criterios de aceptación:**
- [ ] Formulario en tabs: Básico | Empresa | Crédito
- [ ] Tab Básico: nombre, email, teléfono, dirección, ciudad, país
- [ ] Tab Empresa: empresa, taxId (CUIT/RUT)
- [ ] Tab Crédito: límite de crédito, términos de pago preferidos
- [ ] Validación de email único
- [ ] Validación de formato de taxId
- [ ] Loading state
- [ ] Mensaje de éxito/error
- [ ] Redirección a ClientDetailPage después de crear

**Dependencias:**
- Ninguna

---

#### SIM-65: [Clientes] Detalle de Cliente completo

**Interfaces utilizadas:**
- `ClientDetail` (main data)
- `Invoice[]` (facturas)
- `Transaction[]` (transacciones)
- `ClientStatistics` (estadísticas)

**Endpoints:**
- `GET /api/clients/:id` → ClientDetail
- `GET /api/clients/:id/invoices` → Invoice[]
- `GET /api/clients/:id/transactions` → Transaction[]
- `GET /api/clients/:id/statistics` → ClientStatistics

**Archivo a crear:**
- `src/pages/clients/ClientDetailPage.tsx`

**Criterios de aceptación:**
- [ ] Información básica del cliente en card
- [ ] KPIs: Total comprado, Ticket promedio, Última compra
- [ ] Tabs: Facturas | Transacciones | Estadísticas
- [ ] Tab Facturas: tabla de todas las facturas del cliente
- [ ] Tab Transacciones: historial de pagos y movimientos
- [ ] Tab Estadísticas: productos más comprados, gráfico de compras por mes
- [ ] Botón "Editar Cliente"
- [ ] Botón "Nueva Factura" (prellenar cliente)
- [ ] Indicador de crédito disponible

**Dependencias:**
- Ninguna

---

#### SIM-66: [Clientes] Estado de Cuenta

**Archivo a crear:**
- `src/pages/clients/ClientStatementPage.tsx`

**Criterios de aceptación:**
- [ ] Resumen de cuenta: saldo total, facturas pendientes, pagos
- [ ] Tabla de facturas pendientes con antigüedad
- [ ] Reporte de antigüedad (0-30, 31-60, 61-90, >90 días)
- [ ] Exportar estado de cuenta a PDF
- [ ] Enviar por email al cliente

**Dependencias:**
- SIM-65 (datos del cliente)

---

### MÓDULO: Proveedores

#### SIM-67: [Proveedores] Mejorar lista de proveedores

**Archivo a modificar:**
- `src/pages/suppliers/SupplierListPage.tsx`

**Mejoras a implementar:**
- [ ] Paginación
- [ ] Búsqueda por nombre, email
- [ ] Mostrar cantidad de productos que provee
- [ ] Mostrar fecha de última orden
- [ ] Ordenamiento
- [ ] Exportar a CSV
- [ ] Botón "Nuevo Proveedor"
- [ ] Acciones: ver detalle, editar, crear orden

**Dependencias:**
- SIM-68, SIM-69

---

#### SIM-68: [Proveedores] Crear/Editar Proveedor

**Interfaces utilizadas:**
- `SupplierFormData` (input)
- `Supplier` (output)

**Endpoints:**
- `POST /api/suppliers` (body: SupplierFormData) → Supplier
- `PUT /api/suppliers/:id` (body: Partial<SupplierFormData>) → Supplier

**Archivo a crear:**
- `src/pages/suppliers/CreateSupplierPage.tsx`
- `src/pages/suppliers/EditSupplierPage.tsx`

**Criterios de aceptación:**
- [ ] Formulario: nombre, email, teléfono, taxId, dirección, website
- [ ] Términos de pago preferidos
- [ ] Validación de email único
- [ ] Mensaje de éxito/error
- [ ] Redirección a SupplierDetailPage

**Dependencias:**
- Ninguna

---

#### SIM-69: [Proveedores] Detalle de Proveedor

**Interfaces utilizadas:**
- `SupplierDetail` (main data)
- `Product[]` (productos que provee)
- `PurchaseOrder[]` (órdenes)
- `SupplierStatistics`

**Endpoints:**
- `GET /api/suppliers/:id` → SupplierDetail

**Archivo a crear:**
- `src/pages/suppliers/SupplierDetailPage.tsx`

**Criterios de aceptación:**
- [ ] Información del proveedor
- [ ] KPIs: Total órdenes, Total gastado, Tasa de entrega a tiempo
- [ ] Tabs: Productos | Órdenes | Estadísticas
- [ ] Tab Productos: tabla de productos que provee
- [ ] Tab Órdenes: historial de órdenes de compra
- [ ] Botón "Nueva Orden de Compra"
- [ ] Botón "Editar Proveedor"

**Dependencias:**
- SIM-70 (para órdenes de compra)

---

#### SIM-70: [Proveedores] Sistema de Órdenes de Compra

**Interfaces utilizadas:**
- `PurchaseOrderFormData` (input)
- `PurchaseOrder` (output)
- `PurchaseOrderItem`

**Endpoints:**
- `POST /api/purchase-orders` (body: PurchaseOrderFormData) → PurchaseOrder
- `PUT /api/purchase-orders/:id/status` → PurchaseOrder
- `POST /api/purchase-orders/:id/receive` → StockMovement[]

**Archivo a crear:**
- `src/pages/suppliers/PurchaseOrdersPage.tsx`
- `src/pages/suppliers/CreatePurchaseOrderPage.tsx`

**Criterios de aceptación:**
- [ ] Lista de órdenes con filtros por estado
- [ ] Crear orden: seleccionar proveedor, agregar productos, cantidades, costos
- [ ] Calcular total automáticamente
- [ ] Fecha esperada de entrega
- [ ] Estados: draft/sent/confirmed/received/cancelled
- [ ] Flujo de aprobación (opcional)
- [ ] Al recibir mercancía: crear entradas de stock automáticas
- [ ] Comparar cantidades esperadas vs recibidas

**Dependencias:**
- SIM-55 (entradas de stock)

---

### MÓDULO: Reportes

#### SIM-71: [Reportes] Reportes de Ventas básicos

**Interfaces utilizadas:**
- `SalesReport`

**Endpoints:**
- `GET /api/reports/sales?period=:period` → SalesReport
- `GET /api/reports/sales/daily` → SalesReport
- `GET /api/reports/sales/monthly` → SalesReport

**Archivo a crear:**
- `src/pages/reports/SalesReportsPage.tsx`

**Criterios de aceptación:**
- [ ] Selector de período: hoy/semana/mes/año/custom
- [ ] KPIs: Total ventas, Total facturas, Ticket promedio
- [ ] Top 10 productos más vendidos (tabla + gráfico de barras)
- [ ] Top 10 clientes (tabla)
- [ ] Ventas por categoría (pie chart)
- [ ] Exportar a PDF/Excel
- [ ] Filtros por fecha

**Dependencias:**
- Ninguna

---

#### SIM-72: [Reportes] Reportes de Inventario

**Interfaces utilizadas:**
- `InventoryReport`
- `StockAlert[]`
- `StockValuation[]`

**Endpoints:**
- `GET /api/reports/inventory` → InventoryReport
- `GET /api/reports/inventory/low-stock` → StockAlert[]
- `GET /api/reports/inventory/valuation` → StockValuation[]

**Archivo a crear:**
- `src/pages/reports/InventoryReportsPage.tsx`

**Criterios de aceptación:**
- [ ] KPIs: Total productos, Total stock, Valor total
- [ ] Reporte de stock bajo
- [ ] Reporte de stock muerto (sin movimientos > 90 días)
- [ ] Valorización de inventario por categoría
- [ ] Stock por ubicación
- [ ] Exportar a PDF/Excel

**Dependencias:**
- Ninguna

---

#### SIM-77: [Reportes] Reportes Financieros

**Interfaces utilizadas:**
- `FinancialReport`

**Endpoints:**
- `GET /api/reports/financial?period=:period` → FinancialReport

**Archivo a crear:**
- `src/pages/reports/FinancialReportsPage.tsx`

**Criterios de aceptación:**
- [ ] Selector de período
- [ ] KPIs: Ingresos totales, Gastos totales, Ganancia neta
- [ ] Cuentas por cobrar
- [ ] Cuentas por pagar
- [ ] Flujo de caja
- [ ] Gráficos de tendencias
- [ ] Exportar a PDF

**Dependencias:**
- Ninguna

---

#### SIM-78: [Reportes] Dashboard Analítico

**Archivo a crear:**
- `src/pages/reports/AnalyticsDashboardPage.tsx`

**Criterios de aceptación:**
- [ ] Análisis de tendencias (gráficos interactivos)
- [ ] Pronósticos de ventas (basados en históricos)
- [ ] KPIs principales con comparación vs período anterior
- [ ] Alertas y recomendaciones automáticas
- [ ] Filtros por período y categoría

**Dependencias:**
- SIM-71, SIM-72, SIM-77

---

### MÓDULO: Dashboard

#### SIM-73: [Dashboard] Gráfico de Ventas interactivo

**Archivo a modificar:**
- `src/pages/dashboard/MainDashboard.tsx`

**Mejoras:**
- [ ] Agregar gráfico de línea de ventas de los últimos 30 días
- [ ] Interactivo con tooltips
- [ ] Comparación con período anterior
- [ ] Toggle entre diario/semanal/mensual

**Dependencias:**
- Ninguna

---

#### SIM-74: [Dashboard] Top Productos Más Vendidos

**Mejoras al dashboard:**
- [ ] Card con lista de top 5 productos más vendidos
- [ ] Mostrar cantidad vendida y revenue
- [ ] Link a ProductDetailPage

**Dependencias:**
- Ninguna

---

#### SIM-75: [Dashboard] Widget de Facturas Pendientes

**Mejoras al dashboard:**
- [ ] Card con facturas vencidas (overdue)
- [ ] Mostrar monto total pendiente
- [ ] Link a InvoiceListPage filtrado por overdue

**Dependencias:**
- Ninguna

---

#### SIM-76: [Dashboard] Estadísticas Rápidas adicionales

**Mejoras al dashboard:**
- [ ] Agregar más widgets: Clientes nuevos este mes, Productos sin stock, Órdenes pendientes
- [ ] Hacer widgets configurables (usuario elige cuáles ver)

**Dependencias:**
- Ninguna

---

### MÓDULO: Administración

#### SIM-79: [Admin] Gestión de Usuarios

**Interfaces utilizadas:**
- `User` (main data)
- `UserFormData` (input)
- `Role[]` (para asignar)

**Endpoints:**
- `GET /api/users` → User[]
- `POST /api/users` (body: UserFormData) → User
- `PUT /api/users/:id` → User
- `DELETE /api/users/:id` → { success: boolean }

**Archivo a crear:**
- `src/pages/admin/UsersPage.tsx`

**Criterios de aceptación:**
- [ ] Lista de usuarios con rol, estado, última conexión
- [ ] Crear usuario: nombre, email, contraseña, rol
- [ ] Editar usuario
- [ ] Activar/desactivar usuario
- [ ] Eliminar usuario (con confirmación)
- [ ] Ver actividad del usuario (últimas acciones)
- [ ] Filtro por rol, estado

**Dependencias:**
- SIM-80 (roles)

---

#### SIM-80: [Admin] Gestión de Roles

**Interfaces utilizadas:**
- `Role` (main data)
- `Permission[]`
- `RoleFormData` (input)

**Endpoints:**
- `GET /api/roles` → Role[]
- `POST /api/roles` (body: RoleFormData) → Role
- `PUT /api/roles/:id` → Role

**Archivo a crear:**
- `src/pages/admin/RolesPage.tsx`

**Criterios de aceptación:**
- [ ] Lista de roles con cantidad de usuarios
- [ ] Crear rol: nombre, selección de permisos (checkboxes agrupados)
- [ ] Editar permisos de rol
- [ ] No permitir eliminar rol si tiene usuarios asignados
- [ ] Permisos por recurso: Productos, Inventario, Facturas, Clientes, etc.
- [ ] Acciones por recurso: crear, leer, actualizar, eliminar

**Dependencias:**
- Ninguna

---

#### SIM-81: [Admin] Configuración del Sistema

**Interfaces utilizadas:**
- `SystemSettings`

**Endpoints:**
- `GET /api/settings` → SystemSettings
- `PUT /api/settings` (body: SystemSettings) → SystemSettings

**Archivo a modificar:**
- `src/pages/admin/AdminPage.tsx` (agregar tabs)

**Criterios de aceptación:**
- [ ] Tabs: Empresa | Facturación | Notificaciones
- [ ] Tab Empresa: nombre, taxId, dirección, teléfono, email, logo
- [ ] Tab Facturación: prefijo de factura, numeración, tasa de impuesto default, moneda
- [ ] Tab Notificaciones: configuración de emails, alertas
- [ ] Validación de campos
- [ ] Guardar cambios con confirmación

**Dependencias:**
- Ninguna

---

#### SIM-82: [Admin] Respaldo y Restauración

**Interfaces utilizadas:**
- `BackupData`

**Endpoints:**
- `POST /api/backup` → BackupData
- `GET /api/backups` → BackupData[]
- `POST /api/restore/:id` → { success: boolean }

**Archivo a crear:**
- `src/pages/admin/BackupPage.tsx`

**Criterios de aceptación:**
- [ ] Botón "Crear Respaldo" (genera backup de BD)
- [ ] Lista de backups con fecha, tamaño
- [ ] Descargar backup
- [ ] Restaurar backup (con confirmación y advertencia)
- [ ] Programar backups automáticos
- [ ] Limpieza automática de backups antiguos

**Dependencias:**
- Ninguna

---

#### SIM-83: [Admin] Log de Auditoría

**Interfaces utilizadas:**
- `AuditLog`

**Endpoints:**
- `GET /api/audit-logs` → AuditLog[]

**Archivo a crear:**
- `src/pages/admin/AuditLogPage.tsx`

**Criterios de aceptación:**
- [ ] Tabla de logs: usuario, acción, recurso, fecha, IP
- [ ] Filtros: por usuario, por acción, por recurso, por rango de fechas
- [ ] Paginación
- [ ] Ver detalles de cambios (JSON diff)
- [ ] Exportar logs a CSV
- [ ] No permitir editar o eliminar logs (read-only)

**Dependencias:**
- Ninguna

---

### MÓDULO: Ayuda

#### SIM-87: [Ayuda] Guía de Usuario

**Archivo a modificar:**
- `src/pages/help/HelpPage.tsx`

**Mejoras:**
- [ ] Agregar sección de artículos de ayuda
- [ ] Búsqueda de artículos
- [ ] Categorías de artículos
- [ ] Artículos markdown con screenshots

**Dependencias:**
- Ninguna

---

#### SIM-88: [Ayuda] Tutoriales en Video

**Mejoras:**
- [ ] Agregar sección de videos tutoriales
- [ ] Embed de videos (YouTube/Vimeo)
- [ ] Categorías de videos

**Dependencias:**
- Ninguna

---

#### SIM-89: [Ayuda] FAQ

**Mejoras:**
- [ ] Sección de preguntas frecuentes
- [ ] Accordion de preguntas/respuestas
- [ ] Búsqueda en FAQs

**Dependencias:**
- Ninguna

---

#### SIM-90: [Ayuda] Contactar Soporte

**Mejoras:**
- [ ] Formulario de contacto: nombre, email, asunto, mensaje
- [ ] Categoría de consulta
- [ ] Envío a email de soporte
- [ ] Confirmación de envío

**Dependencias:**
- Ninguna

---

#### SIM-91: [Ayuda] Información del Sistema

**Mejoras:**
- [ ] Versión de la aplicación
- [ ] Información de licencia
- [ ] Credits
- [ ] Release notes

**Dependencias:**
- Ninguna

---

## 🔗 Dependencias entre Tareas

### Críticas (Bloquean otras tareas)

```
SIM-52 (Categorías) → SIM-49, SIM-50 (Crear/Editar Producto)
SIM-49 (Crear Producto) → SIM-50, SIM-51, SIM-53 (Editar/Detalle/Lista)
SIM-60 (Detalle Factura) → SIM-61 (Seguimiento Pagos)
SIM-64 (Crear Cliente) → SIM-59 (Crear Factura)
SIM-80 (Roles) → SIM-79 (Usuarios)
```

### Recomendadas (Mejor flujo de desarrollo)

```
SIM-55 (Entradas Stock) ← SIM-70 (Órdenes de Compra)
SIM-71, SIM-72, SIM-77 → SIM-78 (Dashboard Analítico)
SIM-49, SIM-51 → SIM-53 (Mejorar ProductListPage)
SIM-60, SIM-64, SIM-65 → SIM-63 (Mejorar ClientListPage)
```

---

## 📝 Notas de Implementación

### Validaciones Comunes

Aplicar en todos los formularios:
- Validación de campos requeridos antes de submit
- Loading state durante operaciones async
- Mensajes de error claros y en español
- Confirmación para operaciones destructivas (eliminar)
- Sanitización de inputs
- Validación de formatos (email, teléfono, taxId)

### Patrones de UI

- Usar Material-UI components consistentemente
- Loading: LinearProgress para páginas, CircularProgress para botones
- Confirmaciones: Dialog con título, mensaje, botones Cancelar/Confirmar
- Mensajes de éxito: Snackbar verde, 3 segundos
- Mensajes de error: Snackbar rojo, 5 segundos
- Formularios: Validación en submit, no en tiempo real (UX más limpia)

### Manejo de Errores

```typescript
try {
  setIsLoading(true);
  const result = await apiCall();
  showSuccessMessage("Operación exitosa");
} catch (error) {
  showErrorMessage(error.message || "Error al procesar la solicitud");
} finally {
  setIsLoading(false);
}
```

### Estado de Carga

Siempre mostrar indicadores de carga para operaciones que toman > 100ms.

---

## 🎯 Priorización Sugerida

### Fase 1 - MVP (Crítico para funcionalidad básica)

1. SIM-52 (Categorías) - PRIMERO
2. SIM-49 (Crear Producto)
3. SIM-50 (Editar Producto)
4. SIM-51 (Detalle Producto)
5. SIM-53 (Mejorar ProductListPage)
6. SIM-64 (Crear/Editar Cliente)
7. SIM-59 (Crear Factura)
8. SIM-60 (Detalle Factura)
9. SIM-61 (Seguimiento Pagos)
10. SIM-55, SIM-56 (Entradas/Salidas Stock)

### Fase 2 - Operaciones Avanzadas

11. SIM-57 (Transferencias)
12. SIM-68, SIM-69, SIM-70 (Proveedores y Órdenes)
13. SIM-65, SIM-66 (Detalle Cliente, Estado Cuenta)
14. SIM-62 (Notas de Crédito)

### Fase 3 - Análisis y Admin

15. SIM-71, SIM-72 (Reportes básicos)
16. SIM-80, SIM-79 (Roles y Usuarios)
17. SIM-81 (Configuración)
18. SIM-77, SIM-78 (Reportes financieros, Analytics)

### Fase 4 - Optimizaciones

19. SIM-73-76 (Mejoras Dashboard)
20. SIM-84 (Códigos de Barras)
21. SIM-85, SIM-86 (Conteos)
22. SIM-82, SIM-83 (Backup, Auditoría)
23. SIM-87-91 (Ayuda)

---

**Fecha de creación**: 2025-10-27
**Última actualización**: 2025-10-27
**Versión**: 1.0
**Autor**: Claude Code + Ferced
