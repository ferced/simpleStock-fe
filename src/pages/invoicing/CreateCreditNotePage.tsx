import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
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

interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  total: number;
  balance: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'partial';
  createdAt: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface CreditNoteItem {
  invoiceItemId: string;
  productName: string;
  originalQuantity: number;
  originalPrice: number;
  creditQuantity: number;
  creditAmount: number;
  selected: boolean;
}

type CreditNoteReason = 'return' | 'billing_error' | 'discount' | 'defective' | 'cancellation' | 'other';

const reasonLabels: Record<CreditNoteReason, string> = {
  return: 'Devolución de mercadería',
  billing_error: 'Error en facturación',
  discount: 'Descuento acordado',
  defective: 'Productos defectuosos',
  cancellation: 'Cancelación de venta',
  other: 'Otro motivo',
};

const mockInvoices: Invoice[] = [
  {
    id: 'FAC-001',
    clientId: 'c1',
    clientName: 'Cliente Demo',
    total: 125000,
    balance: 75000,
    status: 'partial',
    createdAt: dayjs().subtract(10, 'day').toISOString(),
    items: [
      { id: 'i1', productId: 'p1', productName: 'Laptop HP ProBook 450', quantity: 2, price: 450000, subtotal: 900000 },
      { id: 'i2', productId: 'p2', productName: 'Monitor LG 27" 4K', quantity: 3, price: 180000, subtotal: 540000 },
      { id: 'i3', productId: 'p3', productName: 'Teclado Mecánico Logitech', quantity: 5, price: 35000, subtotal: 175000 },
    ],
  },
  {
    id: 'FAC-005',
    clientId: 'c2',
    clientName: 'Empresa ABC',
    total: 85000,
    balance: 85000,
    status: 'sent',
    createdAt: dayjs().subtract(5, 'day').toISOString(),
    items: [
      { id: 'i4', productId: 'p4', productName: 'Mouse Inalámbrico Microsoft', quantity: 10, price: 15000, subtotal: 150000 },
      { id: 'i5', productId: 'p5', productName: 'Disco SSD Samsung 1TB', quantity: 2, price: 95000, subtotal: 190000 },
    ],
  },
  {
    id: 'FAC-012',
    clientId: 'c3',
    clientName: 'Corporación XYZ',
    total: 250000,
    balance: 0,
    status: 'paid',
    createdAt: dayjs().subtract(15, 'day').toISOString(),
    items: [
      { id: 'i6', productId: 'p6', productName: 'Memoria RAM 16GB DDR4', quantity: 8, price: 45000, subtotal: 360000 },
      { id: 'i7', productId: 'p7', productName: 'Webcam Logitech C920', quantity: 4, price: 55000, subtotal: 220000 },
    ],
  },
];

