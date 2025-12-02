### Qué se hizo

- Página `ProductDetailPage` con información general, proveedores e historial de stock.
- Indicador de stock bajo (si `stock < minimumStock`).
- Resumen de historial de precios.
- Botones para navegar a editar y volver a la lista.
- Mock de datos hasta conectar API real.

### Rutas

- Añadida ruta protegida: `/productos/:id` en `src/App.tsx`.

### Archivos clave

- `src/pages/products/ProductDetailPage.tsx`
- `src/App.tsx`

### Notas

- Sin dependencias nuevas.
- Preparado para integrar endpoints: `/api/products/:id`, `/api/products/:id/history`, `/api/products/:id/prices`.

### Referencia

- Linear: SIM-51 [Productos] Crear página de Detalle de Producto



