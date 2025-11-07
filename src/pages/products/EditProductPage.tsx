import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ProductDetail, ProductFormData, ProductCategory, SupplierSummary } from '../../types';

const currencyAdornment = <InputAdornment position="start">$</InputAdornment>;
const percentAdornment = <InputAdornment position="end">%</InputAdornment>;

const buildMockDetail = (id: string): ProductDetail => ({
  id,
  name: 'Producto de prueba',
  sku: 'TEST-001',
  categoryId: 'cat-1',
  price: 1200,
  taxRate: 21,
  stock: 35,
  suppliers: [
    { id: 'sup-1', name: 'Acme Corp', contactEmail: 'ventas@acme.test', phone: '555-0001' },
  ],
  updatedAt: new Date().toISOString(),
  description: 'Descripción del producto de prueba',
  costPrice: 800,
  wholesalePrice: 1000,
  minimumStock: 5,
  maximumStock: 200,
  imageUrls: [],
  barcode: '1234567890123',
  internalCode: 'INT-001',
  category: { id: 'cat-1', name: 'Electrónica' },
  stockHistory: [],
  priceHistory: new Array(6).fill(0).map((_, i) => ({
    id: `p-${i}`,
    productId: id,
    previousPrice: 900 + i * 50,
    newPrice: 950 + i * 50,
    changedBy: 'admin',
    createdAt: new Date(Date.now() - i * 604800000).toISOString(),
  })),
  createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
});