export const CreateCreditNotePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceIdParam = searchParams.get('invoiceId');

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState('');

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [reason, setReason] = useState<CreditNoteReason>('return');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');
  const [creditItems, setCreditItems] = useState<CreditNoteItem[]>([]);
  const [applyFullCredit, setApplyFullCredit] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar factura desde parámetro URL
  useEffect(() => {
    if (invoiceIdParam) {
      setIsLoading(true);
      setTimeout(() => {
        const invoice = mockInvoices.find(i => i.id === invoiceIdParam);
        if (invoice) {
          handleSelectInvoice(invoice);
        }
        setIsLoading(false);
      }, 500);
    }
  }, [invoiceIdParam]);

  const filteredInvoices = useMemo(() => {
    if (!invoiceSearch) return mockInvoices;
    const search = invoiceSearch.toLowerCase();
    return mockInvoices.filter(
      i => i.id.toLowerCase().includes(search) ||
           i.clientName.toLowerCase().includes(search)
    );
  }, [invoiceSearch]);

  const totalCredit = useMemo(() => {
    return creditItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.creditAmount, 0);
  }, [creditItems]);

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCreditItems(
      invoice.items.map(item => ({
        invoiceItemId: item.id,
        productName: item.productName,
        originalQuantity: item.quantity,
        originalPrice: item.price,
        creditQuantity: item.quantity,
        creditAmount: item.subtotal,
        selected: false,
      }))
    );
    setShowInvoiceDialog(false);
    setInvoiceSearch('');
    setErrors({});
  };

  const handleItemSelect = (itemId: string, selected: boolean) => {
    setCreditItems(prev =>
      prev.map(item =>
        item.invoiceItemId === itemId ? { ...item, selected } : item
      )
    );
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setCreditItems(prev =>
      prev.map(item => {
        if (item.invoiceItemId === itemId) {
          const validQty = Math.max(0, Math.min(quantity, item.originalQuantity));
          return {
            ...item,
            creditQuantity: validQty,
            creditAmount: validQty * item.originalPrice,
          };
        }
        return item;
      })
    );
  };

  const handleApplyFullCredit = (checked: boolean) => {
    setApplyFullCredit(checked);
    if (checked) {
      setCreditItems(prev =>
        prev.map(item => ({
          ...item,
          selected: true,
          creditQuantity: item.originalQuantity,
          creditAmount: item.originalQuantity * item.originalPrice,
        }))
      );
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedInvoice) {
      newErrors.invoice = 'Seleccioná una factura';
    }
    if (reason === 'other' && !customReason.trim()) {
      newErrors.customReason = 'Ingresá el motivo personalizado';
    }
    if (totalCredit === 0) {
      newErrors.items = 'Seleccioná al menos un item para acreditar';
    }
    if (selectedInvoice && totalCredit > selectedInvoice.total) {
      newErrors.items = 'El monto de crédito no puede superar el total de la factura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (issue: boolean = false) => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      // TODO: Guardar nota de crédito en el backend
      await new Promise(r => setTimeout(r, 1000));

      const creditNote = {
        invoiceId: selectedInvoice!.id,
        clientId: selectedInvoice!.clientId,
        clientName: selectedInvoice!.clientName,
        reason: reason === 'other' ? customReason : reasonLabels[reason],
        notes,
        items: creditItems.filter(i => i.selected),
        totalAmount: totalCredit,
        status: issue ? 'issued' : 'draft',
      };

      console.log('Nota de crédito:', creditNote);
      navigate('/facturacion/notas-credito');
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Stack spacing={4}>
        <SectionHeader title="Cargando..." subtitle="Por favor esperá" />
        <LinearProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Nueva Nota de Crédito"
        subtitle="Generá una nota de crédito para anular o ajustar una factura"
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/facturacion/notas-credito')}
          >
            Volver
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Selección de Factura */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>
                  Factura de Origen
                </Typography>

                {!selectedInvoice ? (
                  <Box>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<SearchIcon />}
                      onClick={() => setShowInvoiceDialog(true)}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Seleccionar Factura
                    </Button>
                    {errors.invoice && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        {errors.invoice}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <ReceiptIcon color="primary" />
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {selectedInvoice.id}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {selectedInvoice.clientName}
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack alignItems="flex-end">
                            <Typography variant="h6" fontWeight={600}>
                              ${selectedInvoice.total.toLocaleString('es-AR')}
                            </Typography>
                            <Chip
                              size="small"
                              label={selectedInvoice.status === 'paid' ? 'Pagada' : selectedInvoice.status === 'partial' ? 'Parcial' : 'Pendiente'}
                              color={selectedInvoice.status === 'paid' ? 'success' : selectedInvoice.status === 'partial' ? 'warning' : 'default'}
                            />
                          </Stack>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Fecha: {dayjs(selectedInvoice.createdAt).format('DD/MM/YYYY')}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => setShowInvoiceDialog(true)}
                          >
                            Cambiar factura
                          </Button>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Resumen del Crédito
                </Typography>
                <Divider />

                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Items seleccionados:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {creditItems.filter(i => i.selected).length}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Factura original:
                    </Typography>
                    <Typography variant="body2">
                      ${selectedInvoice?.total.toLocaleString('es-AR') || '0'}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight={700}>
                      Total a Acreditar:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="error.main">
                      ${totalCredit.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => handleSave(true)}
                    disabled={isSaving || !selectedInvoice || totalCredit === 0}
                    fullWidth
                  >
                    Emitir Nota de Crédito
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(false)}
                    disabled={isSaving || !selectedInvoice}
                    fullWidth
                  >
                    Guardar Borrador
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Motivo */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>
                  Motivo del Crédito
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Motivo"
                      value={reason}
                      onChange={(e) => setReason(e.target.value as CreditNoteReason)}
                    >
                      {Object.entries(reasonLabels).map(([key, label]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {reason === 'other' && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Especificar motivo"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        error={Boolean(errors.customReason)}
                        helperText={errors.customReason}
                        required
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Notas adicionales"
                      placeholder="Información adicional para el registro..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Items a acreditar */}
        {selectedInvoice && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                      Items a Acreditar
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={applyFullCredit}
                          onChange={(e) => handleApplyFullCredit(e.target.checked)}
                        />
                      }
                      label="Crédito total (todos los items)"
                    />
                  </Box>

                  {errors.items && (
                    <Alert severity="error">{errors.items}</Alert>
                  )}

                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Precio Unit.</TableCell>
                        <TableCell align="center">Cant. Original</TableCell>
                        <TableCell align="center">Cant. a Acreditar</TableCell>
                        <TableCell align="right">Monto</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {creditItems.map((item) => (
                        <TableRow
                          key={item.invoiceItemId}
                          selected={item.selected}
                          sx={{ opacity: item.selected ? 1 : 0.6 }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={item.selected}
                              onChange={(e) => handleItemSelect(item.invoiceItemId, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {item.productName}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            ${item.originalPrice.toLocaleString('es-AR')}
                          </TableCell>
                          <TableCell align="center">
                            {item.originalQuantity}
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              size="small"
                              value={item.creditQuantity}
                              onChange={(e) => handleQuantityChange(item.invoiceItemId, parseInt(e.target.value) || 0)}
                              disabled={!item.selected}
                              inputProps={{
                                min: 0,
                                max: item.originalQuantity,
                                style: { textAlign: 'center', width: 60 }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color={item.selected ? 'error.main' : 'text.disabled'}
                            >
                              ${item.creditAmount.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Dialog para seleccionar factura */}
      <Dialog
        open={showInvoiceDialog}
        onClose={() => setShowInvoiceDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Seleccionar Factura</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              placeholder="Buscar por número de factura o cliente..."
              value={invoiceSearch}
              onChange={(e) => setInvoiceSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Factura</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Saldo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleSelectInvoice(invoice)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {invoice.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell align="right">
                        ${invoice.total.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell align="right">
                        ${invoice.balance.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={invoice.status === 'paid' ? 'Pagada' : invoice.status === 'partial' ? 'Parcial' : 'Pendiente'}
                          color={invoice.status === 'paid' ? 'success' : invoice.status === 'partial' ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {dayjs(invoice.createdAt).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        <CheckCircleIcon
                          fontSize="small"
                          color={selectedInvoice?.id === invoice.id ? 'primary' : 'disabled'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInvoiceDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default CreateCreditNotePage;
