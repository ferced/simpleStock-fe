import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircleIcon from '@mui/icons-material/Circle';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';
import dayjs from 'dayjs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  ip: string;
  timestamp: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  permissions: string[];
  sendWelcomeEmail: boolean;
  forcePasswordChange: boolean;
}

const allPermissions: Permission[] = [
  // Productos
  { id: 'products.view', name: 'Ver productos', description: 'Ver lista y detalle de productos', category: 'Productos' },
  { id: 'products.create', name: 'Crear productos', description: 'Agregar nuevos productos al catálogo', category: 'Productos' },
  { id: 'products.edit', name: 'Editar productos', description: 'Modificar información de productos', category: 'Productos' },
  { id: 'products.delete', name: 'Eliminar productos', description: 'Eliminar productos del sistema', category: 'Productos' },
  { id: 'products.categories', name: 'Gestionar categorías', description: 'Crear, editar y eliminar categorías', category: 'Productos' },

  // Inventario
  { id: 'inventory.view', name: 'Ver inventario', description: 'Ver stock y movimientos', category: 'Inventario' },
  { id: 'inventory.entry', name: 'Registrar entradas', description: 'Agregar stock al inventario', category: 'Inventario' },
  { id: 'inventory.exit', name: 'Registrar salidas', description: 'Retirar stock del inventario', category: 'Inventario' },
  { id: 'inventory.transfer', name: 'Transferencias', description: 'Transferir stock entre depósitos', category: 'Inventario' },
  { id: 'inventory.count', name: 'Conteo de inventario', description: 'Realizar conteos físicos', category: 'Inventario' },

  // Facturación
  { id: 'invoicing.view', name: 'Ver facturas', description: 'Ver lista y detalle de facturas', category: 'Facturación' },
  { id: 'invoicing.create', name: 'Crear facturas', description: 'Generar nuevas facturas', category: 'Facturación' },
  { id: 'invoicing.edit', name: 'Editar facturas', description: 'Modificar facturas en borrador', category: 'Facturación' },
  { id: 'invoicing.delete', name: 'Anular facturas', description: 'Anular facturas emitidas', category: 'Facturación' },
  { id: 'invoicing.payments', name: 'Registrar pagos', description: 'Registrar pagos de clientes', category: 'Facturación' },
  { id: 'invoicing.credit_notes', name: 'Notas de crédito', description: 'Crear y gestionar notas de crédito', category: 'Facturación' },

  // Clientes
  { id: 'clients.view', name: 'Ver clientes', description: 'Ver lista y detalle de clientes', category: 'Clientes' },
  { id: 'clients.create', name: 'Crear clientes', description: 'Agregar nuevos clientes', category: 'Clientes' },
  { id: 'clients.edit', name: 'Editar clientes', description: 'Modificar información de clientes', category: 'Clientes' },
  { id: 'clients.delete', name: 'Eliminar clientes', description: 'Eliminar clientes del sistema', category: 'Clientes' },

  // Proveedores
  { id: 'suppliers.view', name: 'Ver proveedores', description: 'Ver lista y detalle de proveedores', category: 'Proveedores' },
  { id: 'suppliers.create', name: 'Crear proveedores', description: 'Agregar nuevos proveedores', category: 'Proveedores' },
  { id: 'suppliers.edit', name: 'Editar proveedores', description: 'Modificar información de proveedores', category: 'Proveedores' },
  { id: 'suppliers.orders', name: 'Órdenes de compra', description: 'Gestionar órdenes de compra', category: 'Proveedores' },

  // Reportes
  { id: 'reports.sales', name: 'Reportes de ventas', description: 'Acceder a reportes de ventas', category: 'Reportes' },
  { id: 'reports.inventory', name: 'Reportes de inventario', description: 'Acceder a reportes de inventario', category: 'Reportes' },
  { id: 'reports.financial', name: 'Reportes financieros', description: 'Acceder a reportes financieros', category: 'Reportes' },
  { id: 'reports.analytics', name: 'Dashboard analítico', description: 'Ver dashboard con métricas avanzadas', category: 'Reportes' },

  // Administración
  { id: 'admin.users', name: 'Gestionar usuarios', description: 'Crear, editar y eliminar usuarios', category: 'Administración' },
  { id: 'admin.roles', name: 'Gestionar roles', description: 'Configurar roles y permisos', category: 'Administración' },
  { id: 'admin.settings', name: 'Configuración', description: 'Modificar configuración del sistema', category: 'Administración' },
  { id: 'admin.backup', name: 'Respaldos', description: 'Crear y restaurar respaldos', category: 'Administración' },
  { id: 'admin.audit', name: 'Log de auditoría', description: 'Ver registro de actividades', category: 'Administración' },
];

