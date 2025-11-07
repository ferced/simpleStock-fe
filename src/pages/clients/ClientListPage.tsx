import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { clientService } from '../../services/mockApi';
import type { Client } from '../../types';
import { useNavigate } from 'react-router-dom';

type SortKey = 'name' | 'totalBalance' | 'activeInvoices';

export const ClientListPage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [onlyDebt, setOnlyDebt] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      const data = await clientService.getClients();
      setClients(data);
      setIsLoading(false);
    };

    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    let list = clients.filter((client) => {
      const s = search.toLowerCase();
      const match =
        client.name.toLowerCase().includes(s) ||
        (client.email || '').toLowerCase().includes(s) ||
        (client.company || '').toLowerCase().includes(s);
      const debt = !onlyDebt || client.totalBalance > 0;
      return match && debt;
    });
    list = list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'totalBalance':
          return (a.totalBalance - b.totalBalance) * dir;
        case 'activeInvoices':
          return (a.activeInvoices - b.activeInvoices) * dir;
        default:
          return 0;
      }
    });
    return list;
  }, [clients, search, onlyDebt, sortKey, sortDir]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredClients.slice(start, start + rowsPerPage);
  }, [filteredClients, page, rowsPerPage]);

  const exportCSV = () => {
    const header = ['id', 'name', 'email', 'company', 'totalBalance', 'activeInvoices'];
    const rows = filteredClients.map((c) => [c.id, c.name, c.email, c.company || '', c.totalBalance, c.activeInvoices]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => (typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v))).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Clientes"
        subtitle="Segmentá, analizá y seguí la relación con tus clientes"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<AssessmentIcon />}>
              Ver reportes
            </Button>
            <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => navigate('/clientes/nuevo')}>
              Nuevo cliente
            </Button>
          </Stack>
        }
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nombre, email o empresa"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <Grid container spacing={2}>
                  <Grid item>
                    <FormControlLabel control={<Checkbox checked={onlyDebt} onChange={(e) => setOnlyDebt(e.target.checked)} />} label="Sólo con saldo > 0" />
                  </Grid>
                  <Grid item>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2">Ordenar por</Typography>
                      <Select size="small" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
                        <MenuItem value="name">Nombre</MenuItem>
                        <MenuItem value="totalBalance">Saldo</MenuItem>
                        <MenuItem value="activeInvoices">Facturas activas</MenuItem>
                      </Select>
                      <Select size="small" value={sortDir} onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}>
                        <MenuItem value="asc">Asc</MenuItem>
                        <MenuItem value="desc">Desc</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  <Grid item sx={{ ml: 'auto' }}>
                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>Exportar CSV</Button>
                  </Grid>
                </Grid>
                {isLoading ? <LinearProgress /> : null}
                <List>
                  {paginated.map((client) => (
                    <ListItem
                      key={client.id}
                      alignItems="flex-start"
                      sx={{
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        mb: 2,
                        py: 2,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                      onClick={() => navigate(`/clientes/${client.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                          {client.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={client.name}
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              {client.company ?? 'Sin empresa registrada'} · {client.email}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {client.phone ?? 'Sin teléfono'}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Stack spacing={1} alignItems="flex-end">
                        <Chip label={`${client.activeInvoices} facturas activas`} variant="outlined" />
                        <Typography variant="subtitle2" fontWeight={600} color={client.totalBalance > 0 ? 'error.main' : undefined}>
                          Saldo ${client.totalBalance.toLocaleString('es-AR')}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="outlined" startIcon={<ReceiptLongIcon />} onClick={(e) => { e.stopPropagation(); navigate('/facturacion/nueva'); }}>Factura</Button>
                          <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${client.id}/editar`); }}>Editar</Button>
                        </Stack>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography variant="body2">Filas por página</Typography>
                  </Grid>
                  <Grid item>
                    <Select size="small" value={String(rowsPerPage)} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} sx={{ ml: 1 }}>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item sx={{ ml: 'auto' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button variant="outlined" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Anterior</Button>
                      <Typography variant="caption">Página {page + 1} / {Math.max(1, Math.ceil(filteredClients.length / rowsPerPage))}</Typography>
                      <Button variant="outlined" disabled={(page + 1) * rowsPerPage >= filteredClients.length} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <SectionHeader title="Acciones rápidas" subtitle="Optimizar la relación con tus clientes" />
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Button variant="contained" color="secondary">
                  Generar campaña de emails
                </Button>
                <Button variant="outlined" startIcon={<LocalPhoneIcon />}>
                  Programar llamadas
                </Button>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Consejo: segmentá clientes con saldo vencido y enviá recordatorios automáticos.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
