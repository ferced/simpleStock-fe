### Qué se hizo

- Componente `RegisterPaymentModal` para registrar pagos:
  - Monto con validación (<= saldo), método, referencia y notas
  - Resumen de total, pagado y saldo
- Integrado en `InvoiceDetailPage` con botón "Registrar Pago" (modal mock suma pago y recalcula saldo)

### Archivos clave

- `src/components/invoicing/RegisterPaymentModal.tsx`
- `src/pages/invoicing/InvoiceDetailPage.tsx`

### Notas

- Listo para conectar a `POST /api/invoices/:id/payments`.

### Referencia

- Linear: SIM-61 [Facturación] Sistema de Seguimiento de Pagos

