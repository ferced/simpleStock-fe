import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SectionHeader } from '../../components/common/SectionHeader';

export const CreateEditSupplierPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: isEdit ? 'Blue Hardware' : '',
    contactEmail: isEdit ? 'contacto@bluehw.com' : '',
    phone: isEdit ? '+54 11 4567-8900' : '',
    address: isEdit ? 'Av. Corrientes 1234, CABA' : '',
    taxId: isEdit ? '30-12345678-9' : '',
    preferredSupplier: isEdit ? 'yes' : 'no',
    paymentTerms: isEdit ? '30' : '',
    deliveryTime: isEdit ? '5-7 días hábiles' : '',
    minimumOrder: isEdit ? '50000' : '',
    discount: isEdit ? '10' : '0',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email inválido';
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = 'El CUIT/CUIL es requerido';
    }

    if (!formData.paymentTerms.trim()) {
      newErrors.paymentTerms = 'El plazo de pago es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Aquí iría la lógica para guardar el proveedor
    console.log('Supplier data:', formData);
    setSaved(true);

    setTimeout(() => {
      navigate('/proveedores');
    }, 1500);
  };

  return (
    <Stack spacing={4}>
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton onClick={() => navigate('/proveedores')}>
          <ArrowBackIcon />
        </IconButton>
        <SectionHeader
          title={isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          subtitle={isEdit ? `Modificar información del proveedor` : 'Registrar un nuevo proveedor'}
        />
      </Box>

      {saved && (
        <Alert severity="success">
          Proveedor {isEdit ? 'actualizado' : 'creado'} exitosamente. Redirigiendo...
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Información Básica
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Nombre del Proveedor"
                      value={formData.name}
                      onChange={handleChange('name')}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      placeholder="Ej: Blue Hardware"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="CUIT/CUIL"
                      value={formData.taxId}
                      onChange={handleChange('taxId')}
                      error={Boolean(errors.taxId)}
                      helperText={errors.taxId}
                      placeholder="XX-XXXXXXXX-X"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Email de Contacto"
                      value={formData.contactEmail}
                      onChange={handleChange('contactEmail')}
                      error={Boolean(errors.contactEmail)}
                      helperText={errors.contactEmail}
                      placeholder="contacto@proveedor.com"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      placeholder="+54 11 1234-5678"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Dirección"
                      value={formData.address}
                      onChange={handleChange('address')}
                      placeholder="Calle 123, Ciudad, Provincia"
                    />
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={700}>
                  Condiciones Comerciales
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Plazo de Pago (días)"
                      type="number"
                      value={formData.paymentTerms}
                      onChange={handleChange('paymentTerms')}
                      error={Boolean(errors.paymentTerms)}
                      helperText={errors.paymentTerms || 'Días para pagar las facturas'}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tiempo de Entrega"
                      value={formData.deliveryTime}
                      onChange={handleChange('deliveryTime')}
                      placeholder="Ej: 5-7 días hábiles"
                      helperText="Tiempo estimado de entrega"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Pedido Mínimo ($)"
                      type="number"
                      value={formData.minimumOrder}
                      onChange={handleChange('minimumOrder')}
                      placeholder="50000"
                      helperText="Monto mínimo para realizar un pedido"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Descuento Especial (%)"
                      type="number"
                      value={formData.discount}
                      onChange={handleChange('discount')}
                      helperText="Descuento aplicable por acuerdo comercial"
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Proveedor Preferente"
                      value={formData.preferredSupplier}
                      onChange={handleChange('preferredSupplier')}
                      helperText="Marcar como proveedor con acuerdo especial"
                    >
                      <MenuItem value="no">No</MenuItem>
                      <MenuItem value="yes">Sí</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/proveedores')}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              size="large"
              type="submit"
              startIcon={<SaveIcon />}
            >
              {isEdit ? 'Guardar Cambios' : 'Crear Proveedor'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
};
