import FilterListIcon from '@mui/icons-material/FilterList';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableRowsIcon from '@mui/icons-material/TableRows';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
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
  Checkbox,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { categories, suppliers } from '../../mocks/data';
import type { Product } from '../../types';
import { useNavigate } from 'react-router-dom';

type SortKey = 'name' | 'price' | 'stock' | 'updatedAt';

export const ProductListPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
    let list = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
      const matchesMin = minPrice === '' || product.price >= Number(minPrice);
      const matchesMax = maxPrice === '' || product.price <= Number(maxPrice);
      const matchesLowStock = !lowStockOnly || product.stock <= 5;
      return matchesSearch && matchesCategory && matchesMin && matchesMax && matchesLowStock;
    });

    list = list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'price':
          return (a.price - b.price) * dir;
        case 'stock':
          return (a.stock - b.stock) * dir;
        case 'updatedAt':
          return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * dir;
        default:
          return 0;
      }
    });

    return list;
  }, [products, search, categoryFilter, minPrice, maxPrice, lowStockOnly, sortKey, sortDir]);

  const paginatedProducts = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  const handleDelete = () => {
    if (!deleteId) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  const exportCSV = () => {
    const header = ['id', 'name', 'sku', 'categoryId', 'price', 'taxRate', 'stock', 'updatedAt'];
    const rows = filteredProducts.map((p) => [p.id, p.name, p.sku, p.categoryId, p.price, p.taxRate, p.stock, p.updatedAt]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => (typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : String(v))).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/productos/nuevo')}>
              Crear producto
            </Button>
          </Stack>
        }
      />
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box>
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
                <Button fullWidth variant="outlined" color="secondary" sx={{ height: '56px' }} startIcon={<FileDownloadIcon />} onClick={exportCSV}>
                  Exportar CSV
                </Button>
              </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  type="number"
                  label="Precio mín."
                  fullWidth
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  type="number"
                  label="Precio máx."
                  fullWidth
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={<Checkbox checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />}
                  label="Sólo stock bajo"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction="row" justifyContent="flex-end">
                  <ToggleButtonGroup
                    size="small"
                    value={view}
                    exclusive
                    onChange={(_, v) => v && setView(v)}
                  >
                    <ToggleButton value="table" aria-label="Tabla"><TableRowsIcon fontSize="small" /></ToggleButton>
                    <ToggleButton value="grid" aria-label="Grilla"><ViewModuleIcon fontSize="small" /></ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="body2">Ordenar por</Typography>
              </Grid>
              <Grid item>
                <Select size="small" value={sortKey} onChange={(e: SelectChangeEvent) => setSortKey(e.target.value as SortKey)}>
                  <MenuItem value="name">Nombre</MenuItem>
                  <MenuItem value="price">Precio</MenuItem>
                  <MenuItem value="stock">Stock</MenuItem>
                  <MenuItem value="updatedAt">Fecha</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <Select size="small" value={sortDir} onChange={(e: SelectChangeEvent) => setSortDir(e.target.value as 'asc' | 'desc')}>
                  <MenuItem value="asc">Asc</MenuItem>
                  <MenuItem value="desc">Desc</MenuItem>
                </Select>
              </Grid>
              <Grid item sx={{ ml: 'auto' }}>
                <Typography variant="caption">{filteredProducts.length} resultados</Typography>
              </Grid>
            </Grid>
            {isLoading ? <LinearProgress /> : null}
            {view === 'table' ? (
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
                    {paginatedProducts.map((product) => {
                      const categoryName = categories.find((category) => category.id === product.categoryId)?.name ?? 'Sin categoría';
                      return (
                        <TableRow hover key={product.id} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/productos/${product.id}`)}>
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
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            <IconButton size="small" onClick={() => navigate(`/productos/${product.id}/editar`)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => setDeleteId(product.id)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/productos/${product.id}`)}>
                      <CardContent>
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                            <Typography fontWeight={600}>{product.name}</Typography>
                            <Chip size="small" label={product.sku} />
                          </Stack>
                          <Typography variant="body2">${product.price.toLocaleString('es-AR')}</Typography>
                          <Chip
                            size="small"
                            label={`${product.stock} u.`}
                            color={product.stock <= 5 ? 'error' : product.stock <= 10 ? 'warning' : 'success'}
                            variant="outlined"
                          />
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/productos/${product.id}/editar`); }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); setDeleteId(product.id); }}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Typography variant="body2">Filas por página</Typography>
              </Grid>
              <Grid item>
                <Select size="small" value={String(rowsPerPage)} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </Grid>
              <Grid item sx={{ ml: 'auto' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button variant="outlined" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Anterior</Button>
                  <Typography variant="caption">Página {page + 1} / {Math.max(1, Math.ceil(filteredProducts.length / rowsPerPage))}</Typography>
                  <Button variant="outlined" disabled={(page + 1) * rowsPerPage >= filteredProducts.length} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Eliminar producto</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
