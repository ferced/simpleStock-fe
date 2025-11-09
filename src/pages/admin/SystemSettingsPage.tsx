import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';

interface SystemSettings {
  companyName: string;
  currency: string;
  taxRate: number;
  language: string;
  timezone: string;
  dateFormat: string;
  invoicePrefix: string;
  invoiceStartNumber: number;
  lowStockThreshold: number;
  emailNotifications: boolean;
  stockAlerts: boolean;
  invoiceReminders: boolean;
  autoBackup: boolean;
  backupFrequency: string;
}

const currencies = [
  { value: 'ARS', label: 'Peso Argentino (ARS)' },
  { value: 'USD', label: 'Dólar Estadounidense (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
];

const languages = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
];

const timezones = [
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (GMT-3)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
];

const dateFormats = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

const backupFrequencies = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
];

export const SystemSettingsPage = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    companyName: 'Suma Gestión',
    currency: 'ARS',
    taxRate: 21,
    language: 'es',
    timezone: 'America/Argentina/Buenos_Aires',
    dateFormat: 'DD/MM/YYYY',
    invoicePrefix: 'FC',
    invoiceStartNumber: 1,
    lowStockThreshold: 10,
    emailNotifications: true,
    stockAlerts: true,
    invoiceReminders: true,
    autoBackup: true,
    backupFrequency: 'daily',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof SystemSettings) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Configuración del Sistema"
        subtitle="Personalizá los parámetros generales de la aplicación"
        action={<Chip label="Configuración avanzada" color="primary" />}
      />

      {saved && (
        <Alert severity="success">
          Configuración guardada exitosamente
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <SettingsIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Información de la Empresa
              </Typography>
            </Box>
            <Divider />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de la Empresa"
                  value={settings.companyName}
                  onChange={handleChange('companyName')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Idioma"
                  value={settings.language}
                  onChange={handleChange('language')}
                >
                  {languages.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Zona Horaria"
                  value={settings.timezone}
                  onChange={handleChange('timezone')}
                >
                  {timezones.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Formato de Fecha"
                  value={settings.dateFormat}
                  onChange={handleChange('dateFormat')}
                >
                  {dateFormats.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <MonetizationOnIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Configuración Fiscal
              </Typography>
            </Box>
            <Divider />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Moneda Principal"
                  value={settings.currency}
                  onChange={handleChange('currency')}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tasa de IVA por Defecto (%)"
                  value={settings.taxRate}
                  onChange={handleChange('taxRate')}
                  inputProps={{ min: 0, max: 100, step: 0.5 }}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <ReceiptIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Facturación
              </Typography>
            </Box>
            <Divider />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prefijo de Factura"
                  value={settings.invoicePrefix}
                  onChange={handleChange('invoicePrefix')}
                  helperText="Ejemplo: FC, FAC, INV"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Número Inicial de Factura"
                  value={settings.invoiceStartNumber}
                  onChange={handleChange('invoiceStartNumber')}
                  inputProps={{ min: 1 }}
                  helperText="Número desde el cual comenzar la numeración"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Umbral de Stock Bajo"
                  value={settings.lowStockThreshold}
                  onChange={handleChange('lowStockThreshold')}
                  inputProps={{ min: 0 }}
                  helperText="Cantidad mínima para alertas de stock"
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <NotificationsIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Notificaciones y Alertas
              </Typography>
            </Box>
            <Divider />
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Notificaciones por Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recibir notificaciones importantes por correo electrónico
                  </Typography>
                </Stack>
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange('emailNotifications')}
                />
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Alertas de Stock Bajo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notificar cuando el stock esté por debajo del umbral
                  </Typography>
                </Stack>
                <Switch
                  checked={settings.stockAlerts}
                  onChange={handleChange('stockAlerts')}
                />
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Recordatorios de Facturas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enviar recordatorios de facturas vencidas o próximas a vencer
                  </Typography>
                </Stack>
                <Switch
                  checked={settings.invoiceReminders}
                  onChange={handleChange('invoiceReminders')}
                />
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={700}>
              Respaldos Automáticos
            </Typography>
            <Divider />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Backup Automático
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Realizar copias de seguridad de forma automática
                </Typography>
              </Stack>
              <Switch
                checked={settings.autoBackup}
                onChange={handleChange('autoBackup')}
              />
            </Box>
            {settings.autoBackup && (
              <TextField
                select
                fullWidth
                label="Frecuencia de Backup"
                value={settings.backupFrequency}
                onChange={handleChange('backupFrequency')}
              >
                {backupFrequencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" size="large">
          Restablecer
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Guardar Configuración
        </Button>
      </Box>
    </Stack>
  );
};
