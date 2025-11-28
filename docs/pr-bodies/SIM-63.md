### Qué se hizo

- Mejoras en `ClientListPage`:
  - Paginación (10/20/50) con controles Anterior/Siguiente
  - Búsqueda por nombre/email/empresa
  - Filtro: sólo clientes con saldo > 0
  - Orden por nombre, saldo y facturas activas (asc/desc)
  - Exportación a CSV
  - Acciones por cliente: Editar, Crear factura
  - Click en fila → detalle del cliente
  - Botón “Nuevo cliente” → `/clientes/nuevo`

### Archivos clave

- `src/pages/clients/ClientListPage.tsx`

### Referencia

- Linear: SIM-63 [Clientes] Mejorar lista de clientes



