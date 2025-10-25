import { LoadingButton } from '@mui/lab';
import { Checkbox, FormControlLabel, Link, Stack, TextField } from '@mui/material';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import type { AuthFormValues } from '../../types';

const initialValues: AuthFormValues = {
  email: '',
  password: '',
  remember: true,
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<AuthFormValues>(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof AuthFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 650);
  };

  return (
    <AuthLayout title="Bienvenido de nuevo" subtitle="Ingresá tus credenciales para continuar">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField label="Correo electrónico" type="email" value={values.email} onChange={handleChange('email')} required />
          <TextField label="Contraseña" type="password" value={values.password} onChange={handleChange('password')} required />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={<Checkbox checked={values.remember} onChange={handleChange('remember')} />}
              label="Recordarme"
            />
            <Link component="button" onClick={() => navigate('/auth/recuperar')} variant="body2">
              ¿Olvidaste tu contraseña?
            </Link>
          </Stack>
          <LoadingButton type="submit" variant="contained" loading={isLoading} size="large">
            Ingresar
          </LoadingButton>
          <Link component="button" onClick={() => navigate('/auth/registro')} variant="body2">
            Crear una cuenta
          </Link>
        </Stack>
      </form>
    </AuthLayout>
  );
};
