import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import dayjs from 'dayjs';

interface SalesSummary {
  date: string;
  invoices: number;
  revenue: number;
  items: number;
}

interface ProductSales {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

interface ClientSales {
  clientId: string;
  clientName: string;
  invoices: number;
  revenue: number;
}

interface CategorySales {
  category: string;
  quantity: number;
  revenue: number;
}

type TabKey = 'daily' | 'products' | 'clients' | 'categories';

// Mock data
const mockDailySales: SalesSummary[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - i * 86400000).toISOString(),
  invoices: Math.floor(Math.random() * 10) + 5,
  revenue: Math.floor(Math.random() * 100000) + 50000,
  items: Math.floor(Math.random() * 50) + 20,
}));

const mockProductSales: ProductSales[] = [
  { productId: 'p1', productName: 'Producto A', quantity: 150, revenue: 225000 },
  { productId: 'p2', productName: 'Producto B', quantity: 120, revenue: 300000 },
  { productId: 'p3', productName: 'Producto C', quantity: 90, revenue: 315000 },
  { productId: 'p4', productName: 'Producto D', quantity: 75, revenue: 150000 },
  { productId: 'p5', productName: 'Producto E', quantity: 60, revenue: 120000 },
];

const mockClientSales: ClientSales[] = [
  { clientId: 'c1', clientName: 'Cliente Demo', invoices: 15, revenue: 750000 },
  { clientId: 'c2', clientName: 'Empresa ABC', invoices: 12, revenue: 900000 },
  { clientId: 'c3', clientName: 'Corporación XYZ', invoices: 10, revenue: 1200000 },
  { clientId: 'c4', clientName: 'Comercio 123', invoices: 8, revenue: 400000 },
  { clientId: 'c5', clientName: 'Negocio 456', invoices: 6, revenue: 300000 },
];

const mockCategorySales: CategorySales[] = [
  { category: 'Electrónica', quantity: 200, revenue: 800000 },
  { category: 'Hogar', quantity: 150, revenue: 450000 },
  { category: 'Oficina', quantity: 120, revenue: 360000 },
  { category: 'Deportes', quantity: 80, revenue: 240000 },
  { category: 'Otros', quantity: 50, revenue: 150000 },
];

