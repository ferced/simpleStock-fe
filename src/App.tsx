import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { MainDashboard } from './pages/dashboard/MainDashboard';
import { ProductListPage } from './pages/products/ProductListPage';
import { InventoryOverviewPage } from './pages/inventory/InventoryOverviewPage';
import { InvoiceListPage } from './pages/invoicing/InvoiceListPage';
import { ClientListPage } from './pages/clients/ClientListPage';
import { SupplierListPage } from './pages/suppliers/SupplierListPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { AdminPage } from './pages/admin/AdminPage';
import { HelpPage } from './pages/help/HelpPage';
import theme from './theme';

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/auth">
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="registro" element={<RegisterPage />} />
          <Route path="recuperar" element={<ForgotPasswordPage />} />
          <Route path="restablecer" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<MainDashboard />} />
          <Route path="productos" element={<ProductListPage />} />
          <Route path="inventario" element={<InventoryOverviewPage />} />
          <Route path="facturacion" element={<InvoiceListPage />} />
          <Route path="clientes" element={<ClientListPage />} />
          <Route path="proveedores" element={<SupplierListPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="administracion" element={<AdminPage />} />
          <Route path="ayuda" element={<HelpPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
