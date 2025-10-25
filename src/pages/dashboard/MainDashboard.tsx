import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Avatar,
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
import { StatCard } from '../../components/common/StatCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import { dashboardService } from '../../services/mockApi';
import type { StockAlert, StockMovement, WidgetStat } from '../../types';

export const MainDashboard = () => {
  const [stats, setStats] = useState<WidgetStat[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [statsData, alertsData, movementsData] = await Promise.all([
        dashboardService.getWidgets(),
        dashboardService.getStockAlerts(),
        dashboardService.getStockMovements(),
      ]);
      setStats(statsData);
      setAlerts(alertsData);
      setMovements(movementsData);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <Stack spacing={4}>
      <SectionHeader title="Dashboard" subtitle="Visión general de tu operación" />
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.id}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <SectionHeader title="Alertas de stock" subtitle="Productos por debajo del mínimo" />
              {isLoading ? <LinearProgress /> : null}
              <List>
                {alerts.map((alert) => (
                  <ListItem key={alert.productId} sx={{ borderRadius: 2, mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                        <TrendingFlatIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={alert.productName}
                      secondary={`Stock actual ${alert.currentStock} / Mínimo ${alert.minimumStock}`}
                    />
                    <Chip label="Revisar" color="warning" variant="outlined" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <SectionHeader title="Movimientos recientes" subtitle="Entradas, salidas y transferencias" />
              {isLoading ? <LinearProgress /> : null}
              <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                {movements.map((movement) => (
                  <ListItem key={movement.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: movement.type === 'in' ? 'success.light' : 'secondary.light' }}>
                        <TrendingUpIcon fontSize="small" />
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
                            {dayjs(movement.createdAt).format('DD MMM HH:mm')} · {movement.destination ?? movement.source}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <SectionHeader
              title="Prioridades del día"
              subtitle="Accesos rápidos a tareas críticas"
              action={<Chip label="Automatizá recordatorios" color="secondary" />}
            />
            <Divider />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Facturas pendientes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tenés 3 facturas por enviar. Revisá borradores antes de las 17:00 hs.
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Reposición sugerida
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enviá orden a Blue Hardware por monitores IPS y teclados mecánicos.
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Conteo cíclico
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Programá un conteo rápido en Sucursal Norte para mobiliario.
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
