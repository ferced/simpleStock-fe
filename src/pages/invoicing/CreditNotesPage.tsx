import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
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

interface CreditNote {
  id: string;
  invoiceId: string;
  clientId: string;
  clientName: string;
  amount: number;
  reason: string;
  status: 'draft' | 'issued' | 'cancelled';
  createdAt: string;
}

const mockCreditNotes: CreditNote[] = [
  {
    id: 'CN-001',
    invoiceId: 'FAC-001',
    clientId: 'c1',
    clientName: 'Cliente Demo',
    amount: 15000,
    reason: 'Devolución de mercadería',
    status: 'issued',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'CN-002',
    invoiceId: 'FAC-005',
    clientId: 'c2',
    clientName: 'Empresa ABC',
    amount: 8500,
    reason: 'Error en facturación',
    status: 'issued',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'CN-003',
    invoiceId: 'FAC-012',
    clientId: 'c3',
    clientName: 'Corporación XYZ',
    amount: 25000,
    reason: 'Descuento acordado',
    status: 'draft',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  issued: 'Emitida',
  cancelled: 'Anulada',
};

export const CreditNotesPage = () => {
  const navigate = useNavigate();
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCreditNotes = async () => {
      setIsLoading(true);
      // TODO: await apiClient.get('/credit-notes')
      await new Promise(r => setTimeout(r, 500));
      setCreditNotes(mockCreditNotes);
      setIsLoading(false);
    };

    loadCreditNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    if (!search) return creditNotes;
    const s = search.toLowerCase();
    return creditNotes.filter(
      note =>
        note.id.toLowerCase().includes(s) ||
        note.invoiceId.toLowerCase().includes(s) ||
        note.clientName.toLowerCase().includes(s) ||
        note.reason.toLowerCase().includes(s)
    );
  }, [creditNotes, search]);

  const stats = useMemo(() => {
    const totalAmount = creditNotes
      .filter(n => n.status === 'issued')
      .reduce((sum, n) => sum + n.amount, 0);
    const totalCount = creditNotes.length;
    const issuedCount = creditNotes.filter(n => n.status === 'issued').length;
    const draftCount = creditNotes.filter(n => n.status === 'draft').length;
    return { totalAmount, totalCount, issuedCount, draftCount };
  }, [creditNotes]);

  const exportCSV = () => {
    const header = ['Número', 'Factura', 'Cliente', 'Monto', 'Motivo', 'Estado', 'Fecha'];
    const rows = filteredNotes.map(n => [
      n.id,
      n.invoiceId,
      n.clientName,
      n.amount,
      n.reason,
      statusLabels[n.status],
      dayjs(n.createdAt).format('DD/MM/YYYY'),
    ]);
    const csv = [header, ...rows]
      .map(r => r.map(v => (typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v))).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notas-credito.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Notas de Crédito"
        subtitle="Gestioná devoluciones, descuentos y cancelaciones"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
              Exportar
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/facturacion/notas-credito/nueva')}>
              Nueva Nota de Crédito
            </Button>
          </Stack>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total de Notas
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.totalCount}
                </Typography>
                <Chip label="Historial completo" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Notas Emitidas
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {stats.issuedCount}
                </Typography>
                <Chip label="Aprobadas" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Borradores
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {stats.draftCount}
                </Typography>
                <Chip label="Pendientes" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Monto Total
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  ${stats.totalAmount.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Notas emitidas" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Notas de Crédito */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              placeholder="Buscar por número, factura, cliente o motivo"
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

            <Typography variant="body2" color="text.secondary">
              Mostrando {filteredNotes.length} de {creditNotes.length} notas de crédito
            </Typography>

            {isLoading ? (
              <LinearProgress />
            ) : filteredNotes.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <ReceiptIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {search ? 'No se encontraron notas de crédito' : 'No hay notas de crédito registradas'}
                </Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Número</TableCell>
                    <TableCell>Factura</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredNotes.map((note) => (
                    <TableRow
                      key={note.id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                      onClick={() => navigate(`/facturacion/notas-credito/${note.id}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {note.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{note.invoiceId}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{note.clientName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {note.reason}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600} color="error.main">
                          ${note.amount.toLocaleString('es-AR')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={statusLabels[note.status]}
                          color={
                            note.status === 'issued'
                              ? 'success'
                              : note.status === 'draft'
                              ? 'warning'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {dayjs(note.createdAt).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Información */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Sobre las Notas de Crédito
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                ¿Qué es una Nota de Crédito?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Una nota de crédito es un documento que se emite para anular total o parcialmente una factura.
                Se utiliza en casos de devoluciones, descuentos o errores de facturación.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Motivos comunes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Devolución de mercadería • Error en facturación • Descuentos acordados •
                Cancelación de venta • Productos defectuosos
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Efectos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Una nota de crédito reduce el saldo pendiente del cliente y puede generar
                un crédito a favor que se puede aplicar en futuras compras.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CreditNotesPage;
