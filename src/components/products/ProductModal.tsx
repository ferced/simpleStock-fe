import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { suppliers } from '../../mocks/data';

type ProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSave?: (product: ProductFormData) => void;
};

export type ProductFormData = {
  name: string;
  sku: string;
  stock: number;
  supplierId: string;
  cost: number;
  taxRate: number;
  margin: number;
  salePrice: number;
};

const TAX_OPTIONS = [
  { value: 21, label: '21%' },
  { value: 10.5, label: '10.5%' },
];

export const ProductModal = ({ open, onClose, onSave }: ProductModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    stock: 0,
    supplierId: '',
    cost: 0,
    taxRate: 21,
    margin: 0,
    salePrice: 0,
  });

  // Calcular precio de venta automáticamente
  useEffect(() => {
    const { cost, taxRate, margin } = formData;
    if (cost > 0) {
      // Fórmula: precio_venta = costo * (1 + IVA/100) * (1 + margen/100)
      const salePrice = cost * (1 + taxRate / 100) * (1 + margin / 100);
      setFormData((prev) => ({ ...prev, salePrice: Math.round(salePrice * 100) / 100 }));
    } else {
      setFormData((prev) => ({ ...prev, salePrice: 0 }));
    }
  }, [formData.cost, formData.taxRate, formData.margin]);

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      sku: '',
      stock: 0,
      supplierId: '',
      cost: 0,
      taxRate: 21,
      margin: 0,
      salePrice: 0,
    });
    onClose();
  };

  const isFormValid = formData.name && formData.sku && formData.supplierId && formData.cost > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Nuevo Producto</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del producto"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU / ID"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                required
                placeholder="Ej: MN-IPS-27"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cantidad inicial"
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', Number(e.target.value))}
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">u.</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Proveedor"
                value={formData.supplierId}
                onChange={(e) => handleChange('supplierId', e.target.value)}
                required
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Costo"
                type="number"
                value={formData.cost}
                onChange={(e) => handleChange('cost', Number(e.target.value))}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="IVA"
                value={formData.taxRate}
                onChange={(e) => handleChange('taxRate', Number(e.target.value))}
              >
                {TAX_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Margen de ganancia"
                type="number"
                value={formData.margin}
                onChange={(e) => handleChange('margin', Number(e.target.value))}
                InputProps={{
                  inputProps: { min: 0, step: 0.1 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                helperText="Porcentaje de ganancia sobre el costo + IVA"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Precio de venta"
                type="text"
                value={formData.salePrice.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontWeight: 600,
                    color: 'primary.main',
                  },
                }}
                helperText="Calculado automáticamente"
              />
            </Grid>
            {formData.cost > 0 && (
              <Grid item xs={12}>
                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Desglose del precio:
                  </Typography>
                  <Typography variant="body2">
                    Costo: ${formData.cost.toLocaleString('es-AR')} + IVA ({formData.taxRate}%): $
                    {(formData.cost * (formData.taxRate / 100)).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    + Margen ({formData.margin}%): $
                    {((formData.cost * (1 + formData.taxRate / 100) * formData.margin) / 100).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isFormValid}>
          Guardar producto
        </Button>
      </DialogActions>
    </Dialog>
  );
};
