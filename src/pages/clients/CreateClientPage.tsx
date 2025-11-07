import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
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
    <Box p={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Nuevo Cliente</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit as any} disabled={isSubmitting}>{isSubmitting ? 'Guardando…' : 'Crear'}</Button>
        </Stack>
      </Stack>

      <Card>
        <CardHeader title="Formulario" />
        <Divider />
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab value="basic" label="Básico" />
            <Tab value="company" label="Empresa" />
            <Tab value="credit" label="Crédito" />
          </Tabs>

          {tab === 'basic' && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><TextField label="Nombre" fullWidth value={form.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name} required /></Grid>
              <Grid item xs={12} md={6}><TextField label="Email" fullWidth value={form.email} onChange={handleChange('email')} error={!!errors.email} helperText={errors.email} required /></Grid>
              <Grid item xs={12} md={6}><TextField label="Teléfono" fullWidth value={form.phone || ''} onChange={handleChange('phone')} /></Grid>
              <Grid item xs={12} md={6}><TextField label="Dirección" fullWidth value={form.address || ''} onChange={handleChange('address')} /></Grid>
              <Grid item xs={12} md={6}><TextField label="Ciudad" fullWidth value={form.city || ''} onChange={handleChange('city')} /></Grid>
              <Grid item xs={12} md={6}><TextField label="País" fullWidth value={form.country || ''} onChange={handleChange('country')} /></Grid>
            </Grid>
          )}

          {tab === 'company' && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><TextField label="Empresa" fullWidth value={form.company || ''} onChange={handleChange('company')} /></Grid>
              <Grid item xs={12} md={6}><TextField label="CUIT/RUT" fullWidth value={form.taxId || ''} onChange={handleChange('taxId')} error={!!errors.taxId} helperText={errors.taxId} /></Grid>
            </Grid>
          )}

          {tab === 'credit' && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><TextField label="Límite de crédito" fullWidth type="number" value={form.creditLimit ?? ''} onChange={handleChange('creditLimit')} error={!!errors.creditLimit} helperText={errors.creditLimit} /></Grid>
              <Grid item xs={12} md={6}><TextField select fullWidth label="Términos de pago" value={form.paymentTerms || 'cash'} onChange={handleChange('paymentTerms')}>
                <option value="cash">Contado</option>
                <option value="30days">30 días</option>
                <option value="60days">60 días</option>
                <option value="90days">90 días</option>
              </TextField></Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      <Snackbar open={toastOpen} autoHideDuration={2500} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>Cliente creado correctamente</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateClientPage;