const rolePermissions: Record<string, string[]> = {
  admin: allPermissions.map(p => p.id),
  manager: allPermissions.filter(p => !p.category.includes('Administración')).map(p => p.id),
  employee: [
    'products.view',
    'inventory.view', 'inventory.entry', 'inventory.exit',
    'invoicing.view', 'invoicing.create', 'invoicing.payments',
    'clients.view',
    'suppliers.view',
  ],
};

const mockActivityLog: ActivityLog[] = [
  { id: '1', action: 'Inicio de sesión', details: 'Login exitoso', ip: '192.168.1.100', timestamp: dayjs().subtract(1, 'hour').toISOString() },
  { id: '2', action: 'Creó factura', details: 'Factura FAC-025 por $45,000', ip: '192.168.1.100', timestamp: dayjs().subtract(2, 'hour').toISOString() },
  { id: '3', action: 'Editó producto', details: 'Modificó precio de SKU-001', ip: '192.168.1.100', timestamp: dayjs().subtract(3, 'hour').toISOString() },
  { id: '4', action: 'Registró pago', details: 'Pago de $20,000 en FAC-020', ip: '192.168.1.100', timestamp: dayjs().subtract(5, 'hour').toISOString() },
  { id: '5', action: 'Inicio de sesión', details: 'Login exitoso', ip: '192.168.1.105', timestamp: dayjs().subtract(1, 'day').toISOString() },
];

