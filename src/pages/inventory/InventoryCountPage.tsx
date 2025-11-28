import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
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

interface InventoryCount {
  id: string;
  name: string;
  location: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  totalProducts: number;
  countedProducts: number;
  discrepancies: number;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

interface CountItem {
  productId: string;
  productName: string;
  sku: string;
  expectedQty: number;
  countedQty: number | null;
  discrepancy: number;
  status: 'pending' | 'counted' | 'discrepancy';
}

const mockCounts: InventoryCount[] = [
  {
    id: 'cnt-001',
    name: 'Conteo General Q4 2025',
    location: 'Depósito Central',
    status: 'completed',
    totalProducts: 150,
    countedProducts: 150,
    discrepancies: 12,
    createdBy: 'Juan Pérez',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'cnt-002',
    name: 'Conteo Sucursal Norte',
    location: 'Sucursal Norte',
    status: 'in_progress',
    totalProducts: 85,
    countedProducts: 62,
    discrepancies: 5,
    createdBy: 'María García',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'cnt-003',
    name: 'Conteo Tecnología',
    location: 'Depósito Central',
    status: 'draft',
    totalProducts: 45,
    countedProducts: 0,
    discrepancies: 0,
    createdBy: 'Carlos López',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const mockCountItems: CountItem[] = [
  { productId: 'p1', productName: 'Monitor LED 24"', sku: 'MON-LED-24', expectedQty: 50, countedQty: 48, discrepancy: -2, status: 'discrepancy' },
  { productId: 'p2', productName: 'Teclado Mecánico', sku: 'TEC-MEC-01', expectedQty: 30, countedQty: 30, discrepancy: 0, status: 'counted' },
  { productId: 'p3', productName: 'Mouse Inalámbrico', sku: 'MOU-WL-01', expectedQty: 45, countedQty: null, discrepancy: 0, status: 'pending' },
  { productId: 'p4', productName: 'Auriculares Bluetooth', sku: 'AUR-BT-01', expectedQty: 25, countedQty: 27, discrepancy: 2, status: 'discrepancy' },
  { productId: 'p5', productName: 'Webcam HD', sku: 'WEB-HD-01', expectedQty: 20, countedQty: 20, discrepancy: 0, status: 'counted' },
];

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const locations = ['Depósito Central', 'Sucursal Norte', 'Sucursal Sur', 'Bodega Externa'];

export const InventoryCountPage = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<InventoryCount[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [countDetailOpen, setCountDetailOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState<InventoryCount | null>(null);
  const [countItems, setCountItems] = useState<CountItem[]>([]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [newCount, setNewCount] = useState({
    name: '',
    location: 'Depósito Central',
  });

  useEffect(() => {
    const loadCounts = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setCounts(mockCounts);
      setIsLoading(false);
    };

    loadCounts();
  }, []);

  const filteredCounts = useMemo(() => {
    let filtered = counts;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.location.toLowerCase().includes(s) ||
          c.createdBy.toLowerCase().includes(s)
      );
    }

    return filtered;
  }, [counts, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: counts.length,
      inProgress: counts.filter((c) => c.status === 'in_progress').length,
      completed: counts.filter((c) => c.status === 'completed').length,
      totalDiscrepancies: counts.reduce((sum, c) => sum + c.discrepancies, 0),
    };
  }, [counts]);

  const handleCreateCount = async () => {
    if (!newCount.name.trim()) return;

    const newInventoryCount: InventoryCount = {
      id: `cnt-${Date.now()}`,
      name: newCount.name,
      location: newCount.location,
      status: 'draft',
      totalProducts: Math.floor(Math.random() * 100) + 20,
      countedProducts: 0,
      discrepancies: 0,
      createdBy: 'Usuario Actual',
      createdAt: new Date().toISOString(),
    };

    setCounts([newInventoryCount, ...counts]);
    setCreateDialogOpen(false);
    setNewCount({ name: '', location: 'Depósito Central' });
    setSnackbar({ open: true, message: 'Conteo creado exitosamente', severity: 'success' });
  };

  const handleStartCount = (count: InventoryCount) => {
    setCounts(
      counts.map((c) => (c.id === count.id ? { ...c, status: 'in_progress' as const } : c))
    );
    setSnackbar({ open: true, message: 'Conteo iniciado', severity: 'info' });
  };

  const handleCompleteCount = (count: InventoryCount) => {
    setCounts(
      counts.map((c) =>
        c.id === count.id
          ? { ...c, status: 'completed' as const, completedAt: new Date().toISOString() }
          : c
      )
    );
    setSnackbar({ open: true, message: 'Conteo finalizado exitosamente', severity: 'success' });
  };

  const openCountDetail = (count: InventoryCount) => {
    setSelectedCount(count);
    setCountItems(mockCountItems);
    setCountDetailOpen(true);
  };

  const handleUpdateItemCount = (productId: string, countedQty: number) => {
    setCountItems(
      countItems.map((item) => {
        if (item.productId === productId) {
          const discrepancy = countedQty - item.expectedQty;
          return {
            ...item,
            countedQty,
            discrepancy,
            status: discrepancy !== 0 ? 'discrepancy' as const : 'counted' as const,
          };
        }
        return item;
      })
    );
  };

  const exportCSV = () => {
    const header = ['Nombre', 'Ubicación', 'Estado', 'Total Productos', 'Contados', 'Discrepancias', 'Creado Por', 'Fecha'];
    const rows = filteredCounts.map((c) => [
      c.name,
      c.location,
      statusLabels[c.status],
      c.totalProducts,
      c.countedProducts,
      c.discrepancies,
      c.createdBy,
      dayjs(c.createdAt).format('DD/MM/YYYY'),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-counts-${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Conteo Físico de Inventario"
        subtitle="Realizá y gestioná conteos de stock para verificar existencias"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
              Exportar
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
              Nuevo Conteo
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
                  Total de Conteos
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.total}
                </Typography>
                <Chip label="Histórico" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  En Progreso
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {stats.inProgress}
                </Typography>
                <Chip label="Activos" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Completados
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {stats.completed}
                </Typography>
                <Chip label="Finalizados" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Discrepancias
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {stats.totalDiscrepancies}
                </Typography>
                <Chip label="Diferencias encontradas" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre, ubicación o responsable..."
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
                <MenuItem value="draft">Borrador</MenuItem>
                <MenuItem value="in_progress">En Progreso</MenuItem>
                <MenuItem value="completed">Completado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de Conteos */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Mostrando {filteredCounts.length} de {counts.length} conteos
            </Typography>

            {isLoading ? (
              <LinearProgress />
            ) : filteredCounts.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <AssignmentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No se encontraron conteos
                </Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Progreso</TableCell>
                    <TableCell>Discrepancias</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Creado Por</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCounts.map((count) => (
                    <TableRow
                      key={count.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => openCountDetail(count)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {count.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{count.location}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="caption">
                            {count.countedProducts} / {count.totalProducts}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(count.countedProducts / count.totalProducts) * 100}
                            sx={{ height: 6, borderRadius: 1 }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {count.discrepancies > 0 ? (
                          <Chip
                            size="small"
                            icon={<WarningIcon fontSize="small" />}
                            label={count.discrepancies}
                            color="error"
                          />
                        ) : (
                          <Chip size="small" icon={<CheckCircleIcon fontSize="small" />} label="0" color="success" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={statusLabels[count.status]}
                          color={
                            count.status === 'completed'
                              ? 'success'
                              : count.status === 'in_progress'
                              ? 'warning'
                              : count.status === 'cancelled'
                              ? 'error'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{count.createdBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {dayjs(count.createdAt).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {count.status === 'draft' && (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleStartCount(count)}
                            >
                              <PlayArrowIcon fontSize="small" />
                            </IconButton>
                          )}
                          {count.status === 'in_progress' && (
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleCompleteCount(count)}
                            >
                              <StopIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Dialog Crear Conteo */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Conteo de Inventario</DialogTitle>
        <DialogContent>
          <Stack spacing={3} pt={1}>
            <TextField
              fullWidth
              label="Nombre del Conteo"
              value={newCount.name}
              onChange={(e) => setNewCount({ ...newCount, name: e.target.value })}
              placeholder="Ej: Conteo General Q4 2025"
            />
            <TextField
              select
              fullWidth
              label="Ubicación"
              value={newCount.location}
              onChange={(e) => setNewCount({ ...newCount, location: e.target.value })}
            >
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </TextField>
            <Alert severity="info">
              Se incluirán todos los productos de la ubicación seleccionada en el conteo.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateCount} variant="contained" disabled={!newCount.name.trim()}>
            Crear Conteo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Detalle del Conteo */}
      <Dialog open={countDetailOpen} onClose={() => setCountDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{selectedCount?.name}</Typography>
            {selectedCount && (
              <Chip
                label={statusLabels[selectedCount.status]}
                color={
                  selectedCount.status === 'completed'
                    ? 'success'
                    : selectedCount.status === 'in_progress'
                    ? 'warning'
                    : 'default'
                }
              />
            )}
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} pt={1}>
            {selectedCount && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Ubicación
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedCount.location}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Progreso
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedCount.countedProducts} / {selectedCount.totalProducts}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Discrepancias
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color="error.main">
                      {selectedCount.discrepancies}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider />

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell align="right">Stock Sistema</TableCell>
                      <TableCell align="right">Conteo</TableCell>
                      <TableCell align="right">Diferencia</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {countItems.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {item.productName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item.sku}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{item.expectedQty}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          {selectedCount.status === 'in_progress' ? (
                            <TextField
                              size="small"
                              type="number"
                              value={item.countedQty ?? ''}
                              onChange={(e) =>
                                handleUpdateItemCount(item.productId, Number(e.target.value))
                              }
                              sx={{ width: 80 }}
                              inputProps={{ min: 0 }}
                            />
                          ) : (
                            <Typography variant="body2">
                              {item.countedQty ?? '-'}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={
                              item.discrepancy === 0
                                ? 'success.main'
                                : item.discrepancy > 0
                                ? 'primary.main'
                                : 'error.main'
                            }
                          >
                            {item.discrepancy > 0 ? '+' : ''}
                            {item.discrepancy}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            icon={
                              item.status === 'pending' ? (
                                <PendingIcon fontSize="small" />
                              ) : item.status === 'discrepancy' ? (
                                <WarningIcon fontSize="small" />
                              ) : (
                                <CheckCircleIcon fontSize="small" />
                              )
                            }
                            label={
                              item.status === 'pending'
                                ? 'Pendiente'
                                : item.status === 'discrepancy'
                                ? 'Diferencia'
                                : 'OK'
                            }
                            color={
                              item.status === 'pending'
                                ? 'default'
                                : item.status === 'discrepancy'
                                ? 'error'
                                : 'success'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCountDetailOpen(false)}>Cerrar</Button>
          {selectedCount?.status === 'in_progress' && (
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                handleCompleteCount(selectedCount);
                setCountDetailOpen(false);
              }}
            >
              Finalizar Conteo
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default InventoryCountPage;
