import { NavItem } from '../types';

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: 'Dashboard' },
  {
    label: 'Productos',
    path: '/productos',
    icon: 'Inventory',
    children: [
      { label: 'Listado', path: '/productos' },
      { label: 'Categorías', path: '/productos/categorias' },
    ],
  },
  {
    label: 'Inventario',
    path: '/inventario',
    icon: 'Warehouse',
  },
  {
    label: 'Facturación',
    path: '/facturacion',
    icon: 'ReceiptLong',
  },
  // PANTALLAS OCULTAS TEMPORALMENTE PARA LA REUNIÓN
  // Descomentar después de la reunión con el cliente
  // {
  //   label: 'Clientes',
  //   path: '/clientes',
  //   icon: 'People',
  // },
  // {
  //   label: 'Proveedores',
  //   path: '/proveedores',
  //   icon: 'LocalShipping',
  // },
  // {
  //   label: 'Reportes',
  //   path: '/reportes',
  //   icon: 'Insights',
  // },
  // {
  //   label: 'Administración',
  //   path: '/administracion',
  //   icon: 'Settings',
  // },
  // {
  //   label: 'Ayuda',
  //   path: '/ayuda',
  //   icon: 'HelpCenter',
  // },
];
