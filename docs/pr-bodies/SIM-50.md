### Qué se hizo

- Implementada `EditProductPage` con formulario prellenado y SKU en solo lectura.
- Validaciones básicas: campos requeridos, `salePrice >= costPrice`, `initialStock >= 0`.
- Resumen de historial de precios y acción de "Ajustar Stock" con confirmación.
- Mock de categorías, proveedores y datos del producto hasta conectar API real.

### Rutas

- Añadida ruta protegida: `/productos/:id/editar` en `src/App.tsx`.

### Archivos clave

- `src/pages/products/EditProductPage.tsx`
- `src/App.tsx`

### Notas

- Sin dependencias nuevas.
- Preparado para integrar endpoints: `GET /api/products/:id` y `PUT /api/products/:id`.

### Referencia

- Linear: SIM-50 [Productos] Crear página de Editar Producto




