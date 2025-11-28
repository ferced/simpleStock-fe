import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LoopIcon from '@mui/icons-material/Loop';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
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
  Switch,
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

interface CyclicCountConfig {
  id: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  isActive: boolean;
  totalProducts: number;
  lastCountDate: string | null;
  nextCountDate: string;
  completedCounts: number;
  totalDiscrepancies: number;
}

interface CyclicCountTask {
  id: string;
  configId: string;
  configName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  products: number;
  countedProducts: number;
  discrepancies: number;
  assignee?: string;
}

const mockConfigs: CyclicCountConfig[] = [
  {
    id: 'cyc-001',
    name: 'Productos de Alto Valor',
    category: 'Electrónica',
    frequency: 'weekly',
    isActive: true,
    totalProducts: 25,
    lastCountDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    nextCountDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    completedCounts: 12,
    totalDiscrepancies: 3,
  },
  {
    id: 'cyc-002',
    name: 'Productos de Alta Rotación',
    category: 'Consumibles',
    frequency: 'daily',
    isActive: true,
    totalProducts: 40,
    lastCountDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    nextCountDate: new Date().toISOString(),
    completedCounts: 28,
    totalDiscrepancies: 8,
  },
  {
    id: 'cyc-003',
    name: 'Inventario General',
    category: 'Todos',
    frequency: 'monthly',
    isActive: true,
    totalProducts: 150,
    lastCountDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    nextCountDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    completedCounts: 6,
    totalDiscrepancies: 15,
  },
  {
    id: 'cyc-004',
    name: 'Productos Estacionales',
    category: 'Temporada',
    frequency: 'quarterly',
    isActive: false,
    totalProducts: 30,
    lastCountDate: null,
    nextCountDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    completedCounts: 0,
    totalDiscrepancies: 0,
  },
];

const mockTasks: CyclicCountTask[] = [
  {
    id: 'task-001',
    configId: 'cyc-002',
    configName: 'Productos de Alta Rotación',
    status: 'pending',
    dueDate: new Date().toISOString(),
    products: 40,
    countedProducts: 0,
    discrepancies: 0,
    assignee: 'María García',
  },
  {
    id: 'task-002',
    configId: 'cyc-001',
    configName: 'Productos de Alto Valor',
    status: 'overdue',
    dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    products: 25,
    countedProducts: 10,
    discrepancies: 1,
    assignee: 'Juan Pérez',
  },
  {
    id: 'task-003',
    configId: 'cyc-003',
    configName: 'Inventario General',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    products: 150,
    countedProducts: 75,
    discrepancies: 5,
    assignee: 'Carlos López',
  },
];

const frequencyLabels: Record<string, string> = {
  daily: 'Diario',
  weekly: 'Semanal',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completado',
  overdue: 'Vencido',
};

const categories = ['Electrónica', 'Consumibles', 'Oficina', 'Temporada', 'Todos'];

