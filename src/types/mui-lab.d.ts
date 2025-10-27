declare module '@mui/lab/LoadingButton' {
  import { ButtonProps } from '@mui/material/Button';

  export interface LoadingButtonProps extends ButtonProps {
    loading?: boolean;
    loadingIndicator?: React.ReactNode;
    loadingPosition?: 'start' | 'end' | 'center';
  }

  const LoadingButton: React.FC<LoadingButtonProps>;
  export default LoadingButton;
}
