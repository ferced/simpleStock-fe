import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { InvoiceDetail, Payment } from '../../types';
import { RegisterPaymentModal } from '../../components/invoicing/RegisterPaymentModal';

const buildMockDetail = (id: string): InvoiceDetail => ({
  id,
  clientId: 'cli-1',
  clientName: 'Cliente Demo',
  clientEmail: 'demo@cliente.test',
  status: 'draft',
  total: 12100,
  dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
  createdAt: new Date().toISOString(),
  items: [
    { productId: 'p-1', quantity: 2, price: 5000 },
    { productId: 'p-2', quantity: 1, price: 1000 },
  ],
  subtotal: 11000,
  taxAmount: 1100,
  discount: 0,
  itemsDetail: [
    { productId: 'p-1', productName: 'Producto A', quantity: 2, price: 5000, subtotal: 10000, taxAmount: 1000 },
    { productId: 'p-2', productName: 'Producto B', quantity: 1, price: 1000, subtotal: 1000, taxAmount: 100 },
  ],
  payments: [
    { id: 'pay-1', invoiceId: id, amount: 5000, method: 'transfer', createdAt: new Date().toISOString() },
  ],
});

export const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<InvoiceDetail | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setTimeout(() => setData(buildMockDetail(id)), 200);
  }, [id]);

  const paidAmount = useMemo(() => (data ? data.payments.reduce((a, p) => a + p.amount, 0) : 0), [data]);
  const balance = useMemo(() => (data ? Math.max(0, data.total - paidAmount) : 0), [data, paidAmount]);

  const statusColor = (status: InvoiceDetail['status']) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'sent':
        return 'warning';
      case 'paid':
        return 'success';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  if (!data) {
    return (
      <Box p={3}><Typography>Cargando…</Typography></Box>
    );
  }

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h5">Factura #{data.id}</Typography>
          <Chip size="small" label={data.status} color={statusColor(data.status) as any} />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => window.print()}>Imprimir</Button>
          <Button variant="outlined">Exportar PDF</Button>
          <Button variant="outlined">Enviar</Button>
          <Button variant="contained" disabled={balance === 0} onClick={() => setPaymentOpen(true)}>Registrar Pago</Button>
          {data.status === 'draft' && <Button onClick={() => navigate(`/facturacion/${data.id}/editar`)}>Editar</Button>}
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Cliente" />
            <Divider />
            <CardContent>
              <Typography variant="body2">Nombre: {data.clientName}</Typography>
              <Typography variant="body2">Email: {data.clientEmail}</Typography>
              <Typography variant="body2">Vencimiento: {new Date(data.dueDate).toLocaleDateString()}</Typography>
              <Typography variant="body2">Creada: {new Date(data.createdAt).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Totales" />
            <Divider />
            <CardContent>
              <Stack spacing={0.5}>
                <Typography variant="body2">Subtotal: ${data.subtotal.toLocaleString('es-AR')}</Typography>
                <Typography variant="body2">Descuento: ${data.discount.toLocaleString('es-AR')}</Typography>
                <Typography variant="body2">Impuestos: ${data.taxAmount.toLocaleString('es-AR')}</Typography>
                <Typography variant="h6">Total: ${data.total.toLocaleString('es-AR')}</Typography>
                <Typography variant="body2">Pagado: ${paidAmount.toLocaleString('es-AR')}</Typography>
                <Typography variant="body2">Saldo: ${balance.toLocaleString('es-AR')}</Typography>
                {balance === 0 && <Alert severity="success">Factura pagada</Alert>}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Items" />
            <Divider />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="right">Impuestos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.itemsDetail.map((it) => (
                    <TableRow key={it.productId}>
                      <TableCell>{it.productName}</TableCell>
                      <TableCell align="right">${it.price.toLocaleString('es-AR')}</TableCell>
                      <TableCell align="right">{it.quantity}</TableCell>
                      <TableCell align="right">${it.subtotal.toLocaleString('es-AR')}</TableCell>
                      <TableCell align="right">${it.taxAmount.toLocaleString('es-AR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Pagos" />
            <Divider />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell align="right">Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.payments.length === 0 ? (
                    <TableRow><TableCell colSpan={3}>Sin pagos</TableCell></TableRow>
                  ) : (
                    data.payments.map((p: Payment) => (
                      <TableRow key={p.id}>
                        <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{p.method}</TableCell>
                        <TableCell align="right">${p.amount.toLocaleString('es-AR')}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <RegisterPaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        invoiceTotal={data.total}
        paidAmount={paidAmount}
        onConfirm={(p) => {
          // mock append payment
          setData((prev) => prev ? { ...prev, payments: [...prev.payments, { id: `pay-${Date.now()}`, invoiceId: prev.id, amount: p.amount, method: p.method, reference: p.reference, createdAt: new Date().toISOString() }] } : prev);
          setPaymentOpen(false);
        }}
      />
    </Box>
  );
};

export default InvoiceDetailPage;

