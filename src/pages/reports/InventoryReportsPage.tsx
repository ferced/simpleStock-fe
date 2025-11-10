import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';

interface ProductStock {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  value: number;
  status: 'ok' | 'low' | 'critical' | 'overstock';
}

interface StockMovement {
  date: string;
  entries: number;
  exits: number;
  net: number;
}

interface CategoryStock {
  category: string;
  products: number;
  totalStock: number;
  totalValue: number;
}

interface LocationStock {
  location: string;
  products: number;
  totalStock: number;
}

type TabKey = 'stock' | 'movements' | 'categories' | 'locations';

// Mock data
const mockProductStock: ProductStock[] = [
  {
    productId: 'p1',
    productName: 'Producto A',
    sku: 'SKU-001',
    category: 'Electrónica',
    currentStock: 5,
    minStock: 10,
    maxStock: 100,
    value: 7500,
    status: 'critical',
  },
  {
    productId: 'p2',
    productName: 'Producto B',
    sku: 'SKU-002',
    category: 'Hogar',
    currentStock: 12,
    minStock: 10,
    maxStock: 50,
    value: 30000,
    status: 'low',
  },
  {
    productId: 'p3',
    productName: 'Producto C',
    sku: 'SKU-003',
    category: 'Oficina',
    currentStock: 50,
    minStock: 20,
    maxStock: 100,
    value: 175000,
    status: 'ok',
  },
  {
    productId: 'p4',
    productName: 'Producto D',
    sku: 'SKU-004',
    category: 'Deportes',
    currentStock: 150,
    minStock: 30,
    maxStock: 80,
    value: 300000,
    status: 'overstock',
  },
  {
    productId: 'p5',
    productName: 'Producto E',
    sku: 'SKU-005',
    category: 'Electrónica',
    currentStock: 25,
    minStock: 15,
    maxStock: 60,
    value: 50000,
    status: 'ok',
  },
];

const mockStockMovements: StockMovement[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - i * 86400000).toISOString(),
  entries: Math.floor(Math.random() * 50) + 10,
  exits: Math.floor(Math.random() * 40) + 15,
  net: 0,
})).map(m => ({ ...m, net: m.entries - m.exits }));

const mockCategoryStock: CategoryStock[] = [
  { category: 'Electrónica', products: 15, totalStock: 280, totalValue: 840000 },
  { category: 'Hogar', products: 12, totalStock: 150, totalValue: 450000 },
  { category: 'Oficina', products: 10, totalStock: 200, totalValue: 600000 },
  { category: 'Deportes', products: 8, totalStock: 180, totalValue: 360000 },
];

const mockLocationStock: LocationStock[] = [
  { location: 'Depósito Central', products: 35, totalStock: 450 },
  { location: 'Sucursal 1', products: 28, totalStock: 180 },
  { location: 'Sucursal 2', products: 22, totalStock: 120 },
  { location: 'Sucursal 3', products: 15, totalStock: 60 },
];

