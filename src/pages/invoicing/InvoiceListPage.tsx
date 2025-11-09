import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  type ChipProps,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { CreateInvoiceModal } from '../../components/invoicing/CreateInvoiceModal';
import { invoicingService } from '../../services/mockApi';
import type { Invoice, PaymentReminder } from '../../types';

const statusMap: Record<Invoice['status'], { label: string; color: ChipProps['color'] }> = {
  draft: { label: 'Borrador', color: 'default' },
  sent: { label: 'Enviada', color: 'warning' },
  paid: { label: 'Pagada', color: 'success' },
  overdue: { label: 'Vencida', color: 'error' },
};

export const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | Invoice['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    const loadInvoicing = async () => {
      setIsLoading(true);
      const [invoiceData, reminderData] = await Promise.all([
        invoicingService.getInvoices(),
        invoicingService.getReminders(),
      ]);
      setInvoices(invoiceData);
      setReminders(reminderData);
      setIsLoading(false);
    };

    loadInvoicing();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      const matchesSearch = searchTerm === '' ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.total.toString().includes(searchTerm);

      let matchesDate = true;
      if (dateFilter !== 'all') {
        const invoiceDate = dayjs(invoice.createdAt);
        const now = dayjs();
        if (dateFilter === 'today') {
          matchesDate = invoiceDate.isSame(now, 'day');
        } else if (dateFilter === 'week') {
          matchesDate = invoiceDate.isAfter(now.subtract(7, 'days'));
        } else if (dateFilter === 'month') {
          matchesDate = invoiceDate.isAfter(now.subtract(30, 'days'));
        }
      }

      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [invoices, statusFilter, searchTerm, dateFilter]);

  const invoiceStats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
    const pending = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
    return { total, paid, pending };
  }, [invoices]);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Facturación"
        subtitle="Seguimiento de facturas, pagos y recordatorios"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<PictureAsPdfIcon />}>
              Exportar PDF
            </Button>
            <Button variant="contained" onClick={() => setCreateModalOpen(true)}>Crear factura</Button>
          </Stack>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total Facturado
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  ${invoiceStats.total.toLocaleString('es-AR')}
                </Typography>
                <Chip label={`${invoices.length} facturas`} size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Cobrado
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  ${invoiceStats.paid.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Facturas pagadas" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Por Cobrar
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  ${invoiceStats.pending.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Pendientes" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    placeholder="Buscar por número o monto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    select
                    label="Estado"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as Invoice['status'] | 'all')}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    {Object.entries(statusMap).map(([status, value]) => (
                      <MenuItem key={status} value={status}>
                        {value.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Fecha"
                    value={dateFilter}
                    onChange={(event) => setDateFilter(event.target.value as typeof dateFilter)}
                    sx={{ minWidth: 150 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FilterListIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="today">Hoy</MenuItem>
                    <MenuItem value="week">Última semana</MenuItem>
                    <MenuItem value="month">Último mes</MenuItem>
                  </TextField>
                </Stack>
                {isLoading ? <LinearProgress /> : null}
                <Typography variant="body2" color="text.secondary">
                  Mostrando {filteredInvoices.length} de {invoices.length} facturas
                </Typography>
                <List>
                  {filteredInvoices.map((invoice) => (
                    <ListItem
                      key={invoice.id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body1" fontWeight={600}>
                              Factura {invoice.id}
                            </Typography>
                            <Chip
                              label={statusMap[invoice.status].label}
                              color={statusMap[invoice.status].color}
                              size="small"
                            />
                          </Stack>
                        }
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              Emitida: {dayjs(invoice.createdAt).format('DD MMM YYYY')}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              Vencimiento: {dayjs(invoice.dueDate).format('DD MMM YYYY')}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack spacing={0.5} alignItems="flex-end">
                          <Typography variant="h6" fontWeight={700}>
                            ${invoice.total.toLocaleString('es-AR')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {invoice.status === 'paid' ? 'Pagado' : 'Pendiente'}
                          </Typography>
                        </Stack>
                        <Tooltip title="Ver detalle">
                          <IconButton color="primary">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <SectionHeader title="Recordatorios" subtitle="Pagos pendientes programados" />
              {isLoading ? <LinearProgress /> : null}
              <List>
                {reminders.map((reminder) => (
                  <ListItem key={reminder.id} alignItems="flex-start">
                    <ListItemText
                      primary={reminder.clientName}
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            ${reminder.amount.toLocaleString('es-AR')} · Vence {dayjs(reminder.dueDate).format('DD MMM')}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            Factura {reminder.invoiceId}
                          </Typography>
                        </Stack>
                      }
                    />
                    <Stack spacing={1}>
                      <Button size="small" variant="outlined" startIcon={<AttachEmailIcon fontSize="small" />}>
                        Enviar email
                      </Button>
                      <Button size="small" variant="text" startIcon={<BeenhereIcon fontSize="small" />}>
                        Registrar pago
                      </Button>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>

      <CreateInvoiceModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          // Recargar facturas después de crear una nueva
          const loadInvoicing = async () => {
            const [invoiceData, reminderData] = await Promise.all([
              invoicingService.getInvoices(),
              invoicingService.getReminders(),
            ]);
            setInvoices(invoiceData);
            setReminders(reminderData);
          };
          loadInvoicing();
        }}
      />
    </Stack>
  );
};
