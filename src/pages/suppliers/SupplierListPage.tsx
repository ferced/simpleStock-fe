import CallMadeIcon from '@mui/icons-material/CallMade';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { suppliers } from '../../mocks/data';
import type { SupplierSummary } from '../../types';

export const SupplierListPage = () => {
  const [supplierList, setSupplierList] = useState<SupplierSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setSupplierList(suppliers);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

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
      <Card>
        <CardContent>
          {isLoading ? <LinearProgress sx={{ mb: 2 }} /> : null}
          <List>
            {supplierList.map((supplier) => (
              <ListItem key={supplier.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                    <LocalShippingIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={supplier.name}
                  secondary={
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {supplier.contactEmail}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {supplier.phone ?? 'Sin teléfono registrado'}
                      </Typography>
                    </Stack>
                  }
                />
                <Stack spacing={1} alignItems="flex-end">
                  <Chip label="Acuerdo preferente" color="secondary" variant="outlined" />
                  <Button size="small" startIcon={<CallMadeIcon fontSize="small" />}>Historial</Button>
                </Stack>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
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
