import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import HistoryIcon from '@mui/icons-material/History';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import type { Product, StockMovement } from '../../types';
import dayjs from 'dayjs';

interface StockExitFormData {
  productId: string;
  quantity: number;
  type: 'sale' | 'adjustment' | 'loss' | 'damage';
  location: string;
  reason?: string;
  notes?: string;
}

type FormErrors = Partial<Record<keyof StockExitFormData, string>>;

const exitTypeLabels: Record<string, string> = {
  sale: 'Venta',
  adjustment: 'Ajuste',
  loss: 'Pérdida',
  damage: 'Rotura/Daño',
};

const locations = [
  'Depósito Central',
  'Sucursal 1',
  'Sucursal 2',
  'Sucursal 3',
];

// Mock data
const mockProducts: Product[] = [
  { id: 'p1', name: 'Producto A', sku: 'SKU-001', categoryId: 'cat-1', price: 1500, taxRate: 21, stock: 50, suppliers: [], updatedAt: new Date().toISOString() },
  { id: 'p2', name: 'Producto B', sku: 'SKU-002', categoryId: 'cat-1', price: 2500, taxRate: 21, stock: 30, suppliers: [], updatedAt: new Date().toISOString() },
  { id: 'p3', name: 'Producto C', sku: 'SKU-003', categoryId: 'cat-2', price: 3500, taxRate: 21, stock: 15, suppliers: [], updatedAt: new Date().toISOString() },
];

