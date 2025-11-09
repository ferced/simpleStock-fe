import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import DevicesIcon from '@mui/icons-material/Devices';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';

export const SystemInfoPage = () => (
  <Stack spacing={4}>
    <SectionHeader
      title="Información del Sistema"
      subtitle="Detalles técnicos y versiones"
      action={<Chip label="Versión 1.0.0" color="primary" />}
    />

    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
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
                  <InfoIcon color="primary" />
                </Box>
                <Stack spacing={0.5}>
                  <Typography variant="h6" fontWeight={700}>
                    Información General
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Detalles de la aplicación
                  </Typography>
                </Stack>
              </Box>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nombre
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    Suma Gestión
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Versión
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    1.0.0
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Última actualización
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date().toLocaleDateString('es-AR')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Entorno
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {import.meta.env.MODE === 'production' ? 'Producción' : 'Desarrollo'}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
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
                  <CodeIcon color="primary" />
                </Box>
                <Stack spacing={0.5}>
                  <Typography variant="h6" fontWeight={700}>
                    Tecnologías
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stack tecnológico
                  </Typography>
                </Stack>
              </Box>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Framework
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    React 18
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Lenguaje
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    TypeScript
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    UI Library
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    Material-UI v6
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Build Tool
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    Vite
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
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
                  <DevicesIcon color="primary" />
                </Box>
                <Stack spacing={0.5}>
                  <Typography variant="h6" fontWeight={700}>
                    Navegador
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Información del cliente
                  </Typography>
                </Stack>
              </Box>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User Agent
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                    {navigator.userAgent.split(' ').slice(0, 3).join(' ')}...
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Plataforma
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {navigator.platform}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Idioma
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {navigator.language}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Online
                  </Typography>
                  <Chip
                    label={navigator.onLine ? 'Conectado' : 'Desconectado'}
                    color={navigator.onLine ? 'success' : 'error'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
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
                  <StorageIcon color="primary" />
                </Box>
                <Stack spacing={0.5}>
                  <Typography variant="h6" fontWeight={700}>
                    Almacenamiento
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado del almacenamiento local
                  </Typography>
                </Stack>
              </Box>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    LocalStorage
                  </Typography>
                  <Chip
                    label={localStorage ? 'Disponible' : 'No disponible'}
                    color={localStorage ? 'success' : 'error'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    SessionStorage
                  </Typography>
                  <Chip
                    label={sessionStorage ? 'Disponible' : 'No disponible'}
                    color={sessionStorage ? 'success' : 'error'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cookies
                  </Typography>
                  <Chip
                    label={navigator.cookieEnabled ? 'Habilitadas' : 'Deshabilitadas'}
                    color={navigator.cookieEnabled ? 'success' : 'error'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Service Worker
                  </Typography>
                  <Chip
                    label={'serviceWorker' in navigator ? 'Soportado' : 'No soportado'}
                    color={'serviceWorker' in navigator ? 'success' : 'error'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            Licencia y Soporte
          </Typography>
          <Divider />
          <Typography variant="body2" color="text.secondary">
            Suma Gestión © {new Date().getFullYear()}. Todos los derechos reservados.
            <br />
            Para soporte técnico, contactá a soporte@sumagestión.com
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  </Stack>
);
