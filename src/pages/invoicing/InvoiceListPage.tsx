import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
  type ChipProps,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
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
  const [isLoading, setIsLoading] = useState(true);

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
    return invoices.filter((invoice) => statusFilter === 'all' || invoice.status === statusFilter);
  }, [invoices, statusFilter]);

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
            <Button variant="contained">Crear factura</Button>
          </Stack>
        }
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  select
                  label="Estado"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as Invoice['status'] | 'all')}
                  sx={{ maxWidth: 220 }}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {Object.entries(statusMap).map(([status, value]) => (
                    <MenuItem key={status} value={status}>
                      {value.label}
                    </MenuItem>
                  ))}
                </TextField>
                {isLoading ? <LinearProgress /> : null}
                <List>
                  {filteredInvoices.map((invoice) => (
                    <ListItem key={invoice.id} sx={{ borderRadius: 2, mb: 1 }}>
                      <ListItemText
                        primary={`Factura ${invoice.id}`}
                        secondary={
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              {dayjs(invoice.createdAt).format('DD MMM YYYY')} · Vence {dayjs(invoice.dueDate).format('DD MMM')}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              ${invoice.total.toLocaleString('es-AR')}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Chip label={statusMap[invoice.status].label} color={statusMap[invoice.status].color} variant="outlined" />
                      <Box ml={2}>
                        <Button size="small">Ver detalle</Button>
                      </Box>
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
    </Stack>
  );
};
