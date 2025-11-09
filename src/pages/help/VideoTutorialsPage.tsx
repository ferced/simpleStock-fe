import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useMemo } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

const tutorials: VideoTutorial[] = [
  {
    id: '1',
    category: 'Primeros Pasos',
    title: 'Introducción a Suma Gestión',
    description: 'Conocé las funcionalidades principales del sistema y cómo navegar por la interfaz.',
    duration: '5:30',
    thumbnail: 'https://via.placeholder.com/400x225/2C3E9B/FFFFFF?text=Introduccion',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
  },
  {
    id: '2',
    category: 'Primeros Pasos',
    title: 'Configuración Inicial',
    description: 'Configurá tu empresa, usuarios y parámetros básicos del sistema.',
    duration: '8:15',
    thumbnail: 'https://via.placeholder.com/400x225/12A3B8/FFFFFF?text=Configuracion',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
  },
  {
    id: '3',
    category: 'Productos',
    title: 'Crear y Gestionar Productos',
    description: 'Aprendé a registrar productos, categorías y gestionar tu catálogo completo.',
    duration: '7:45',
    thumbnail: 'https://via.placeholder.com/400x225/2C3E9B/FFFFFF?text=Productos',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
  },
  {
    id: '4',
    category: 'Inventario',
    title: 'Control de Stock',
    description: 'Controlá tu inventario, movimientos y alertas de stock mínimo.',
    duration: '10:20',
    thumbnail: 'https://via.placeholder.com/400x225/12A3B8/FFFFFF?text=Inventario',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
  },
  {
    id: '5',
    category: 'Facturación',
    title: 'Crear Facturas',
    description: 'Emití facturas de forma rápida y profesional con cálculos automáticos.',
    duration: '9:10',
    thumbnail: 'https://via.placeholder.com/400x225/2C3E9B/FFFFFF?text=Facturacion',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
  },
  {
    id: '6',
    category: 'Facturación',
    title: 'Gestión de Pagos',
    description: 'Registrá pagos, seguí facturas pendientes y generá recordatorios automáticos.',
    duration: '6:50',
    thumbnail: 'https://via.placeholder.com/400x225/12A3B8/FFFFFF?text=Pagos',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
  },
  {
    id: '7',
    category: 'Clientes',
    title: 'Administrar Clientes',
    description: 'Registrá clientes, consultá estados de cuenta y gestioná condiciones comerciales.',
    duration: '7:30',
    thumbnail: 'https://via.placeholder.com/400x225/2C3E9B/FFFFFF?text=Clientes',
    videoUrl: 'https://www.youtube.com/watch?v=example7',
  },
  {
    id: '8',
    category: 'Proveedores',
    title: 'Gestión de Proveedores',
    description: 'Registrá proveedores y creá órdenes de compra de forma eficiente.',
    duration: '8:40',
    thumbnail: 'https://via.placeholder.com/400x225/12A3B8/FFFFFF?text=Proveedores',
    videoUrl: 'https://www.youtube.com/watch?v=example8',
  },
  {
    id: '9',
    category: 'Reportes',
    title: 'Reportes y Análisis',
    description: 'Generá reportes de ventas, inventario y análisis financieros.',
    duration: '11:15',
    thumbnail: 'https://via.placeholder.com/400x225/2C3E9B/FFFFFF?text=Reportes',
    videoUrl: 'https://www.youtube.com/watch?v=example9',
  },
];

const categories = Array.from(new Set(tutorials.map((t) => t.category)));

export const VideoTutorialsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tutorial) => {
      const matchesSearch =
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || tutorial.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Tutoriales en Video"
        subtitle="Aprendé a usar Suma Gestión con estos videos paso a paso"
        action={<Chip label={`${tutorials.length} videos`} color="primary" />}
      />

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              placeholder="Buscá un tutorial..."
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

            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip
                icon={<CategoryIcon />}
                label="Todas las categorías"
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
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 'es' : ''} disponible{filteredTutorials.length !== 1 ? 's' : ''}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {filteredTutorials.map((tutorial) => (
          <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={tutorial.thumbnail}
                  alt={tutorial.title}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <PlayCircleIcon
                    sx={{
                      fontSize: 64,
                      color: 'white',
                      opacity: 0.9,
                      '&:hover': {
                        opacity: 1,
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                </Box>
                <Chip
                  icon={<AccessTimeIcon fontSize="small" />}
                  label={tutorial.duration}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={1.5}>
                  <Chip label={tutorial.category} size="small" color="primary" sx={{ width: 'fit-content' }} />
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {tutorial.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tutorial.description}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTutorials.length === 0 && (
        <Card>
          <CardContent>
            <Stack spacing={2} alignItems="center" py={4}>
              <PlayCircleIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
              <Typography variant="h6" color="text.secondary">
                No se encontraron tutoriales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intentá con otros términos de búsqueda o categorías
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};
