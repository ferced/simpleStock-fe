import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import dayjs from 'dayjs';

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  items: number;
  totalAmount: number;
  expectedDate: string;
  createdAt: string;
}

const mockOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    supplierId: 'sup-1',
    supplierName: 'Proveedor Alpha',
    status: 'received',
    items: 5,
    totalAmount: 125000,
    expectedDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'PO-002',
    supplierId: 'sup-2',
    supplierName: 'Proveedor Beta',
    status: 'confirmed',
    items: 8,
    totalAmount: 95000,
    expectedDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'PO-003',
    supplierId: 'sup-3',
    supplierName: 'Proveedor Gamma',
    status: 'sent',
    items: 12,
    totalAmount: 215000,
    expectedDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'PO-004',
    supplierId: 'sup-1',
    supplierName: 'Proveedor Alpha',
    status: 'draft',
    items: 3,
    totalAmount: 45000,
    expectedDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  confirmed: 'Confirmada',
  received: 'Recibida',
  cancelled: 'Cancelada',
};

const statusIcons: Record<string, any> = {
  draft: PendingIcon,
  sent: LocalShippingIcon,
  confirmed: CheckCircleIcon,
  received: CheckCircleIcon,
  cancelled: PendingIcon,
};

export const PurchaseOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      // TODO: await apiClient.get('/purchase-orders')
      await new Promise(r => setTimeout(r, 500));
      setOrders(mockOrders);
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        o =>
          o.id.toLowerCase().includes(s) ||
          o.supplierName.toLowerCase().includes(s)
      );
    }

    return filtered;
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const totalCount = orders.length;
    const draftCount = orders.filter(o => o.status === 'draft').length;
    const sentCount = orders.filter(o => o.status === 'sent').length;
    const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
    const receivedCount = orders.filter(o => o.status === 'received').length;
    const totalAmount = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { totalCount, draftCount, sentCount, confirmedCount, receivedCount, totalAmount };
  }, [orders]);

  const exportCSV = () => {
    const header = ['Número', 'Proveedor', 'Estado', 'Items', 'Monto', 'Fecha Esperada', 'Creación'];
    const rows = filteredOrders.map(o => [
      o.id,
      o.supplierName,
      statusLabels[o.status],
      o.items,
      o.totalAmount,
      dayjs(o.expectedDate).format('DD/MM/YYYY'),
      dayjs(o.createdAt).format('DD/MM/YYYY'),
    ]);
    const csv = [header, ...rows]
      .map(r => r.map(v => (typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v))).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ordenes-compra.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Órdenes de Compra"
        subtitle="Gestioná tus compras a proveedores"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
              Exportar
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/proveedores/ordenes/nueva')}>
              Nueva Orden
            </Button>
          </Stack>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total de Órdenes
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.totalCount}
                </Typography>
                <Chip label="Todas" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Borradores
                </Typography>
                <Typography variant="h5" fontWeight={700} color="text.secondary">
                  {stats.draftCount}
                </Typography>
                <Chip label="Pendientes" size="small" color="default" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Enviadas
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {stats.sentCount}
                </Typography>
                <Chip label="En tránsito" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Confirmadas
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {stats.confirmedCount}
                </Typography>
                <Chip label="Por recibir" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Monto Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  ${(stats.totalAmount / 1000).toFixed(0)}k
                </Typography>
                <Chip label="Inversión" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Órdenes */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Buscar por número u orden o proveedor"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos los estados</MenuItem>
                  <MenuItem value="draft">Borradores</MenuItem>
                  <MenuItem value="sent">Enviadas</MenuItem>
                  <MenuItem value="confirmed">Confirmadas</MenuItem>
                  <MenuItem value="received">Recibidas</MenuItem>
                  <MenuItem value="cancelled">Canceladas</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary">
              Mostrando {filteredOrders.length} de {orders.length} órdenes de compra
            </Typography>

            {isLoading ? (
              <LinearProgress />
            ) : filteredOrders.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {search || statusFilter !== 'all' ? 'No se encontraron órdenes' : 'No hay órdenes registradas'}
                </Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Número</TableCell>
                    <TableCell>Proveedor</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Items</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell>Fecha Esperada</TableCell>
                    <TableCell>Creación</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status];
                    return (
                      <TableRow
                        key={order.id}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'action.hover' },
                        }}
                        onClick={() => navigate(`/proveedores/ordenes/${order.id}`)}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {order.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{order.supplierName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            icon={<StatusIcon fontSize="small" />}
                            label={statusLabels[order.status]}
                            color={
                              order.status === 'received'
                                ? 'success'
                                : order.status === 'confirmed'
                                ? 'warning'
                                : order.status === 'sent'
                                ? 'primary'
                                : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{order.items}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${order.totalAmount.toLocaleString('es-AR')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {dayjs(order.expectedDate).format('DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {dayjs(order.createdAt).format('DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default PurchaseOrdersPage;
