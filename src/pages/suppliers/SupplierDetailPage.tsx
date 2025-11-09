import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { SectionHeader } from '../../components/common/SectionHeader';

export const SupplierDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - en producción vendría de un servicio
  const supplier = {
    id: id || 'SUP-001',
    name: 'Blue Hardware',
    contactEmail: 'contacto@bluehw.com',
    phone: '+54 11 4567-8900',
    address: 'Av. Corrientes 1234, CABA',
    taxId: '30-12345678-9',
    preferredSupplier: true,
    paymentTerms: '30 días',
    deliveryTime: '5-7 días hábiles',
    minimumOrder: '$50,000',
    discount: '10%',
  };

  const recentOrders = [
    { id: 'OC-001', date: '2024-01-15', total: 125000, status: 'Entregada' },
    { id: 'OC-002', date: '2024-01-10', total: 89000, status: 'En tránsito' },
    { id: 'OC-003', date: '2024-01-05', total: 156000, status: 'Entregada' },
    { id: 'OC-004', date: '2023-12-28', total: 203000, status: 'Entregada' },
  ];

  const productsCatalog = [
    { id: 'PROD-001', name: 'Monitor LED 24"', price: 7500, stock: 45 },
    { id: 'PROD-002', name: 'Teclado Mecánico RGB', price: 4500, stock: 120 },
    { id: 'PROD-003', name: 'Mouse Inalámbrico', price: 2500, stock: 200 },
    { id: 'PROD-004', name: 'Webcam HD 1080p', price: 5000, stock: 80 },
  ];

  return (
    <Stack spacing={4}>
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton onClick={() => navigate('/proveedores')}>
          <ArrowBackIcon />
        </IconButton>
        <SectionHeader
          title={supplier.name}
          subtitle={`Proveedor ${supplier.id}`}
          action={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<ShoppingCartIcon />}>
                Nueva orden de compra
              </Button>
              <Button variant="contained" startIcon={<EditIcon />}>
                Editar
              </Button>
            </Stack>
          }
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: 'primary.main',
                  }}
                >
                  <LocalShippingIcon sx={{ fontSize: 48 }} />
                </Avatar>
                <Stack spacing={1} alignItems="center" width="100%">
                  <Typography variant="h5" fontWeight={700}>
                    {supplier.name}
                  </Typography>
                  {supplier.preferredSupplier && (
                    <Chip label="Proveedor Preferente" color="secondary" />
                  )}
                </Stack>
                <Divider sx={{ width: '100%' }} />
                <Stack spacing={2} width="100%">
                  <Box display="flex" alignItems="center" gap={2}>
                    <EmailIcon color="action" />
                    <Stack spacing={0}>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2">{supplier.contactEmail}</Typography>
                    </Stack>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PhoneIcon color="action" />
                    <Stack spacing={0}>
                      <Typography variant="caption" color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body2">{supplier.phone}</Typography>
                    </Stack>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <LocationOnIcon color="action" />
                    <Stack spacing={0}>
                      <Typography variant="caption" color="text.secondary">
                        Dirección
                      </Typography>
                      <Typography variant="body2">{supplier.address}</Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight={700}>
                    Condiciones Comerciales
                  </Typography>
                  <Divider />
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          CUIT/CUIL
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {supplier.taxId}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Plazo de Pago
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {supplier.paymentTerms}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Tiempo de Entrega
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {supplier.deliveryTime}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Pedido Mínimo
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {supplier.minimumOrder}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Descuento Especial
                        </Typography>
                        <Chip label={supplier.discount} color="success" size="small" />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={700}>
                      Estadísticas
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1}>
                            <Typography variant="caption" color="text.secondary">
                              Total Órdenes
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                              {recentOrders.length}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1}>
                            <Typography variant="caption" color="text.secondary">
                              Total Comprado
                            </Typography>
                            <Typography variant="h5" fontWeight={700} color="success.main">
                              ${recentOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString('es-AR')}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1}>
                            <Typography variant="caption" color="text.secondary">
                              Promedio por Orden
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                              ${Math.round(recentOrders.reduce((sum, o) => sum + o.total, 0) / recentOrders.length).toLocaleString('es-AR')}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1}>
                            <Typography variant="caption" color="text.secondary">
                              En Tránsito
                            </Typography>
                            <Typography variant="h5" fontWeight={700} color="warning.main">
                              1
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Órdenes Recientes
                </Typography>
                <Divider />
                <List>
                  {recentOrders.map((order) => (
                    <ListItem
                      key={order.id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1" fontWeight={600}>
                              {order.id}
                            </Typography>
                            <Chip
                              label={order.status}
                              size="small"
                              color={order.status === 'Entregada' ? 'success' : 'warning'}
                            />
                          </Stack>
                        }
                        secondary={order.date}
                      />
                      <Typography variant="h6" fontWeight={700}>
                        ${order.total.toLocaleString('es-AR')}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Productos en Catálogo
                </Typography>
                <Divider />
                <List>
                  {productsCatalog.map((product) => (
                    <ListItem
                      key={product.id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <ListItemText
                        primary={product.name}
                        secondary={`Stock: ${product.stock} unidades`}
                      />
                      <Stack alignItems="flex-end" spacing={0.5}>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                          ${product.price.toLocaleString('es-AR')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Precio unitario
                        </Typography>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
