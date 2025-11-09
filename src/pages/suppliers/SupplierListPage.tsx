import CallMadeIcon from '@mui/icons-material/CallMade';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { suppliers } from '../../mocks/data';
import type { SupplierSummary } from '../../types';

export const SupplierListPage = () => {
  const [supplierList, setSupplierList] = useState<SupplierSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setSupplierList(suppliers);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  const filteredSuppliers = useMemo(() => {
    if (searchTerm === '') return supplierList;
    return supplierList.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [supplierList, searchTerm]);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Proveedores"
        subtitle="Centralizá compras, entregas y condiciones comerciales"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<ShoppingCartCheckoutIcon />}>
              Nueva orden de compra
            </Button>
            <Button variant="contained">Agregar proveedor</Button>
          </Stack>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Proveedores Activos
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {supplierList.length}
                </Typography>
                <Chip label="Total registrados" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Proveedores Destacados
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {supplierList.filter(s => s.name.includes('Hardware') || s.name.includes('Tech')).length}
                </Typography>
                <Chip label="Con acuerdo preferente" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Órdenes Activas
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  12
                </Typography>
                <Chip label="En tránsito" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Entregas Pendientes
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  5
                </Typography>
                <Chip label="Requiere seguimiento" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            {isLoading ? <LinearProgress /> : null}
            <Typography variant="body2" color="text.secondary">
              Mostrando {filteredSuppliers.length} de {supplierList.length} proveedores
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {filteredSuppliers.map((supplier, index) => (
          <Grid item xs={12} md={6} key={supplier.id}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: index % 2 === 0 ? 'primary.main' : 'secondary.main',
                        width: 56,
                        height: 56,
                      }}
                    >
                      <LocalShippingIcon fontSize="large" />
                    </Avatar>
                    <Stack spacing={0.5} flexGrow={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontWeight={700}>
                          {supplier.name}
                        </Typography>
                        {index < 3 && (
                          <Chip
                            icon={<StarIcon fontSize="small" />}
                            label="Preferente"
                            color="secondary"
                            size="small"
                          />
                        )}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Proveedor #{supplier.id}
                      </Typography>
                    </Stack>
                  </Box>

                  <Divider />

                  <Stack spacing={1.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {supplier.contactEmail}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {supplier.phone ?? 'Sin teléfono registrado'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ShoppingCartCheckoutIcon fontSize="small" />}
                    >
                      Nueva orden
                    </Button>
                    <Tooltip title="Ver historial">
                      <IconButton size="small" color="primary">
                        <CallMadeIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card>
        <CardContent>
          <SectionHeader title="Sugerencias" subtitle="Ideas para profesionalizar tus compras" />
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Evaluación de desempeño
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Compará tiempos de entrega y costos entre proveedores clave.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Alertas automáticas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configurá avisos cuando un proveedor esté demorando entregas críticas.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Catálogo colaborativo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Permití que tus proveedores actualicen disponibilidad y precios en línea.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
