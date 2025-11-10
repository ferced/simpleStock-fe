import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Fernando Cedrola',
    email: 'fernando@simplestock.com',
    role: 'admin',
    status: 'active',
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'u2',
    name: 'María González',
    email: 'maria@simplestock.com',
    role: 'manager',
    status: 'active',
    lastLogin: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'u3',
    name: 'Juan Pérez',
    email: 'juan@simplestock.com',
    role: 'employee',
    status: 'active',
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'u4',
    name: 'Ana Martínez',
    email: 'ana@simplestock.com',
    role: 'employee',
    status: 'inactive',
    lastLogin: new Date(Date.now() - 10 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  employee: 'Empleado',
};

const roleColors: Record<string, 'error' | 'warning' | 'default'> = {
  admin: 'error',
  manager: 'warning',
  employee: 'default',
};

export const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      // TODO: await apiClient.get('/users')
      await new Promise(r => setTimeout(r, 500));
      setUsers(mockUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const s = search.toLowerCase();
    return users.filter(
      u =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        roleLabels[u.role].toLowerCase().includes(s)
    );
  }, [users, search]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const managerCount = users.filter(u => u.role === 'manager').length;
    const employeeCount = users.filter(u => u.role === 'employee').length;
    return { totalUsers, activeUsers, adminCount, managerCount, employeeCount };
  }, [users]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    if (selectedUser) {
      navigate(`/administracion/usuarios/${selectedUser.id}/editar`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      // TODO: await apiClient.delete(`/users/${selectedUser.id}`)
      await new Promise(r => setTimeout(r, 500));
      setUsers(users.filter(u => u.id !== selectedUser.id));
    }
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = async (user: User) => {
    // TODO: await apiClient.patch(`/users/${user.id}`, { status: user.status === 'active' ? 'inactive' : 'active' })
    await new Promise(r => setTimeout(r, 500));
    setUsers(users.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } as User : u));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Gestión de Usuarios"
        subtitle="Administrá los usuarios y permisos del sistema"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/administracion/usuarios/nuevo')}>
            Nuevo Usuario
          </Button>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total de Usuarios
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.totalUsers}
                </Typography>
                <Chip label="Registrados" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Usuarios Activos
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {stats.activeUsers}
                </Typography>
                <Chip label="Habilitados" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Administradores
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {stats.adminCount}
                </Typography>
                <Chip label="Admin" size="small" color="error" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Gerentes
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {stats.managerCount}
                </Typography>
                <Chip label="Managers" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Empleados
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {stats.employeeCount}
                </Typography>
                <Chip label="Staff" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Usuarios */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre, email o rol"
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
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </Typography>

            {isLoading ? (
              <LinearProgress />
            ) : filteredUsers.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <PersonIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {search ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
                </Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Último Acceso</TableCell>
                    <TableCell>Registrado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {getInitials(user.name)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            {user.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={user.role === 'admin' ? <AdminPanelSettingsIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                          label={roleLabels[user.role]}
                          color={roleColors[user.role]}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={user.status === 'active' ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                          label={user.status === 'active' ? 'Activo' : 'Inactivo'}
                          color={user.status === 'active' ? 'success' : 'default'}
                          onClick={() => handleToggleStatus(user)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.lastLogin ? dayjs(user.lastLogin).format('DD/MM/YYYY HH:mm') : 'Nunca'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(user.createdAt).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
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
            Sobre los Roles de Usuario
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <AdminPanelSettingsIcon color="error" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Administrador
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Acceso completo al sistema. Puede gestionar usuarios, configuración, reportes y todas las operaciones.
              </Typography>
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <PersonIcon color="warning" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Gerente
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Puede gestionar productos, inventario, clientes, proveedores y facturación. Sin acceso a configuración del sistema.
              </Typography>
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <PersonIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Empleado
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Acceso limitado a operaciones básicas: consulta de productos, registro de movimientos de stock y facturación.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Menu de Acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Dialog de Confirmación de Eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que querés eliminar al usuario <strong>{selectedUser?.name}</strong>?
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
    </Stack>
  );
};

export default UserManagementPage;
