import {
  Client,
  HelpResource,
  Invoice,
  InventorySnapshot,
  PaymentReminder,
  Product,
  ProductCategory,
  ReportSummary,
  StockAlert,
  StockMovement,
  SupplierSummary,
  WidgetStat,
} from '../types';

export const widgetStats: WidgetStat[] = [
  {
    id: 'sales',
    title: 'Ventas del mes',
    value: '$ 128.450',
    trend: 12.5,
    helperText: 'vs. mes anterior',
  },
  {
    id: 'inventory',
    title: 'Valor de inventario',
    value: '$ 86.900',
    trend: -3.1,
    helperText: 'ajustes recientes',
  },
  {
    id: 'low-stock',
    title: 'Alertas de stock',
    value: '8 productos',
    helperText: 'revisar antes del viernes',
  },
  {
    id: 'clients',
    title: 'Clientes activos',
    value: '126',
    trend: 4.3,
    helperText: 'este trimestre',
  },
];

export const stockAlerts: StockAlert[] = [
  { productId: 'p-1', productName: 'Monitor IPS 27"', currentStock: 6, minimumStock: 10 },
  { productId: 'p-2', productName: 'Teclado Mecánico Azure', currentStock: 4, minimumStock: 8 },
  { productId: 'p-3', productName: 'Silla Ergonómica Flow', currentStock: 2, minimumStock: 5 },
];

export const categories: ProductCategory[] = [
  { id: 'c-1', name: 'Tecnología', description: 'Hardware, periféricos y accesorios' },
  { id: 'c-2', name: 'Oficina', description: 'Mobiliario y suministros' },
  { id: 'c-3', name: 'Servicios', description: 'Planes y garantías extendidas' },
];

export const suppliers: SupplierSummary[] = [
  { id: 's-1', name: 'Blue Hardware', contactEmail: 'ventas@bluehardware.com', phone: '+54 11 4567 8901' },
  { id: 's-2', name: 'OfficeLab', contactEmail: 'contacto@officelab.ar' },
];

export const products: Product[] = [
  {
    id: 'p-1',
    name: 'Monitor IPS 27"',
    sku: 'MN-IPS-27',
    categoryId: 'c-1',
    price: 215000,
    taxRate: 21,
    stock: 6,
    suppliers,
    updatedAt: '2024-03-18T10:15:00Z',
  },
  {
    id: 'p-2',
    name: 'Notebook Air Pro 14"',
    sku: 'NB-AP-14',
    categoryId: 'c-1',
    price: 830000,
    taxRate: 21,
    stock: 18,
    suppliers,
    updatedAt: '2024-03-17T08:05:00Z',
  },
  {
    id: 'p-3',
    name: 'Silla Ergonómica Flow',
    sku: 'SL-FLOW',
    categoryId: 'c-2',
    price: 152000,
    taxRate: 21,
    stock: 2,
    suppliers,
    updatedAt: '2024-03-16T11:40:00Z',
  },
];

export const inventorySnapshots: InventorySnapshot[] = [
  {
    id: 'inv-1',
    location: 'Depósito Central',
    totalItems: 324,
    totalValue: 5890000,
    updatedAt: '2024-03-18T07:30:00Z',
  },
  {
    id: 'inv-2',
    location: 'Sucursal Norte',
    totalItems: 142,
    totalValue: 2280000,
    updatedAt: '2024-03-17T12:45:00Z',
  },
];

