import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import HistoryIcon from '@mui/icons-material/History';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Alert,
  Avatar,
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
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { SectionHeader } from '../../components/common/SectionHeader';
import dayjs from 'dayjs';

type OrderStatus = 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled' | 'partial';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  receivedQuantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

interface OrderHistory {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierAddress: string;
  status: OrderStatus;
  expectedDate: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  paymentTerms: string;
  shippingAddress: string;
  items: OrderItem[];
  history: OrderHistory[];
}

const statusConfig: Record<OrderStatus, { label: string; color: 'default' | 'primary' | 'warning' | 'success' | 'error' | 'info'; step: number }> = {
  draft: { label: 'Borrador', color: 'default', step: 0 },
  sent: { label: 'Enviada', color: 'primary', step: 1 },
  confirmed: { label: 'Confirmada', color: 'warning', step: 2 },
  partial: { label: 'Recepción Parcial', color: 'info', step: 3 },
  received: { label: 'Recibida', color: 'success', step: 4 },
  cancelled: { label: 'Cancelada', color: 'error', step: -1 },
};

const steps = ['Borrador', 'Enviada', 'Confirmada', 'En Recepción', 'Completada'];

export const PurchaseOrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dialogs
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [receiveQuantities, setReceiveQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      // Simular carga de datos
      await new Promise(r => setTimeout(r, 600));

      const mockOrder: PurchaseOrder = {
        id: id || 'PO-001',
        supplierId: 'sup-1',
        supplierName: 'Proveedor Alpha',
        supplierEmail: 'alpha@proveedor.com',
        supplierPhone: '+54 11 1234-5678',
        supplierAddress: 'Av. Corrientes 1234, CABA',
        status: 'confirmed',
        expectedDate: dayjs().add(3, 'day').toISOString(),
        createdAt: dayjs().subtract(5, 'day').toISOString(),
        updatedAt: dayjs().subtract(1, 'day').toISOString(),
        notes: 'Entregar en horario de oficina (9:00 - 18:00). Contactar a Juan Pérez para coordinar.',
        paymentTerms: '30 días',
        shippingAddress: 'Depósito Central, Av. Principal 1234, Zona Industrial',
        items: [
          { id: '1', productId: 'prod-1', productName: 'Laptop HP ProBook 450', sku: 'SKU-001', quantity: 10, receivedQuantity: 0, unitPrice: 450000, discount: 5, subtotal: 4275000 },
          { id: '2', productId: 'prod-2', productName: 'Monitor LG 27" 4K', sku: 'SKU-002', quantity: 20, receivedQuantity: 0, unitPrice: 180000, discount: 0, subtotal: 3600000 },
          { id: '3', productId: 'prod-3', productName: 'Teclado Mecánico Logitech', sku: 'SKU-003', quantity: 30, receivedQuantity: 0, unitPrice: 35000, discount: 10, subtotal: 945000 },
          { id: '4', productId: 'prod-5', productName: 'Disco SSD Samsung 1TB', sku: 'SKU-005', quantity: 15, receivedQuantity: 0, unitPrice: 95000, discount: 0, subtotal: 1425000 },
        ],
        history: [
          { id: '1', action: 'Orden creada', user: 'Admin', timestamp: dayjs().subtract(5, 'day').toISOString(), details: 'Orden de compra generada desde el sistema' },
          { id: '2', action: 'Orden enviada al proveedor', user: 'Admin', timestamp: dayjs().subtract(4, 'day').toISOString(), details: 'Email enviado a alpha@proveedor.com' },
          { id: '3', action: 'Orden confirmada', user: 'Sistema', timestamp: dayjs().subtract(1, 'day').toISOString(), details: 'El proveedor confirmó la disponibilidad y fecha de entrega' },
        ],
      };

      setOrder(mockOrder);
      setIsLoading(false);
    };

    loadOrder();
  }, [id]);

  const totals = useMemo(() => {
    if (!order) return { subtotal: 0, tax: 0, total: 0, itemCount: 0, totalUnits: 0, receivedUnits: 0 };

    const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.21;
    const total = subtotal + tax;
    const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const receivedUnits = order.items.reduce((sum, item) => sum + item.receivedQuantity, 0);

    return { subtotal, tax, total, itemCount: order.items.length, totalUnits, receivedUnits };
  }, [order]);

  const canEdit = order?.status === 'draft';
  const canSend = order?.status === 'draft';
  const canConfirm = order?.status === 'sent';
  const canReceive = order?.status === 'confirmed' || order?.status === 'partial';
  const canCancel = order?.status !== 'received' && order?.status !== 'cancelled';

  const handleSendToSupplier = async () => {
    if (!order) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));
    setOrder(prev => prev ? {
      ...prev,
      status: 'sent',
      history: [...prev.history, {
        id: Date.now().toString(),
        action: 'Orden enviada al proveedor',
        user: 'Admin',
        timestamp: new Date().toISOString(),
        details: `Email enviado a ${prev.supplierEmail}`,
      }],
    } : null);
    setIsProcessing(false);
  };

  const handleConfirmOrder = async () => {
    if (!order) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));
    setOrder(prev => prev ? {
      ...prev,
      status: 'confirmed',
      history: [...prev.history, {
        id: Date.now().toString(),
        action: 'Orden confirmada',
        user: 'Admin',
        timestamp: new Date().toISOString(),
        details: 'Confirmación manual del proveedor',
      }],
    } : null);
    setIsProcessing(false);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));
    setOrder(prev => prev ? {
      ...prev,
      status: 'cancelled',
      history: [...prev.history, {
        id: Date.now().toString(),
        action: 'Orden cancelada',
        user: 'Admin',
        timestamp: new Date().toISOString(),
        details: cancelReason || 'Sin motivo especificado',
      }],
    } : null);
    setShowCancelDialog(false);
    setCancelReason('');
    setIsProcessing(false);
  };

  const handleOpenReceiveDialog = () => {
    if (!order) return;
    const quantities: Record<string, number> = {};
    order.items.forEach(item => {
      quantities[item.id] = item.quantity - item.receivedQuantity;
    });
    setReceiveQuantities(quantities);
    setShowReceiveDialog(true);
  };

  const handleReceiveMerchandise = async () => {
    if (!order) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1000));

    const updatedItems = order.items.map(item => ({
      ...item,
      receivedQuantity: item.receivedQuantity + (receiveQuantities[item.id] || 0),
    }));

    const allReceived = updatedItems.every(item => item.receivedQuantity >= item.quantity);
    const someReceived = updatedItems.some(item => item.receivedQuantity > 0);

    const newStatus: OrderStatus = allReceived ? 'received' : someReceived ? 'partial' : order.status;

    const receivedItems = order.items
      .filter(item => receiveQuantities[item.id] > 0)
      .map(item => `${item.productName}: ${receiveQuantities[item.id]} unidades`)
      .join(', ');

    setOrder(prev => prev ? {
      ...prev,
      status: newStatus,
      items: updatedItems,
      history: [...prev.history, {
        id: Date.now().toString(),
        action: allReceived ? 'Recepción completa' : 'Recepción parcial',
        user: 'Admin',
        timestamp: new Date().toISOString(),
        details: `Productos recibidos: ${receivedItems}. Inventario actualizado automáticamente.`,
      }],
    } : null);

    setShowReceiveDialog(false);
    setReceiveQuantities({});
    setIsProcessing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // TODO: Implementar exportación a PDF
    console.log('Exportar a PDF');
  };

  if (isLoading || !order) {
    return (
      <Stack spacing={4}>
        <SectionHeader title="Cargando orden..." subtitle="Por favor esperá" />
        <LinearProgress />
      </Stack>
    );
  }

  const statusInfo = statusConfig[order.status];

  return (
    <Stack spacing={4}>
      <SectionHeader
        title={`Orden de Compra ${order.id}`}
        subtitle={`Creada el ${dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}`}
        action={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Imprimir">
              <IconButton onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exportar PDF">
              <IconButton onClick={handleExportPDF}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            {canEdit && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/proveedores/ordenes/${order.id}/editar`)}
              >
                Editar
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/proveedores/ordenes')}
            >
              Volver
            </Button>
          </Stack>
        }
      />

      {/* Estado y Progreso */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={statusInfo.label}
                  color={statusInfo.color}
                  size="medium"
                  sx={{ fontWeight: 600 }}
                />
                {order.status === 'confirmed' && (
                  <Typography variant="body2" color="warning.main">
                    Entrega esperada: {dayjs(order.expectedDate).format('DD/MM/YYYY')}
                  </Typography>
                )}
              </Stack>

              <Stack direction="row" spacing={1}>
                {canSend && (
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleSendToSupplier}
                    disabled={isProcessing}
                  >
                    Enviar al Proveedor
                  </Button>
                )}
                {canConfirm && (
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                  >
                    Confirmar Orden
                  </Button>
                )}
                {canReceive && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<InventoryIcon />}
                    onClick={handleOpenReceiveDialog}
                    disabled={isProcessing}
                  >
                    Recibir Mercancía
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
                    Cancelar
                  </Button>
                )}
              </Stack>
            </Box>

            {order.status !== 'cancelled' && (
              <Stepper activeStep={statusInfo.step} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}

            {order.status === 'partial' && (
              <Alert severity="info" icon={<LocalShippingIcon />}>
                Recepción parcial: {totals.receivedUnits} de {totals.totalUnits} unidades recibidas ({((totals.receivedUnits / totals.totalUnits) * 100).toFixed(0)}%)
                <LinearProgress
                  variant="determinate"
                  value={(totals.receivedUnits / totals.totalUnits) * 100}
                  sx={{ mt: 1 }}
                />
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Información del Proveedor */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Proveedor
                </Typography>
                <Divider />

                <Box display="flex" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <LocalShippingIcon />
                  </Avatar>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {order.supplierName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.supplierEmail}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.supplierPhone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.supplierAddress}
                    </Typography>
                  </Stack>
                </Box>

                <Divider />

                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Condiciones de pago:</Typography>
                    <Typography variant="body2" fontWeight={500}>{order.paymentTerms}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Fecha esperada:</Typography>
                    <Typography variant="body2" fontWeight={500}>{dayjs(order.expectedDate).format('DD/MM/YYYY')}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen Financiero */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Resumen Financiero
                </Typography>
                <Divider />

                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Productos ({totals.itemCount} items, {totals.totalUnits} unidades):
                    </Typography>
                    <Typography variant="body2">
                      ${totals.subtotal.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      IVA (21%):
                    </Typography>
                    <Typography variant="body2">
                      ${totals.tax.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>
                      Total:
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                      ${totals.total.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Dirección de entrega:
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress}
                  </Typography>
                </Box>

                {order.notes && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Notas:
                    </Typography>
                    <Typography variant="body2">
                      {order.notes}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Productos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>
                  Productos de la Orden
                </Typography>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>SKU</TableCell>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Precio Unit.</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      {(order.status === 'partial' || order.status === 'received') && (
                        <TableCell align="center">Recibido</TableCell>
                      )}
                      <TableCell align="right">Descuento</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => {
                      const isPartiallyReceived = item.receivedQuantity > 0 && item.receivedQuantity < item.quantity;
                      const isFullyReceived = item.receivedQuantity >= item.quantity;

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Chip label={item.sku} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body2" fontWeight={500}>
                                {item.productName}
                              </Typography>
                              {isFullyReceived && (
                                <Chip label="Completo" size="small" color="success" />
                              )}
                              {isPartiallyReceived && (
                                <Chip label="Parcial" size="small" color="warning" />
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            ${item.unitPrice.toLocaleString('es-AR')}
                          </TableCell>
                          <TableCell align="center">
                            {item.quantity}
                          </TableCell>
                          {(order.status === 'partial' || order.status === 'received') && (
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color={isFullyReceived ? 'success.main' : isPartiallyReceived ? 'warning.main' : 'text.secondary'}
                              >
                                {item.receivedQuantity} / {item.quantity}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell align="right">
                            {item.discount > 0 ? (
                              <Chip label={`-${item.discount}%`} size="small" color="success" />
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              ${item.subtotal.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Historial */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <HistoryIcon color="action" />
                  <Typography variant="h6" fontWeight={600}>
                    Historial de la Orden
                  </Typography>
                </Stack>

                <Stack spacing={0}>
                  {order.history.map((event, index) => {
                    const dotColor = event.action.includes('cancelada') ? 'error.main' :
                      event.action.includes('Recepción') ? 'success.main' :
                      event.action.includes('confirmada') ? 'warning.main' :
                      'primary.main';

                    return (
                      <Box key={event.id} display="flex" gap={2}>
                        {/* Timeline connector */}
                        <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: 24 }}>
                          <CircleIcon sx={{ fontSize: 12, color: dotColor, zIndex: 1 }} />
                          {index < order.history.length - 1 && (
                            <Box sx={{ width: 2, flexGrow: 1, bgcolor: 'divider', minHeight: 40 }} />
                          )}
                        </Box>

                        {/* Content */}
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

      {/* Dialog de Cancelación */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon color="error" />
            <Typography variant="h6">Cancelar Orden de Compra</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="warning">
              Esta acción cancelará la orden de compra {order.id}. Esta acción no se puede deshacer.
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Motivo de cancelación"
              placeholder="Ingresá el motivo de la cancelación (opcional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>
            Volver
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelOrder}
            disabled={isProcessing}
          >
            Confirmar Cancelación
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Recepción */}
      <Dialog open={showReceiveDialog} onClose={() => setShowReceiveDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <InventoryIcon color="success" />
            <Typography variant="h6">Recibir Mercancía</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Alert severity="info">
              Ingresá la cantidad recibida de cada producto. El inventario se actualizará automáticamente.
            </Alert>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Pedido</TableCell>
                  <TableCell align="center">Ya Recibido</TableCell>
                  <TableCell align="center">Pendiente</TableCell>
                  <TableCell align="center">Recibir Ahora</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => {
                  const pending = item.quantity - item.receivedQuantity;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2" fontWeight={500}>
                            {item.productName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.sku}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">
                        <Typography color={item.receivedQuantity > 0 ? 'success.main' : 'text.secondary'}>
                          {item.receivedQuantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography color={pending > 0 ? 'warning.main' : 'success.main'} fontWeight={600}>
                          {pending}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          size="small"
                          value={receiveQuantities[item.id] || 0}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(pending, parseInt(e.target.value) || 0));
                            setReceiveQuantities(prev => ({ ...prev, [item.id]: value }));
                          }}
                          inputProps={{
                            min: 0,
                            max: pending,
                            style: { textAlign: 'center', width: 80 }
                          }}
                          disabled={pending === 0}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Alert severity="success">
              Total a recibir: {Object.values(receiveQuantities).reduce((sum, q) => sum + q, 0)} unidades
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReceiveDialog(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleReceiveMerchandise}
            disabled={isProcessing || Object.values(receiveQuantities).every(q => q === 0)}
            startIcon={<CheckCircleIcon />}
          >
            Confirmar Recepción
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default PurchaseOrderDetailPage;
