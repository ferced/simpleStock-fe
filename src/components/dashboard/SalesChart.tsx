import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { SectionHeader } from '../common/SectionHeader';

interface SalesData {
  month: string;
  sales: number;
  maxSales: number;
}

const salesData: SalesData[] = [
  { month: 'Ene', sales: 245000, maxSales: 350000 },
  { month: 'Feb', sales: 198000, maxSales: 350000 },
  { month: 'Mar', sales: 287000, maxSales: 350000 },
  { month: 'Abr', sales: 312000, maxSales: 350000 },
  { month: 'May', sales: 268000, maxSales: 350000 },
  { month: 'Jun', sales: 345000, maxSales: 350000 },
  { month: 'Jul', sales: 298000, maxSales: 350000 },
  { month: 'Ago', sales: 276000, maxSales: 350000 },
  { month: 'Sep', sales: 321000, maxSales: 350000 },
  { month: 'Oct', sales: 289000, maxSales: 350000 },
  { month: 'Nov', sales: 334000, maxSales: 350000 },
  { month: 'Dic', sales: 298000, maxSales: 350000 },
];

export const SalesChart = () => {
  const totalSales = salesData.reduce((sum, data) => sum + data.sales, 0);
  const avgSales = totalSales / salesData.length;

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <SectionHeader
            title="Ventas del Año"
            subtitle="Evolución mensual de ingresos"
            action={
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`Promedio: $${Math.round(avgSales).toLocaleString('es-AR')}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip label={`Total: $${totalSales.toLocaleString('es-AR')}`} color="primary" />
              </Stack>
            }
          />

          <Grid container spacing={2} alignItems="flex-end" sx={{ height: 300 }}>
            {salesData.map((data, index) => {
              const heightPercentage = (data.sales / data.maxSales) * 100;
              const isHighlight = data.sales >= avgSales;
              const isCurrentMonth = index === new Date().getMonth();

              return (
                <Grid item xs={1} key={data.month}>
                  <Stack spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: '100%',
                        height: `${heightPercentage * 2.5}px`,
                        bgcolor: isCurrentMonth
                          ? 'primary.main'
                          : isHighlight
                          ? 'success.light'
                          : 'secondary.light',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                          opacity: 0.8,
                          transform: 'scaleY(1.05)',
                        },
                      }}
                      title={`${data.month}: $${data.sales.toLocaleString('es-AR')}`}
                    >
                      {isCurrentMonth && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -24,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bgcolor: 'primary.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Actual
                        </Box>
                      )}
                    </Box>
                    <Typography variant="caption" fontWeight={isCurrentMonth ? 700 : 500}>
                      {data.month}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.65rem',
                        display: { xs: 'none', md: 'block' },
                      }}
                    >
                      ${(data.sales / 1000).toFixed(0)}k
                    </Typography>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: 'primary.main',
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="caption">Mes actual</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: 'success.light',
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="caption">Sobre promedio</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: 'secondary.light',
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="caption">Bajo promedio</Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
