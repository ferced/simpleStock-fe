### Qué se hizo

- Página `CreateInvoicePage` (wizard de 5 pasos) con mock y cálculos:
  1) Selección de cliente
  2) Agregar productos (cantidad, validación de stock, eliminación)
  3) Descuentos (total), cálculo: subtotal, descuento, impuestos, total
  4) Términos de pago + notas
  5) Vista previa de la factura
- Ruta agregada: `/facturacion/nueva` en `src/App.tsx`

### Archivos clave

- `src/pages/invoicing/CreateInvoicePage.tsx`
- `src/App.tsx`

### Notas

- Basado en mock (`mocks/data`) por ahora; listo para conectar a `/api/invoices`, `/api/clients`, `/api/products`.

### Referencia

- Linear: SIM-59 [Facturación] Crear Factura - Flujo completo



