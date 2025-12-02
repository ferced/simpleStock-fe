### Qué se hizo

- Página `ClientStatementPage` (Estado de Cuenta) con:
  - Resumen: total facturado y saldo pendiente
  - Antigüedad de deuda: 0-30 / 31-60 / 61-90 / >90 días
  - Tabla de facturas pendientes (fecha, vencimiento, estado, monto, saldo)
  - Exportar a PDF (mock) y Enviar por email (mock)
- Ruta agregada: `/clientes/:id/estado` en `src/App.tsx`

### Archivos clave

- `src/pages/clients/ClientStatementPage.tsx`
- `src/App.tsx`

### Referencia

- Linear: SIM-66 [Clientes] Estado de Cuenta




