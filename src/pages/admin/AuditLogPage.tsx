import { useState, useEffect, useMemo } from 'react';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import {
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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import dayjs from 'dayjs';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export';
  resource: string;
  resourceId?: string;
  description: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'usr-1',
    userName: 'Juan Pérez',
    userEmail: 'juan@empresa.com',
    action: 'update',
    resource: 'Producto',
    resourceId: 'prod-123',
    description: 'Actualizó el precio del producto "Monitor LED 24"',
    changes: [
      { field: 'price', oldValue: '45000', newValue: '48500' },
      { field: 'stock', oldValue: '25', newValue: '30' },
    ],
    ipAddress: '192.168.1.100',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'log-002',
    userId: 'usr-2',
    userName: 'María García',
    userEmail: 'maria@empresa.com',
    action: 'create',
    resource: 'Factura',
    resourceId: 'fac-456',
    description: 'Creó factura FC-00456 para cliente "Empresa ABC"',
    ipAddress: '192.168.1.101',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'log-003',
    userId: 'usr-1',
    userName: 'Juan Pérez',
    userEmail: 'juan@empresa.com',
    action: 'login',
    resource: 'Sistema',
    description: 'Inicio de sesión exitoso',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'log-004',
    userId: 'usr-3',
    userName: 'Carlos López',
    userEmail: 'carlos@empresa.com',
    action: 'delete',
    resource: 'Cliente',
    resourceId: 'cli-789',
    description: 'Eliminó el cliente "Cliente Inactivo"',
    ipAddress: '192.168.1.102',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'log-005',
    userId: 'usr-2',
    userName: 'María García',
    userEmail: 'maria@empresa.com',
    action: 'export',
    resource: 'Reporte',
    description: 'Exportó reporte de ventas del mes',
    ipAddress: '192.168.1.101',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'log-006',
    userId: 'usr-1',
    userName: 'Juan Pérez',
    userEmail: 'juan@empresa.com',
    action: 'update',
    resource: 'Configuración',
    description: 'Actualizó la configuración del sistema',
    changes: [
      { field: 'taxRate', oldValue: '21', newValue: '19' },
    ],
    ipAddress: '192.168.1.100',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'log-007',
    userId: 'usr-3',
    userName: 'Carlos López',
    userEmail: 'carlos@empresa.com',
    action: 'logout',
    resource: 'Sistema',
    description: 'Cierre de sesión',
    ipAddress: '192.168.1.102',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'log-008',
    userId: 'usr-2',
    userName: 'María García',
    userEmail: 'maria@empresa.com',
    action: 'create',
    resource: 'Producto',
    resourceId: 'prod-999',
    description: 'Creó nuevo producto "Teclado Mecánico RGB"',
    ipAddress: '192.168.1.101',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

const actionLabels: Record<string, { label: string; color: 'success' | 'primary' | 'warning' | 'error' | 'default' | 'info' }> = {
  create: { label: 'Crear', color: 'success' },
  read: { label: 'Ver', color: 'default' },
  update: { label: 'Editar', color: 'warning' },
  delete: { label: 'Eliminar', color: 'error' },
  login: { label: 'Iniciar Sesión', color: 'primary' },
  logout: { label: 'Cerrar Sesión', color: 'default' },
  export: { label: 'Exportar', color: 'info' },
};

const actionIcons: Record<string, any> = {
  create: AddIcon,
  read: VisibilityIcon,
  update: EditIcon,
  delete: DeleteIcon,
  login: LoginIcon,
  logout: LogoutIcon,
  export: DownloadIcon,
};

export const AuditLogPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setLogs(mockAuditLogs);
      setIsLoading(false);
    };

    loadLogs();
  }, []);

  const users = useMemo(() => {
    const uniqueUsers = new Map<string, { id: string; name: string }>();
    logs.forEach((log) => uniqueUsers.set(log.userId, { id: log.userId, name: log.userName }));
    return Array.from(uniqueUsers.values());
  }, [logs]);

  const resources = useMemo(() => {
    const uniqueResources = new Set<string>();
    logs.forEach((log) => uniqueResources.add(log.resource));
    return Array.from(uniqueResources);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    let filtered = logs;

    if (actionFilter !== 'all') {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    if (resourceFilter !== 'all') {
      filtered = filtered.filter((log) => log.resource === resourceFilter);
    }

    if (userFilter !== 'all') {
      filtered = filtered.filter((log) => log.userId === userFilter);
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.description.toLowerCase().includes(s) ||
          log.userName.toLowerCase().includes(s) ||
          log.resource.toLowerCase().includes(s)
      );
    }

    return filtered;
  }, [logs, search, actionFilter, resourceFilter, userFilter]);

  const paginatedLogs = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredLogs.slice(start, start + rowsPerPage);
  }, [filteredLogs, page]);

  const exportCSV = () => {
    const header = ['Fecha', 'Usuario', 'Acción', 'Recurso', 'Descripción', 'IP'];
    const rows = filteredLogs.map((log) => [
      dayjs(log.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      log.userName,
      actionLabels[log.action]?.label || log.action,
      log.resource,
      log.description,
      log.ipAddress,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const today = dayjs().startOf('day');
    const todayLogs = logs.filter((log) => dayjs(log.createdAt).isAfter(today));
    return {
      totalLogs: logs.length,
      todayLogs: todayLogs.length,
      uniqueUsers: users.length,
      criticalActions: logs.filter((log) => log.action === 'delete').length,
    };
  }, [logs, users]);

  const openDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Log de Auditoría"
        subtitle="Registro de todas las acciones realizadas en el sistema"
        action={
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV}>
            Exportar CSV
          </Button>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total de Registros
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.totalLogs}
                </Typography>
                <Chip label="Histórico completo" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Acciones Hoy
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {stats.todayLogs}
                </Typography>
                <Chip label="Últimas 24h" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Usuarios Activos
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {stats.uniqueUsers}
                </Typography>
                <Chip label="Con actividad" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Eliminaciones
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {stats.criticalActions}
                </Typography>
                <Chip label="Acciones críticas" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <FilterListIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Filtros
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
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
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Acción"
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                >
                  <MenuItem value="all">Todas las acciones</MenuItem>
                  <MenuItem value="create">Crear</MenuItem>
                  <MenuItem value="update">Editar</MenuItem>
                  <MenuItem value="delete">Eliminar</MenuItem>
                  <MenuItem value="login">Iniciar Sesión</MenuItem>
                  <MenuItem value="logout">Cerrar Sesión</MenuItem>
                  <MenuItem value="export">Exportar</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Recurso"
                  value={resourceFilter}
                  onChange={(e) => setResourceFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos los recursos</MenuItem>
                  {resources.map((resource) => (
                    <MenuItem key={resource} value={resource}>
                      {resource}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Usuario"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos los usuarios</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Mostrando {paginatedLogs.length} de {filteredLogs.length} registros
            </Typography>

            {isLoading ? (
              <LinearProgress />
            ) : filteredLogs.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No se encontraron registros
                </Typography>
              </Stack>
            ) : (
              <>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Acción</TableCell>
                      <TableCell>Recurso</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>IP</TableCell>
                      <TableCell align="right">Detalle</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedLogs.map((log) => {
                      const ActionIcon = actionIcons[log.action] || HistoryIcon;
                      const actionConfig = actionLabels[log.action] || { label: log.action, color: 'default' as const };
                      return (
                        <TableRow key={log.id} hover>
                          <TableCell>
                            <Typography variant="body2">
                              {dayjs(log.createdAt).format('DD/MM/YYYY')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dayjs(log.createdAt).format('HH:mm:ss')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light' }}>
                                <PersonIcon sx={{ fontSize: 16 }} />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {log.userName}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              icon={<ActionIcon sx={{ fontSize: 14 }} />}
                              label={actionConfig.label}
                              color={actionConfig.color}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{log.resource}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 300,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {log.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {log.ipAddress}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => openDetail(log)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Paginación */}
                <Stack direction="row" justifyContent="flex-end" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    Anterior
                  </Button>
                  <Typography variant="caption">
                    Página {page + 1} / {Math.max(1, Math.ceil(filteredLogs.length / rowsPerPage))}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={(page + 1) * rowsPerPage >= filteredLogs.length}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Dialog de Detalle */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalle del Registro</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Stack spacing={3} pt={1}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Fecha y Hora
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {dayjs(selectedLog.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Acción
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      size="small"
                      label={actionLabels[selectedLog.action]?.label || selectedLog.action}
                      color={actionLabels[selectedLog.action]?.color || 'default'}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Usuario
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedLog.userEmail}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Recurso
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedLog.resource}
                  {selectedLog.resourceId && ` (${selectedLog.resourceId})`}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Descripción
                </Typography>
                <Typography variant="body1">{selectedLog.description}</Typography>
              </Box>

              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cambios Realizados
                  </Typography>
                  <Table size="small" sx={{ mt: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Campo</TableCell>
                        <TableCell>Valor Anterior</TableCell>
                        <TableCell>Valor Nuevo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedLog.changes.map((change, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{change.field}</TableCell>
                          <TableCell>
                            <Typography variant="body2" color="error.main">
                              {change.oldValue}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="success.main">
                              {change.newValue}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}

              <Divider />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Dirección IP
                  </Typography>
                  <Typography variant="body2">{selectedLog.ipAddress}</Typography>
                </Grid>
                {selectedLog.userAgent && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Navegador
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {selectedLog.userAgent}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AuditLogPage;
