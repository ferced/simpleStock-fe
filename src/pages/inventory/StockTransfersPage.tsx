import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HistoryIcon from '@mui/icons-material/History';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
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
  LinearProgress,
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
import dayjs from 'dayjs';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
}

interface StockTransfer {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

interface TransferFormData {
  productId: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof TransferFormData, string>>;

const locations = [
  'Depósito Central',
  'Sucursal 1',
  'Sucursal 2',
  'Sucursal 3',
  'Sucursal 4',
];

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_transit: 'En Tránsito',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'error'> = {
  pending: 'default',
  in_transit: 'primary',
  completed: 'success',
  cancelled: 'error',
};

const statusIcons: Record<string, any> = {
  pending: PendingIcon,
  in_transit: LocalShippingIcon,
  completed: CheckCircleIcon,
  cancelled: CancelIcon,
};

// Mock data
const mockProducts: Product[] = [
  { id: 'p1', name: 'Producto A', sku: 'SKU-001', stock: 50 },
  { id: 'p2', name: 'Producto B', sku: 'SKU-002', stock: 30 },
  { id: 'p3', name: 'Producto C', sku: 'SKU-003', stock: 15 },
  { id: 'p4', name: 'Producto D', sku: 'SKU-004', stock: 80 },
];

const mockTransfers: StockTransfer[] = [
  {
    id: 'T-001',
    productId: 'p1',
    productName: 'Producto A',
    quantity: 10,
    fromLocation: 'Depósito Central',
    toLocation: 'Sucursal 1',
    status: 'in_transit',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'T-002',
    productId: 'p2',
    productName: 'Producto B',
    quantity: 5,
    fromLocation: 'Sucursal 1',
    toLocation: 'Sucursal 2',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'T-003',
    productId: 'p3',
    productName: 'Producto C',
    quantity: 8,
    fromLocation: 'Depósito Central',
    toLocation: 'Sucursal 3',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const StockTransfersPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState<TransferFormData>({
    productId: '',
    quantity: 1,
    fromLocation: 'Depósito Central',
    toLocation: 'Sucursal 1',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // TODO: await apiClient.get('/products')
      // TODO: await apiClient.get('/stock-transfers')
      await new Promise(r => setTimeout(r, 500));
      setProducts(mockProducts);
      setTransfers(mockTransfers);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === form.productId);
  }, [products, form.productId]);

  const stats = useMemo(() => {
    const totalTransfers = transfers.length;
    const pendingCount = transfers.filter(t => t.status === 'pending').length;
    const inTransitCount = transfers.filter(t => t.status === 'in_transit').length;
    const completedCount = transfers.filter(t => t.status === 'completed').length;
    return { totalTransfers, pendingCount, inTransitCount, completedCount };
  }, [transfers]);

  const validate = (data: TransferFormData): FormErrors => {
    const next: FormErrors = {};
    if (!data.productId) next.productId = 'Producto requerido';
    if (data.quantity <= 0) next.quantity = 'La cantidad debe ser mayor a 0';
    if (!data.fromLocation) next.fromLocation = 'Ubicación origen requerida';
    if (!data.toLocation) next.toLocation = 'Ubicación destino requerida';
    if (data.fromLocation === data.toLocation) {
      next.toLocation = 'La ubicación destino debe ser diferente al origen';
    }
    if (selectedProduct && data.quantity > selectedProduct.stock) {
      next.quantity = `Stock insuficiente (disponible: ${selectedProduct.stock})`;
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
      // TODO: await apiClient.post('/stock-transfers', form)
      await new Promise(r => setTimeout(r, 750));

      const productName = selectedProduct?.name || 'Producto';
      setSuccessMessage(`✓ Transferencia creada: ${form.quantity} unidades de ${productName}`);
      setSuccessOpen(true);

      // Add to transfers list
      setTransfers([
        {
          id: `T-${String(transfers.length + 1).padStart(3, '0')}`,
          productId: form.productId,
          productName: productName,
          quantity: form.quantity,
          fromLocation: form.fromLocation,
          toLocation: form.toLocation,
          status: 'pending',
          notes: form.notes,
          createdAt: new Date().toISOString(),
        },
        ...transfers,
      ]);

      // Reset form
      setForm({
        productId: '',
        quantity: 1,
        fromLocation: 'Depósito Central',
        toLocation: 'Sucursal 1',
        notes: '',
      });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Sistema de Transferencias"
        subtitle="Gestioná el movimiento de productos entre ubicaciones"
        action={
          <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => navigate('/inventario')}>
            Ver Inventario
          </Button>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total Transferencias
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.totalTransfers}
                </Typography>
                <Chip label="Todas" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Pendientes
                </Typography>
                <Typography variant="h5" fontWeight={700} color="text.secondary">
                  {stats.pendingCount}
                </Typography>
                <Chip label="Por iniciar" size="small" color="default" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  En Tránsito
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {stats.inTransitCount}
                </Typography>
                <Chip label="En movimiento" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Completadas
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {stats.completedCount}
                </Typography>
                <Chip label="Finalizadas" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Formulario de Nueva Transferencia */}
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <SwapHorizIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Nueva Transferencia
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} (${option.sku}) - Stock: ${option.stock}`}
                value={selectedProduct || null}
                onChange={(_, newValue) => {
                  setForm({ ...form, productId: newValue?.id || '' });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Producto"
                    error={!!errors.productId}
                    helperText={errors.productId || 'Buscá y seleccioná el producto a transferir'}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Desde (Origen)"
                fullWidth
                value={form.fromLocation}
                onChange={(e) => setForm({ ...form, fromLocation: e.target.value })}
                error={!!errors.fromLocation}
                helperText={errors.fromLocation || 'Ubicación actual del producto'}
                required
              >
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Hacia (Destino)"
                fullWidth
                value={form.toLocation}
                onChange={(e) => setForm({ ...form, toLocation: e.target.value })}
                error={!!errors.toLocation}
                helperText={errors.toLocation || 'Ubicación destino del producto'}
                required
              >
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc} disabled={loc === form.fromLocation}>
                    {loc}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Cantidad"
                fullWidth
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                error={!!errors.quantity}
                helperText={errors.quantity || 'Unidades a transferir'}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notas"
                fullWidth
                multiline
                minRows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                helperText="Observaciones sobre la transferencia (opcional)"
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => {
                  setForm({
                    productId: '',
                    quantity: 1,
                    fromLocation: 'Depósito Central',
                    toLocation: 'Sucursal 1',
                    notes: '',
                  });
                  setErrors({});
                }}>
                  Limpiar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Crear Transferencia
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Historial de Transferencias */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={700}>
              Historial de Transferencias
            </Typography>
            <Divider />

            {isLoading ? (
              <LinearProgress />
            ) : transfers.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <SwapHorizIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No hay transferencias registradas
                </Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Origen</TableCell>
                    <TableCell>Destino</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha Creación</TableCell>
                    <TableCell>Completada</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transfers.map((transfer) => {
                    const StatusIcon = statusIcons[transfer.status];
                    return (
                      <TableRow key={transfer.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {transfer.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{transfer.productName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {transfer.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {transfer.fromLocation}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {transfer.toLocation}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            icon={<StatusIcon fontSize="small" />}
                            label={statusLabels[transfer.status]}
                            color={statusColors[transfer.status]}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {dayjs(transfer.createdAt).format('DD/MM/YYYY HH:mm')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {transfer.completedAt
                              ? dayjs(transfer.completedAt).format('DD/MM/YYYY HH:mm')
                              : '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar Transferencia</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <Typography variant="body2">
              ¿Confirmar la siguiente transferencia de stock?
            </Typography>
            <Box>
              <Typography variant="caption" color="text.secondary">Producto:</Typography>
              <Typography variant="body2" fontWeight={600}>{selectedProduct?.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Cantidad:</Typography>
              <Typography variant="body2" fontWeight={600}>{form.quantity} unidades</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Desde:</Typography>
              <Typography variant="body2" fontWeight={600}>{form.fromLocation}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Hacia:</Typography>
              <Typography variant="body2" fontWeight={600}>{form.toLocation}</Typography>
            </Box>
            {form.notes && (
              <Box>
                <Typography variant="caption" color="text.secondary">Notas:</Typography>
                <Typography variant="body2">{form.notes}</Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Confirmar'}
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

export default StockTransfersPage;
