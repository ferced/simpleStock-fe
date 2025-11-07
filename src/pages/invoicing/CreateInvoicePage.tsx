import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { clients, products } from '../../mocks/data';
import type { Client, InvoiceFormData, InvoiceItem, Product } from '../../types';

type StepKey = 0 | 1 | 2 | 3 | 4;

export const CreateInvoicePage = () => {
  const [activeStep, setActiveStep] = useState<StepKey>(0);
  const [toastOpen, setToastOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [items, setItems] = useState<(InvoiceItem & { name?: string; stock?: number })[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<InvoiceFormData['paymentTerms']>('cash');
  const [totalDiscount, setTotalDiscount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const addProduct = (p: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === p.id);
      if (existing) {
        return prev.map((i) => (i.productId === p.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { productId: p.id, quantity: 1, price: p.price, name: p.name, stock: p.stock }];
    });
  };

  const setItemQuantity = (productId: string, q: number) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, q) } : i)));
  };

  const removeItem = (productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId));

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const discount = Number(totalDiscount || 0);
    const taxRate = 0.21; // simple 21% demo
    const taxable = Math.max(0, subtotal - discount);
    const taxAmount = taxable * taxRate;
    const total = taxable + taxAmount;
    return { subtotal, discount, taxAmount, total };
  }, [items, totalDiscount]);

  const canNext = useMemo(() => {
    if (activeStep === 0) return !!selectedClient;
    if (activeStep === 1) return items.length > 0 && items.every((i) => i.quantity <= (i.stock ?? Infinity));
    if (activeStep === 2) return true;
    if (activeStep === 3) return true;
    return true;
  }, [activeStep, selectedClient, items]);

  const next = () => setActiveStep((s) => (s < 4 ? ((s + 1) as StepKey) : s));
  const back = () => setActiveStep((s) => (s > 0 ? ((s - 1) as StepKey) : s));

  const submit = async () => {
    // TODO: await apiClient.post('/invoices', { clientId, items, paymentTerms, totalDiscount, notes })
    await new Promise((r) => setTimeout(r, 700));
    setToastOpen(true);
    // In real impl, navigate to detalle de factura
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Crear Factura</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={back} disabled={activeStep === 0}>Atrás</Button>
          {activeStep < 4 ? (
            <Button variant="contained" onClick={next} disabled={!canNext}>Siguiente</Button>
          ) : (
            <Button variant="contained" onClick={submit}>Generar Factura</Button>
          )}
        </Stack>
      </Stack>

      <Card>
        <CardHeader title="Asistente" />
        <Divider />
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            <Step><StepLabel>Cliente</StepLabel></Step>
            <Step><StepLabel>Productos</StepLabel></Step>
            <Step><StepLabel>Descuentos</StepLabel></Step>
            <Step><StepLabel>Términos</StepLabel></Step>
            <Step><StepLabel>Vista Previa</StepLabel></Step>
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Seleccionar cliente"
                  value={selectedClient?.id || ''}
                  onChange={(e) => setSelectedClient(clients.find((c) => c.id === e.target.value) || null)}
                >
                  <option value="">—</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Agregar producto"
                  value=""
                  onChange={(e) => {
                    const p = products.find((x) => x.id === e.target.value);
                    if (p) addProduct(p);
                  }}
                >
                  <option value="">—</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((i) => (
                      <TableRow key={i.productId}>
                        <TableCell>{i.name}</TableCell>
                        <TableCell align="right">${i.price.toLocaleString('es-AR')}</TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            size="small"
                            value={i.quantity}
                            onChange={(e) => setItemQuantity(i.productId, Number(e.target.value))}
                            inputProps={{ min: 1, max: i.stock ?? undefined, style: { width: 72 } }}
                            error={i.quantity > (i.stock ?? Infinity)}
                            helperText={i.quantity > (i.stock ?? Infinity) ? 'Sin stock' : ''}
                          />
                        </TableCell>
                        <TableCell align="right">${(i.price * i.quantity).toLocaleString('es-AR')}</TableCell>
                        <TableCell align="right">
                          <Button color="error" onClick={() => removeItem(i.productId)}>Eliminar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {items.length === 0 && (
                      <TableRow><TableCell colSpan={5} align="center">Sin productos</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField label="Descuento total" type="number" fullWidth value={totalDiscount} onChange={(e) => setTotalDiscount(e.target.value === '' ? '' : Number(e.target.value))} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">Subtotal: ${totals.subtotal.toLocaleString('es-AR')}</Typography>
                <Typography variant="body2">Descuento: ${totals.discount.toLocaleString('es-AR')}</Typography>
                <Typography variant="body2">Impuestos (21%): ${totals.taxAmount.toLocaleString('es-AR')}</Typography>
                <Typography fontWeight={600}>Total: ${totals.total.toLocaleString('es-AR')}</Typography>
              </Grid>
            </Grid>
          )}

          {activeStep === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField select fullWidth label="Términos de pago" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value as any)}>
                  <option value="cash">Contado</option>
                  <option value="30days">30 días</option>
                  <option value="60days">60 días</option>
                  <option value="90days">90 días</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Notas" fullWidth multiline minRows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </Grid>
            </Grid>
          )}

          {activeStep === 4 && (
            <Stack spacing={1}>
              <Typography variant="subtitle1">Resumen</Typography>
              <Typography variant="body2">Cliente: {selectedClient ? `${selectedClient.name} — ${selectedClient.email}` : '-'}</Typography>
              <Typography variant="body2">Items: {items.length}</Typography>
              <Typography variant="body2">Términos: {paymentTerms}</Typography>
              <Typography fontWeight={600}>Total: ${totals.total.toLocaleString('es-AR')}</Typography>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Snackbar open={toastOpen} autoHideDuration={2500} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>Factura creada correctamente</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateInvoicePage;

