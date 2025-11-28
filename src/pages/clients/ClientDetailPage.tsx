import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import type { ClientDetail, Invoice, Transaction } from '../../types';
import dayjs from 'dayjs';

const buildMock = (id: string): ClientDetail => ({
  id,
  name: 'Cliente Demo',
  email: 'demo@cliente.test',
  phone: '555-1111',
  company: 'Demo SA',
  totalBalance: 245000,
  activeInvoices: 3,
  taxId: '20-12345678-9',
  address: 'Calle Falsa 123',
  city: 'CABA',
  country: 'AR',
  creditLimit: 500000,
  availableCredit: 255000,
  paymentTerms: '30 días',
  transactions: [
    { id: 't1', clientId: id, type: 'invoice', amount: 150000, balance: 150000, createdAt: new Date().toISOString() },
    { id: 't2', clientId: id, type: 'payment', amount: -50000, balance: 100000, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 't3', clientId: id, type: 'invoice', amount: 75000, balance: 175000, createdAt: new Date(Date.now() - 2*86400000).toISOString() },
    { id: 't4', clientId: id, type: 'payment', amount: -100000, balance: 75000, createdAt: new Date(Date.now() - 3*86400000).toISOString() },
    { id: 't5', clientId: id, type: 'invoice', amount: 120000, balance: 195000, createdAt: new Date(Date.now() - 5*86400000).toISOString() },
  ],
  invoices: [
    { id: 'inv-1', clientId: id, status: 'sent', total: 150000, dueDate: new Date(Date.now() + 7*86400000).toISOString(), createdAt: new Date().toISOString(), items: [] },
    { id: 'inv-2', clientId: id, status: 'overdue', total: 50000, dueDate: new Date(Date.now() - 5*86400000).toISOString(), createdAt: new Date(Date.now() - 15*86400000).toISOString(), items: [] },
    { id: 'inv-3', clientId: id, status: 'paid', total: 200000, dueDate: new Date(Date.now() - 10*86400000).toISOString(), createdAt: new Date(Date.now() - 20*86400000).toISOString(), items: [] },
  ],
  statistics: {
    totalPurchases: 1250000,
    averageTicket: 62500,
    lastPurchaseDate: new Date(Date.now() - 3*86400000).toISOString(),
    topProducts: [
      { productId: 'p1', productName: 'Producto A', quantity: 40 },
      { productId: 'p2', productName: 'Producto B', quantity: 22 },
      { productId: 'p3', productName: 'Producto C', quantity: 18 },
      { productId: 'p4', productName: 'Producto D', quantity: 12 },
    ],
  },
  createdAt: new Date(Date.now() - 60*86400000).toISOString(),
});

const statusLabels: Record<string, string> = {
  sent: 'Enviada',
  paid: 'Pagada',
  overdue: 'Vencida',
  draft: 'Borrador',
};

const transactionLabels: Record<string, string> = {
  invoice: 'Factura',
  payment: 'Pago',
  credit: 'Nota de Crédito',
};

