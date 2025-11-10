import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
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

interface IncomeStatement {
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  taxes: number;
  netIncome: number;
}

interface CashFlow {
  operatingActivities: number;
  investingActivities: number;
  financingActivities: number;
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

interface FinancialMetrics {
  grossMargin: number;
  netMargin: number;
  returnOnSales: number;
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

type TabKey = 'income' | 'cashflow' | 'metrics' | 'monthly';

// Mock data
const mockIncomeStatement: IncomeStatement = {
  revenue: 5000000,
  costOfGoodsSold: 3000000,
  grossProfit: 2000000,
  operatingExpenses: 1200000,
  operatingIncome: 800000,
  taxes: 160000,
  netIncome: 640000,
};

const mockCashFlow: CashFlow = {
  operatingActivities: 750000,
  investingActivities: -200000,
  financingActivities: -100000,
  netCashFlow: 450000,
  beginningCash: 500000,
  endingCash: 950000,
};

const mockMetrics: FinancialMetrics = {
  grossMargin: 40.0,
  netMargin: 12.8,
  returnOnSales: 16.0,
  currentRatio: 2.5,
  quickRatio: 1.8,
  debtToEquity: 0.6,
};

const mockMonthlyData: MonthlyData[] = [
  { month: 'Enero', revenue: 450000, expenses: 280000, profit: 170000 },
  { month: 'Febrero', revenue: 420000, expenses: 260000, profit: 160000 },
  { month: 'Marzo', revenue: 480000, expenses: 290000, profit: 190000 },
  { month: 'Abril', revenue: 510000, expenses: 310000, profit: 200000 },
  { month: 'Mayo', revenue: 490000, expenses: 295000, profit: 195000 },
  { month: 'Junio', revenue: 530000, expenses: 320000, profit: 210000 },
];

export const FinancialReportsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('income');
  const [period, setPeriod] = useState<string>('current-year');
  const [isLoading, setIsLoading] = useState(true);

  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement>(mockIncomeStatement);
  const [cashFlow, setCashFlow] = useState<CashFlow>(mockCashFlow);
  const [metrics, setMetrics] = useState<FinancialMetrics>(mockMetrics);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(mockMonthlyData);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // TODO: await apiClient.get('/reports/financial')
      await new Promise(r => setTimeout(r, 500));
      setIncomeStatement(mockIncomeStatement);
      setCashFlow(mockCashFlow);
      setMetrics(mockMetrics);
      setMonthlyData(mockMonthlyData);
      setIsLoading(false);
    };

