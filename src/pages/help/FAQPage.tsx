import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SearchIcon from '@mui/icons-material/Search';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    category: 'General',
    question: '¿Cómo creo mi primera factura?',
    answer: 'Para crear una factura, navegá a la sección "Facturación" en el menú lateral, hacé clic en "Nueva Factura", seleccioná un cliente, agregá los productos y completá los datos necesarios. El sistema calculará automáticamente los totales y el IVA.',
  },
  {
    id: '2',
    category: 'General',
    question: '¿Cómo agrego un nuevo producto al inventario?',
    answer: 'Dirigite a "Productos" en el menú, hacé clic en "Nuevo Producto" y completá el formulario con la información del producto (nombre, SKU, precio de costo, precio de venta, stock inicial). El SKU se genera automáticamente si lo dejás vacío.',
  },
  {
    id: '3',
    category: 'Inventario',
    question: '¿Cómo funciona el control de stock mínimo?',
    answer: 'Podés configurar un stock mínimo para cada producto. Cuando el stock actual cae por debajo de este valor, el sistema te mostrará una alerta en el Dashboard para que puedas realizar una reposición a tiempo.',
  },
  {
    id: '4',
    category: 'Inventario',
    question: '¿Puedo gestionar múltiples categorías de productos?',
    answer: 'Sí, podés crear y gestionar categorías desde "Productos > Categorías". Esto te permite organizar mejor tu inventario y generar reportes por categoría.',
  },
  {
    id: '5',
    category: 'Clientes',
    question: '¿Cómo registro un nuevo cliente?',
    answer: 'Desde la sección "Clientes", hacé clic en "Nuevo Cliente" y completá la información básica (nombre, CUIT/DNI, dirección, email, teléfono). También podés configurar condiciones de pago específicas para cada cliente.',
  },
  {
    id: '6',
    category: 'Clientes',
    question: '¿Puedo ver el estado de cuenta de un cliente?',
    answer: 'Sí, cada cliente tiene una página de "Estado de Cuenta" donde podés ver todas sus facturas, pagos realizados, saldo pendiente y el historial completo de transacciones.',
  },
  {
    id: '7',
    category: 'Facturación',
    question: '¿Qué tipos de comprobantes puedo emitir?',
    answer: 'Podés emitir Facturas A, B y C, así como Notas de Crédito. El sistema calcula automáticamente los impuestos según el tipo de comprobante y la condición fiscal del cliente.',
  },
  {
    id: '8',
    category: 'Facturación',
    question: '¿Cómo funciona el seguimiento de pagos?',
    answer: 'En la sección de Facturación podés ver el estado de cada factura (Pagada, Pendiente, Vencida). El sistema te permite registrar pagos parciales o totales y actualiza automáticamente el estado de la factura.',
  },
  {
    id: '9',
    category: 'Reportes',
    question: '¿Qué tipo de reportes puedo generar?',
    answer: 'Podés generar reportes de ventas, inventario, productos más vendidos, estado de cuentas por cliente, y reportes financieros. Todos los reportes se pueden exportar en PDF o Excel.',
  },
  {
    id: '10',
    category: 'Seguridad',
    question: '¿Mis datos están seguros?',
    answer: 'Sí, utilizamos encriptación de datos, conexiones HTTPS, autenticación segura y realizamos backups automáticos diarios. Tus datos están protegidos con los más altos estándares de seguridad.',
  },
  {
    id: '11',
    category: 'Seguridad',
    question: '¿Puedo tener múltiples usuarios en el sistema?',
    answer: 'Sí, podés crear múltiples usuarios con diferentes niveles de acceso y permisos desde la sección de Administración. Esto te permite que tu equipo trabaje colaborativamente manteniendo la seguridad.',
  },
  {
    id: '12',
    category: 'Soporte',
    question: '¿Cómo contacto al soporte técnico?',
    answer: 'Podés contactarnos por email (soporte@sumagestion.com), chat en vivo (Lun-Vie 9-18hs) o teléfono (+54 11 4567-8900). También tenés la opción de enviar un formulario desde la página de Contactar Soporte.',
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

export const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Preguntas Frecuentes"
        subtitle="Encuentra respuestas rápidas a las preguntas más comunes"
        action={<Chip icon={<HelpOutlineIcon />} label={`${faqs.length} preguntas`} color="primary" />}
      />

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              placeholder="Buscá una pregunta o tema..."
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

            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label="Todas"
                color={selectedCategory === null ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? 'filled' : 'outlined'}
              />
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {filteredFAQs.length === 0 ? (
        <Card>
          <CardContent>
            <Stack spacing={2} alignItems="center" py={4}>
              <HelpOutlineIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
              <Typography variant="h6" color="text.secondary">
                No se encontraron preguntas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intentá con otros términos de búsqueda o contactá a soporte
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {filteredFAQs.map((faq) => (
            <Accordion key={faq.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack spacing={1} width="100%">
                  <Box display="flex" gap={2} alignItems="center">
                    <Chip label={faq.category} size="small" color="primary" variant="outlined" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {faq.question}
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}

      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              ¿No encontraste lo que buscabas?
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta
            </Typography>
            <Chip label="Contactar Soporte" color="primary" />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
