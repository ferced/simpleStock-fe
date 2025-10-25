import {
  clients,
  helpCenterResources,
  invoices,
  inventorySnapshots,
  paymentReminders,
  products,
  reports,
  stockAlerts,
  stockMovements,
  widgetStats,
} from '../mocks/data';
import {
  Client,
  HelpResource,
  Invoice,
  InventorySnapshot,
  PaymentReminder,
  Product,
  ReportSummary,
  StockAlert,
  StockMovement,
  WidgetStat,
} from '../types';

const simulateDelay = async <T>(data: T, delay = 320): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const dashboardService = {
  getWidgets: () => simulateDelay<WidgetStat[]>(widgetStats),
  getStockAlerts: () => simulateDelay<StockAlert[]>(stockAlerts),
  getStockMovements: () => simulateDelay<StockMovement[]>(stockMovements),
};

export const productService = {
  getProducts: () => simulateDelay<Product[]>(products),
};

export const inventoryService = {
  getSnapshots: () => simulateDelay<InventorySnapshot[]>(inventorySnapshots),
  getMovements: () => simulateDelay<StockMovement[]>(stockMovements),
};

export const invoicingService = {
  getInvoices: () => simulateDelay<Invoice[]>(invoices),
  getReminders: () => simulateDelay<PaymentReminder[]>(paymentReminders),
};

export const clientService = {
  getClients: () => simulateDelay<Client[]>(clients),
};

export const reportService = {
  getReports: () => simulateDelay<ReportSummary[]>(reports),
};

export const helpCenterService = {
  getResources: () => simulateDelay<HelpResource[]>(helpCenterResources),
};
