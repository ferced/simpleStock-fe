import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
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

interface Role {
  id: string;
  name: string;
  permissionIds: string[];
  usersCount: number;
}

interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

interface RoleFormData {
  name: string;
  permissionIds: string[];
}

type FormErrors = Partial<Record<keyof RoleFormData, string>>;

const resources = [
  { name: 'Productos', key: 'products', actions: ['create', 'read', 'update', 'delete'] as const },
  { name: 'Inventario', key: 'inventory', actions: ['create', 'read', 'update', 'delete'] as const },
  { name: 'Facturas', key: 'invoices', actions: ['create', 'read', 'update', 'delete'] as const },
  { name: 'Clientes', key: 'clients', actions: ['create', 'read', 'update', 'delete'] as const },
  { name: 'Proveedores', key: 'suppliers', actions: ['create', 'read', 'update', 'delete'] as const },
  { name: 'Reportes', key: 'reports', actions: ['read'] as const },
  { name: 'Administración', key: 'admin', actions: ['read', 'update'] as const },
];

const actionLabels: Record<string, string> = {
  create: 'Crear',
  read: 'Leer',
  update: 'Actualizar',
  delete: 'Eliminar',
};

// Generate all permissions
const allPermissions: Permission[] = resources.flatMap(resource =>
  resource.actions.map(action => ({
    id: `${resource.key}:${action}`,
    resource: resource.key,
    action: action as 'create' | 'read' | 'update' | 'delete',
  }))
);

// Mock data
const mockRoles: Role[] = [
  {
    id: 'r1',
    name: 'Administrador',
    permissionIds: allPermissions.map(p => p.id),
    usersCount: 2,
  },
  {
    id: 'r2',
    name: 'Vendedor',
    permissionIds: [
      'products:read',
      'inventory:read',
      'invoices:create',
      'invoices:read',
      'invoices:update',
      'clients:create',
      'clients:read',
      'clients:update',
      'reports:read',
    ],
    usersCount: 5,
  },
  {
    id: 'r3',
    name: 'Contador',
    permissionIds: [
      'invoices:read',
      'clients:read',
      'reports:read',
      'admin:read',
    ],
    usersCount: 1,
  },
  {
    id: 'r4',
    name: 'Gerente de Inventario',
    permissionIds: [
      'products:create',
      'products:read',
      'products:update',
      'inventory:create',
      'inventory:read',
      'inventory:update',
      'inventory:delete',
      'suppliers:create',
      'suppliers:read',
      'suppliers:update',
      'reports:read',
    ],
    usersCount: 3,
  },
];

