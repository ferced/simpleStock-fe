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
