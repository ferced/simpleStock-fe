import { useEffect, useMemo, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ProductFormData, SupplierSummary, ProductCategory } from '../../types';

type FormErrors = Partial<Record<keyof ProductFormData, string>>;

const currencyAdornment = <InputAdornment position="start">$</InputAdornment>;
const percentAdornment = <InputAdornment position="end">%</InputAdornment>;

export const CreateProductPage = () => {
  const navigate = useNavigate();

  // Temporary local options until real API is connected
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);

  const [form, setForm] = useState<ProductFormData>({
    name: '',
    sku: '',
    categoryId: '',
    description: '',
    costPrice: 0,
    salePrice: 0,
    wholesalePrice: undefined,
    taxRate: 21,
    initialStock: 0,
    minimumStock: 0,
    maximumStock: undefined,
    supplierIds: [],
    imageUrls: [],
    barcode: '',
    internalCode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    // Simulated fetch
    const mockCategories: ProductCategory[] = [
      { id: 'cat-1', name: 'Electrónica', description: 'Dispositivos y accesorios' },
      { id: 'cat-2', name: 'Hogar', description: 'Artículos para el hogar' },
      { id: 'cat-3', name: 'Oficina', description: 'Suministros de oficina' },
    ];
    const mockSuppliers: SupplierSummary[] = [
      { id: 'sup-1', name: 'Acme Corp', contactEmail: 'ventas@acme.test', phone: '555-0001' },
      { id: 'sup-2', name: 'Globex', contactEmail: 'info@globex.test', phone: '555-0002' },
      { id: 'sup-3', name: 'Soylent', contactEmail: 'contacto@soylent.test', phone: '555-0003' },
    ];
    setCategories(mockCategories);
    setSuppliers(mockSuppliers);
  }, []);

  // Generate SKU from name if empty when leaving name field
  const generatedSku = useMemo(() => {
    if (!form.name) return '';
    return form.name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 20);
  }, [form.name]);

  const validate = (data: ProductFormData): FormErrors => {
    const next: FormErrors = {};
    if (!data.name?.trim()) next.name = 'Nombre requerido';
    if (!data.categoryId) next.categoryId = 'Categoría requerida';
    if (data.costPrice == null || data.costPrice < 0) next.costPrice = 'Costo inválido';
    if (data.salePrice == null || data.salePrice < 0) next.salePrice = 'Precio de venta inválido';
    if (data.salePrice < data.costPrice) next.salePrice = 'El precio de venta debe ser >= costo';
    if (data.taxRate == null || data.taxRate < 0) next.taxRate = 'Impuesto inválido';
    if (data.initialStock == null || data.initialStock < 0) next.initialStock = 'Stock inicial inválido';
    if (data.minimumStock == null || data.minimumStock < 0) next.minimumStock = 'Stock mínimo inválido';
    return next;
  };

  const handleChange =
    <K extends keyof ProductFormData>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [key]: ['costPrice', 'salePrice', 'wholesalePrice', 'taxRate', 'initialStock', 'minimumStock', 'maximumStock'].includes(
          key as string
        )
          ? (value === '' ? ('' as any) : Number(value))
          : (value as any),
      }));
    };

  const handleSupplierToggle = (supplierId: string) => {
    setForm((prev) => {
      const exists = prev.supplierIds.includes(supplierId);
      return {
        ...prev,
        supplierIds: exists
          ? prev.supplierIds.filter((id) => id !== supplierId)
          : [...prev.supplierIds, supplierId],
      };
    });
  };

  const handleAddImageUrl = () => {
    if ((form.imageUrls?.length || 0) >= 5) return;
    setForm((prev) => ({
      ...prev,
      imageUrls: [...(prev.imageUrls || []), ''],
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setForm((prev) => {
      const next = [...(prev.imageUrls || [])];
      next[index] = value;
      return { ...prev, imageUrls: next };
    });
  };

  const onBlurName = () => {
    if (!form.sku?.trim() && generatedSku) {
      setForm((prev) => ({ ...prev, sku: generatedSku }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setIsSubmitting(true);
    try {
      // TODO: replace with real API: await apiClient.post<Product>('/products', form)
      await new Promise((r) => setTimeout(r, 750));
      setSuccessOpen(true);
      // Redirect to products list (until ProductDetailPage is implemented)
      setTimeout(() => navigate('/productos'), 900);
    } catch (error) {
      // Display handled via Alert below
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Crear Producto"
        subtitle="Registrá un nuevo producto en tu inventario"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => navigate('/productos')}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit as any}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Crear Producto'}
            </Button>
          </Stack>
        }
      />

      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Información General
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre del Producto"
                  fullWidth
                  value={form.name}
                  onChange={handleChange('name')}
                  onBlur={onBlurName}
                  error={!!errors.name}
                  helperText={errors.name || 'Nombre comercial del producto'}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="SKU"
                  fullWidth
                  value={form.sku}
                  onChange={handleChange('sku')}
                  placeholder={generatedSku || 'AUTO'}
                  helperText="Se genera automáticamente si se deja vacío"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Categoría"
                  fullWidth
                  value={form.categoryId}
                  onChange={handleChange('categoryId')}
                  error={!!errors.categoryId}
                  helperText={errors.categoryId || 'Categoría del producto'}
                  required
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descripción"
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.description || ''}
                  onChange={handleChange('description')}
                  helperText="Descripción detallada del producto (opcional)"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Precios e Impuestos
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Precio de Costo"
                  fullWidth
                  type="number"
                  InputProps={{ startAdornment: currencyAdornment }}
                  value={form.costPrice}
                  onChange={handleChange('costPrice')}
                  error={!!errors.costPrice}
                  helperText={errors.costPrice || 'Costo de adquisición del producto'}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Precio de Venta"
                  fullWidth
                  type="number"
                  InputProps={{ startAdornment: currencyAdornment }}
                  value={form.salePrice}
                  onChange={handleChange('salePrice')}
                  error={!!errors.salePrice}
                  helperText={errors.salePrice || 'Precio al público'}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Precio Mayorista"
                  fullWidth
                  type="number"
                  InputProps={{ startAdornment: currencyAdornment }}
                  value={form.wholesalePrice ?? ''}
                  onChange={handleChange('wholesalePrice')}
                  helperText="Precio para compras en cantidad (opcional)"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Tasa de Impuesto"
                  fullWidth
                  type="number"
                  InputProps={{ endAdornment: percentAdornment }}
                  value={form.taxRate}
                  onChange={handleChange('taxRate')}
                  error={!!errors.taxRate}
                  helperText={errors.taxRate || 'IVA u otro impuesto aplicable'}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Stock y Proveedores
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Stock Inicial"
                  fullWidth
                  type="number"
                  value={form.initialStock}
                  onChange={handleChange('initialStock')}
                  error={!!errors.initialStock}
                  helperText={errors.initialStock || 'Cantidad inicial en inventario'}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Stock Mínimo"
                  fullWidth
                  type="number"
                  value={form.minimumStock}
                  onChange={handleChange('minimumStock')}
                  error={!!errors.minimumStock}
                  helperText={errors.minimumStock || 'Nivel de alerta de stock bajo'}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Stock Máximo"
                  fullWidth
                  type="number"
                  value={form.maximumStock ?? ''}
                  onChange={handleChange('maximumStock')}
                  helperText="Nivel máximo de inventario (opcional)"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Proveedores
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Seleccioná los proveedores de este producto
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {suppliers.map((s) => {
                    const selected = form.supplierIds.includes(s.id);
                    return (
                      <Chip
                        key={s.id}
                        label={s.name}
                        color={selected ? 'primary' : 'default'}
                        onClick={() => handleSupplierToggle(s.id)}
                        variant={selected ? 'filled' : 'outlined'}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Imágenes y Códigos
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      URLs de Imágenes (máximo 5)
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddPhotoAlternateIcon />}
                      onClick={handleAddImageUrl}
                      disabled={(form.imageUrls?.length || 0) >= 5}
                    >
                      Agregar URL
                    </Button>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Agregá URLs de imágenes del producto
                  </Typography>
                  <Box>
                    {form.imageUrls?.map((url, idx) => (
                      <TextField
                        key={idx}
                        fullWidth
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={url}
                        onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                        sx={{ mb: 1 }}
                        helperText={`Imagen ${idx + 1}`}
                      />
                    ))}
                    {form.imageUrls?.length === 0 && (
                      <Typography variant="body2" color="text.disabled">
                        No hay imágenes agregadas
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Código de Barras"
                  fullWidth
                  value={form.barcode || ''}
                  onChange={handleChange('barcode')}
                  helperText="Código de barras del producto (opcional)"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Código Interno"
                  fullWidth
                  value={form.internalCode || ''}
                  onChange={handleChange('internalCode')}
                  helperText="Código interno de identificación (opcional)"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Producto creado correctamente
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default CreateProductPage;

