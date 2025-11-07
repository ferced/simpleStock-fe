import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
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
import type { ClientDetail, Invoice, Transaction } from '../../types';

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
    { id: 't2', clientId: id, type: 'payment', amount: -50000, balance: 100000, createdAt: new Date().toISOString() },
  ],
  invoices: [
    { id: 'inv-1', clientId: id, status: 'sent', total: 150000, dueDate: new Date(Date.now() + 7*86400000).toISOString(), createdAt: new Date().toISOString(), items: [] },
    { id: 'inv-2', clientId: id, status: 'overdue', total: 50000, dueDate: new Date(Date.now() - 5*86400000).toISOString(), createdAt: new Date().toISOString(), items: [] },
  ],
  statistics: {
    totalPurchases: 1250000,
    averageTicket: 62500,
    lastPurchaseDate: new Date(Date.now() - 3*86400000).toISOString(),
    topProducts: [
      { productId: 'p1', productName: 'Producto A', quantity: 40 },
      { productId: 'p2', productName: 'Producto B', quantity: 22 },
    ],
  },
  createdAt: new Date(Date.now() - 60*86400000).toISOString(),
});

export const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'invoices' | 'transactions' | 'stats'>('invoices');
  const [data, setData] = useState<ClientDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    setTimeout(() => setData(buildMock(id)), 200);
  }, [id]);

  const debtBadge = useMemo(() => (data && data.totalBalance > 0 ? 'error' : 'success'), [data]);

  if (!data) return <Box p={3}><Typography>Cargando…</Typography></Box>;

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h5">{data.name}</Typography>
          <Chip size="small" color={debtBadge as any} label={data.totalBalance > 0 ? `Saldo $${data.totalBalance.toLocaleString('es-AR')}` : 'Sin deuda'} />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate(`/clientes/${data.id}/editar`)}>Editar cliente</Button>
          <Button variant="contained" onClick={() => navigate('/facturacion/nueva')}>Nueva factura</Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Información" />
            <Divider />
            <CardContent>
              <Stack spacing={0.5}>
                <Typography variant="body2">Email: {data.email}</Typography>
                <Typography variant="body2">Teléfono: {data.phone}</Typography>
                <Typography variant="body2">Empresa: {data.company}</Typography>
                <Typography variant="body2">CUIT/RUT: {data.taxId}</Typography>
                <Typography variant="body2">Dirección: {data.address}, {data.city}, {data.country}</Typography>
                <Typography variant="body2">Alta: {new Date(data.createdAt).toLocaleDateString()}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="KPIs" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}><Typography variant="caption">Total Comprado</Typography><Typography variant="h6">${data.statistics.totalPurchases.toLocaleString('es-AR')}</Typography></Grid>
                <Grid item xs={12} sm={4}><Typography variant="caption">Ticket promedio</Typography><Typography variant="h6">${data.statistics.averageTicket.toLocaleString('es-AR')}</Typography></Grid>
                <Grid item xs={12} sm={4}><Typography variant="caption">Última compra</Typography><Typography variant="h6">{new Date(data.statistics.lastPurchaseDate).toLocaleDateString()}</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Detalle" />
            <Divider />
            <CardContent>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab value="invoices" label="Facturas" />
                <Tab value="transactions" label="Transacciones" />
                <Tab value="stats" label="Estadísticas" />
              </Tabs>

              {tab === 'invoices' && (
                <Table size="small">
                  <TableHead><TableRow><TableCell>N°</TableCell><TableCell>Estado</TableCell><TableCell align="right">Total</TableCell><TableCell>Vencimiento</TableCell></TableRow></TableHead>
                  <TableBody>
                    {data.invoices.map((inv: Invoice) => (
                      <TableRow key={inv.id} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/facturacion/${inv.id}`)}>
                        <TableCell>{inv.id}</TableCell>
                        <TableCell><Chip size="small" label={inv.status} color={inv.status === 'overdue' ? 'error' : inv.status === 'paid' ? 'success' : 'warning'} /></TableCell>
                        <TableCell align="right">${inv.total.toLocaleString('es-AR')}</TableCell>
                        <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {tab === 'transactions' && (
                <Table size="small">
                  <TableHead><TableRow><TableCell>Fecha</TableCell><TableCell>Tipo</TableCell><TableCell align="right">Monto</TableCell><TableCell align="right">Saldo</TableCell></TableRow></TableHead>
                  <TableBody>
                    {data.transactions.map((t: Transaction) => (
                      <TableRow key={t.id}>
                        <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{t.type}</TableCell>
                        <TableCell align="right">{t.amount < 0 ? '-' : ''}${Math.abs(t.amount).toLocaleString('es-AR')}</TableCell>
                        <TableCell align="right">${t.balance.toLocaleString('es-AR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {tab === 'stats' && (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Productos más comprados</Typography>
                  {data.statistics.topProducts.map((p) => (
                    <Typography key={p.productId} variant="body2">{p.productName}: {p.quantity} u.</Typography>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDetailPage;