export const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);

  const [initialDetail, setInitialDetail] = useState<ProductDetail | null>(null);
  const [form, setForm] = useState<ProductFormData | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);

  useEffect(() => {
    const mockCategories: ProductCategory[] = [
      { id: 'cat-1', name: 'Electrónica', description: 'Dispositivos y accesorios' },
      { id: 'cat-2', name: 'Hogar', description: 'Artículos para el hogar' },
      { id: 'cat-3', name: 'Oficina', description: 'Suministros de oficina' },
    ];
    const mockSuppliers: SupplierSummary[] = [
      { id: 'sup-1', name: 'Acme Corp', contactEmail: 'ventas@acme.test', phone: '555-0001' },
      { id: 'sup-2', name: 'Globex', contactEmail: 'info@globex.test', phone: '555-0002' },
    ];
    setCategories(mockCategories);
    setSuppliers(mockSuppliers);
  }, []);

  useEffect(() => {
    if (!id) return;
    const detail = buildMockDetail(id);
    setInitialDetail(detail);
    setForm({
      name: detail.name,
      sku: detail.sku,
      categoryId: detail.categoryId,
      description: detail.description,
      costPrice: detail.costPrice,
      salePrice: detail.price,
      wholesalePrice: detail.wholesalePrice,
      taxRate: detail.taxRate,
      initialStock: detail.stock,
      minimumStock: detail.minimumStock,
      maximumStock: detail.maximumStock,
      supplierIds: detail.suppliers.map((s) => s.id),
      imageUrls: detail.imageUrls,
      barcode: detail.barcode,
      internalCode: detail.internalCode,
    });
  }, [id]);

  const handleChange = <K extends keyof ProductFormData>(key: K) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: ['costPrice', 'salePrice', 'wholesalePrice', 'taxRate', 'initialStock', 'minimumStock', 'maximumStock'].includes(key as string)
          ? (value === '' ? ('' as any) : Number(value))
          : (value as any),
      };
    });
  };

  const validate = (data: ProductFormData) => {
    const next: Partial<Record<keyof ProductFormData, string>> = {};
    if (!data.name?.trim()) next.name = 'Nombre requerido';
    if (!data.categoryId) next.categoryId = 'Categoría requerida';
    if (data.costPrice == null || data.costPrice < 0) next.costPrice = 'Costo inválido';
    if (data.salePrice == null || data.salePrice < 0) next.salePrice = 'Precio inválido';
    if (data.salePrice < data.costPrice) next.salePrice = 'El precio de venta debe ser >= costo';
    if (data.initialStock == null || data.initialStock < 0) next.initialStock = 'Stock inicial inválido';
    if (data.minimumStock == null || data.minimumStock < 0) next.minimumStock = 'Stock mínimo inválido';
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      // TODO: await apiClient.put(`/products/${id}`, form)
      await new Promise((r) => setTimeout(r, 700));
      setSuccessOpen(true);
      setTimeout(() => navigate(`/productos/${id}`), 900);
    } finally {
      setIsSubmitting(false);
    }
  };

  const lowStock = useMemo(() => {
    if (!form) return false;
    return (form.initialStock ?? 0) < (form.minimumStock ?? 0);
  }, [form]);

  const applyStockAdjustment = () => {
    setForm((prev) => (prev ? { ...prev, initialStock: Math.max(0, (prev.initialStock ?? 0) + stockAdjustment) } : prev));
    setStockDialogOpen(false);
    setStockAdjustment(0);
  };

  if (!form || !initialDetail) {
    return (
      <Box p={3}>
        <Typography>Cargando…</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Editar Producto</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit as any} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </Stack>
      </Stack>

      {lowStock && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Stock bajo: {form.initialStock} (mínimo {form.minimumStock})
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardHeader title="Información General" action={<Button onClick={() => setStockDialogOpen(true)}>Ajustar Stock</Button>} />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Nombre" fullWidth value={form.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name} required />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField label="SKU" fullWidth value={form.sku} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField select label="Categoría" fullWidth value={form.categoryId} onChange={handleChange('categoryId')} error={!!errors.categoryId} helperText={errors.categoryId} required>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Descripción" fullWidth multiline minRows={3} value={form.description || ''} onChange={handleChange('description')} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box height={16} />

        <Card>
          <CardHeader title="Precios e Impuestos" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField label="Costo" fullWidth type="number" InputProps={{ startAdornment: currencyAdornment }} value={form.costPrice} onChange={handleChange('costPrice')} error={!!errors.costPrice} helperText={errors.costPrice} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Precio de Venta" fullWidth type="number" InputProps={{ startAdornment: currencyAdornment }} value={form.salePrice} onChange={handleChange('salePrice')} error={!!errors.salePrice} helperText={errors.salePrice} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Impuesto" fullWidth type="number" InputProps={{ endAdornment: percentAdornment }} value={form.taxRate} onChange={handleChange('taxRate')} />
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Historial de precios (resumen)
              </Typography>
              {initialDetail.priceHistory.length === 0 ? (
                <Typography variant="body2">Sin variaciones registradas</Typography>
              ) : (
                <Stack spacing={0.5}>
                  {initialDetail.priceHistory.map((p) => (
                    <Typography key={p.id} variant="body2">
                      {new Date(p.createdAt).toLocaleDateString()}: ${p.previousPrice.toFixed(2)} → ${p.newPrice.toFixed(2)} (por {p.changedBy})
                    </Typography>
                  ))}
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>

        <Box height={16} />

        <Card>
          <CardHeader title="Stock" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField label="Stock" fullWidth type="number" value={form.initialStock} onChange={handleChange('initialStock')} error={!!errors.initialStock} helperText={errors.initialStock} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Stock Mínimo" fullWidth type="number" value={form.minimumStock} onChange={handleChange('minimumStock')} error={!!errors.minimumStock} helperText={errors.minimumStock} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Stock Máximo" fullWidth type="number" value={form.maximumStock ?? ''} onChange={handleChange('maximumStock')} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>

      <Dialog open={stockDialogOpen} onClose={() => setStockDialogOpen(false)}>
        <DialogTitle>Ajustar stock</DialogTitle>
        <DialogContent>
          <DialogContentText>Ingrese un valor positivo o negativo para ajustar el stock actual.</DialogContentText>
          <TextField autoFocus margin="dense" label="Ajuste" type="number" fullWidth value={stockAdjustment} onChange={(e) => setStockAdjustment(Number(e.target.value))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockDialogOpen(false)}>Cancelar</Button>
          <Button onClick={applyStockAdjustment} variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={successOpen} autoHideDuration={3000} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Producto actualizado correctamente
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProductPage;
