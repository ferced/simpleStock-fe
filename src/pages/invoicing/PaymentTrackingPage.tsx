import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PaymentIcon from '@mui/icons-material/Payment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Snackbar,
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

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  paid: number;
  balance: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  dueDate: string;
  createdAt: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'check';
  notes?: string;
  createdAt: string;
}

interface PaymentFormData {
  invoiceId: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'check';
  notes: string;
}

type FormErrors = Partial<Record<keyof PaymentFormData, string>>;

const paymentMethodLabels: Record<string, string> = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
  check: 'Cheque',
};

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: 'FAC-001',
    clientName: 'Cliente Demo',
    amount: 50000,
    paid: 30000,
    balance: 20000,
    status: 'partial',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'FAC-002',
    clientName: 'Empresa ABC',
    amount: 75000,
    paid: 0,
    balance: 75000,
    status: 'overdue',
    dueDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 33 * 86400000).toISOString(),
  },
  {
    id: 'FAC-003',
    clientName: 'Corporación XYZ',
    amount: 120000,
    paid: 120000,
    balance: 0,
    status: 'paid',
    dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'FAC-004',
    clientName: 'Comercio 123',
    amount: 45000,
    paid: 0,
    balance: 45000,
    status: 'pending',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const mockPayments: Payment[] = [
  {
    id: 'PAG-001',
    invoiceId: 'FAC-001',
    amount: 30000,
    method: 'transfer',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'PAG-002',
    invoiceId: 'FAC-003',
    amount: 120000,
    method: 'card',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const PaymentTrackingPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState<PaymentFormData>({
    invoiceId: '',
    amount: 0,
    method: 'cash',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // TODO: await apiClient.get('/invoices')
      // TODO: await apiClient.get('/payments')
      await new Promise(r => setTimeout(r, 500));
      setInvoices(mockInvoices);
      setPayments(mockPayments);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        i => i.id.toLowerCase().includes(s) || i.clientName.toLowerCase().includes(s)
      );
    }

    return filtered;
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const paidCount = invoices.filter(i => i.status === 'paid').length;
    const partialCount = invoices.filter(i => i.status === 'partial').length;
    const overdueCount = invoices.filter(i => i.status === 'overdue').length;
    const totalPending = invoices
      .filter(i => i.status !== 'paid')
      .reduce((sum, i) => sum + i.balance, 0);
    const totalReceived = invoices.reduce((sum, i) => sum + i.paid, 0);

    return { totalInvoices, paidCount, partialCount, overdueCount, totalPending, totalReceived };
  }, [invoices]);

  const handleRegisterPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setForm({
      invoiceId: invoice.id,
      amount: invoice.balance,
      method: 'cash',
      notes: '',
    });
    setErrors({});
    setDialogOpen(true);
  };

  const validate = (data: PaymentFormData): FormErrors => {
    const next: FormErrors = {};
    if (!data.invoiceId) next.invoiceId = 'Factura requerida';
    if (data.amount <= 0) next.amount = 'El monto debe ser mayor a 0';
    if (selectedInvoice && data.amount > selectedInvoice.balance) {
      next.amount = `El monto no puede ser mayor al saldo (${selectedInvoice.balance.toLocaleString('es-AR')})`;
    }
    return next;
  };

  const handleSubmit = async () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // TODO: await apiClient.post('/payments', form)
      await new Promise(r => setTimeout(r, 750));

      // Update invoice
      const newPaid = (selectedInvoice?.paid || 0) + form.amount;
      const newBalance = (selectedInvoice?.amount || 0) - newPaid;
      const newStatus = newBalance === 0 ? 'paid' : 'partial';

      setInvoices(invoices.map(inv =>
        inv.id === form.invoiceId
          ? { ...inv, paid: newPaid, balance: newBalance, status: newStatus as any }
          : inv
      ));

      // Add payment to history
      setPayments([
        {
          id: `PAG-${String(payments.length + 1).padStart(3, '0')}`,
          invoiceId: form.invoiceId,
          amount: form.amount,
          method: form.method,
          notes: form.notes,
          createdAt: new Date().toISOString(),
        },
        ...payments,
      ]);

      setSuccessMessage(`✓ Pago registrado: $${form.amount.toLocaleString('es-AR')}`);
      setSuccessOpen(true);
      setDialogOpen(false);
      setSelectedInvoice(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInvoicePayments = (invoiceId: string) => {
    return payments.filter(p => p.invoiceId === invoiceId);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Seguimiento de Pagos"
        subtitle="Registrá pagos y hacé seguimiento de facturas pendientes"
        action={
          <Button variant="outlined" startIcon={<ReceiptIcon />} onClick={() => navigate('/facturacion')}>
            Ver Facturas
          </Button>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
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

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Pagadas
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {stats.paidCount}
                </Typography>
                <Chip label="Completas" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Parciales
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {stats.partialCount}
                </Typography>
                <Chip label="En proceso" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Vencidas
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {stats.overdueCount}
                </Typography>
                <Chip label="Atrasadas" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Por Cobrar
                </Typography>
                <Typography variant="h6" fontWeight={700} color="error.main">
                  ${(stats.totalPending / 1000).toFixed(0)}k
                </Typography>
                <Chip label="Pendiente" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Cobrado
                </Typography>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  ${(stats.totalReceived / 1000).toFixed(0)}k
                </Typography>
                <Chip label="Recibido" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Facturas */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Buscar por número de factura o cliente"
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
                  <MenuItem value="pending">Pendientes</MenuItem>
                  <MenuItem value="partial">Pagos parciales</MenuItem>
                  <MenuItem value="overdue">Vencidas</MenuItem>
                  <MenuItem value="paid">Pagadas</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary">
              Mostrando {filteredInvoices.length} de {invoices.length} facturas
            </Typography>

            {isLoading ? (
              <LinearProgress />
            ) : filteredInvoices.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <ReceiptIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {search || statusFilter !== 'all' ? 'No se encontraron facturas' : 'No hay facturas registradas'}
                </Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Factura</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell align="right">Monto Total</TableCell>
                    <TableCell align="right">Pagado</TableCell>
                    <TableCell align="right">Saldo</TableCell>
                    <TableCell>Vencimiento</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices.map((invoice) => {
                    const isOverdue = invoice.status === 'overdue';
                    const invoicePayments = getInvoicePayments(invoice.id);

                    return (
                      <TableRow key={invoice.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {invoice.id}
                          </Typography>
                          {invoicePayments.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              {invoicePayments.length} pago(s)
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{invoice.clientName}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${invoice.amount.toLocaleString('es-AR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main">
                            ${invoice.paid.toLocaleString('es-AR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} color={invoice.balance > 0 ? 'error.main' : 'text.secondary'}>
                            ${invoice.balance.toLocaleString('es-AR')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color={isOverdue ? 'error.main' : 'text.secondary'}>
                            {dayjs(invoice.dueDate).format('DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            icon={
                              invoice.status === 'paid' ? <CheckCircleIcon fontSize="small" /> :
                              invoice.status === 'overdue' ? <WarningIcon fontSize="small" /> :
                              <PendingIcon fontSize="small" />
                            }
                            label={
                              invoice.status === 'paid' ? 'Pagada' :
                              invoice.status === 'partial' ? 'Parcial' :
                              invoice.status === 'overdue' ? 'Vencida' :
                              'Pendiente'
                            }
                            color={
                              invoice.status === 'paid' ? 'success' :
                              invoice.status === 'overdue' ? 'error' :
                              invoice.status === 'partial' ? 'warning' :
                              'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          {invoice.balance > 0 && (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<PaymentIcon />}
                              onClick={() => handleRegisterPayment(invoice)}
                            >
                              Registrar Pago
                            </Button>
                          )}
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

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Pago</DialogTitle>
        <DialogContent>
          <Stack spacing={3} pt={2}>
            {selectedInvoice && (
              <Alert severity="info" icon={<ReceiptIcon />}>
                <Stack spacing={0.5}>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedInvoice.id} - {selectedInvoice.clientName}
                  </Typography>
                  <Typography variant="caption">
                    Monto total: ${selectedInvoice.amount.toLocaleString('es-AR')} •
                    Pagado: ${selectedInvoice.paid.toLocaleString('es-AR')} •
                    Saldo: ${selectedInvoice.balance.toLocaleString('es-AR')}
                  </Typography>
                </Stack>
              </Alert>
            )}

            <TextField
              label="Monto del Pago"
              fullWidth
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              error={!!errors.amount}
              helperText={errors.amount || 'Monto a pagar (puede ser parcial)'}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              select
              label="Método de Pago"
              fullWidth
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value as any })}
              required
            >
              <MenuItem value="cash">Efectivo</MenuItem>
              <MenuItem value="card">Tarjeta</MenuItem>
              <MenuItem value="transfer">Transferencia Bancaria</MenuItem>
              <MenuItem value="check">Cheque</MenuItem>
            </TextField>

            <TextField
              label="Notas"
              fullWidth
              multiline
              minRows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              helperText="Observaciones sobre el pago (opcional)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default PaymentTrackingPage;
