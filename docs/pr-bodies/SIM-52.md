### Qué se hizo

- Página `CategoriesPage` para gestión de categorías (CRUD mock):
  - Listado con nombre, descripción y cantidad de productos asociados
  - Crear/Editar mediante modal con validaciones
  - Eliminar con confirmación y validación: no permite eliminar si tiene productos
  - Búsqueda, paginación (10/20/50)
- Ruta agregada: `/productos/categorias` en `src/App.tsx`

### Archivos clave

- `src/pages/products/CategoriesPage.tsx`
- `src/App.tsx`

### Notas

- Implementación basada en mock (`mocks/data`). Lista para conectar a endpoints reales (`/api/categories`).

### Referencia

- Linear: SIM-52 [Productos] Gestión de Categorías - CRUD completo



