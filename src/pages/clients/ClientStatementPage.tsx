import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

type StatementRow = { id: string; invoiceId: string; date: string; dueDate: string; status: 'draft'|'sent'|'paid'|'overdue'; amount: number; balance: number; ageDays: number };

const buildMock = (id: string) => {
  const rows: StatementRow[] = [
    { id: 's1', invoiceId: 'inv-1', date: new Date(Date.now()-40*86400000).toISOString(), dueDate: new Date(Date.now()-10*86400000).toISOString(), status: 'overdue', amount: 150000, balance: 50000, ageDays: 10 },
    { id: 's2', invoiceId: 'inv-2', date: new Date(Date.now()-20*86400000).toISOString(), dueDate: new Date(Date.now()+10*86400000).toISOString(), status: 'sent', amount: 80000, balance: 80000, ageDays: 0 },
  ];
  return rows;
};

export const ClientStatementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState<StatementRow[]>([]);

  useEffect(() => {
    if (!id) return;
    setTimeout(() => setRows(buildMock(id)), 150);
  }, [id]);

  const totals = useMemo(() => {
    const total = rows.reduce((a, r) => a + r.amount, 0);
    const balance = rows.reduce((a, r) => a + r.balance, 0);
    return { total, balance };
  }, [rows]);

  const aging = useMemo(() => {
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '>90': 0 } as Record<string, number>;
    rows.forEach((r) => {
      const days = r.ageDays;
      if (days <= 30) buckets['0-30'] += r.balance; else if (days <= 60) buckets['31-60'] += r.balance; else if (days <= 90) buckets['61-90'] += r.balance; else buckets['>90'] += r.balance;
    });
    return buckets;
  }, [rows]);

  const exportPDF = () => {
    // Mock: en real se generaría PDF
    window.print();
  };

  const sendEmail = () => {
    alert('Estado de cuenta enviado (mock)');
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Estado de Cuenta</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={exportPDF}>Exportar PDF</Button>
          <Button variant="outlined" onClick={sendEmail}>Enviar por email</Button>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Resumen" />
            <Divider />
            <CardContent>
              <Stack spacing={0.5}>
                <Typography variant="body2">Total facturado: ${totals.total.toLocaleString('es-AR')}</Typography>
                <Typography variant="h6">Saldo pendiente: ${totals.balance.toLocaleString('es-AR')}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Antigüedad de deuda" />
            <Divider />
            <CardContent>
              <Grid container>
                <Grid item xs={6}><Typography variant="body2">0-30</Typography></Grid><Grid item xs={6}><Typography align="right">${aging['0-30'].toLocaleString('es-AR')}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">31-60</Typography></Grid><Grid item xs={6}><Typography align="right">${aging['31-60'].toLocaleString('es-AR')}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">61-90</Typography></Grid><Grid item xs={6}><Typography align="right">${aging['61-90'].toLocaleString('es-AR')}</Typography></Grid>
                <Grid item xs={6}><Typography variant="body2">&gt;90</Typography></Grid><Grid item xs={6}><Typography align="right">${aging['>90'].toLocaleString('es-AR')}</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Facturas pendientes" />
            <Divider />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>N°</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Vencimiento</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell align="right">Saldo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center">Sin facturas pendientes</TableCell></TableRow>
                  ) : rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.invoiceId}</TableCell>
                      <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(r.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell align="right">${r.amount.toLocaleString('es-AR')}</TableCell>
                      <TableCell align="right">${r.balance.toLocaleString('es-AR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientStatementPage;

