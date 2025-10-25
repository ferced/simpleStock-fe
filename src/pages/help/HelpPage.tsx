import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SchoolIcon from '@mui/icons-material/School';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  type ChipProps,
} from '@mui/material';
import { useEffect, useState, type ElementType } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { helpCenterService } from '../../services/mockApi';
import type { HelpResource } from '../../types';

const iconByType: Record<HelpResource['type'], ElementType> = {
  article: SchoolIcon,
  video: OndemandVideoIcon,
  faq: HelpOutlineIcon,
  support: SupportAgentIcon,
};

const accentByType: Record<HelpResource['type'], ChipProps['color']> = {
  article: 'primary',
  video: 'secondary',
  faq: 'default',
  support: 'success',
};

export const HelpPage = () => {
  const [resources, setResources] = useState<HelpResource[]>([]);

  useEffect(() => {
    const loadHelp = async () => {
      const data = await helpCenterService.getResources();
      setResources(data);
    };

    loadHelp();
  }, []);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Ayuda y soporte"
        subtitle="Recursos curados para sacar el máximo provecho del sistema"
        action={<Chip label="Centro de ayuda 24/7" color="secondary" />}
      />
      <Grid container spacing={3}>
        {resources.map((resource) => {
          const Icon = iconByType[resource.type];
          const color = accentByType[resource.type];
          return (
            <Grid item xs={12} md={6} key={resource.id}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Chip icon={<Icon />} label={resource.type.toUpperCase()} color={color} variant="outlined" />
                      <Typography variant="h6" fontWeight={700}>
                        {resource.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {resource.description}
                    </Typography>
                    <Chip label={resource.actionLabel ?? 'Ver más'} color={color} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Card>
        <CardContent>
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between">
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={700}>
                ¿Necesitás hablar con alguien?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nuestro equipo responde consultas funcionales y técnicas en menos de 24 hs.
              </Typography>
            </Stack>
            <Chip icon={<ChatBubbleOutlineIcon />} label="Iniciar chat en vivo" color="primary" />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
