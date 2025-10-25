import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RemoveIcon from '@mui/icons-material/Remove';
import { WidgetStat } from '../../types';

type StatCardProps = {
  stat: WidgetStat;
};

export const StatCard = ({ stat }: StatCardProps) => {
  const trendIcon =
    stat.trend && stat.trend !== 0
      ? stat.trend > 0
        ? TrendingUpIcon
        : TrendingDownIcon
      : RemoveIcon;

  const TrendIcon = trendIcon;
  const trendColor = stat.trend && stat.trend < 0 ? 'error' : 'success';

  return (
    <Card sx={{ minHeight: 156, background: 'linear-gradient(135deg, #ffffff 0%, #f7f9ff 100%)' }}>
      <CardContent>
        <Stack spacing={2} alignItems="flex-start">
          <Chip
            label={stat.title}
            color="primary"
            size="small"
            sx={{
              background: 'rgba(44, 62, 155, 0.08)',
              color: 'primary.main',
              fontWeight: 600,
            }}
          />
          <Typography variant="h4" fontWeight={700}>
            {stat.value}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
            <Box
              component={TrendIcon}
              fontSize={20}
              color={stat.trend ? trendColor : 'action.disabled'}
            />
            {stat.trend !== undefined ? (
              <Typography variant="body2" fontWeight={600} color={`${trendColor}.main`}>
                {stat.trend > 0 ? '+' : ''}
                {stat.trend}%
              </Typography>
            ) : null}
            {stat.helperText ? (
              <Typography variant="body2" color="text.secondary">
                {stat.helperText}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