export const CreateEditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  const [form, setForm] = useState<UserForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    status: 'active',
    permissions: rolePermissions['employee'],
    sendWelcomeEmail: true,
    forcePasswordChange: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      // Simular carga de usuario existente
      setTimeout(() => {
        setForm({
          name: 'Juan Pérez',
          email: 'juan@simplestock.com',
          password: '',
          confirmPassword: '',
          role: 'employee',
          status: 'active',
          permissions: rolePermissions['employee'],
          sendWelcomeEmail: false,
          forcePasswordChange: false,
        });
        setActivityLog(mockActivityLog);
        setIsLoading(false);
      }, 500);
    }
  }, [isEditing]);

  const handleRoleChange = (role: 'admin' | 'manager' | 'employee') => {
    setForm(prev => ({
      ...prev,
      role,
      permissions: rolePermissions[role],
    }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId),
    }));
  };

  const handleCategoryToggle = (category: string) => {
    const categoryPermissions = allPermissions.filter(p => p.category === category).map(p => p.id);
    const allSelected = categoryPermissions.every(p => form.permissions.includes(p));

    if (allSelected) {
      setForm(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => !categoryPermissions.includes(p)),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...categoryPermissions])],
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!form.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!isEditing && !form.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (form.password && form.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (form.password && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (form.permissions.length === 0) {
      newErrors.permissions = 'Debe seleccionar al menos un permiso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      // TODO: Guardar usuario en el backend
      await new Promise(r => setTimeout(r, 1000));
      navigate('/administracion/usuarios');
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (isLoading) {
    return (
      <Stack spacing={4}>
        <SectionHeader title="Cargando usuario..." subtitle="Por favor esperá" />
        <LinearProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <SectionHeader
        title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
        subtitle={isEditing ? `Modificando usuario ${form.name}` : 'Creá un nuevo usuario del sistema'}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/administracion/usuarios')}
            >
              Volver
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </Stack>
        }
      />

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab icon={<PersonIcon />} label="Información" iconPosition="start" />
            <Tab icon={<SecurityIcon />} label="Permisos" iconPosition="start" />
            {isEditing && <Tab icon={<HistoryIcon />} label="Actividad" iconPosition="start" />}
          </Tabs>
        </Box>

        <CardContent>
          {/* Tab: Información */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Stack spacing={3} alignItems="center">
                  <Avatar
                    sx={{ width: 120, height: 120, fontSize: 48, bgcolor: 'primary.main' }}
                  >
                    {form.name ? getInitials(form.name) : <PersonIcon sx={{ fontSize: 48 }} />}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    El avatar se genera automáticamente a partir de las iniciales del nombre
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight={600}>
                    Datos Personales
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre completo"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                        error={Boolean(errors.password)}
                        helperText={errors.password || (isEditing ? 'Dejá vacío para mantener la actual' : '')}
                        required={!isEditing}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Confirmar contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                        required={!isEditing || Boolean(form.password)}
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  <Typography variant="h6" fontWeight={600}>
                    Rol y Estado
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        label="Rol"
                        value={form.role}
                        onChange={(e) => handleRoleChange(e.target.value as 'admin' | 'manager' | 'employee')}
                      >
                        <MenuItem value="admin">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label="Admin" size="small" color="error" />
                            <Typography>Administrador</Typography>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="manager">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label="Manager" size="small" color="warning" />
                            <Typography>Gerente</Typography>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="employee">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label="Staff" size="small" color="primary" />
                            <Typography>Empleado</Typography>
                          </Stack>
                        </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        select
                        fullWidth
                        label="Estado"
                        value={form.status}
                        onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      >
                        <MenuItem value="active">Activo</MenuItem>
                        <MenuItem value="inactive">Inactivo</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  <Divider />

                  <Typography variant="h6" fontWeight={600}>
                    Opciones Adicionales
                  </Typography>

                  <FormGroup>
                    {!isEditing && (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.sendWelcomeEmail}
                            onChange={(e) => setForm(prev => ({ ...prev, sendWelcomeEmail: e.target.checked }))}
                          />
                        }
                        label="Enviar email de bienvenida con credenciales"
                      />
                    )}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.forcePasswordChange}
                          onChange={(e) => setForm(prev => ({ ...prev, forcePasswordChange: e.target.checked }))}
                        />
                      }
                      label="Forzar cambio de contraseña en el próximo inicio de sesión"
                    />
                  </FormGroup>
                </Stack>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab: Permisos */}
          <TabPanel value={tabValue} index={1}>
            <Stack spacing={3}>
              <Alert severity="info">
                Los permisos predeterminados se asignan según el rol seleccionado. Podés personalizarlos según las necesidades del usuario.
              </Alert>

              {errors.permissions && (
                <Alert severity="error">{errors.permissions}</Alert>
              )}

              <Typography variant="body2" color="text.secondary">
                Permisos seleccionados: {form.permissions.length} de {allPermissions.length}
              </Typography>

              <Grid container spacing={3}>
                {Object.entries(groupedPermissions).map(([category, permissions]) => {
                  const categorySelected = permissions.filter(p => form.permissions.includes(p.id)).length;
                  const allSelected = categorySelected === permissions.length;
                  const someSelected = categorySelected > 0 && categorySelected < permissions.length;

                  return (
                    <Grid item xs={12} md={6} key={category}>
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={2}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle1" fontWeight={600}>
                                {category}
                              </Typography>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onChange={() => handleCategoryToggle(category)}
                                  />
                                }
                                label={
                                  <Typography variant="caption">
                                    {categorySelected}/{permissions.length}
                                  </Typography>
                                }
                              />
                            </Box>
                            <Divider />
                            <FormGroup>
                              {permissions.map((permission) => (
                                <FormControlLabel
                                  key={permission.id}
                                  control={
                                    <Checkbox
                                      checked={form.permissions.includes(permission.id)}
                                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                      size="small"
                                    />
                                  }
                                  label={
                                    <Stack>
                                      <Typography variant="body2">{permission.name}</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {permission.description}
                                      </Typography>
                                    </Stack>
                                  }
                                />
                              ))}
                            </FormGroup>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          </TabPanel>

          {/* Tab: Actividad (solo en edición) */}
          {isEditing && (
            <TabPanel value={tabValue} index={2}>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>
                  Últimas Actividades
                </Typography>

                {activityLog.length === 0 ? (
                  <Alert severity="info">No hay actividad registrada para este usuario</Alert>
                ) : (
                  <Stack spacing={0}>
                    {activityLog.map((log, index) => (
                      <Box key={log.id} display="flex" gap={2}>
                        <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: 24 }}>
                          <CircleIcon sx={{ fontSize: 12, color: 'primary.main', zIndex: 1 }} />
                          {index < activityLog.length - 1 && (
                            <Box sx={{ width: 2, flexGrow: 1, bgcolor: 'divider', minHeight: 50 }} />
                          )}
                        </Box>

                        <Box pb={2} flexGrow={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                            <Typography variant="subtitle2" fontWeight={600}>
                              {log.action}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dayjs(log.timestamp).format('DD/MM/YYYY HH:mm')}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {log.details}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            IP: {log.ip}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}

                <Button variant="outlined" onClick={() => navigate('/administracion/auditoria')}>
                  Ver Log Completo de Auditoría
                </Button>
              </Stack>
            </TabPanel>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CreateEditUserPage;
