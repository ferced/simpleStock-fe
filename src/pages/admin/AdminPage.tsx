import LockOpenIcon from '@mui/icons-material/LockOpen';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PolicyIcon from '@mui/icons-material/Policy';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';

const settingsCards = [
  {
    icon: ManageAccountsIcon,
    title: 'Usuarios y roles',
    description: 'Gestioná accesos, invitaciones y permisos por área.',
    chip: '3 invitaciones pendientes',
  },
  {
    icon: LockOpenIcon,
    title: 'Seguridad y auditoría',
    description: 'Activá 2FA, revisá el log de actividad y exportá auditorías.',
    chip: '2 alertas recientes',
  },
  {
    icon: SettingsBackupRestoreIcon,
    title: 'Respaldo y restauración',
    description: 'Configurá respaldos automáticos y descargá copias manuales.',
    chip: 'Último backup hace 3 días',
  },
  {
    icon: PolicyIcon,
    title: 'Documentación y legales',
    description: 'Personalizá términos, privacidad y numeraciones de comprobantes.',
    chip: 'Revisión sugerida',
  },
];

export const AdminPage = () => (
  <Stack spacing={4}>
    <SectionHeader
      title="Administración"
      subtitle="Configuración general del sistema y seguridad"
      action={<Chip label="Modo auditoría activo" color="secondary" />}
    />
    <Grid container spacing={3}>
      {settingsCards.map((card) => {
        const Icon = card.icon;
        return (
          <Grid item xs={12} md={6} key={card.title}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, rgba(44,62,155,0.12) 0%, rgba(18,163,184,0.12) 100%)',
                      }}
                    >
                      <Icon color="primary" />
                    </Box>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" fontWeight={700}>
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </Stack>
                  </Box>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip label={card.chip} variant="outlined" />
                    <Switch defaultChecked color="primary" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <SectionHeader title="Variables clave" subtitle="Ajustes finos del sistema" action={<TuneIcon color="primary" />} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Moneda principal
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  Peso argentino (ARS)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Impuestos por defecto
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  IVA 21%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Notificaciones
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  Envío diario 08:00 hs
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  </Stack>
);
