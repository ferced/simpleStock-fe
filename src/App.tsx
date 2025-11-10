import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { MainDashboard } from './pages/dashboard/MainDashboard';
import { ProductListPage } from './pages/products/ProductListPage';
import { InventoryOverviewPage } from './pages/inventory/InventoryOverviewPage';
import { StockEntryPage } from './pages/inventory/StockEntryPage';
import { StockExitPage } from './pages/inventory/StockExitPage';
import { InvoiceListPage } from './pages/invoicing/InvoiceListPage';
import { CreateInvoicePage } from './pages/invoicing/CreateInvoicePage';
import { InvoiceDetailPage } from './pages/invoicing/InvoiceDetailPage';
import { CreditNotesPage } from './pages/invoicing/CreditNotesPage';
import { ClientListPage } from './pages/clients/ClientListPage';
import { CreateClientPage } from './pages/clients/CreateClientPage';
import { EditClientPage } from './pages/clients/EditClientPage';
import { ClientDetailPage } from './pages/clients/ClientDetailPage';
import { ClientStatementPage } from './pages/clients/ClientStatementPage';
import { SupplierListPage } from './pages/suppliers/SupplierListPage';
import { SupplierDetailPage } from './pages/suppliers/SupplierDetailPage';
import { CreateEditSupplierPage } from './pages/suppliers/CreateEditSupplierPage';
import { PurchaseOrdersPage } from './pages/suppliers/PurchaseOrdersPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { AdminPage } from './pages/admin/AdminPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { SystemInfoPage } from './pages/help/SystemInfoPage';
import { ContactSupportPage } from './pages/help/ContactSupportPage';
import { FAQPage } from './pages/help/FAQPage';
import { VideoTutorialsPage } from './pages/help/VideoTutorialsPage';
import { UserGuidePage } from './pages/help/UserGuidePage';
import { CreateProductPage } from './pages/products/CreateProductPage';
import { ProductDetailPage } from './pages/products/ProductDetailPage';
import { EditProductPage } from './pages/products/EditProductPage';
import { CategoriesPage } from './pages/products/CategoriesPage';
import theme from './theme';

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas de autenticación */}
          <Route path="/auth">
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="registro" element={<RegisterPage />} />
            <Route path="recuperar" element={<ForgotPasswordPage />} />
            <Route path="restablecer" element={<ResetPasswordPage />} />
          </Route>

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MainDashboard />} />
            <Route path="productos" element={<ProductListPage />} />
            <Route path="productos/nuevo" element={<CreateProductPage />} />
            <Route path="productos/:id" element={<ProductDetailPage />} />
            <Route path="productos/:id/editar" element={<EditProductPage />} />
            <Route path="productos/categorias" element={<CategoriesPage />} />
            <Route path="inventario" element={<InventoryOverviewPage />} />
            <Route path="inventario/entradas" element={<StockEntryPage />} />
            <Route path="inventario/salidas" element={<StockExitPage />} />
            <Route path="facturacion" element={<InvoiceListPage />} />
            <Route path="facturacion/nueva" element={<CreateInvoicePage />} />
            <Route path="facturacion/:id" element={<InvoiceDetailPage />} />
            <Route path="facturacion/notas-credito" element={<CreditNotesPage />} />
            <Route path="clientes" element={<ClientListPage />} />
            <Route path="clientes/nuevo" element={<CreateClientPage />} />
            <Route path="clientes/:id/editar" element={<EditClientPage />} />
            <Route path="clientes/:id" element={<ClientDetailPage />} />
            <Route path="clientes/:id/estado" element={<ClientStatementPage />} />
            <Route path="proveedores" element={<SupplierListPage />} />
            <Route path="proveedores/nuevo" element={<CreateEditSupplierPage />} />
            <Route path="proveedores/:id/editar" element={<CreateEditSupplierPage />} />
            <Route path="proveedores/:id" element={<SupplierDetailPage />} />
            <Route path="proveedores/ordenes" element={<PurchaseOrdersPage />} />
            <Route path="reportes" element={<ReportsPage />} />
            <Route path="administracion" element={<AdminPage />} />
            <Route path="administracion/configuracion" element={<SystemSettingsPage />} />
            <Route path="ayuda" element={<HelpPage />} />
            <Route path="ayuda/sistema" element={<SystemInfoPage />} />
            <Route path="ayuda/soporte" element={<ContactSupportPage />} />
            <Route path="ayuda/faq" element={<FAQPage />} />
            <Route path="ayuda/tutoriales" element={<VideoTutorialsPage />} />
            <Route path="ayuda/guia" element={<UserGuidePage />} />
          </Route>

          {/* Ruta catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
