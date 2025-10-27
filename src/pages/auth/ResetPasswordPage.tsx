import LoadingButton from '@mui/lab/LoadingButton';
import { Link, Stack, TextField } from '@mui/material';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';

const initialValues = {
  password: '',
  confirmPassword: '',
};

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string } | undefined)?.email ?? '';
  const [values, setValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/login');
    }, 700);
  };

  return (
    <AuthLayout
      title="Restablecer contraseña"
      subtitle={emailFromState ? `Restableciendo acceso para ${emailFromState}` : 'Definí una nueva contraseña segura'}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Nueva contraseña"
            type="password"
            value={values.password}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setValues((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <TextField
            label="Confirmar contraseña"
            type="password"
            value={values.confirmPassword}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setValues((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            required
          />
          <LoadingButton type="submit" variant="contained" loading={isLoading} size="large">
            Guardar contraseña
          </LoadingButton>
          <Link component="button" onClick={() => navigate('/auth/login')} variant="body2">
            Ir al inicio de sesión
          </Link>
        </Stack>
      </form>
    </AuthLayout>
  );
};
