import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import BugReportIcon from '@mui/icons-material/BugReport';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';

const supportTypes = [
  { value: 'technical', label: 'Soporte Técnico' },
  { value: 'billing', label: 'Facturación' },
  { value: 'feature', label: 'Solicitud de Funcionalidad' },
  { value: 'bug', label: 'Reporte de Error' },
  { value: 'other', label: 'Otro' },
];

export const ContactSupportPage = () => {
  const [formData, setFormData] = useState({
    type: 'technical',
    subject: '',
    message: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Support form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Contactar Soporte"
        subtitle="Estamos aquí para ayudarte"
        action={<Chip label="Respuesta en 24hs" color="success" />}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(44,62,155,0.12) 0%, rgba(18,163,184,0.12) 100%)',
                  }}
                >
                  <EmailIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Email
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  soporte@sumagestion.com
                </Typography>
                <Chip label="Respuesta: 24-48hs" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(44,62,155,0.12) 0%, rgba(18,163,184,0.12) 100%)',
                  }}
                >
                  <ChatIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Chat en Vivo
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Lun-Vie 9:00 - 18:00
                </Typography>
                <Chip label="Respuesta inmediata" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(44,62,155,0.12) 0%, rgba(18,163,184,0.12) 100%)',
                  }}
                >
                  <PhoneIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" fontWeight={700}>
                  Teléfono
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  +54 11 4567-8900
                </Typography>
                <Chip label="Lun-Vie 9-18hs" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <BugReportIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Formulario de Contacto
              </Typography>
            </Box>

            {submitted && (
              <Alert severity="success">
                ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  select
                  label="Tipo de Consulta"
                  value={formData.type}
                  onChange={handleChange('type')}
                  fullWidth
                  required
                >
                  {supportTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Email de Contacto"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  fullWidth
                  required
                  placeholder="tu@email.com"
                />

                <TextField
                  label="Asunto"
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  fullWidth
                  required
                  placeholder="Describe brevemente tu consulta"
                />

                <TextField
                  label="Mensaje"
                  value={formData.message}
                  onChange={handleChange('message')}
                  fullWidth
                  required
                  multiline
                  rows={6}
                  placeholder="Describe tu consulta en detalle. Incluí cualquier información relevante que nos ayude a asistirte mejor."
                />

                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => setFormData({ type: 'technical', subject: '', message: '', email: '' })}
                  >
                    Limpiar
                  </Button>
                  <Button variant="contained" type="submit">
                    Enviar Mensaje
                  </Button>
                </Box>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              Horarios de Atención
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Soporte por Chat y Teléfono
                </Typography>
                <Typography variant="body1">
                  Lunes a Viernes: 9:00 - 18:00 hs
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Soporte por Email
                </Typography>
                <Typography variant="body1">
                  24/7 - Respuesta en 24-48 horas
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