export const stockMovements: StockMovement[] = [
  {
    id: 'mov-1',
    productId: 'p-2',
    productName: 'Notebook Air Pro 14"',
    type: 'out',
    quantity: 3,
    destination: 'Venta #FA-9321',
    createdAt: '2024-03-18T13:20:00Z',
  },
  {
    id: 'mov-2',
    productId: 'p-1',
    productName: 'Monitor IPS 27"',
    type: 'in',
    quantity: 10,
    source: 'OC-2024-118',
    createdAt: '2024-03-17T09:00:00Z',
  },
  {
    id: 'mov-3',
    productId: 'p-3',
    productName: 'Silla Ergonómica Flow',
    type: 'transfer',
    quantity: 4,
    source: 'Depósito Central',
    destination: 'Sucursal Norte',
    createdAt: '2024-03-16T16:30:00Z',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'FA-9321',
    clientId: 'cl-1',
    status: 'sent',
    total: 1245000,
    dueDate: '2024-03-30',
    createdAt: '2024-03-18',
    items: [
      { productId: 'p-2', quantity: 2, price: 830000 },
      { productId: 'p-3', quantity: 1, price: 152000, discount: 5000 },
    ],
  },
  {
    id: 'FA-9318',
    clientId: 'cl-2',
    status: 'paid',
    total: 642000,
    dueDate: '2024-03-12',
    createdAt: '2024-03-05',
    items: [{ productId: 'p-1', quantity: 3, price: 215000 }],
  },
];

export const clients: Client[] = [
  {
    id: 'cl-1',
    name: 'Estudio Creativo Prisma',
    email: 'compras@prisma.agency',
    phone: '+54 9 11 3456 7890',
    company: 'Prisma Agency',
    totalBalance: 245000,
    activeInvoices: 2,
  },
  {
    id: 'cl-2',
    name: 'Distribuidora Aurora',
    email: 'ventas@aurora.com',
    totalBalance: 0,
    activeInvoices: 0,
  },
  {
    id: 'cl-3',
    name: 'Cooperativa Andina',
    email: 'admin@andina.coop',
    phone: '+54 381 321 4455',
    totalBalance: 98000,
    activeInvoices: 1,
  },
];

export const paymentReminders: PaymentReminder[] = [
  {
    id: 'rem-1',
    invoiceId: 'FA-9321',
    clientName: 'Estudio Creativo Prisma',
    amount: 245000,
    dueDate: '2024-03-30',
  },
  {
    id: 'rem-2',
    invoiceId: 'FA-9320',
    clientName: 'Cooperativa Andina',
    amount: 98000,
    dueDate: '2024-03-28',
  },
];

export const reports: ReportSummary[] = [
  {
    id: 'rep-1',
    title: 'Ventas por categoría',
    description: 'Comparativa mensual de ingresos agrupados por familia de productos.',
    lastUpdated: '2024-03-18T08:00:00Z',
    tags: ['ventas', 'categorías', 'mensual'],
  },
  {
    id: 'rep-2',
    title: 'Alertas de stock',
    description: 'Listado detallado de productos debajo del stock mínimo.',
    lastUpdated: '2024-03-17T14:22:00Z',
    tags: ['inventario', 'alertas'],
  },
  {
    id: 'rep-3',
    title: 'Flujo de caja proyectado',
    description: 'Pronóstico de ingresos vs. egresos a 60 días.',
    lastUpdated: '2024-03-16T11:05:00Z',
    tags: ['finanzas', 'proyección'],
  },
];

export const helpCenterResources: HelpResource[] = [
  {
    id: 'help-1',
    title: 'Guía rápida de configuración inicial',
    description: 'Pasos recomendados para cargar tus primeros productos y clientes.',
    type: 'article',
    actionLabel: 'Ver guía',
  },
  {
    id: 'help-2',
    title: 'Video: Creación de facturas en menos de 2 minutos',
    description: 'Mirá cómo generar facturas y enviarlas por email.',
    type: 'video',
    actionLabel: 'Reproducir',
  },
  {
    id: 'help-3',
    title: 'Preguntas frecuentes sobre inventario',
    description: 'Respuestas a dudas comunes sobre conteos cíclicos y ajustes.',
    type: 'faq',
    actionLabel: 'Leer FAQ',
  },
  {
    id: 'help-4',
    title: 'Contactar a soporte',
    description: 'Nuestro equipo responde en menos de 24 hs.',
    type: 'support',
    actionLabel: 'Abrir ticket',
  },
];
