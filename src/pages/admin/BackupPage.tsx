import { useState, useEffect } from 'react';
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import WarningIcon from '@mui/icons-material/Warning';
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

interface BackupData {
  id: string;
  filename: string;
  size: number;
  type: 'manual' | 'automatic';
  status: 'completed' | 'failed' | 'in_progress';
  createdAt: string;
}

interface BackupSettings {
  autoBackupEnabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  lastBackupDate: string | null;
  nextBackupDate: string | null;
}

const mockBackups: BackupData[] = [
  {
    id: 'bk-001',
    filename: 'backup_2025-11-28_10-00.zip',
    size: 15728640,
    type: 'automatic',
    status: 'completed',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'bk-002',
    filename: 'backup_2025-11-27_10-00.zip',
    size: 15204352,
    type: 'automatic',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'bk-003',
    filename: 'backup_2025-11-26_15-30.zip',
    size: 14680064,
    type: 'manual',
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'bk-004',
    filename: 'backup_2025-11-25_10-00.zip',
    size: 14155776,
    type: 'automatic',
    status: 'completed',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'bk-005',
    filename: 'backup_2025-11-24_10-00.zip',
    size: 13631488,
    type: 'automatic',
    status: 'failed',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const BackupPage = () => {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [settings, setSettings] = useState<BackupSettings>({
    autoBackupEnabled: true,
    frequency: 'daily',
    retentionDays: 30,
    lastBackupDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    nextBackupDate: new Date(Date.now() + 1 * 86400000).toISOString(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupData | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const loadBackups = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setBackups(mockBackups);
      setIsLoading(false);
    };

    loadBackups();
  }, []);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    await new Promise((r) => setTimeout(r, 2000));

    const newBackup: BackupData = {
      id: `bk-${Date.now()}`,
      filename: `backup_${dayjs().format('YYYY-MM-DD_HH-mm')}.zip`,
      size: Math.floor(Math.random() * 5000000) + 10000000,
      type: 'manual',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setBackups([newBackup, ...backups]);
    setIsCreatingBackup(false);
    setSnackbar({ open: true, message: 'Respaldo creado exitosamente', severity: 'success' });
  };

  const handleRestore = async () => {
    if (!selectedBackup) return;
    setRestoreDialogOpen(false);
    setSnackbar({ open: true, message: 'Restauración iniciada. Este proceso puede tomar varios minutos.', severity: 'info' });

    await new Promise((r) => setTimeout(r, 3000));
    setSnackbar({ open: true, message: 'Sistema restaurado exitosamente', severity: 'success' });
    setSelectedBackup(null);
  };

  const handleDelete = async () => {
    if (!selectedBackup) return;
    setBackups(backups.filter((b) => b.id !== selectedBackup.id));
    setDeleteDialogOpen(false);
    setSnackbar({ open: true, message: 'Respaldo eliminado', severity: 'success' });
    setSelectedBackup(null);
  };

  const handleDownload = (backup: BackupData) => {
    setSnackbar({ open: true, message: `Descargando ${backup.filename}...`, severity: 'info' });
  };

  const handleSettingsChange = (field: keyof BackupSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [field]: value });
  };

  const stats = {
    totalBackups: backups.length,
    successfulBackups: backups.filter((b) => b.status === 'completed').length,
    failedBackups: backups.filter((b) => b.status === 'failed').length,
    totalSize: backups.reduce((sum, b) => sum + b.size, 0),
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Respaldo y Restauración"
        subtitle="Gestioná las copias de seguridad del sistema"
        action={
          <Button
            variant="contained"
            startIcon={<BackupIcon />}
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
          >
            {isCreatingBackup ? 'Creando...' : 'Crear Respaldo'}
          </Button>
        }
      />

      {isCreatingBackup && <LinearProgress />}

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total de Respaldos
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.totalBackups}
                </Typography>
                <Chip label="Historial" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Exitosos
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {stats.successfulBackups}
                </Typography>
                <Chip label="Completados" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Fallidos
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {stats.failedBackups}
                </Typography>
                <Chip label="Con errores" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Espacio Total
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {formatFileSize(stats.totalSize)}
                </Typography>
                <Chip label="Almacenamiento" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Configuración de Respaldos Automáticos */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <ScheduleIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Respaldos Automáticos
              </Typography>
            </Box>
            <Divider />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Habilitar respaldos automáticos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  El sistema creará respaldos automáticamente según la frecuencia configurada
                </Typography>
              </Stack>
              <Switch
                checked={settings.autoBackupEnabled}
                onChange={handleSettingsChange('autoBackupEnabled')}
              />
            </Box>

            {settings.autoBackupEnabled && (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      select
                      fullWidth
                      label="Frecuencia"
                      value={settings.frequency}
                      onChange={handleSettingsChange('frequency')}
                    >
                      <MenuItem value="daily">Diario</MenuItem>
                      <MenuItem value="weekly">Semanal</MenuItem>
                      <MenuItem value="monthly">Mensual</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Días de retención"
                      value={settings.retentionDays}
                      onChange={handleSettingsChange('retentionDays')}
                      helperText="Eliminar respaldos más antiguos"
                      inputProps={{ min: 7, max: 365 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <Typography variant="caption" color="text.secondary">
                        Próximo respaldo
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {settings.nextBackupDate
                          ? dayjs(settings.nextBackupDate).format('DD/MM/YYYY HH:mm')
                          : 'No programado'}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>

                {settings.lastBackupDate && (
                  <Alert severity="info" icon={<CloudDoneIcon />}>
                    Último respaldo automático:{' '}
                    {dayjs(settings.lastBackupDate).format('DD/MM/YYYY HH:mm')}
                  </Alert>
                )}
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Lista de Respaldos */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={700}>
              Historial de Respaldos
            </Typography>
            <Divider />

            {isLoading ? (
              <LinearProgress />
            ) : backups.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <BackupIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No hay respaldos registrados
                </Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Archivo</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Tamaño</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {backup.filename}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={backup.type === 'automatic' ? 'Automático' : 'Manual'}
                          color={backup.type === 'automatic' ? 'primary' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatFileSize(backup.size)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            backup.status === 'completed'
                              ? 'Completado'
                              : backup.status === 'failed'
                              ? 'Fallido'
                              : 'En progreso'
                          }
                          color={
                            backup.status === 'completed'
                              ? 'success'
                              : backup.status === 'failed'
                              ? 'error'
                              : 'warning'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {dayjs(backup.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(backup)}
                            disabled={backup.status !== 'completed'}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setRestoreDialogOpen(true);
                            }}
                            disabled={backup.status !== 'completed'}
                          >
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedBackup(backup);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
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

      {/* Advertencia */}
      <Alert severity="warning" icon={<WarningIcon />}>
        <Typography variant="body2">
          <strong>Importante:</strong> Restaurar un respaldo reemplazará todos los datos actuales del sistema.
          Se recomienda crear un respaldo antes de realizar cualquier restauración.
        </Typography>
      </Alert>

      {/* Dialog de Restauración */}
      <Dialog open={restoreDialogOpen} onClose={() => setRestoreDialogOpen(false)}>
        <DialogTitle>Restaurar Sistema</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <Alert severity="warning">
              Esta acción reemplazará todos los datos actuales del sistema con los del respaldo seleccionado.
              Esta operación no se puede deshacer.
            </Alert>
            {selectedBackup && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Archivo a restaurar:
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedBackup.filename}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dayjs(selectedBackup.createdAt).format('DD/MM/YYYY HH:mm')}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleRestore} variant="contained" color="warning">
            Restaurar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar Respaldo</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Estás seguro de eliminar este respaldo? Esta acción no se puede deshacer.
          </Typography>
          {selectedBackup && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Archivo:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {selectedBackup.filename}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
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

export default BackupPage;
