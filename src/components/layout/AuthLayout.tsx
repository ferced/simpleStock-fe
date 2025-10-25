import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'radial-gradient(circle at top, #eef2ff 0%, #f5f7fb 45%, #ffffff 100%)',
      p: 2,
    }}
  >
    <Card sx={{ width: '100%', maxWidth: 420 }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Stack spacing={1} textAlign="center">
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  </Box>
);
