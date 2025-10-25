import { Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} spacing={2}>
    <Stack spacing={0.5}>
      <Typography variant="h5" fontWeight={700} color="text.primary">
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
    {action ?? null}
  </Stack>
);
