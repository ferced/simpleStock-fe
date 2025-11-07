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

export interface SalesPoint {
  id: string;
  date: string;
  total: number;
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

export interface AuthFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormValues extends AuthFormValues {
  fullName: string;
  company?: string;
}

export interface ResetPasswordFormValues {
  email: string;
}
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
