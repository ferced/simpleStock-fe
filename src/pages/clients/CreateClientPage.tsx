import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import type { ClientFormData } from '../../types';

type TabKey = 'basic' | 'company' | 'credit';

export const CreateClientPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [form, setForm] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    taxId: '',
    address: '',
    city: '',
    country: '',
    creditLimit: undefined,
    paymentTerms: 'cash',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});

  const validate = (data: ClientFormData) => {
    const next: Partial<Record<keyof ClientFormData, string>> = {};
    if (!data.name?.trim()) next.name = 'Nombre requerido';
    if (!data.email?.trim()) next.email = 'Email requerido';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = 'Email inválido';
    if (data.taxId && !/^[-A-Za-z0-9.]+$/.test(data.taxId)) next.taxId = 'CUIT/RUT inválido';
    if (data.creditLimit != null && data.creditLimit < 0) next.creditLimit = 'Crédito inválido';
    return next;
  };

  const handleChange = <K extends keyof ClientFormData>(key: K) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      [key]: key === 'creditLimit' ? (value === '' ? undefined : Number(value)) : (value as any),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setIsSubmitting(true);
    try {
      // TODO: await apiClient.post('/clients', form)
      await new Promise((r) => setTimeout(r, 700));
      setToastOpen(true);
      setTimeout(() => navigate('/clientes'), 900);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Nuevo Cliente"
        subtitle="Registrá un nuevo cliente con su información completa"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => navigate('/clientes')}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit as any}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando…' : 'Crear Cliente'}
            </Button>
          </Stack>
        }
      />

      <Card>
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab value="basic" label="Información Básica" />
            <Tab value="company" label="Información Fiscal" />
            <Tab value="credit" label="Condiciones Comerciales" />
          </Tabs>

          {tab === 'basic' && (
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Información de contacto y ubicación del cliente
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre completo"
                    fullWidth
                    value={form.name}
                    onChange={handleChange('name')}
                    error={!!errors.name}
                    helperText={errors.name || 'Nombre del cliente o razón social'}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    error={!!errors.email}
                    helperText={errors.email || 'Email para envío de facturas'}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Teléfono"
                    fullWidth
                    value={form.phone || ''}
                    onChange={handleChange('phone')}
                    helperText="Teléfono de contacto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Dirección"
                    fullWidth
                    value={form.address || ''}
                    onChange={handleChange('address')}
                    helperText="Dirección física o postal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Ciudad"
                    fullWidth
                    value={form.city || ''}
                    onChange={handleChange('city')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="País"
                    fullWidth
                    value={form.country || ''}
                    onChange={handleChange('country')}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}

          {tab === 'company' && (
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Información fiscal y de facturación del cliente
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Razón Social"
                    fullWidth
                    value={form.company || ''}
                    onChange={handleChange('company')}
                    helperText="Nombre legal de la empresa (opcional)"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="CUIT/RUT/ID Fiscal"
                    fullWidth
                    value={form.taxId || ''}
                    onChange={handleChange('taxId')}
                    error={!!errors.taxId}
                    helperText={errors.taxId || 'Identificación fiscal del cliente'}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}

          {tab === 'credit' && (
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Configurá las condiciones comerciales y límites de crédito
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Límite de crédito"
                    fullWidth
                    type="number"
                    value={form.creditLimit ?? ''}
                    onChange={handleChange('creditLimit')}
                    error={!!errors.creditLimit}
                    helperText={errors.creditLimit || 'Monto máximo de crédito disponible'}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Términos de pago"
                    value={form.paymentTerms || 'cash'}
                    onChange={handleChange('paymentTerms')}
                    helperText="Plazo de pago preferido"
                  >
                    <MenuItem value="cash">Contado</MenuItem>
                    <MenuItem value="30days">30 días</MenuItem>
                    <MenuItem value="60days">60 días</MenuItem>
                    <MenuItem value="90days">90 días</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Snackbar open={toastOpen} autoHideDuration={2500} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>Cliente creado correctamente</Alert>
      </Snackbar>
    </Stack>
  );
};

export default CreateClientPage;




