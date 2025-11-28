import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import LinkIcon from '@mui/icons-material/Link';
import CircleIcon from '@mui/icons-material/Circle';
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
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import dayjs from 'dayjs';

type CreditNoteStatus = 'draft' | 'issued' | 'applied' | 'partial' | 'cancelled';

interface CreditNoteItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface CreditApplication {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  appliedAt: string;
  appliedBy: string;
}

interface HistoryEvent {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

interface CreditNote {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  reason: string;
  notes: string;
  status: CreditNoteStatus;
  totalAmount: number;
  appliedAmount: number;
  availableCredit: number;
  createdAt: string;
  issuedAt?: string;
  items: CreditNoteItem[];
  applications: CreditApplication[];
  history: HistoryEvent[];
}

interface PendingInvoice {
  id: string;
  number: string;
  clientName: string;
  total: number;
  balance: number;
  dueDate: string;
}

const statusConfig: Record<CreditNoteStatus, { label: string; color: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  draft: { label: 'Borrador', color: 'default' },
  issued: { label: 'Emitida', color: 'success' },
  applied: { label: 'Aplicada', color: 'info' },
  partial: { label: 'Parcialmente Aplicada', color: 'warning' },
  cancelled: { label: 'Anulada', color: 'error' },
};

const mockPendingInvoices: PendingInvoice[] = [
  { id: 'inv-1', number: 'FAC-015', clientName: 'Cliente Demo', total: 50000, balance: 50000, dueDate: dayjs().add(10, 'day').toISOString() },
  { id: 'inv-2', number: 'FAC-018', clientName: 'Cliente Demo', total: 35000, balance: 20000, dueDate: dayjs().add(5, 'day').toISOString() },
  { id: 'inv-3', number: 'FAC-022', clientName: 'Cliente Demo', total: 80000, balance: 80000, dueDate: dayjs().add(15, 'day').toISOString() },
];

export const CreditNoteDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [creditNote, setCreditNote] = useState<CreditNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dialogs
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PendingInvoice | null>(null);
  const [applyAmount, setApplyAmount] = useState(0);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const loadCreditNote = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 600));

      const mockCreditNote: CreditNote = {
        id: id || 'CN-001',
        invoiceId: 'inv-001',
        invoiceNumber: 'FAC-001',
        clientId: 'c1',
        clientName: 'Cliente Demo',
        clientEmail: 'demo@cliente.test',
        reason: 'Devolución de mercadería',
        notes: 'Cliente devolvió productos por defectos de fábrica. Autorizado por supervisor.',
        status: 'issued',
        totalAmount: 15000,
        appliedAmount: 0,
        availableCredit: 15000,
        createdAt: dayjs().subtract(2, 'day').toISOString(),
        issuedAt: dayjs().subtract(2, 'day').toISOString(),
        items: [
          { id: 'i1', productName: 'Teclado Mecánico Logitech', quantity: 2, unitPrice: 35000, amount: 70000 },
          { id: 'i2', productName: 'Mouse Inalámbrico Microsoft', quantity: 3, unitPrice: 15000, amount: 45000 },
        ],
        applications: [],
        history: [
          { id: 'h1', action: 'Nota de crédito creada', user: 'Admin', timestamp: dayjs().subtract(2, 'day').toISOString(), details: 'Creada desde factura FAC-001' },
          { id: 'h2', action: 'Nota de crédito emitida', user: 'Admin', timestamp: dayjs().subtract(2, 'day').toISOString(), details: 'Aprobada y emitida oficialmente' },
        ],
      };

      setCreditNote(mockCreditNote);
      setIsLoading(false);
    };

    loadCreditNote();
  }, [id]);

  const canIssue = creditNote?.status === 'draft';
  const canApply = (creditNote?.status === 'issued' || creditNote?.status === 'partial') && (creditNote?.availableCredit || 0) > 0;
  const canCancel = creditNote?.status !== 'cancelled' && creditNote?.status !== 'applied';

  const handleIssue = async () => {
    if (!creditNote) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));

    setCreditNote(prev => prev ? {
      ...prev,
      status: 'issued',
      issuedAt: new Date().toISOString(),
      history: [...prev.history, {
        id: Date.now().toString(),
        action: 'Nota de crédito emitida',
        user: 'Admin',
        timestamp: new Date().toISOString(),
        details: 'Aprobada y emitida oficialmente',
      }],
    } : null);

    setIsProcessing(false);
  };

  const handleOpenApplyDialog = () => {
    if (!creditNote) return;
    setApplyAmount(Math.min(creditNote.availableCredit, selectedInvoice?.balance || creditNote.availableCredit));
    setShowApplyDialog(true);
  };

  const handleApplyCredit = async () => {
    if (!creditNote || !selectedInvoice || applyAmount <= 0) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1000));

    const newApplication: CreditApplication = {
      id: Date.now().toString(),
      invoiceId: selectedInvoice.id,
      invoiceNumber: selectedInvoice.number,
      amount: applyAmount,
      appliedAt: new Date().toISOString(),
      appliedBy: 'Admin',
    };

    const newAppliedAmount = creditNote.appliedAmount + applyAmount;
    const newAvailableCredit = creditNote.totalAmount - newAppliedAmount;
    const newStatus: CreditNoteStatus = newAvailableCredit === 0 ? 'applied' : 'partial';

    setCreditNote(prev => prev ? {
      ...prev,
      status: newStatus,
      appliedAmount: newAppliedAmount,
      availableCredit: newAvailableCredit,
      applications: [...prev.applications, newApplication],
      history: [...prev.history, {
        id: Date.now().toString(),
        action: `Crédito aplicado a ${selectedInvoice.number}`,
        user: 'Admin',
        timestamp: new Date().toISOString(),
        details: `Monto aplicado: $${applyAmount.toLocaleString('es-AR')}. ${newAvailableCredit === 0 ? 'Crédito agotado.' : `Crédito restante: $${newAvailableCredit.toLocaleString('es-AR')}`}`,
      }],
    } : null);

    setShowApplyDialog(false);
    setSelectedInvoice(null);
    setApplyAmount(0);
    setIsProcessing(false);
  };

  const handleCancel = async () => {
    if (!creditNote) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));

    setCreditNote(prev => prev ? {
      ...prev,
      status: 'cancelled',
      availableCredit: 0,
      history: [...prev.history, {
        id: Date.now().toString(),
        action: 'Nota de crédito anulada',
        user: 'Admin',
        timestamp: new Date().toISOString(),
        details: cancelReason || 'Sin motivo especificado',
      }],
    } : null);

    setShowCancelDialog(false);
    setCancelReason('');
    setIsProcessing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !creditNote) {
    return (
      <Stack spacing={4}>
        <SectionHeader title="Cargando nota de crédito..." subtitle="Por favor esperá" />
        <LinearProgress />
      </Stack>
    );
  }

  const statusInfo = statusConfig[creditNote.status];

  return (
    <Stack spacing={4}>
      <SectionHeader
        title={`Nota de Crédito ${creditNote.id}`}
        subtitle={`Creada el ${dayjs(creditNote.createdAt).format('DD/MM/YYYY HH:mm')}`}
        action={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Imprimir">
              <IconButton onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exportar PDF">
              <IconButton>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/facturacion/notas-credito')}
            >
              Volver
            </Button>
          </Stack>
        }
      />

      {/* Estado y Acciones */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={statusInfo.label}
                color={statusInfo.color}
                size="medium"
                sx={{ fontWeight: 600 }}
              />
              {creditNote.status === 'partial' && (
                <Typography variant="body2" color="text.secondary">
                  Crédito disponible: ${creditNote.availableCredit.toLocaleString('es-AR')}
                </Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={1}>
              {canIssue && (
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleIssue}
                  disabled={isProcessing}
                >
                  Emitir
                </Button>
              )}
              {canApply && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AccountBalanceWalletIcon />}
                  onClick={handleOpenApplyDialog}
                  disabled={isProcessing}
                >
                  Aplicar a Factura
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isProcessing}
                >
                  Anular
                </Button>
              )}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Información Principal */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Información General
                </Typography>
                <Divider />

                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Cliente:</Typography>
                    <Typography variant="body2" fontWeight={500}>{creditNote.clientName}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                    <Typography variant="body2">{creditNote.clientEmail}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">Factura origen:</Typography>
                    <Button
                      size="small"
                      startIcon={<LinkIcon />}
                      onClick={() => navigate(`/facturacion/${creditNote.invoiceId}`)}
                    >
                      {creditNote.invoiceNumber}
                    </Button>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Motivo:</Typography>
                    <Typography variant="body2" fontWeight={500}>{creditNote.reason}</Typography>
                  </Box>
                  {creditNote.issuedAt && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Emitida:</Typography>
                      <Typography variant="body2">{dayjs(creditNote.issuedAt).format('DD/MM/YYYY HH:mm')}</Typography>
                    </Box>
                  )}
                </Stack>

                {creditNote.notes && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Notas:
                      </Typography>
                      <Typography variant="body2">{creditNote.notes}</Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen del Crédito */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Resumen del Crédito
                </Typography>
                <Divider />

                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Monto Total:</Typography>
                    <Typography variant="h6" fontWeight={700} color="error.main">
                      ${creditNote.totalAmount.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Aplicado:</Typography>
                    <Typography variant="body2" color="success.main">
                      ${creditNote.appliedAmount.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Disponible:</Typography>
                    <Typography variant="body2" fontWeight={600} color={creditNote.availableCredit > 0 ? 'warning.main' : 'text.secondary'}>
                      ${creditNote.availableCredit.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                </Stack>

                {creditNote.availableCredit > 0 && creditNote.status !== 'draft' && creditNote.status !== 'cancelled' && (
                  <>
                    <Divider />
                    <Alert severity="info" icon={<AccountBalanceWalletIcon />}>
                      Este cliente tiene un crédito a favor de ${creditNote.availableCredit.toLocaleString('es-AR')} que puede aplicar a futuras facturas.
                    </Alert>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Items */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>
                  Items Acreditados
                </Typography>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Precio Unit.</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {creditNote.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {item.productName}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          ${item.unitPrice.toLocaleString('es-AR')}
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} color="error.main">
                            ${item.amount.toLocaleString('es-AR')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1" fontWeight={700}>
                          Total:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight={700} color="error.main">
                          ${creditNote.totalAmount.toLocaleString('es-AR')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Aplicaciones del Crédito */}
        {creditNote.applications.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight={600}>
                    Aplicaciones del Crédito
                  </Typography>

                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Factura</TableCell>
                        <TableCell align="right">Monto Aplicado</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Usuario</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {creditNote.applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>
                            <Button
                              size="small"
                              startIcon={<LinkIcon />}
                              onClick={() => navigate(`/facturacion/${app.invoiceId}`)}
                            >
                              {app.invoiceNumber}
                            </Button>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              ${app.amount.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {dayjs(app.appliedAt).format('DD/MM/YYYY HH:mm')}
                          </TableCell>
                          <TableCell>{app.appliedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Historial */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <HistoryIcon color="action" />
                  <Typography variant="h6" fontWeight={600}>
                    Historial
                  </Typography>
                </Stack>

                <Stack spacing={0}>
                  {creditNote.history.map((event, index) => {
                    const dotColor = event.action.includes('anulada') ? 'error.main' :
                      event.action.includes('aplicado') ? 'success.main' :
                      event.action.includes('emitida') ? 'info.main' :
                      'primary.main';

                    return (
                      <Box key={event.id} display="flex" gap={2}>
                        <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: 24 }}>
                          <CircleIcon sx={{ fontSize: 12, color: dotColor, zIndex: 1 }} />
                          {index < creditNote.history.length - 1 && (
                            <Box sx={{ width: 2, flexGrow: 1, bgcolor: 'divider', minHeight: 40 }} />
                          )}
                        </Box>

                        <Box pb={2} flexGrow={1}>
                          <Stack direction="row" spacing={2} alignItems="baseline" justifyContent="space-between">
                            <Typography variant="subtitle2" fontWeight={600}>
                              {event.action}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dayjs(event.timestamp).format('DD/MM/YYYY HH:mm')}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            por {event.user}
                          </Typography>
                          {event.details && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {event.details}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para aplicar crédito */}
      <Dialog open={showApplyDialog} onClose={() => setShowApplyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccountBalanceWalletIcon color="success" />
            <Typography variant="h6">Aplicar Crédito a Factura</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info">
              Crédito disponible: <strong>${creditNote.availableCredit.toLocaleString('es-AR')}</strong>
            </Alert>

            <Typography variant="subtitle2" fontWeight={600}>
              Seleccioná una factura pendiente del cliente:
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Factura</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Saldo</TableCell>
                  <TableCell>Vencimiento</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPendingInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    selected={selectedInvoice?.id === invoice.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setApplyAmount(Math.min(creditNote.availableCredit, invoice.balance));
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {invoice.number}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      ${invoice.total.toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="error.main" fontWeight={500}>
                        ${invoice.balance.toLocaleString('es-AR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {dayjs(invoice.dueDate).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      {selectedInvoice?.id === invoice.id && (
                        <CheckCircleIcon color="primary" fontSize="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {selectedInvoice && (
              <>
                <Divider />
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Monto a aplicar"
                      value={applyAmount}
                      onChange={(e) => {
                        const value = Math.max(0, Math.min(
                          Math.min(creditNote.availableCredit, selectedInvoice.balance),
                          parseFloat(e.target.value) || 0
                        ));
                        setApplyAmount(value);
                      }}
                      inputProps={{
                        min: 0,
                        max: Math.min(creditNote.availableCredit, selectedInvoice.balance),
                      }}
                      helperText={`Máximo aplicable: $${Math.min(creditNote.availableCredit, selectedInvoice.balance).toLocaleString('es-AR')}`}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Alert severity="success">
                      Nuevo saldo de {selectedInvoice.number}: ${(selectedInvoice.balance - applyAmount).toLocaleString('es-AR')}
                    </Alert>
                  </Grid>
                </Grid>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApplyDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleApplyCredit}
            disabled={isProcessing || !selectedInvoice || applyAmount <= 0}
            startIcon={<CheckCircleIcon />}
          >
            Confirmar Aplicación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de anulación */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <CancelIcon color="error" />
            <Typography variant="h6">Anular Nota de Crédito</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="warning">
              Esta acción anulará la nota de crédito {creditNote.id}. El crédito ya no estará disponible para el cliente.
              {creditNote.appliedAmount > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Atención:</strong> Ya se aplicaron ${creditNote.appliedAmount.toLocaleString('es-AR')} de esta nota de crédito.
                </Typography>
              )}
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Motivo de anulación"
              placeholder="Ingresá el motivo de la anulación (opcional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>Volver</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Confirmar Anulación
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default CreditNoteDetailPage;