export const InventoryReportsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('stock');
  const [isLoading, setIsLoading] = useState(true);

  const [productStock, setProductStock] = useState<ProductStock[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [categoryStock, setCategoryStock] = useState<CategoryStock[]>([]);
  const [locationStock, setLocationStock] = useState<LocationStock[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // TODO: await apiClient.get('/reports/inventory')
      await new Promise(r => setTimeout(r, 500));
      setProductStock(mockProductStock);
      setStockMovements(mockStockMovements);
      setCategoryStock(mockCategoryStock);
      setLocationStock(mockLocationStock);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalProducts = productStock.length;
    const criticalStock = productStock.filter(p => p.status === 'critical').length;
    const lowStock = productStock.filter(p => p.status === 'low').length;
    const overstock = productStock.filter(p => p.status === 'overstock').length;
    const totalValue = productStock.reduce((sum, p) => sum + p.value, 0);
    const totalItems = productStock.reduce((sum, p) => sum + p.currentStock, 0);

    return { totalProducts, criticalStock, lowStock, overstock, totalValue, totalItems };
  }, [productStock]);

  const exportCSV = () => {
    let header: string[] = [];
    let rows: any[][] = [];

    if (tab === 'stock') {
      header = ['SKU', 'Producto', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Stock Máximo', 'Estado', 'Valor'];
      rows = productStock.map(p => [
        p.sku,
        p.productName,
        p.category,
        p.currentStock,
        p.minStock,
        p.maxStock,
        p.status === 'critical' ? 'Crítico' : p.status === 'low' ? 'Bajo' : p.status === 'overstock' ? 'Exceso' : 'OK',
        p.value,
      ]);
    } else if (tab === 'categories') {
      header = ['Categoría', 'Productos', 'Stock Total', 'Valor Total'];
      rows = categoryStock.map(c => [c.category, c.products, c.totalStock, c.totalValue]);
    } else if (tab === 'locations') {
      header = ['Ubicación', 'Productos', 'Stock Total'];
      rows = locationStock.map(l => [l.location, l.products, l.totalStock]);
    }

    const csv = [header, ...rows]
      .map(r => r.map(v => (typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v))).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-inventario-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Reportes de Inventario"
        subtitle="Analizá el estado de tu inventario, movimientos y alertas de stock"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
              Exportar CSV
            </Button>
            <Button variant="outlined" onClick={() => navigate('/inventario')}>
              Ver Inventario
            </Button>
          </Stack>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total Productos
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.totalProducts}
                </Typography>
                <Chip label="Registrados" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Stock Crítico
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {stats.criticalStock}
                </Typography>
                <Chip label="Urgente" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Stock Bajo
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {stats.lowStock}
                </Typography>
                <Chip label="Atención" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Sobrestock
                </Typography>
                <Typography variant="h5" fontWeight={700} color="info.main">
                  {stats.overstock}
                </Typography>
                <Chip label="Exceso" size="small" color="info" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Items Totales
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {stats.totalItems}
                </Typography>
                <Chip label="Unidades" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Valor Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  ${(stats.totalValue / 1000).toFixed(0)}k
                </Typography>
                <Chip label="Inventario" size="small" color="success" />
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
              <Tab value="stock" label="Estado de Stock" />
              <Tab value="movements" label="Movimientos" />
              <Tab value="categories" label="Por Categoría" />
              <Tab value="locations" label="Por Ubicación" />
            </Tabs>

            <Divider />

            {isLoading ? (
              <LinearProgress />
            ) : (
              <Box>
                {tab === 'stock' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Nivel de stock actual por producto con alertas de reabastecimiento
                    </Typography>

                    {stats.criticalStock > 0 && (
                      <Alert severity="error" icon={<WarningIcon />}>
                        {stats.criticalStock} producto(s) con stock crítico requieren atención inmediata
                      </Alert>
                    )}

                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>SKU</TableCell>
                          <TableCell>Producto</TableCell>
                          <TableCell>Categoría</TableCell>
                          <TableCell align="right">Stock Actual</TableCell>
                          <TableCell align="right">Mín/Máx</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell align="right">Valor</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productStock.map((product) => (
                          <TableRow key={product.productId}>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {product.sku}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {product.productName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {product.category}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color={
                                  product.status === 'critical' ? 'error.main' :
                                  product.status === 'low' ? 'warning.main' :
                                  product.status === 'overstock' ? 'info.main' :
                                  'text.primary'
                                }
                              >
                                {product.currentStock}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="text.secondary">
                                {product.minStock} / {product.maxStock}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={
                                  product.status === 'critical' ? 'Crítico' :
                                  product.status === 'low' ? 'Bajo' :
                                  product.status === 'overstock' ? 'Exceso' :
                                  'OK'
                                }
                                color={
                                  product.status === 'critical' ? 'error' :
                                  product.status === 'low' ? 'warning' :
                                  product.status === 'overstock' ? 'info' :
                                  'success'
                                }
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600}>
                                ${product.value.toLocaleString('es-AR')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Stack>
                )}

                {tab === 'movements' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Historial de movimientos de inventario (entradas y salidas)
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Fecha</TableCell>
                          <TableCell align="right">Entradas</TableCell>
                          <TableCell align="right">Salidas</TableCell>
                          <TableCell align="right">Neto</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stockMovements.slice(0, 15).map((movement, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {new Date(movement.date).toLocaleDateString('es-AR')}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="success.main">
                                +{movement.entries}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="error.main">
                                -{movement.exits}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color={movement.net >= 0 ? 'success.main' : 'error.main'}
                              >
                                {movement.net >= 0 ? '+' : ''}{movement.net}
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
                      Distribución de inventario por categoría de producto
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Categoría</TableCell>
                          <TableCell align="right">Productos</TableCell>
                          <TableCell align="right">Stock Total</TableCell>
                          <TableCell align="right">Valor Total</TableCell>
                          <TableCell align="right">% del Valor</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categoryStock.map((category) => (
                          <TableRow key={category.category}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {category.category}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{category.products}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600}>
                                {category.totalStock}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                ${category.totalValue.toLocaleString('es-AR')}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {((category.totalValue / stats.totalValue) * 100).toFixed(1)}%
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Stack>
                )}

                {tab === 'locations' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Distribución de productos por ubicación física
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ubicación</TableCell>
                          <TableCell align="right">Productos</TableCell>
                          <TableCell align="right">Stock Total</TableCell>
                          <TableCell align="right">% del Stock</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {locationStock.map((location) => (
                          <TableRow key={location.location}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {location.location}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">{location.products}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600}>
                                {location.totalStock}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {((location.totalStock / stats.totalItems) * 100).toFixed(1)}%
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

      {/* Alerts */}
      {stats.criticalStock + stats.lowStock > 0 && (
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <TrendingDownIcon color="error" />
              <Typography variant="h6" fontWeight={700}>
                Alertas de Inventario
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {stats.criticalStock > 0 && (
                <Alert severity="error">
                  <Typography variant="body2" fontWeight={600}>
                    Stock Crítico ({stats.criticalStock} productos)
                  </Typography>
                  <Typography variant="body2">
                    Algunos productos están por debajo del nivel mínimo. Se recomienda realizar pedidos urgentes.
                  </Typography>
                </Alert>
              )}
              {stats.lowStock > 0 && (
                <Alert severity="warning">
                  <Typography variant="body2" fontWeight={600}>
                    Stock Bajo ({stats.lowStock} productos)
                  </Typography>
                  <Typography variant="body2">
                    Varios productos están cerca del nivel mínimo. Considerá planificar reabastecimiento.
                  </Typography>
                </Alert>
              )}
              {stats.overstock > 0 && (
                <Alert severity="info">
                  <Typography variant="body2" fontWeight={600}>
                    Sobrestock ({stats.overstock} productos)
                  </Typography>
                  <Typography variant="body2">
                    Algunos productos tienen stock por encima del máximo recomendado. Podría haber capital innecesario inmovilizado.
                  </Typography>
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default InventoryReportsPage;
