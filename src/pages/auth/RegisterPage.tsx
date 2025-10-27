import LoadingButton from '@mui/lab/LoadingButton';
import { Link, Stack, TextField } from '@mui/material';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import type { RegisterFormValues } from '../../types';

const initialValues: RegisterFormValues = {
  email: '',
  password: '',
  fullName: '',
  company: '',
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof RegisterFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/login');
    }, 750);
  };

  return (
    <AuthLayout title="Creá tu cuenta" subtitle="Organizá tu inventario en minutos">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField label="Nombre completo" value={values.fullName} onChange={handleChange('fullName')} required />
          <TextField label="Empresa" value={values.company} onChange={handleChange('company')} />
          <TextField label="Correo electrónico" type="email" value={values.email} onChange={handleChange('email')} required />
          <TextField label="Contraseña" type="password" value={values.password} onChange={handleChange('password')} required />
          <LoadingButton type="submit" variant="contained" loading={isLoading} size="large">
            Crear cuenta
          </LoadingButton>
          <Link component="button" onClick={() => navigate('/auth/login')} variant="body2">
            ¿Ya tenés cuenta? Ingresá
          </Link>
        </Stack>
      </form>
    </AuthLayout>
  );
};
