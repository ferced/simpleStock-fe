declare module '@mui/lab' {
  import { ButtonProps } from '@mui/material/Button';
  import { ComponentType } from 'react';

  export interface LoadingButtonProps extends ButtonProps {
    loading?: boolean;
    loadingIndicator?: React.ReactNode;
    loadingPosition?: 'start' | 'end' | 'center';
  }

  export const LoadingButton: ComponentType<LoadingButtonProps>;
}
