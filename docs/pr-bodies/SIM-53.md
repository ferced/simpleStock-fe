### Qué se hizo

- Mejoras en `ProductListPage`:
  - Paginación (10/20/50) con controles Anterior/Siguiente
  - Filtros: búsqueda, categoría, rango de precios, sólo stock bajo
  - Orden: nombre, precio, stock, fecha (asc/desc)
  - Vista conmutables: tabla / grid
  - Exportación a CSV
  - Acciones rápidas por ítem: editar / eliminar (con confirmación)
  - Click en fila/navegación: a detalle (`/productos/:id`)
  - Botón “Crear producto” → `/productos/nuevo`

### Archivos clave

- `src/pages/products/ProductListPage.tsx`

### Notas

- Implementación basada en mock API local. Lista para adaptar a endpoints reales.

### Referencia

- Linear: SIM-53 [Productos] Mejorar ProductListPage



