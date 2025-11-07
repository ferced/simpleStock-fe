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
      { label: 'Categorías', path: '/productos/categorias', enabled: false },
    ],
  },
  { label: 'Inventario', path: '/inventario', icon: 'Warehouse', enabled: true },
  { label: 'Facturación', path: '/facturacion', icon: 'ReceiptLong', enabled: true },
  { label: 'Clientes', path: '/clientes', icon: 'People', enabled: false },
  { label: 'Proveedores', path: '/proveedores', icon: 'LocalShipping', enabled: false },
  { label: 'Reportes', path: '/reportes', icon: 'Insights', enabled: false },
  { label: 'Administración', path: '/administracion', icon: 'Settings', enabled: false },
  { label: 'Ayuda', path: '/ayuda', icon: 'HelpCenter', enabled: false },
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


