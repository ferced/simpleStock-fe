import { useState, useEffect, useMemo } from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import SpeedIcon from '@mui/icons-material/Speed';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import dayjs from 'dayjs';

interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  status: 'good' | 'warning' | 'critical';
}

interface TrendData {
  period: string;
  sales: number;
  inventory: number;
  margin: number;
}

interface Forecast {
  period: string;
  projected: number;
  confidence: number;
  type: 'optimistic' | 'realistic' | 'pessimistic';
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  units: number;
  growth: number;
  margin: number;
}

const mockKPIs: KPI[] = [
  {
    id: 'kpi-1',
    name: 'Ventas Mensuales',
    value: 1250000,
    target: 1200000,
    unit: '$',
    trend: 8.5,
    status: 'good',
  },
  {
    id: 'kpi-2',
    name: 'Margen Promedio',
    value: 32.5,
    target: 35,
    unit: '%',
    trend: -2.1,
    status: 'warning',
  },
  {
    id: 'kpi-3',
    name: 'Rotación de Inventario',
    value: 4.2,
    target: 5,
    unit: 'x',
    trend: 5.3,
    status: 'warning',
  },
  {
    id: 'kpi-4',
    name: 'Tasa de Conversión',
    value: 68,
    target: 65,
    unit: '%',
    trend: 12.4,
    status: 'good',
  },
  {
    id: 'kpi-5',
    name: 'Valor Promedio Pedido',
    value: 45000,
    target: 42000,
    unit: '$',
    trend: 7.1,
    status: 'good',
  },
  {
    id: 'kpi-6',
    name: 'Stock Crítico',
    value: 8,
    target: 5,
    unit: 'productos',
    trend: -15,
    status: 'critical',
  },
];

const mockTrendData: TrendData[] = [
  { period: 'Ene', sales: 980000, inventory: 850000, margin: 28 },
  { period: 'Feb', sales: 1050000, inventory: 820000, margin: 30 },
  { period: 'Mar', sales: 1120000, inventory: 790000, margin: 31 },
  { period: 'Abr', sales: 1080000, inventory: 810000, margin: 29 },
  { period: 'May', sales: 1180000, inventory: 780000, margin: 32 },
  { period: 'Jun', sales: 1250000, inventory: 760000, margin: 33 },
  { period: 'Jul', sales: 1320000, inventory: 740000, margin: 34 },
  { period: 'Ago', sales: 1280000, inventory: 750000, margin: 33 },
  { period: 'Sep', sales: 1350000, inventory: 720000, margin: 35 },
  { period: 'Oct', sales: 1420000, inventory: 710000, margin: 36 },
  { period: 'Nov', sales: 1250000, inventory: 730000, margin: 32 },
  { period: 'Dic', sales: 1500000, inventory: 700000, margin: 38 },
];

const mockForecasts: Forecast[] = [
  { period: 'Dic 2025', projected: 1520000, confidence: 85, type: 'realistic' },
  { period: 'Ene 2026', projected: 1380000, confidence: 78, type: 'realistic' },
  { period: 'Feb 2026', projected: 1450000, confidence: 72, type: 'realistic' },
  { period: 'Mar 2026', projected: 1600000, confidence: 65, type: 'optimistic' },
];

const mockTopProducts: TopProduct[] = [
  { id: 'p1', name: 'Monitor LED 27"', sales: 285000, units: 45, growth: 15.2, margin: 28 },
  { id: 'p2', name: 'Notebook Pro 14"', sales: 420000, units: 12, growth: 8.5, margin: 22 },
  { id: 'p3', name: 'Teclado Mecánico RGB', sales: 156000, units: 78, growth: 25.3, margin: 35 },
  { id: 'p4', name: 'Mouse Inalámbrico', sales: 98000, units: 196, growth: -5.2, margin: 42 },
  { id: 'p5', name: 'Webcam HD 1080p', sales: 87000, units: 58, growth: 32.1, margin: 38 },
];