export const RolesPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState<RoleFormData>({
    name: '',
    permissionIds: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      setIsLoading(true);
      // TODO: await apiClient.get('/roles')
      await new Promise(r => setTimeout(r, 500));
      setRoles(mockRoles);
      setIsLoading(false);
    };

    loadRoles();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, role: Role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setForm({ name: '', permissionIds: [] });
    setErrors({});
    setDialogOpen(true);
  };

  const handleEdit = () => {
    if (selectedRole) {
      setForm({
        name: selectedRole.name,
        permissionIds: selectedRole.permissionIds,
      });
      setErrors({});
      setDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    handleMenuClose();
    if (selectedRole && selectedRole.usersCount > 0) {
      alert(`No se puede eliminar el rol "${selectedRole.name}" porque tiene ${selectedRole.usersCount} usuario(s) asignado(s)`);
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRole) {
      // TODO: await apiClient.delete(`/roles/${selectedRole.id}`)
      await new Promise(r => setTimeout(r, 500));
      setRoles(roles.filter(r => r.id !== selectedRole.id));
      setSuccessMessage(`✓ Rol "${selectedRole.name}" eliminado`);
      setSuccessOpen(true);
    }
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  const validate = (data: RoleFormData): FormErrors => {
    const next: FormErrors = {};
    if (!data.name?.trim()) next.name = 'Nombre requerido';
    if (data.permissionIds.length === 0) next.permissionIds = 'Seleccioná al menos un permiso';
    return next;
  };

  const handleSubmit = async () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (selectedRole) {
        // TODO: await apiClient.put(`/roles/${selectedRole.id}`, form)
        await new Promise(r => setTimeout(r, 750));
        setRoles(roles.map(r =>
          r.id === selectedRole.id ? { ...r, ...form } : r
        ));
        setSuccessMessage(`✓ Rol "${form.name}" actualizado`);
      } else {
        // TODO: await apiClient.post('/roles', form)
        await new Promise(r => setTimeout(r, 750));
        setRoles([
          ...roles,
          {
            id: `r${roles.length + 1}`,
            name: form.name,
            permissionIds: form.permissionIds,
            usersCount: 0,
          },
        ]);
        setSuccessMessage(`✓ Rol "${form.name}" creado`);
      }
      setSuccessOpen(true);
      setDialogOpen(false);
      setSelectedRole(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setForm({
      ...form,
      permissionIds: checked
        ? [...form.permissionIds, permissionId]
        : form.permissionIds.filter(id => id !== permissionId),
    });
  };

  const handleResourceToggle = (resourceKey: string, checked: boolean) => {
    const resourcePermissions = allPermissions
      .filter(p => p.resource === resourceKey)
      .map(p => p.id);

    if (checked) {
      setForm({
        ...form,
        permissionIds: [...new Set([...form.permissionIds, ...resourcePermissions])],
      });
    } else {
      setForm({
        ...form,
        permissionIds: form.permissionIds.filter(id => !resourcePermissions.includes(id)),
      });
    }
  };

  const isResourceFullySelected = (resourceKey: string) => {
    const resourcePermissions = allPermissions
      .filter(p => p.resource === resourceKey)
      .map(p => p.id);
    return resourcePermissions.every(id => form.permissionIds.includes(id));
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Gestión de Roles"
        subtitle="Definí roles y permisos para control de acceso granular"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Nuevo Rol
          </Button>
        }
      />

      {/* Lista de Roles */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Mostrando {roles.length} roles
            </Typography>

            {isLoading ? (
              <LinearProgress />
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre del Rol</TableCell>
                    <TableCell align="right">Permisos</TableCell>
                    <TableCell align="right">Usuarios Asignados</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AdminPanelSettingsIcon color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight={600}>
                            {role.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {role.permissionIds.length} permiso(s)
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">{role.usersCount}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, role)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Información sobre Roles */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Sobre los Roles y Permisos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                ¿Qué es un Rol?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Un rol es un conjunto de permisos que definen qué acciones puede realizar un usuario en el sistema.
                Cada usuario puede tener asignado un rol que determina su nivel de acceso.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Tipos de Permisos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Crear</strong>: Permite crear nuevos registros<br />
                • <strong>Leer</strong>: Permite ver y consultar información<br />
                • <strong>Actualizar</strong>: Permite modificar registros existentes<br />
                • <strong>Eliminar</strong>: Permite eliminar registros
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Recursos Disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Productos, Inventario, Facturas, Clientes, Proveedores, Reportes, y Administración
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Menu de Acciones */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Dialog de Crear/Editar Rol */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRole ? 'Editar Rol' : 'Crear Nuevo Rol'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} pt={2}>
            <TextField
              label="Nombre del Rol"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name || 'Ejemplo: Vendedor, Contador, Auditor'}
              required
            />

            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Permisos
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Seleccioná los permisos que tendrá este rol
              </Typography>
              {errors.permissionIds && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.permissionIds}
                </Alert>
              )}

              <Stack spacing={3}>
                {resources.map((resource) => (
                  <Box key={resource.key}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isResourceFullySelected(resource.key)}
                            indeterminate={
                              form.permissionIds.some(id => id.startsWith(`${resource.key}:`)) &&
                              !isResourceFullySelected(resource.key)
                            }
                            onChange={(e) => handleResourceToggle(resource.key, e.target.checked)}
                          />
                        }
                        label={
                          <Typography variant="body1" fontWeight={600}>
                            {resource.name}
                          </Typography>
                        }
                      />
                    </Stack>
                    <FormGroup row sx={{ pl: 4 }}>
                      {resource.actions.map((action) => {
                        const permissionId = `${resource.key}:${action}`;
                        return (
                          <FormControlLabel
                            key={permissionId}
                            control={
                              <Checkbox
                                checked={form.permissionIds.includes(permissionId)}
                                onChange={(e) => handlePermissionChange(permissionId, e.target.checked)}
                                size="small"
                              />
                            }
                            label={actionLabels[action]}
                          />
                        );
                      })}
                    </FormGroup>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : selectedRole ? 'Actualizar' : 'Crear Rol'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmación de Eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar Rol</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que querés eliminar el rol <strong>{selectedRole?.name}</strong>?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default RolesPage;