const mockHistory: StockMovement[] = [
  { id: 'm1', productId: 'p1', productName: 'Producto A', type: 'out', quantity: 10, source: 'Depósito Central', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'm2', productId: 'p2', productName: 'Producto B', type: 'out', quantity: 5, source: 'Sucursal 1', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
];

export const StockExitPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<StockMovement[]>([]);

  const [form, setForm] = useState<StockExitFormData>({
    productId: '',
    quantity: 1,
    type: 'sale',
    location: 'Depósito Central',
    reason: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Simulated fetch
    setProducts(mockProducts);
    setHistory(mockHistory);
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === form.productId);
  }, [products, form.productId]);

  const validate = (data: StockExitFormData): FormErrors => {
    const next: FormErrors = {};
    if (!data.productId) next.productId = 'Producto requerido';
    if (data.quantity <= 0) next.quantity = 'La cantidad debe ser mayor a 0';
    if (!data.location) next.location = 'Ubicación requerida';

    // Check if there's enough stock
    if (selectedProduct && data.quantity > selectedProduct.stock) {
      next.quantity = `Stock insuficiente (disponible: ${selectedProduct.stock})`;
    }

    if ((data.type === 'loss' || data.type === 'damage') && !data.reason?.trim()) {
      next.reason = 'Motivo requerido para pérdidas y daños';
    }

    return next;
  };

  const handleSubmit = () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setIsSubmitting(true);
    try {
      // TODO: await apiClient.post('/api/inventory/exit', form)
      await new Promise(r => setTimeout(r, 750));

      const productName = selectedProduct?.name || 'Producto';
      setSuccessMessage(`✓ Salida registrada: -${form.quantity} unidades de ${productName}`);
      setSuccessOpen(true);

      // Reset form
      setForm({
        productId: '',
        quantity: 1,
        type: 'sale',
        location: 'Depósito Central',
        reason: '',
        notes: '',
      });
      setErrors({});

      // Refresh history (mock)
      setHistory([
        {
          id: `m${Date.now()}`,
          productId: form.productId,
          productName: productName,
          type: 'out',
          quantity: form.quantity,
          source: form.location,
          createdAt: new Date().toISOString(),
        },
        ...history,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stockWarning = useMemo(() => {
    if (!selectedProduct || form.quantity === 0) return null;
    const remainingStock = selectedProduct.stock - form.quantity;
    if (remainingStock < 0) {
      return { severity: 'error' as const, message: 'Stock insuficiente' };
    }
    if (remainingStock === 0) {
      return { severity: 'warning' as const, message: 'Esta salida dejará el stock en 0' };
    }
    if (remainingStock < 10) {
      return { severity: 'warning' as const, message: `Stock bajo después de esta salida: ${remainingStock} unidades` };
    }
    return null;
  }, [selectedProduct, form.quantity]);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Registro de Salidas de Stock"
        subtitle="Registrá ventas, ajustes, pérdidas y roturas de inventario"
        action={
          <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => navigate('/inventario')}>
            Ver Inventario
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <RemoveCircleIcon color="error" />
                <Typography variant="h6" fontWeight={700}>
                  Nueva Salida
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Tipo de Salida"
                    fullWidth
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  >
                    <MenuItem value="sale">Venta</MenuItem>
                    <MenuItem value="adjustment">Ajuste de Inventario</MenuItem>
                    <MenuItem value="loss">Pérdida</MenuItem>
                    <MenuItem value="damage">Rotura o Daño</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Ubicación"
                    fullWidth
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    error={!!errors.location}
                    helperText={errors.location || 'Depósito o sucursal origen'}
                    required
                  >
                    {locations.map((loc) => (
                      <MenuItem key={loc} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => `${option.name} (${option.sku})`}
                    value={selectedProduct || null}
                    onChange={(_, newValue) => {
                      setForm({ ...form, productId: newValue?.id || '' });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Producto"
                        error={!!errors.productId}
                        helperText={errors.productId || 'Buscá y seleccioná el producto'}
                        required
                      />
                    )}
                  />
                </Grid>

                {selectedProduct && (
                  <Grid item xs={12}>
                    <Alert severity="info" icon={<TrendingDownIcon />}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedProduct.name}
                        </Typography>
                        <Typography variant="caption">
                          SKU: {selectedProduct.sku} • Stock disponible: {selectedProduct.stock} unidades
                        </Typography>
                      </Stack>
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    label="Cantidad"
                    fullWidth
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    error={!!errors.quantity}
                    helperText={errors.quantity || 'Cantidad a retirar'}
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                {stockWarning && (
                  <Grid item xs={12}>
                    <Alert severity={stockWarning.severity} icon={<WarningIcon />}>
                      {stockWarning.message}
                    </Alert>
                  </Grid>
                )}

                {(form.type === 'loss' || form.type === 'damage') && (
                  <Grid item xs={12}>
                    <TextField
                      label="Motivo"
                      fullWidth
                      value={form.reason || ''}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      error={!!errors.reason}
                      helperText={errors.reason || 'Explicá el motivo de la pérdida o daño'}
                      required
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    label="Notas"
                    fullWidth
                    multiline
                    minRows={3}
                    value={form.notes || ''}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    helperText="Observaciones adicionales (opcional)"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => navigate('/inventario')}>
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<SaveIcon />}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      Registrar Salida
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Últimas Salidas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay salidas registradas
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {history.slice(0, 5).map((movement) => (
                    <Box key={movement.id}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={600}>
                          {movement.productName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={`-${movement.quantity}`} size="small" color="error" />
                          <Typography variant="caption" color="text.secondary">
                            {movement.source}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.disabled">
                          {dayjs(movement.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Typography>
                      </Stack>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Historial de Salidas
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {history.length === 0 ? (
                <Stack alignItems="center" py={4}>
                  <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay salidas registradas
                  </Typography>
                </Stack>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell>Ubicación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>{dayjs(movement.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {movement.productName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={`-${movement.quantity}`} size="small" color="error" />
                        </TableCell>
                        <TableCell>{movement.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Salida de Stock</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <Typography variant="body2">
              ¿Confirmar la siguiente salida de stock?
            </Typography>
            <Box>
              <Typography variant="caption" color="text.secondary">Tipo:</Typography>
              <Typography variant="body2" fontWeight={600}>{exitTypeLabels[form.type]}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Producto:</Typography>
              <Typography variant="body2" fontWeight={600}>{selectedProduct?.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Cantidad:</Typography>
              <Typography variant="body2" fontWeight={600} color="error.main">-{form.quantity} unidades</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Ubicación:</Typography>
              <Typography variant="body2" fontWeight={600}>{form.location}</Typography>
            </Box>
            {selectedProduct && (
              <Box>
                <Typography variant="caption" color="text.secondary">Stock resultante:</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedProduct.stock - form.quantity} unidades
                </Typography>
              </Box>
            )}
            {form.reason && (
              <Box>
                <Typography variant="caption" color="text.secondary">Motivo:</Typography>
                <Typography variant="body2" fontWeight={600}>{form.reason}</Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} variant="contained" color="error" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default StockExitPage;