export const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'invoices' | 'transactions' | 'stats'>('invoices');
  const [data, setData] = useState<ClientDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    setTimeout(() => setData(buildMock(id)), 200);
  }, [id]);

  const creditUsagePercent = useMemo(() => {
    if (!data || !data.creditLimit) return 0;
    return ((data.creditLimit - data.availableCredit) / data.creditLimit) * 100;
  }, [data]);

  if (!data) {
    return (
      <Stack spacing={4}>
        <SectionHeader
          title="Detalle de Cliente"
          subtitle="Cargando información..."
        />
        <Card>
          <CardContent>
            <Stack alignItems="center" spacing={2} py={4}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Cargando datos del cliente...
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <SectionHeader
        title={data.name}
        subtitle={`Cliente desde ${dayjs(data.createdAt).format('DD/MM/YYYY')}`}
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/clientes/${data.id}/editar`)}>
              Editar
            </Button>
            <Button variant="contained" startIcon={<ReceiptLongIcon />} onClick={() => navigate('/facturacion/nueva')}>
              Nueva Factura
            </Button>
          </Stack>
        }
      />

      {/* Estadísticas Principales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                    <ShoppingCartIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    Total Comprado
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700}>
                  ${data.statistics.totalPurchases.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Historial completo" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ bgcolor: 'success.light', width: 40, height: 40 }}>
                    <TrendingUpIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    Ticket Promedio
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  ${data.statistics.averageTicket.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Por compra" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ bgcolor: data.totalBalance > 0 ? 'error.light' : 'success.light', width: 40, height: 40 }}>
                    <AccountBalanceWalletIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    Saldo Actual
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} color={data.totalBalance > 0 ? 'error.main' : 'success.main'}>
                  ${data.totalBalance.toLocaleString('es-AR')}
                </Typography>
                <Chip
                  label={data.totalBalance > 0 ? `${data.activeInvoices} facturas pendientes` : 'Al día'}
                  size="small"
                  color={data.totalBalance > 0 ? 'error' : 'success'}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ bgcolor: 'warning.light', width: 40, height: 40 }}>
                    <CalendarTodayIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    Última Compra
                  </Typography>
                </Stack>
                <Typography variant="h6" fontWeight={700}>
                  {dayjs(data.statistics.lastPurchaseDate).format('DD/MM/YYYY')}
                </Typography>
                <Chip label={`Hace ${dayjs().diff(dayjs(data.statistics.lastPurchaseDate), 'day')} días`} size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Información y Crédito */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Información de Contacto
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body2" fontWeight={600}>{data.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">Teléfono:</Typography>
                  <Typography variant="body2" fontWeight={600}>{data.phone}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">Empresa:</Typography>
                  <Typography variant="body2" fontWeight={600}>{data.company}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">CUIT/RUT:</Typography>
                  <Typography variant="body2" fontWeight={600}>{data.taxId}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">Dirección:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {data.address}, {data.city}, {data.country}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Límite de Crédito
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Crédito Utilizado
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ${(data.creditLimit - data.availableCredit).toLocaleString('es-AR')} / ${data.creditLimit.toLocaleString('es-AR')}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={creditUsagePercent}
                    sx={{ height: 8, borderRadius: 1 }}
                    color={creditUsagePercent > 80 ? 'error' : creditUsagePercent > 50 ? 'warning' : 'success'}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {creditUsagePercent.toFixed(1)}% utilizado
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Crédito Disponible
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="success.main">
                        ${data.availableCredit.toLocaleString('es-AR')}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Términos de Pago
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {data.paymentTerms}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs de Detalle */}
      <Card>
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab value="invoices" label="Facturas" />
            <Tab value="transactions" label="Transacciones" />
            <Tab value="stats" label="Productos Frecuentes" />
          </Tabs>

          {tab === 'invoices' && (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Historial de facturas del cliente
              </Typography>
              {data.invoices.length === 0 ? (
                <Stack alignItems="center" py={4}>
                  <ReceiptLongIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay facturas registradas
                  </Typography>
                </Stack>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Número</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Fecha Emisión</TableCell>
                      <TableCell>Vencimiento</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.invoices.map((inv: Invoice) => (
                      <TableRow
                        key={inv.id}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'action.hover' }
                        }}
                        onClick={() => navigate(`/facturacion/${inv.id}`)}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {inv.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={statusLabels[inv.status] || inv.status}
                            color={inv.status === 'overdue' ? 'error' : inv.status === 'paid' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>{dayjs(inv.createdAt).format('DD/MM/YYYY')}</TableCell>
                        <TableCell>{dayjs(inv.dueDate).format('DD/MM/YYYY')}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${inv.total.toLocaleString('es-AR')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Stack>
          )}

          {tab === 'transactions' && (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Historial de movimientos en la cuenta del cliente
              </Typography>
              {data.transactions.length === 0 ? (
                <Stack alignItems="center" py={4}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay transacciones registradas
                  </Typography>
                </Stack>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell align="right">Saldo Resultante</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.transactions.map((t: Transaction) => (
                      <TableRow key={t.id}>
                        <TableCell>{dayjs(t.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={transactionLabels[t.type] || t.type}
                            variant="outlined"
                            color={t.type === 'payment' ? 'success' : 'primary'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={t.amount < 0 ? 'success.main' : 'text.primary'}
                          >
                            {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toLocaleString('es-AR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${t.balance.toLocaleString('es-AR')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Stack>
          )}

          {tab === 'stats' && (
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Productos más comprados por este cliente
              </Typography>
              {data.statistics.topProducts.length === 0 ? (
                <Stack alignItems="center" py={4}>
                  <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay estadísticas de productos
                  </Typography>
                </Stack>
              ) : (
                <List>
                  {data.statistics.topProducts.map((p, index) => {
                    const maxQty = Math.max(...data.statistics.topProducts.map(prod => prod.quantity));
                    const percentage = (p.quantity / maxQty) * 100;

                    return (
                      <ListItem key={p.productId} sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label={`#${index + 1}`} size="small" color="primary" />
                            <Typography variant="body1" fontWeight={600}>
                              {p.productName}
                            </Typography>
                          </Stack>
                          <Typography variant="h6" fontWeight={700} color="primary.main">
                            {p.quantity} unidades
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ClientDetailPage;


