import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
  InputAdornment,
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
import type { Product, SupplierSummary, StockMovement } from '../../types';
import dayjs from 'dayjs';

interface StockEntryFormData {
  productId: string;
  quantity: number;
  type: 'purchase' | 'adjustment' | 'return';
  cost?: number;
  supplierId?: string;
  location: string;
  notes?: string;
}

type FormErrors = Partial<Record<keyof StockEntryFormData, string>>;

const entryTypeLabels: Record<string, string> = {
  purchase: 'Compra',
  adjustment: 'Ajuste',
  return: 'Devolución',
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

const mockSuppliers: SupplierSummary[] = [
  { id: 'sup-1', name: 'Proveedor Alpha', contactEmail: 'alpha@test.com', phone: '555-0001' },
  { id: 'sup-2', name: 'Proveedor Beta', contactEmail: 'beta@test.com', phone: '555-0002' },
  { id: 'sup-3', name: 'Proveedor Gamma', contactEmail: 'gamma@test.com', phone: '555-0003' },
];

const mockHistory: StockMovement[] = [
  { id: 'm1', productId: 'p1', productName: 'Producto A', type: 'in', quantity: 50, destination: 'Depósito Central', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'm2', productId: 'p2', productName: 'Producto B', type: 'in', quantity: 30, destination: 'Sucursal 1', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
];

export const StockEntryPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  const [history, setHistory] = useState<StockMovement[]>([]);

  const [form, setForm] = useState<StockEntryFormData>({
    productId: '',
    quantity: 1,
    type: 'purchase',
    cost: undefined,
    supplierId: '',
    location: 'Depósito Central',
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
    setSuppliers(mockSuppliers);
    setHistory(mockHistory);
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === form.productId);
  }, [products, form.productId]);

  const selectedSupplier = useMemo(() => {
    return suppliers.find(s => s.id === form.supplierId);
  }, [suppliers, form.supplierId]);

  const validate = (data: StockEntryFormData): FormErrors => {
    const next: FormErrors = {};
    if (!data.productId) next.productId = 'Producto requerido';
    if (data.quantity <= 0) next.quantity = 'La cantidad debe ser mayor a 0';
    if (!data.location) next.location = 'Ubicación requerida';
    if (data.type === 'purchase' && !data.supplierId) next.supplierId = 'Proveedor requerido para compras';
    if (data.type === 'purchase' && !data.cost) next.cost = 'Costo requerido para compras';
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
      // TODO: await apiClient.post('/api/inventory/entry', form)
      await new Promise(r => setTimeout(r, 750));

      const productName = selectedProduct?.name || 'Producto';
      setSuccessMessage(`✓ Entrada registrada: +${form.quantity} unidades de ${productName}`);
      setSuccessOpen(true);

      // Reset form
      setForm({
        productId: '',
        quantity: 1,
        type: 'purchase',
        cost: undefined,
        supplierId: '',
        location: 'Depósito Central',
        notes: '',
      });
      setErrors({});

      // Refresh history (mock)
      setHistory([
        {
          id: `m${Date.now()}`,
          productId: form.productId,
          productName: productName,
          type: 'in',
          quantity: form.quantity,
          destination: form.location,
          createdAt: new Date().toISOString(),
        },
        ...history,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Registro de Entradas de Stock"
        subtitle="Registrá compras, ajustes y devoluciones de inventario"
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
                <AddCircleIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Nueva Entrada
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Tipo de Entrada"
                    fullWidth
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                  >
                    <MenuItem value="purchase">Compra</MenuItem>
                    <MenuItem value="adjustment">Ajuste de Inventario</MenuItem>
                    <MenuItem value="return">Devolución de Cliente</MenuItem>
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
                    helperText={errors.location || 'Depósito o sucursal destino'}
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
                    <Alert severity="info" icon={<TrendingUpIcon />}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedProduct.name}
                        </Typography>
                        <Typography variant="caption">
                          SKU: {selectedProduct.sku} • Stock actual: {selectedProduct.stock} unidades
                        </Typography>
                      </Stack>
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Cantidad"
                    fullWidth
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    error={!!errors.quantity}
                    helperText={errors.quantity || 'Cantidad a ingresar'}
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Costo Unitario"
                    fullWidth
                    type="number"
                    value={form.cost ?? ''}
                    onChange={(e) => setForm({ ...form, cost: e.target.value === '' ? undefined : Number(e.target.value) })}
                    error={!!errors.cost}
                    helperText={errors.cost || (form.type === 'purchase' ? 'Requerido para compras' : 'Opcional')}
                    required={form.type === 'purchase'}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                {form.type === 'purchase' && (
                  <Grid item xs={12}>
                    <Autocomplete
                      options={suppliers}
                      getOptionLabel={(option) => option.name}
                      value={selectedSupplier || null}
                      onChange={(_, newValue) => {
                        setForm({ ...form, supplierId: newValue?.id || '' });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Proveedor"
                          error={!!errors.supplierId}
                          helperText={errors.supplierId || 'Proveedor de la compra'}
                          required
                        />
                      )}
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
                      startIcon={<SaveIcon />}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      Registrar Entrada
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
                Últimas Entradas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay entradas registradas
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
                          <Chip label={`+${movement.quantity}`} size="small" color="success" />
                          <Typography variant="caption" color="text.secondary">
                            {movement.destination}
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
                Historial de Entradas
              </Typography>
              <Divider sx={{ mb: 3 }} />
              {history.length === 0 ? (
                <Stack alignItems="center" py={4}>
                  <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay entradas registradas
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
                          <Chip label={`+${movement.quantity}`} size="small" color="success" />
                        </TableCell>
                        <TableCell>{movement.destination}</TableCell>
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
        <DialogTitle>Confirmar Entrada de Stock</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <Typography variant="body2">
              ¿Confirmar la siguiente entrada de stock?
            </Typography>
            <Box>
              <Typography variant="caption" color="text.secondary">Tipo:</Typography>
              <Typography variant="body2" fontWeight={600}>{entryTypeLabels[form.type]}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Producto:</Typography>
              <Typography variant="body2" fontWeight={600}>{selectedProduct?.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Cantidad:</Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">+{form.quantity} unidades</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Ubicación:</Typography>
              <Typography variant="body2" fontWeight={600}>{form.location}</Typography>
            </Box>
            {form.cost && (
              <Box>
                <Typography variant="caption" color="text.secondary">Costo Total:</Typography>
                <Typography variant="body2" fontWeight={600}>${(form.cost * form.quantity).toLocaleString('es-AR')}</Typography>
              </Box>
            )}
            {selectedSupplier && (
              <Box>
                <Typography variant="caption" color="text.secondary">Proveedor:</Typography>
                <Typography variant="body2" fontWeight={600}>{selectedSupplier.name}</Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} variant="contained" disabled={isSubmitting}>
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

export default StockEntryPage;
