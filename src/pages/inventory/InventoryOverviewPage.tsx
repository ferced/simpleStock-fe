import DirectionsIcon from '@mui/icons-material/Directions';
import DownloadIcon from '@mui/icons-material/Download';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { inventoryService } from '../../services/mockApi';
import type { InventorySnapshot, StockMovement } from '../../types';

export const InventoryOverviewPage = () => {
  const [snapshots, setSnapshots] = useState<InventorySnapshot[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
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
      <Box>
        <Grid container spacing={3}>
          {snapshots.map((snapshot) => (
          <Grid item xs={12} md={6} key={snapshot.id}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {snapshot.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Última actualización {dayjs(snapshot.updatedAt).format('DD MMM HH:mm')}
                      </Typography>
                    </Stack>
                    <Chip label={`$${snapshot.totalValue.toLocaleString('es-AR')}`} color="primary" />
                  </Stack>
                  <Divider />
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                      <Inventory2Icon />
                    </Avatar>
                    <Stack spacing={0.5}>
                      <Typography variant="h4" fontWeight={700}>
                        {snapshot.totalItems}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unidades disponibles
                      </Typography>
                    </Stack>
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
          <SectionHeader title="Movimientos recientes" subtitle="Últimas entradas, salidas y transferencias" />
          {isLoading ? <LinearProgress /> : null}
          <List sx={{ maxHeight: 360, overflow: 'auto' }}>
            {movements.map((movement) => (
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
