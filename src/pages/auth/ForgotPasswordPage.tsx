import LoadingButton from '@mui/lab/LoadingButton';
import { Link, Stack, TextField } from '@mui/material';
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import type { ResetPasswordFormValues } from '../../types';

const initialValues: ResetPasswordFormValues = {
  email: '',
};

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/restablecer', { state: { email: values.email } });
    }, 600);
  };

  return (
    <AuthLayout title="Recuperar acceso" subtitle="Te enviaremos un enlace para restablecer tu contraseña">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Correo electrónico"
            type="email"
            value={values.email}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setValues({ email: event.target.value })}
            required
          />
          <LoadingButton type="submit" variant="contained" loading={isLoading} size="large">
            Enviar instrucciones
          </LoadingButton>
          <Link component="button" onClick={() => navigate('/auth/login')} variant="body2">
            Volver al inicio de sesión
          </Link>
        </Stack>
      </form>
    </AuthLayout>
  );
};
