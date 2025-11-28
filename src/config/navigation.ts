import { NavItem } from '../types';

export interface NavItemConfig extends NavItem {
  enabled?: boolean;
  children?: NavItemConfig[];
}

export const NAV_CONFIG: NavItemConfig[] = [
  { label: 'Dashboard', path: '/', icon: 'Dashboard', enabled: true },
  {
    label: 'Productos',
    path: '/productos',
    icon: 'Inventory',
    enabled: true,
    children: [
      { label: 'Listado', path: '/productos', enabled: true },
      { label: 'Categorías', path: '/productos/categorias', enabled: true },
    ],
  },
  {
    label: 'Inventario',
    path: '/inventario',
    icon: 'Warehouse',
    enabled: true,
    children: [
      { label: 'Vista General', path: '/inventario', enabled: true },
      { label: 'Entradas', path: '/inventario/entradas', enabled: true },
      { label: 'Salidas', path: '/inventario/salidas', enabled: true },
      { label: 'Transferencias', path: '/inventario/transferencias', enabled: true },
      { label: 'Conteo Físico', path: '/inventario/conteo', enabled: true },
      { label: 'Conteo Cíclico', path: '/inventario/conteo-ciclico', enabled: true },
    ],
  },
  {
    label: 'Facturación',
    path: '/facturacion',
    icon: 'ReceiptLong',
    enabled: true,
    children: [
      { label: 'Facturas', path: '/facturacion', enabled: true },
      { label: 'Notas de Crédito', path: '/facturacion/notas-credito', enabled: true },
      { label: 'Seguimiento de Pagos', path: '/facturacion/pagos', enabled: true },
    ],
  },
  { label: 'Clientes', path: '/clientes', icon: 'People', enabled: true },
  {
    label: 'Proveedores',
    path: '/proveedores',
    icon: 'LocalShipping',
    enabled: true,
    children: [
      { label: 'Listado', path: '/proveedores', enabled: true },
      { label: 'Órdenes de Compra', path: '/proveedores/ordenes', enabled: true },
    ],
  },
  {
    label: 'Reportes',
    path: '/reportes',
    icon: 'Insights',
    enabled: true,
    children: [
      { label: 'Dashboard', path: '/reportes', enabled: true },
      { label: 'Ventas', path: '/reportes/ventas', enabled: true },
      { label: 'Inventario', path: '/reportes/inventario', enabled: true },
      { label: 'Financieros', path: '/reportes/financieros', enabled: true },
      { label: 'Analíticas', path: '/reportes/analiticas', enabled: true },
    ],
  },
  {
    label: 'Administración',
    path: '/administracion',
    icon: 'Settings',
    enabled: true,
    children: [
      { label: 'General', path: '/administracion', enabled: true },
      { label: 'Usuarios', path: '/administracion/usuarios', enabled: true },
      { label: 'Roles y Permisos', path: '/administracion/roles', enabled: true },
      { label: 'Configuración', path: '/administracion/configuracion', enabled: true },
      { label: 'Respaldos', path: '/administracion/respaldos', enabled: true },
      { label: 'Auditoría', path: '/administracion/auditoria', enabled: true },
    ],
  },
  {
    label: 'Ayuda',
    path: '/ayuda',
    icon: 'HelpCenter',
    enabled: true,
    children: [
      { label: 'Centro de Ayuda', path: '/ayuda', enabled: true },
      { label: 'Guía de Usuario', path: '/ayuda/guia', enabled: true },
      { label: 'Video Tutoriales', path: '/ayuda/tutoriales', enabled: true },
      { label: 'FAQ', path: '/ayuda/faq', enabled: true },
      { label: 'Información del Sistema', path: '/ayuda/sistema', enabled: true },
      { label: 'Contactar Soporte', path: '/ayuda/soporte', enabled: true },
    ],
  },
];

export function getEnabledNavigation(): NavItem[] {
  const filterEnabled = (items: NavItemConfig[] | undefined): NavItem[] =>
    (items || [])
      .filter((i) => i.enabled !== false)
      .map(({ enabled: _enabled, children, ...rest }) => ({
        ...rest,
        children: children ? filterEnabled(children) : undefined,
      }));

  return filterEnabled(NAV_CONFIG);
}