    loadData();
  }, [period]);

  const stats = useMemo(() => {
    const totalRevenue = incomeStatement.revenue;
    const totalProfit = incomeStatement.netIncome;
    const profitMargin = (totalProfit / totalRevenue) * 100;
    const totalCashFlow = cashFlow.netCashFlow;

    return { totalRevenue, totalProfit, profitMargin, totalCashFlow };
  }, [incomeStatement, cashFlow]);

  const exportCSV = () => {
    let header: string[] = [];
    let rows: any[][] = [];

    if (tab === 'income') {
      header = ['Concepto', 'Monto'];
      rows = [
        ['Ingresos', incomeStatement.revenue],
        ['Costo de Ventas', incomeStatement.costOfGoodsSold],
        ['Utilidad Bruta', incomeStatement.grossProfit],
        ['Gastos Operativos', incomeStatement.operatingExpenses],
        ['Utilidad Operativa', incomeStatement.operatingIncome],
        ['Impuestos', incomeStatement.taxes],
        ['Utilidad Neta', incomeStatement.netIncome],
      ];
    } else if (tab === 'cashflow') {
      header = ['Concepto', 'Monto'];
      rows = [
        ['Actividades Operativas', cashFlow.operatingActivities],
        ['Actividades de Inversión', cashFlow.investingActivities],
        ['Actividades de Financiamiento', cashFlow.financingActivities],
        ['Flujo Neto de Efectivo', cashFlow.netCashFlow],
        ['Efectivo Inicial', cashFlow.beginningCash],
        ['Efectivo Final', cashFlow.endingCash],
      ];
    } else if (tab === 'monthly') {
      header = ['Mes', 'Ingresos', 'Gastos', 'Utilidad'];
      rows = monthlyData.map(m => [m.month, m.revenue, m.expenses, m.profit]);
    }

    const csv = [header, ...rows]
      .map(r => r.map(v => (typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v))).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-financiero-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Reportes Financieros"
        subtitle="Analizá el estado financiero, flujo de caja y métricas clave"
        action={
          <Stack direction="row" spacing={1}>
            <TextField
              select
              size="small"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="current-month">Mes Actual</MenuItem>
              <MenuItem value="current-quarter">Trimestre Actual</MenuItem>
              <MenuItem value="current-year">Año Actual</MenuItem>
              <MenuItem value="last-year">Año Anterior</MenuItem>
            </TextField>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
              Exportar CSV
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
                <Typography variant="caption" color="text.secondary">
                  Ingresos Totales
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  ${(stats.totalRevenue / 1000000).toFixed(1)}M
                </Typography>
                <Chip label="Período seleccionado" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Utilidad Neta
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  ${(stats.totalProfit / 1000).toFixed(0)}k
                </Typography>
                <Chip label="Ganancia" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Margen de Utilidad
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {stats.profitMargin.toFixed(1)}%
                </Typography>
                <Chip label="Rentabilidad" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Flujo de Caja Neto
                </Typography>
                <Typography variant="h5" fontWeight={700} color={stats.totalCashFlow >= 0 ? 'success.main' : 'error.main'}>
                  ${(stats.totalCashFlow / 1000).toFixed(0)}k
                </Typography>
                <Chip
                  label={stats.totalCashFlow >= 0 ? 'Positivo' : 'Negativo'}
                  size="small"
                  color={stats.totalCashFlow >= 0 ? 'success' : 'error'}
                />
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
              <Tab value="income" label="Estado de Resultados" />
              <Tab value="cashflow" label="Flujo de Caja" />
              <Tab value="metrics" label="Métricas Financieras" />
              <Tab value="monthly" label="Evolución Mensual" />
            </Tabs>

            <Divider />

            {isLoading ? (
              <LinearProgress />
            ) : (
              <Box>
                {tab === 'income' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Estado de resultados consolidado del período
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              Ingresos
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600} color="primary.main">
                              ${incomeStatement.revenue.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ pl: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              Costo de Ventas
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="error.main">
                              (${incomeStatement.costOfGoodsSold.toLocaleString('es-AR')})
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              Utilidad Bruta
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              ${incomeStatement.grossProfit.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ pl: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              Gastos Operativos
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="error.main">
                              (${incomeStatement.operatingExpenses.toLocaleString('es-AR')})
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              Utilidad Operativa
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              ${incomeStatement.operatingIncome.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ pl: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              Impuestos
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="error.main">
                              (${incomeStatement.taxes.toLocaleString('es-AR')})
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'success.light' }}>
                          <TableCell>
                            <Typography variant="body1" fontWeight={700}>
                              Utilidad Neta
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" fontWeight={700} color="success.dark">
                              ${incomeStatement.netIncome.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Stack>
                )}

                {tab === 'cashflow' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Estado de flujo de efectivo del período
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              Actividades Operativas
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              ${cashFlow.operatingActivities.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              Actividades de Inversión
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600} color="error.main">
                              ${cashFlow.investingActivities.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              Actividades de Financiamiento
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600} color="error.main">
                              ${cashFlow.financingActivities.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={700}>
                              Flujo Neto de Efectivo
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={700}>
                              ${cashFlow.netCashFlow.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Divider sx={{ my: 1 }} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2">
                              Efectivo al Inicio del Período
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              ${cashFlow.beginningCash.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: 'primary.light' }}>
                          <TableCell>
                            <Typography variant="body1" fontWeight={700}>
                              Efectivo al Final del Período
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" fontWeight={700} color="primary.dark">
                              ${cashFlow.endingCash.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Stack>
                )}

                {tab === 'metrics' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Indicadores financieros clave y ratios
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Rentabilidad
                            </Typography>
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <TableCell>Margen Bruto</TableCell>
                                  <TableCell align="right">
                                    <Chip label={`${metrics.grossMargin.toFixed(1)}%`} size="small" color="success" />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Margen Neto</TableCell>
                                  <TableCell align="right">
                                    <Chip label={`${metrics.netMargin.toFixed(1)}%`} size="small" color="success" />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>ROI sobre Ventas</TableCell>
                                  <TableCell align="right">
                                    <Chip label={`${metrics.returnOnSales.toFixed(1)}%`} size="small" color="primary" />
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Liquidez y Solvencia
                            </Typography>
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <TableCell>Ratio Corriente</TableCell>
                                  <TableCell align="right">
                                    <Chip label={metrics.currentRatio.toFixed(2)} size="small" color="info" />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Ratio Rápido</TableCell>
                                  <TableCell align="right">
                                    <Chip label={metrics.quickRatio.toFixed(2)} size="small" color="info" />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Deuda/Patrimonio</TableCell>
                                  <TableCell align="right">
                                    <Chip label={metrics.debtToEquity.toFixed(2)} size="small" color="warning" />
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Stack>
                )}

                {tab === 'monthly' && (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Evolución mensual de ingresos, gastos y utilidad
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Mes</TableCell>
                          <TableCell align="right">Ingresos</TableCell>
                          <TableCell align="right">Gastos</TableCell>
                          <TableCell align="right">Utilidad</TableCell>
                          <TableCell align="right">Margen</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {monthlyData.map((month) => {
                          const margin = (month.profit / month.revenue) * 100;
                          return (
                            <TableRow key={month.month}>
                              <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                  {month.month}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" color="primary.main">
                                  ${month.revenue.toLocaleString('es-AR')}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" color="error.main">
                                  ${month.expenses.toLocaleString('es-AR')}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight={600} color="success.main">
                                  ${month.profit.toLocaleString('es-AR')}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Chip label={`${margin.toFixed(1)}%`} size="small" color="success" />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Stack>
                )}
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Insights Financieros */}
      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <AccountBalanceIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Análisis Financiero
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <TrendingUpIcon color="success" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Rentabilidad Saludable
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                El margen neto del {metrics.netMargin.toFixed(1)}% indica una operación rentable.
                El margen bruto del {metrics.grossMargin.toFixed(1)}% muestra un buen control sobre los costos directos.
              </Typography>
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <TrendingUpIcon color="info" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Liquidez Sólida
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                El ratio corriente de {metrics.currentRatio.toFixed(2)} indica capacidad suficiente para cubrir
                obligaciones a corto plazo. Un valor mayor a 1.5 se considera saludable.
              </Typography>
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <TrendingUpIcon color="success" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Flujo de Caja Positivo
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                El flujo de caja neto de ${(cashFlow.netCashFlow / 1000).toFixed(0)}k demuestra la capacidad
                del negocio para generar efectivo y financiar operaciones.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default FinancialReportsPage;
