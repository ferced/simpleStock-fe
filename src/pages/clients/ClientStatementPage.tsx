import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import dayjs from 'dayjs';

type StatementRow = {
  id: string;
  invoiceId: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  amount: number;
  balance: number;
  ageDays: number;
};

const buildMock = (id: string) => {
  const rows: StatementRow[] = [
    {
      id: 's1',
      invoiceId: 'FAC-001',
      date: new Date(Date.now() - 95 * 86400000).toISOString(),
      dueDate: new Date(Date.now() - 65 * 86400000).toISOString(),
      status: 'overdue',
      amount: 150000,
      balance: 150000,
      ageDays: 65,
    },
    {
      id: 's2',
      invoiceId: 'FAC-002',
      date: new Date(Date.now() - 50 * 86400000).toISOString(),
      dueDate: new Date(Date.now() - 20 * 86400000).toISOString(),
      status: 'overdue',
      amount: 80000,
      balance: 80000,
      ageDays: 20,
    },
    {
      id: 's3',
      invoiceId: 'FAC-003',
      date: new Date(Date.now() - 25 * 86400000).toISOString(),
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      status: 'sent',
      amount: 120000,
      balance: 120000,
      ageDays: 0,
    },
    {
      id: 's4',
      invoiceId: 'FAC-004',
      date: new Date(Date.now() - 100 * 86400000).toISOString(),
      dueDate: new Date(Date.now() - 70 * 86400000).toISOString(),
      status: 'paid',
      amount: 200000,
      balance: 0,
      ageDays: 0,
    },
  ];
  return rows;
};

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  overdue: 'Vencida',
};

