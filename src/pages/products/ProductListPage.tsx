import FilterListIcon from '@mui/icons-material/FilterList';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { SectionHeader } from '../../components/common/SectionHeader';
import { productService } from '../../services/mockApi';
import { categories } from '../../mocks/data';
import type { Product } from '../../types';

export const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Productos"
        subtitle="Gestioná el catálogo, precios e inventario"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<FilterListIcon />}>
              Filtros avanzados
            </Button>
            <Button variant="contained">Nuevo producto</Button>
          </Stack>
        }
      />
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nombre o SKU"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SyncAltIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Categoría"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button fullWidth variant="outlined" color="secondary">
                  Exportar listado
                </Button>
              </Grid>
            </Grid>
            {isLoading ? <LinearProgress /> : null}
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Actualizado</TableCell>
                    <TableCell align="right" sx={{ width: 120 }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const categoryName = categories.find((category) => category.id === product.categoryId)?.name ?? 'Sin categoría';
                    return (
                      <TableRow hover key={product.id}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Chip label={product.name.charAt(0)} color="primary" />
                            <Box>
                              <Typography fontWeight={600}>{product.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {product.suppliers[0]?.name ?? 'Sin proveedor asignado'}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{categoryName}</TableCell>
                        <TableCell align="right">${product.price.toLocaleString('es-AR')}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${product.stock} u.`}
                            color={product.stock <= 5 ? 'error' : product.stock <= 10 ? 'warning' : 'success'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">{new Date(product.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <IconButton>
                            <FilterListIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
