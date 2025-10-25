import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import InsightsIcon from '@mui/icons-material/Insights';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { reportService } from '../../services/mockApi';
import type { ReportSummary } from '../../types';

const iconMap = [InsightsIcon, QueryStatsIcon, TrendingUpIcon];

export const ReportsPage = () => {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      const data = await reportService.getReports();
      setReports(data);
      setIsLoading(false);
    };

    loadReports();
  }, []);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Reportes y análisis"
        subtitle="Indicadores clave para entender tu negocio"
        action={
          <Button variant="contained" startIcon={<DownloadDoneIcon />}>
            Descargar todo
          </Button>
        }
      />
      <Grid container spacing={3}>
        {reports.map((report, index) => {
          const Icon = iconMap[index % iconMap.length];
          return (
            <Grid item xs={12} md={4} key={report.id}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Box display="flex" gap={1} alignItems="center">
                      <Chip icon={<Icon />} label={report.tags[0]} color="primary" variant="outlined" />
                      {report.tags.slice(1).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Stack spacing={1}>
                      <Typography variant="h6" fontWeight={700}>
                        {report.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {report.description}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        Actualizado {dayjs(report.lastUpdated).format('DD MMM YYYY HH:mm')}
                      </Typography>
                    </Stack>
                    <Button variant="text">Ver detalles</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {isLoading ? <LinearProgress /> : null}
    </Stack>
  );
};