export const CyclicCountPage = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<CyclicCountConfig[]>([]);
  const [tasks, setTasks] = useState<CyclicCountTask[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [configDetailOpen, setConfigDetailOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<CyclicCountConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'configs' | 'tasks'>('tasks');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [newConfig, setNewConfig] = useState<{
    name: string;
    category: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  }>({
    name: '',
    category: 'Todos',
    frequency: 'weekly',
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setConfigs(mockConfigs);
      setTasks(mockTasks);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const filteredConfigs = useMemo(() => {
    if (!search) return configs;
    const s = search.toLowerCase();
    return configs.filter(
      (c) => c.name.toLowerCase().includes(s) || c.category.toLowerCase().includes(s)
    );
  }, [configs, search]);

  const filteredTasks = useMemo(() => {
    if (!search) return tasks;
    const s = search.toLowerCase();
    return tasks.filter(
      (t) => t.configName.toLowerCase().includes(s) || (t.assignee?.toLowerCase().includes(s) ?? false)
    );
  }, [tasks, search]);

  const stats = useMemo(() => {
    return {
      activeConfigs: configs.filter((c) => c.isActive).length,
      pendingTasks: tasks.filter((t) => t.status === 'pending').length,
      overdueTasks: tasks.filter((t) => t.status === 'overdue').length,
      totalDiscrepancies: configs.reduce((sum, c) => sum + c.totalDiscrepancies, 0),
    };
  }, [configs, tasks]);

  const handleCreateConfig = async () => {
    if (!newConfig.name.trim()) return;

    const newCyclicConfig: CyclicCountConfig = {
      id: `cyc-${Date.now()}`,
      name: newConfig.name,
      category: newConfig.category,
      frequency: newConfig.frequency,
      isActive: true,
      totalProducts: Math.floor(Math.random() * 50) + 10,
      lastCountDate: null,
      nextCountDate: dayjs().add(
        newConfig.frequency === 'daily' ? 1 :
        newConfig.frequency === 'weekly' ? 7 :
        newConfig.frequency === 'monthly' ? 30 : 90,
        'day'
      ).toISOString(),
      completedCounts: 0,
      totalDiscrepancies: 0,
    };

    setConfigs([newCyclicConfig, ...configs]);
    setCreateDialogOpen(false);
    setNewConfig({ name: '', category: 'Todos', frequency: 'weekly' });
    setSnackbar({ open: true, message: 'Configuración de conteo cíclico creada', severity: 'success' });
  };

  const handleToggleActive = (configId: string) => {
    setConfigs(
      configs.map((c) => (c.id === configId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleStartTask = (taskId: string) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: 'in_progress' as const } : t))
    );
    setSnackbar({ open: true, message: 'Conteo iniciado', severity: 'info' });
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: 'completed' as const, countedProducts: t.products } : t))
    );
    setSnackbar({ open: true, message: 'Conteo completado', severity: 'success' });
  };

  const exportCSV = () => {
    if (activeTab === 'configs') {
      const header = ['Nombre', 'Categoría', 'Frecuencia', 'Activo', 'Productos', 'Conteos Completados', 'Discrepancias'];
      const rows = filteredConfigs.map((c) => [
        c.name,
        c.category,
        frequencyLabels[c.frequency],
        c.isActive ? 'Sí' : 'No',
        c.totalProducts,
        c.completedCounts,
        c.totalDiscrepancies,
      ]);
      const csv = [header, ...rows]
        .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cyclic-counts-config-${dayjs().format('YYYY-MM-DD')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const header = ['Conteo', 'Estado', 'Fecha Límite', 'Productos', 'Contados', 'Discrepancias', 'Asignado'];
      const rows = filteredTasks.map((t) => [
        t.configName,
        statusLabels[t.status],
        dayjs(t.dueDate).format('DD/MM/YYYY'),
        t.products,
        t.countedProducts,
        t.discrepancies,
        t.assignee ?? 'Sin asignar',
      ]);
      const csv = [header, ...rows]
        .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cyclic-counts-tasks-${dayjs().format('YYYY-MM-DD')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Conteo Cíclico"
        subtitle="Programá y gestioná conteos periódicos de inventario"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
              Exportar
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
              Nueva Configuración
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
                  Conteos Activos
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.activeConfigs}
                </Typography>
                <Chip label="Configuraciones" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Tareas Pendientes
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {stats.pendingTasks}
                </Typography>
                <Chip label="Por realizar" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Tareas Vencidas
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {stats.overdueTasks}
                </Typography>
                <Chip label="Requieren atención" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Discrepancias Totales
                </Typography>
                <Typography variant="h5" fontWeight={700} color="text.secondary">
                  {stats.totalDiscrepancies}
                </Typography>
                <Chip label="Histórico" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs de navegación */}
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} mb={3}>
            <Button
              variant={activeTab === 'tasks' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('tasks')}
              startIcon={<CalendarTodayIcon />}
            >
              Tareas Programadas
            </Button>
            <Button
              variant={activeTab === 'configs' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('configs')}
              startIcon={<SettingsIcon />}
            >
              Configuraciones
            </Button>
          </Stack>

          <TextField
            fullWidth
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {isLoading ? (
            <LinearProgress />
          ) : activeTab === 'tasks' ? (
            <>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Mostrando {filteredTasks.length} tareas programadas
              </Typography>

              {filteredTasks.length === 0 ? (
                <Stack alignItems="center" py={4}>
                  <ScheduleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay tareas programadas
                  </Typography>
                </Stack>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Conteo</TableCell>
                      <TableCell>Fecha Límite</TableCell>
                      <TableCell>Progreso</TableCell>
                      <TableCell>Discrepancias</TableCell>
                      <TableCell>Asignado a</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {task.configName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">
                              {dayjs(task.dueDate).format('DD/MM/YYYY')}
                            </Typography>
                            {task.status === 'overdue' && (
                              <WarningIcon fontSize="small" color="error" />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="caption">
                              {task.countedProducts} / {task.products}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(task.countedProducts / task.products) * 100}
                              sx={{ height: 6, borderRadius: 1 }}
                              color={task.status === 'overdue' ? 'error' : 'primary'}
                            />
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {task.discrepancies > 0 ? (
                            <Chip size="small" label={task.discrepancies} color="error" />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              0
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.assignee ?? 'Sin asignar'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={statusLabels[task.status]}
                            color={
                              task.status === 'completed'
                                ? 'success'
                                : task.status === 'in_progress'
                                ? 'primary'
                                : task.status === 'overdue'
                                ? 'error'
                                : 'warning'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            {task.status === 'pending' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleStartTask(task.id)}
                              >
                                Iniciar
                              </Button>
                            )}
                            {task.status === 'in_progress' && (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleCompleteTask(task.id)}
                              >
                                Completar
                              </Button>
                            )}
                            {task.status === 'overdue' && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleStartTask(task.id)}
                              >
                                Iniciar
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Mostrando {filteredConfigs.length} configuraciones
              </Typography>

              {filteredConfigs.length === 0 ? (
                <Stack alignItems="center" py={4}>
                  <LoopIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay configuraciones de conteo cíclico
                  </Typography>
                </Stack>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Frecuencia</TableCell>
                      <TableCell>Productos</TableCell>
                      <TableCell>Próximo Conteo</TableCell>
                      <TableCell>Completados</TableCell>
                      <TableCell>Activo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredConfigs.map((config) => (
                      <TableRow key={config.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {config.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label={config.category} variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LoopIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {frequencyLabels[config.frequency]}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{config.totalProducts}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {dayjs(config.nextCountDate).format('DD/MM/YYYY')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">{config.completedCounts}</Typography>
                            {config.totalDiscrepancies > 0 && (
                              <Chip
                                size="small"
                                icon={<WarningIcon fontSize="small" />}
                                label={`${config.totalDiscrepancies} disc.`}
                                color="error"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={config.isActive}
                            onChange={() => handleToggleActive(config.id)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog Crear Configuración */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Configuración de Conteo Cíclico</DialogTitle>
        <DialogContent>
          <Stack spacing={3} pt={1}>
            <TextField
              fullWidth
              label="Nombre"
              value={newConfig.name}
              onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
              placeholder="Ej: Productos de Alto Valor"
            />
            <TextField
              select
              fullWidth
              label="Categoría de Productos"
              value={newConfig.category}
              onChange={(e) => setNewConfig({ ...newConfig, category: e.target.value })}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Frecuencia"
              value={newConfig.frequency}
              onChange={(e) => setNewConfig({ ...newConfig, frequency: e.target.value as any })}
            >
              <MenuItem value="daily">Diario</MenuItem>
              <MenuItem value="weekly">Semanal</MenuItem>
              <MenuItem value="monthly">Mensual</MenuItem>
              <MenuItem value="quarterly">Trimestral</MenuItem>
            </TextField>
            <Alert severity="info">
              Se crearán automáticamente tareas de conteo según la frecuencia seleccionada.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateConfig} variant="contained" disabled={!newConfig.name.trim()}>
            Crear Configuración
          </Button>
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

export default CyclicCountPage;
