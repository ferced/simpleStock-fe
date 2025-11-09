import DirectionsIcon from '@mui/icons-material/Directions';
import DownloadIcon from '@mui/icons-material/Download';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { inventoryService } from '../../services/mockApi';
import type { InventorySnapshot, StockMovement } from '../../types';

export const InventoryOverviewPage = () => {
  const [snapshots, setSnapshots] = useState<InventorySnapshot[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      setIsLoading(true);
      const [snapshotData, movementData] = await Promise.all([
        inventoryService.getSnapshots(),
        inventoryService.getMovements(),
      ]);
      setSnapshots(snapshotData);
      setMovements(movementData);
      setIsLoading(false);
    };

    loadInventory();
  }, []);

  const filteredMovements = useMemo(() => {
    if (searchTerm === '') return movements;
    return movements.filter((movement) =>
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movements, searchTerm]);

  const inventoryStats = useMemo(() => {
    const totalValue = snapshots.reduce((sum, s) => sum + s.totalValue, 0);
    const totalItems = snapshots.reduce((sum, s) => sum + s.totalItems, 0);
    const totalLocations = snapshots.length;
    return { totalValue, totalItems, totalLocations };
  }, [snapshots]);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Inventario"
        subtitle="Controlá el stock, valorización y movimientos"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              Exportar
            </Button>
            <Button variant="contained" startIcon={<PendingActionsIcon />}>
              Nuevo conteo
            </Button>
          </Stack>
        }
      />

      {/* Estadísticas Generales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Valor Total Inventario
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  ${inventoryStats.totalValue.toLocaleString('es-AR')}
                </Typography>
                <Chip label="Todas las ubicaciones" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Unidades Totales
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {inventoryStats.totalItems}
                </Typography>
                <Chip label="Stock disponible" size="small" color="primary" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Ubicaciones Activas
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {inventoryStats.totalLocations}
                </Typography>
                <Chip label="Depósitos" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Movimientos Hoy
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {movements.filter(m => dayjs(m.createdAt).isSame(dayjs(), 'day')).length}
                </Typography>
                <Chip label="Últimas 24hs" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stock por Ubicación */}
      <Box>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Stock por Ubicación
        </Typography>
        <Grid container spacing={3}>
          {snapshots.map((snapshot, index) => (
          <Grid item xs={12} md={6} lg={4} key={snapshot.id}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontWeight={700}>
                          {snapshot.location}
                        </Typography>
                        {index === 0 && (
                          <Chip icon={<CheckCircleIcon fontSize="small" />} label="Principal" size="small" color="success" />
                        )}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Actualizado {dayjs(snapshot.updatedAt).format('DD MMM HH:mm')}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Unidades
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {snapshot.totalItems}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Valor
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                          ${(snapshot.totalValue / 1000).toFixed(0)}k
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Chip
                      icon={<WarningIcon fontSize="small" />}
                      label={`${Math.floor(Math.random() * 5)} alertas`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                    <Button size="small" variant="text">
                      Ver detalle
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
      </Box>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <SectionHeader title="Movimientos recientes" subtitle="Últimas entradas, salidas y transferencias" />
            <TextField
              placeholder="Buscar por producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            {isLoading ? <LinearProgress /> : null}
            <Typography variant="body2" color="text.secondary">
              Mostrando {filteredMovements.length} de {movements.length} movimientos
            </Typography>
          </Stack>
          <List sx={{ maxHeight: 360, overflow: 'auto' }}>
            {filteredMovements.map((movement) => (
              <ListItem key={movement.id}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: movement.type === 'in' ? 'success.light' : 'warning.light' }}>
                    {movement.type === 'transfer' ? <DirectionsIcon /> : movement.type === 'in' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={movement.productName}
                  secondary={
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {movement.quantity} unidades · {movement.type === 'in' ? 'Entrada' : movement.type === 'out' ? 'Salida' : 'Transferencia'}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {dayjs(movement.createdAt).format('DD MMM HH:mm')} · {movement.source ?? movement.destination}
                      </Typography>
                    </Stack>
                  }
                />
                <Box>
                  <Chip label="Detalle" variant="outlined" />
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
};
