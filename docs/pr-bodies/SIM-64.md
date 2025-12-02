### Qué se hizo

- Páginas de Clientes para crear y editar (mock):
  - `CreateClientPage` con formulario en tabs: Básico | Empresa | Crédito
  - `EditClientPage` con prellenado mock y mismas secciones
  - Validaciones: nombre/email requeridos, formato email, CUIT/RUT básico, crédito no negativo
  - Mensajes de éxito y redirección a `/clientes`
- Rutas agregadas en `src/App.tsx`:
  - `/clientes/nuevo`
  - `/clientes/:id/editar`

### Archivos clave

- `src/pages/clients/CreateClientPage.tsx`
- `src/pages/clients/EditClientPage.tsx`
- `src/App.tsx`

### Notas

- Basado en mock por ahora; listo para conectar a `/api/clients` (POST/PUT).

### Referencia

- Linear: SIM-64 [Clientes] Crear/Editar Cliente - Formulario completo