export const AnalyticsDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [dateRange, setDateRange] = useState('last_12_months');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      setKpis(mockKPIs);
      setTrendData(mockTrendData);
      setForecasts(mockForecasts);
      setTopProducts(mockTopProducts);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const maxSales = useMemo(() => Math.max(...trendData.map((d) => d.sales)), [trendData]);

  const totalSales = useMemo(() => trendData.reduce((sum, d) => sum + d.sales, 0), [trendData]);
  const avgMargin = useMemo(
    () => trendData.reduce((sum, d) => sum + d.margin, 0) / trendData.length,
    [trendData]
  );

  const getStatusIcon = (status: KPI['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'warning':
        return <WarningIcon fontSize="small" color="warning" />;
      case 'critical':
        return <WarningIcon fontSize="small" color="error" />;
    }
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Dashboard Analítico"
        subtitle="Análisis de tendencias, KPIs y proyecciones en tiempo real"
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              Última actualización: {dayjs(lastUpdate).format('HH:mm:ss')}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={isLoading}
            >
              Actualizar
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Exportar
            </Button>
          </Stack>
        }
      />

      {isLoading && <LinearProgress />}

      {/* Filtros */}
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Período de Análisis"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="last_30_days">Últimos 30 días</MenuItem>
                <MenuItem value="last_90_days">Últimos 90 días</MenuItem>
                <MenuItem value="last_6_months">Últimos 6 meses</MenuItem>
                <MenuItem value="last_12_months">Últimos 12 meses</MenuItem>
                <MenuItem value="ytd">Año actual (YTD)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={`Desde: ${dayjs().subtract(12, 'month').format('MMM YYYY')}`}
                />
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={`Hasta: ${dayjs().format('MMM YYYY')}`}
                  color="primary"
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* KPIs en Tiempo Real */}
      <Box>
        <Typography variant="h6" fontWeight={700} mb={2}>
          KPIs en Tiempo Real
        </Typography>
        <Grid container spacing={3}>
          {kpis.map((kpi) => {
            const progress = (kpi.value / kpi.target) * 100;
            return (
              <Grid item xs={12} sm={6} md={4} lg={2} key={kpi.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderLeft: 4,
                    borderColor:
                      kpi.status === 'good'
                        ? 'success.main'
                        : kpi.status === 'warning'
                        ? 'warning.main'
                        : 'error.main',
                  }}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {kpi.name}
                        </Typography>
                        {getStatusIcon(kpi.status)}
                      </Stack>
                      <Typography variant="h5" fontWeight={700}>
                        {kpi.unit === '$'
                          ? `$${kpi.value.toLocaleString('es-AR')}`
                          : `${kpi.value}${kpi.unit}`}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {kpi.trend >= 0 ? (
                          <TrendingUpIcon fontSize="small" color="success" />
                        ) : (
                          <TrendingDownIcon fontSize="small" color="error" />
                        )}
                        <Typography
                          variant="caption"
                          color={kpi.trend >= 0 ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {kpi.trend >= 0 ? '+' : ''}
                          {kpi.trend}%
                        </Typography>
                      </Stack>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Meta: {kpi.unit === '$' ? '$' : ''}
                          {kpi.target.toLocaleString('es-AR')}
                          {kpi.unit !== '$' ? kpi.unit : ''}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(progress, 100)}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            mt: 0.5,
                          }}
                          color={progress >= 100 ? 'success' : progress >= 80 ? 'primary' : 'warning'}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Gráficos de Tendencias */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <TimelineIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                      Tendencia de Ventas
                    </Typography>
                  </Box>
                  <Chip
                    label={`Total: $${(totalSales / 1000000).toFixed(2)}M`}
                    color="primary"
                  />
                </Stack>

                <Grid container spacing={1} alignItems="flex-end" sx={{ height: 250 }}>
                  {trendData.map((data) => {
                    const heightPercent = (data.sales / maxSales) * 100;
                    const isCurrentMonth = data.period === dayjs().format('MMM').charAt(0).toUpperCase() + dayjs().format('MMM').slice(1);
                    return (
                      <Grid item xs={1} key={data.period}>
                        <Stack spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: '100%',
                              height: `${heightPercent * 2}px`,
                              bgcolor: isCurrentMonth ? 'primary.main' : 'primary.light',
                              borderRadius: '4px 4px 0 0',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                transform: 'scaleY(1.02)',
                              },
                            }}
                            title={`${data.period}: $${data.sales.toLocaleString('es-AR')}`}
                          />
                          <Typography variant="caption" fontWeight={isCurrentMonth ? 700 : 400}>
                            {data.period}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            ${(data.sales / 1000).toFixed(0)}k
                          </Typography>
                        </Stack>
                      </Grid>
                    );
                  })}
                </Grid>

                <Divider />

                <Stack direction="row" spacing={3} justifyContent="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                    <Typography variant="caption">Mes actual</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 16, height: 16, bgcolor: 'primary.light', borderRadius: 0.5 }} />
                    <Typography variant="caption">Otros meses</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ShowChartIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Proyecciones
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {forecasts.map((forecast) => (
                    <Paper key={forecast.period} variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={600}>
                            {forecast.period}
                          </Typography>
                          <Chip
                            size="small"
                            label={
                              forecast.type === 'optimistic'
                                ? 'Optimista'
                                : forecast.type === 'pessimistic'
                                ? 'Conservador'
                                : 'Realista'
                            }
                            color={
                              forecast.type === 'optimistic'
                                ? 'success'
                                : forecast.type === 'pessimistic'
                                ? 'warning'
                                : 'primary'
                            }
                            variant="outlined"
                          />
                        </Stack>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                          ${forecast.projected.toLocaleString('es-AR')}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinearProgress
                            variant="determinate"
                            value={forecast.confidence}
                            sx={{ flex: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {forecast.confidence}% confianza
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Productos y Métricas */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <BarChartIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Top Productos por Ventas
                  </Typography>
                </Box>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Ventas</TableCell>
                      <TableCell align="right">Unidades</TableCell>
                      <TableCell align="right">Crecimiento</TableCell>
                      <TableCell align="right">Margen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={index + 1}
                              size="small"
                              color={index === 0 ? 'primary' : 'default'}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {product.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${product.sales.toLocaleString('es-AR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{product.units}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="flex-end">
                            {product.growth >= 0 ? (
                              <TrendingUpIcon fontSize="small" color="success" />
                            ) : (
                              <TrendingDownIcon fontSize="small" color="error" />
                            )}
                            <Typography
                              variant="body2"
                              color={product.growth >= 0 ? 'success.main' : 'error.main'}
                              fontWeight={600}
                            >
                              {product.growth >= 0 ? '+' : ''}
                              {product.growth}%
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            size="small"
                            label={`${product.margin}%`}
                            color={product.margin >= 35 ? 'success' : product.margin >= 25 ? 'warning' : 'error'}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <SpeedIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Métricas Avanzadas
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Días de Inventario
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          42
                        </Typography>
                      </Box>
                      <Chip label="Óptimo: 30-45 días" size="small" color="success" />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={70}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color="success"
                    />
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Índice de Satisfacción
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          8.5/10
                        </Typography>
                      </Box>
                      <Chip label="+0.3 vs mes ant." size="small" color="primary" />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color="primary"
                    />
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tasa de Recompra
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          45%
                        </Typography>
                      </Box>
                      <Chip label="Meta: 50%" size="small" color="warning" />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={90}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color="warning"
                    />
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Margen Promedio
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {avgMargin.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Chip label={`Meta: 35%`} size="small" color={avgMargin >= 35 ? 'success' : 'warning'} />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(avgMargin / 35) * 100}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color={avgMargin >= 35 ? 'success' : 'warning'}
                    />
                  </Paper>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AnalyticsDashboardPage;