export const SalesReportsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('daily');
  const [period, setPeriod] = useState<string>('30days');
  const [isLoading, setIsLoading] = useState(true);

  const [dailySales, setDailySales] = useState<SalesSummary[]>([]);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [clientSales, setClientSales] = useState<ClientSales[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // TODO: await apiClient.get('/reports/sales')
      await new Promise(r => setTimeout(r, 500));
      setDailySales(mockDailySales);
      setProductSales(mockProductSales);
      setClientSales(mockClientSales);
      setCategorySales(mockCategorySales);
      setIsLoading(false);
    };

    loadData();
  }, [period]);

  const stats = useMemo(() => {
    const totalRevenue = dailySales.reduce((sum, s) => sum + s.revenue, 0);
    const totalInvoices = dailySales.reduce((sum, s) => sum + s.invoices, 0);
    const totalItems = dailySales.reduce((sum, s) => sum + s.items, 0);
    const avgInvoice = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

    return { totalRevenue, totalInvoices, totalItems, avgInvoice };
  }, [dailySales]);

  const exportCSV = () => {
    let header: string[] = [];
    let rows: any[][] = [];

    if (tab === 'daily') {
      header = ['Fecha', 'Facturas', 'Ingresos', 'Items'];
      rows = dailySales.map(s => [
        dayjs(s.date).format('DD/MM/YYYY'),
        s.invoices,
        s.revenue,
        s.items,
      ]);
    } else if (tab === 'products') {
      header = ['Producto', 'Cantidad', 'Ingresos'];
      rows = productSales.map(p => [p.productName, p.quantity, p.revenue]);
    } else if (tab === 'clients') {
      header = ['Cliente', 'Facturas', 'Ingresos'];
      rows = clientSales.map(c => [c.clientName, c.invoices, c.revenue]);
    } else if (tab === 'categories') {
      header = ['Categoría', 'Cantidad', 'Ingresos'];
      rows = categorySales.map(c => [c.category, c.quantity, c.revenue]);
    }

    const csv = [header, ...rows]
      .map(r => r.map(v => (typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v))).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ventas-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Reportes de Ventas"
        subtitle="Analizá el rendimiento de ventas por día, producto, cliente y categoría"
        action={
          <Stack direction="row" spacing={1}>
            <TextField
              select
              size="small"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="7days">Últimos 7 días</MenuItem>
              <MenuItem value="30days">Últimos 30 días</MenuItem>
              <MenuItem value="90days">Últimos 90 días</MenuItem>
            </TextField>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
              Exportar CSV
            </Button>
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
                  Ingresos Totales
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  ${(stats.totalRevenue / 1000).toFixed(0)}k
                </Typography>
                <Chip label="Período seleccionado" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total Facturas
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.totalInvoices}
                </Typography>
                <Chip label="Emitidas" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Items Vendidos
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {stats.totalItems}
                </Typography>
                <Chip label="Unidades" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Ticket Promedio
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  ${(stats.avgInvoice / 1000).toFixed(1)}k
                </Typography>
                <Chip label="Por factura" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reportes */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab value="daily" label="Ventas Diarias" />
              <Tab value="products" label="Por Producto" />
              <Tab value="clients" label="Por Cliente" />
              <Tab value="categories" label="Por Categoría" />
            </Tabs>

            <Divider />

            {isLoading ? (
              <LinearProgress />
            ) : (
              <Box>
                {tab === 'daily' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Resumen de ventas por día en el período seleccionado
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Fecha</TableCell>
                          <TableCell align="right">Facturas</TableCell>
                          <TableCell align="right">Items</TableCell>
                          <TableCell align="right">Ingresos</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dailySales.slice(0, 15).map((sale, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {dayjs(sale.date).format('DD/MM/YYYY')}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{sale.invoices}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{sale.items}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                ${sale.revenue.toLocaleString('es-AR')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Stack>
                )}

                {tab === 'products' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Ranking de productos más vendidos
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ranking</TableCell>
                          <TableCell>Producto</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell align="right">Ingresos</TableCell>
                          <TableCell align="right">% del Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productSales.map((product, idx) => (
                          <TableRow key={product.productId}>
                            <TableCell>
                              <Chip
                                label={`#${idx + 1}`}
                                size="small"
                                color={idx === 0 ? 'success' : idx === 1 ? 'warning' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {product.productName}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{product.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                ${product.revenue.toLocaleString('es-AR')}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {((product.revenue / stats.totalRevenue) * 100).toFixed(1)}%
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Stack>
                )}

                {tab === 'clients' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Clientes con más facturación en el período
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ranking</TableCell>
                          <TableCell>Cliente</TableCell>
                          <TableCell align="right">Facturas</TableCell>
                          <TableCell align="right">Ingresos</TableCell>
                          <TableCell align="right">Ticket Promedio</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clientSales.map((client, idx) => (
                          <TableRow key={client.clientId}>
                            <TableCell>
                              <Chip
                                label={`#${idx + 1}`}
                                size="small"
                                color={idx === 0 ? 'success' : idx === 1 ? 'warning' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {client.clientName}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{client.invoices}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                ${client.revenue.toLocaleString('es-AR')}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                ${(client.revenue / client.invoices).toLocaleString('es-AR')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Stack>
                )}

                {tab === 'categories' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Ventas por categoría de producto
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Categoría</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell align="right">Ingresos</TableCell>
                          <TableCell align="right">% del Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categorySales.map((category) => (
                          <TableRow key={category.category}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {category.category}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{category.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                ${category.revenue.toLocaleString('es-AR')}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {((category.revenue / stats.totalRevenue) * 100).toFixed(1)}%
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Stack>
                )}
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Insights
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Producto Más Vendido
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {productSales[0]?.productName} lidera las ventas con {productSales[0]?.quantity} unidades vendidas y
                ${productSales[0]?.revenue.toLocaleString('es-AR')} en ingresos.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Cliente Principal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {clientSales[0]?.clientName} es tu cliente más importante con {clientSales[0]?.invoices} facturas y
                ${clientSales[0]?.revenue.toLocaleString('es-AR')} en ventas.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Categoría Destacada
              </Typography>
              <Typography variant="body2" color="text.secondary">
                La categoría {categorySales[0]?.category} representa el{' '}
                {((categorySales[0]?.revenue / stats.totalRevenue) * 100).toFixed(1)}% de tus ingresos totales.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default SalesReportsPage;
