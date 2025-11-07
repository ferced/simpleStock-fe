### Qué se hizo

- Página `InvoiceDetailPage` completa (mock):
  - Info de cliente y metadatos (creación, vencimiento)
  - Tabla de items con subtotales e impuestos
  - Totales: subtotal, descuento, impuestos, total
  - Estado de factura (badge), saldo y monto pagado
  - Historial de pagos
  - Acciones: Enviar, Imprimir, Exportar PDF, Registrar Pago
  - Botón Editar si estado = draft
- Ruta agregada: `/facturacion/:id` en `src/App.tsx`

### Archivos clave

- `src/pages/invoicing/InvoiceDetailPage.tsx`
- `src/App.tsx`

### Notas

- Basado en mock por ahora; listo para conectar a `/api/invoices/:id` y `/api/invoices/:id/payments`.

### Referencia

- Linear: SIM-60 [Facturación] Detalle de Factura completo

