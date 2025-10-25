import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
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
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { clientService } from '../../services/mockApi';
import type { Client } from '../../types';

export const ClientListPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      const data = await clientService.getClients();
      setClients(data);
      setIsLoading(false);
    };

    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => client.name.toLowerCase().includes(search.toLowerCase()));
  }, [clients, search]);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Clientes"
        subtitle="Segmentá, analizá y seguí la relación con tus clientes"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<AssessmentIcon />}>
              Ver reportes
            </Button>
            <Button variant="contained" startIcon={<PersonAddAltIcon />}>
              Nuevo cliente
            </Button>
          </Stack>
        }
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nombre o empresa"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {isLoading ? <LinearProgress /> : null}
                <List>
                  {filteredClients.map((client) => (
                    <ListItem key={client.id} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                          {client.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={client.name}
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              {client.company ?? 'Sin empresa registrada'} · {client.email}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {client.phone ?? 'Sin teléfono'}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Stack spacing={1} alignItems="flex-end">
                        <Chip label={`${client.activeInvoices} facturas activas`} variant="outlined" />
                        <Typography variant="subtitle2" fontWeight={600}>
                          Saldo ${client.totalBalance.toLocaleString('es-AR')}
                        </Typography>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <SectionHeader title="Acciones rápidas" subtitle="Optimizar la relación con tus clientes" />
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                <Button variant="contained" color="secondary">
                  Generar campaña de emails
                </Button>
                <Button variant="outlined" startIcon={<LocalPhoneIcon />}>
                  Programar llamadas
                </Button>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Consejo: segmentá clientes con saldo vencido y enviá recordatorios automáticos.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
