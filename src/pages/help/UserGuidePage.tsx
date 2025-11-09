import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface GuideSection {
  id: string;
  title: string;
  content: string;
  steps?: string[];
}

const guideSections: GuideSection[] = [
  {
    id: '1',
    title: 'Primeros Pasos con Suma Gestión',
    content: 'Bienvenido a Suma Gestión. Esta guía te ayudará a configurar tu sistema y comenzar a gestionar tu negocio de forma eficiente.',
    steps: [
      'Completá la información de tu empresa en Configuración',
      'Agregá tus primeros productos en la sección Productos',
      'Registrá tus clientes principales',
      'Configurá tus proveedores',
      'Emití tu primera factura',
    ],
  },
  {
    id: '2',
    title: 'Gestión de Productos',
    content: 'Los productos son el núcleo de tu inventario. Aprendé a gestionarlos correctamente para mantener tu stock actualizado.',
    steps: [
      'Navegá a la sección "Productos"',
      'Hacé clic en "Nuevo Producto"',
      'Completá el nombre, SKU (se genera automáticamente si lo dejás vacío)',
      'Ingresá precio de costo y precio de venta',
      'Definí el stock inicial y stock mínimo',
      'Asigná una categoría (opcional)',
      'Guardá el producto',
    ],
  },
  {
    id: '3',
    title: 'Control de Inventario',
    content: 'Mantené tu inventario bajo control con alertas de stock mínimo y seguimiento de movimientos.',
    steps: [
      'Accedé a "Inventario" para ver el estado general',
      'Configurá stock mínimo para cada producto',
      'El sistema te alertará cuando el stock esté bajo',
      'Registrá entradas cuando recibas mercadería',
      'Registrá salidas cuando vendas o trasfieras productos',
      'Consultá el historial de movimientos',
    ],
  },
  {
    id: '4',
    title: 'Facturación y Ventas',
    content: 'Emití facturas profesionales con cálculos automáticos de impuestos y totales.',
    steps: [
      'Ingresá a "Facturación" y hacé clic en "Nueva Factura"',
      'Seleccioná el cliente',
      'Agregá productos a la factura',
      'El sistema calculará automáticamente subtotales, IVA y total',
      'Definí las condiciones de pago',
      'Generá e imprimí la factura',
      'Enviá por email al cliente (opcional)',
    ],
  },
  {
    id: '5',
    title: 'Gestión de Clientes',
    content: 'Mantené toda la información de tus clientes organizada y accesible.',
    steps: [
      'Navegá a "Clientes"',
      'Registrá nuevos clientes con su información fiscal',
      'Definí condiciones de pago específicas',
      'Consultá el estado de cuenta de cada cliente',
      'Visualizá el historial de compras',
      'Gestioná facturas pendientes y pagos',
    ],
  },
  {
    id: '6',
    title: 'Proveedores y Compras',
    content: 'Gestioná tus proveedores y órdenes de compra de forma centralizada.',
    steps: [
      'Accedé a "Proveedores"',
      'Registrá tus proveedores con datos de contacto',
      'Configurá condiciones comerciales (plazo de pago, descuentos)',
      'Creá órdenes de compra',
      'Hacé seguimiento de entregas',
      'Registrá la recepción de mercadería',
    ],
  },
  {
    id: '7',
    title: 'Reportes y Análisis',
    content: 'Tomá decisiones informadas con reportes detallados de tu negocio.',
    steps: [
      'Ingresá a "Reportes"',
      'Seleccioná el tipo de reporte que necesitás',
      'Definí el período a analizar',
      'Visualizá gráficos y tablas interactivas',
      'Exportá los reportes en PDF o Excel',
      'Analizá tendencias y toma decisiones',
    ],
  },
  {
    id: '8',
    title: 'Configuración del Sistema',
    content: 'Personalizá Suma Gestión según las necesidades de tu negocio.',
    steps: [
      'Accedé a "Administración" > "Configuración"',
      'Configurá información de tu empresa',
      'Definí parámetros fiscales (moneda, tasas de impuestos)',
      'Personalizá prefijos y numeración de facturas',
      'Configurá alertas y notificaciones',
      'Gestioná usuarios y permisos (si tenés plan premium)',
    ],
  },
  {
    id: '9',
    title: 'Seguridad y Respaldos',
    content: 'Mantené tu información segura con las mejores prácticas.',
    steps: [
      'Usá contraseñas seguras y cambialas periódicamente',
      'Activá la autenticación de dos factores',
      'Configurá respaldos automáticos',
      'Descargá backups manuales regularmente',
      'Limitá el acceso según roles de usuario',
      'Revisá el log de auditoría periódicamente',
    ],
  },
  {
    id: '10',
    title: 'Atajos y Trucos',
    content: 'Trabajá más rápido con estos atajos y funciones avanzadas.',
    steps: [
      'Usá la barra de búsqueda global (Ctrl/Cmd + K)',
      'Filtrá resultados en todas las listas',
      'Exportá datos con un clic',
      'Duplicá facturas existentes para agilizar',
      'Usá plantillas para facturas recurrentes',
      'Configurá recordatorios automáticos de pagos',
    ],
  },
];

export const UserGuidePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = useMemo(() => {
    if (searchTerm === '') return guideSections;
    return guideSections.filter(
      (section) =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.steps?.some((step) => step.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Guía de Usuario"
        subtitle="Documentación completa para sacar el máximo provecho de Suma Gestión"
        action={<Chip icon={<MenuBookIcon />} label={`${guideSections.length} secciones`} color="primary" />}
      />

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Buscá en la guía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {filteredSections.length === 0 ? (
        <Card>
          <CardContent>
            <Stack spacing={2} alignItems="center" py={4}>
              <MenuBookIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
              <Typography variant="h6" color="text.secondary">
                No se encontraron resultados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intentá con otros términos de búsqueda
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {filteredSections.map((section) => (
            <Accordion key={section.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack spacing={0.5} width="100%">
                  <Typography variant="h6" fontWeight={700}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.content}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Divider />
                  {section.steps && section.steps.length > 0 && (
                    <>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Pasos a seguir:
                      </Typography>
                      <List>
                        {section.steps.map((step, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  {index + 1}. {step}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              ¿Necesitás más ayuda?
            </Typography>
            <Divider />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Si no encontraste lo que buscás en esta guía, podés:
              </Typography>
              <List>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Ver los tutoriales en video" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Consultar las preguntas frecuentes (FAQ)" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Contactar a nuestro equipo de soporte" />
                </ListItem>
              </List>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