export const ClientStatementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState<StatementRow[] | null>(null);
  const [clientName, setClientName] = useState('Cliente Demo');

  useEffect(() => {
    if (!id) return;
    setTimeout(() => {
      setRows(buildMock(id));
      setClientName('Cliente Demo');
    }, 150);
  }, [id]);

  const totals = useMemo(() => {
    if (!rows) return { total: 0, balance: 0, paid: 0, overdue: 0 };
    const total = rows.reduce((a, r) => a + r.amount, 0);
    const balance = rows.reduce((a, r) => a + r.balance, 0);
    const paid = rows.filter(r => r.status === 'paid').reduce((a, r) => a + r.amount, 0);
    const overdue = rows.filter(r => r.status === 'overdue').reduce((a, r) => a + r.balance, 0);
    return { total, balance, paid, overdue };
  }, [rows]);

  const aging = useMemo(() => {
    if (!rows) return { '0-30': 0, '31-60': 0, '61-90': 0, '>90': 0 };
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '>90': 0 } as Record<string, number>;
    rows.forEach((r) => {
      if (r.balance === 0) return; // No contar facturas pagadas
      const days = r.ageDays;
      if (days === 0) {
        buckets['0-30'] += r.balance; // Por vencer
      } else if (days <= 30) {
        buckets['0-30'] += r.balance;
      } else if (days <= 60) {
        buckets['31-60'] += r.balance;
      } else if (days <= 90) {
        buckets['61-90'] += r.balance;
      } else {
        buckets['>90'] += r.balance;
      }
    });
    return buckets;
  }, [rows]);

  const agingPercentages = useMemo(() => {
    const total = totals.balance;
    if (total === 0) return { '0-30': 0, '31-60': 0, '61-90': 0, '>90': 0 };
    return {
      '0-30': (aging['0-30'] / total) * 100,
      '31-60': (aging['31-60'] / total) * 100,
      '61-90': (aging['61-90'] / total) * 100,
      '>90': (aging['>90'] / total) * 100,
    };
  }, [aging, totals.balance]);

  const exportPDF = () => {
    // Mock: en real se generaría PDF
    window.print();
  };

  const sendEmail = () => {
    alert('Estado de cuenta enviado por email (función mock)');
  };

  if (!rows) {
    return (
      <Stack spacing={4}>
        <SectionHeader
          title="Estado de Cuenta"
          subtitle="Cargando información..."
        />
        <Card>
          <CardContent>
            <Stack alignItems="center" spacing={2} py={4}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Cargando estado de cuenta...
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
        title="Estado de Cuenta"
        subtitle={`Resumen financiero de ${clientName}`}
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(`/clientes/${id}`)}>
              Volver
            </Button>
            <Button variant="outlined" startIcon={<EmailIcon />} onClick={sendEmail}>
              Enviar Email
            </Button>
            <Button variant="contained" startIcon={<PictureAsPdfIcon />} onClick={exportPDF}>
              Exportar PDF
            </Button>
          </Stack>
        }
      />

      {/* Resumen Principal */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="caption" color="text.secondary">
                    Total Facturado
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700}>
                  ${totals.total.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Todas las facturas" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="caption" color="text.secondary">
                    Pagado
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  ${totals.paid.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Cobrado" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccountBalanceWalletIcon color="warning" />
                  <Typography variant="caption" color="text.secondary">
                    Saldo Pendiente
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  ${totals.balance.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Por cobrar" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <WarningIcon color="error" />
                  <Typography variant="caption" color="text.secondary">
                    Vencido
                  </Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  ${totals.overdue.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Requiere acción" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Antigüedad de Deuda */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={3}>
            Antigüedad de Saldo
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {totals.balance === 0 ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              El cliente no tiene saldo pendiente. Todas las facturas están pagadas.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body2" fontWeight={600}>
                        0-30 días
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="success.main">
                        ${aging['0-30'].toLocaleString('es-AR')}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={agingPercentages['0-30']}
                      sx={{ height: 8, borderRadius: 1 }}
                      color="success"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {agingPercentages['0-30'].toFixed(1)}% del saldo total
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body2" fontWeight={600}>
                        31-60 días
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="warning.main">
                        ${aging['31-60'].toLocaleString('es-AR')}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={agingPercentages['31-60']}
                      sx={{ height: 8, borderRadius: 1 }}
                      color="warning"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {agingPercentages['31-60'].toFixed(1)}% del saldo total
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body2" fontWeight={600}>
                        61-90 días
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="error.main">
                        ${aging['61-90'].toLocaleString('es-AR')}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={agingPercentages['61-90']}
                      sx={{ height: 8, borderRadius: 1 }}
                      color="error"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {agingPercentages['61-90'].toFixed(1)}% del saldo total
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="body2" fontWeight={600}>
                        Más de 90 días
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="error.dark">
                        ${aging['>90'].toLocaleString('es-AR')}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={agingPercentages['>90']}
                      sx={{ height: 8, borderRadius: 1 }}
                      color="error"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {agingPercentages['>90'].toFixed(1)}% del saldo total
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={700} mb={2}>
                      Análisis de Riesgo
                    </Typography>
                    <Stack spacing={2}>
                      {aging['>90'] > 0 && (
                        <Alert severity="error" icon={<WarningIcon />}>
                          Hay ${aging['>90'].toLocaleString('es-AR')} con más de 90 días de antigüedad. Se recomienda acción inmediata.
                        </Alert>
                      )}
                      {aging['61-90'] > 0 && (
                        <Alert severity="warning">
                          Hay ${aging['61-90'].toLocaleString('es-AR')} con 61-90 días de antigüedad. Seguimiento requerido.
                        </Alert>
                      )}
                      {aging['31-60'] > 0 && (
                        <Alert severity="info">
                          Hay ${aging['31-60'].toLocaleString('es-AR')} con 31-60 días de antigüedad.
                        </Alert>
                      )}
                      {aging['0-30'] > 0 && aging['>90'] === 0 && aging['61-90'] === 0 && (
                        <Alert severity="success">
                          El saldo está dentro de los primeros 30 días. Situación favorable.
                        </Alert>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Tabla de Facturas */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Detalle de Facturas
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {rows.length === 0 ? (
            <Stack alignItems="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                No hay facturas registradas
              </Typography>
            </Stack>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Número</TableCell>
                  <TableCell>Fecha Emisión</TableCell>
                  <TableCell>Vencimiento</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell align="right">Saldo</TableCell>
                  <TableCell>Días Vencido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow
                    key={r.id}
                    sx={{
                      backgroundColor: r.status === 'overdue' ? 'error.lighter' : undefined,
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {r.invoiceId}
                      </Typography>
                    </TableCell>
                    <TableCell>{dayjs(r.date).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{dayjs(r.dueDate).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={statusLabels[r.status] || r.status}
                        color={
                          r.status === 'paid'
                            ? 'success'
                            : r.status === 'overdue'
                            ? 'error'
                            : r.status === 'sent'
                            ? 'warning'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        ${r.amount.toLocaleString('es-AR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={r.balance > 0 ? 'error.main' : 'success.main'}
                      >
                        ${r.balance.toLocaleString('es-AR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {r.ageDays > 0 ? (
                        <Chip
                          size="small"
                          label={`${r.ageDays} días`}
                          color={r.ageDays > 90 ? 'error' : r.ageDays > 60 ? 'warning' : 'default'}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell colSpan={4}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      TOTALES
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={700}>
                      ${totals.total.toLocaleString('es-AR')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" fontWeight={700} color="warning.main">
                      ${totals.balance.toLocaleString('es-AR')}
                    </Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ClientStatementPage;



