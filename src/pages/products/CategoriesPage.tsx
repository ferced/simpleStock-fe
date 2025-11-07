import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import type { ProductCategory, Product } from '../../types';
import { categories as mockCategories, products as mockProducts } from '../../mocks/data';

type CategoryForm = {
  name: string;
  description?: string;
};

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>({ name: '', description: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryForm, string>>>({});

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Mock load
    setCategories(mockCategories);
    setProducts(mockProducts);
  }, []);

  const withCounts = useMemo(() => {
    const idToCount = new Map<string, number>();
    products.forEach((p) => idToCount.set(p.categoryId, (idToCount.get(p.categoryId) || 0) + 1));
    return categories.map((c) => ({ ...c, productCount: idToCount.get(c.id) || 0 }));
  }, [categories, products]);

  const filtered = useMemo(() => {
    const list = withCounts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [withCounts, search]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setEditingId(id);
    setForm({ name: cat.name, description: cat.description });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (data: CategoryForm) => {
    const next: Partial<Record<keyof CategoryForm, string>> = {};
    if (!data.name?.trim()) next.name = 'Nombre requerido';
    return next;
  };

  const saveCategory = () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, name: form.name, description: form.description } : c)));
      setToast({ open: true, message: 'Categoría actualizada', severity: 'success' });
    } else {
      const newCat: ProductCategory = { id: `cat-${Date.now()}`, name: form.name, description: form.description };
      setCategories((prev) => [newCat, ...prev]);
      setToast({ open: true, message: 'Categoría creada', severity: 'success' });
    }
    setModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    const cat = withCounts.find((c) => c.id === id);
    if (!cat) return;
    if ((cat as any).productCount > 0) {
      setToast({ open: true, message: 'No se puede eliminar: tiene productos asociados', severity: 'error' });
      return;
    }
    setDeleteId(id);
  };

  const deleteCategory = () => {
    if (!deleteId) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    setToast({ open: true, message: 'Categoría eliminada', severity: 'success' });
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Categorías</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Nueva categoría</Button>
        </Stack>
      </Stack>

      <Card>
        <CardHeader title="Listado" />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth placeholder="Buscar por nombre" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Typography variant="body2">Filas por página</Typography>
                  <TextField
                    select
                    size="small"
                    value={String(rowsPerPage)}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                    sx={{ width: 96 }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </TextField>
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="right"># Productos</TableCell>
                    <TableCell align="right" sx={{ width: 120 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.description || '-'}</TableCell>
                      <TableCell align="right">{(withCounts.find((x) => x.id === c.id) as any)?.productCount || 0}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openEdit(c.id)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => confirmDelete(c.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary">Sin resultados</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={1} alignItems="center">
              <Button variant="outlined" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Anterior</Button>
              <Typography variant="caption">Página {page + 1} / {Math.max(1, Math.ceil(filtered.length / rowsPerPage))}</Typography>
              <Button variant="outlined" disabled={(page + 1) * rowsPerPage >= filtered.length} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>{editingId ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Nombre" fullWidth value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} error={!!errors.name} helperText={errors.name} required />
            <TextField label="Descripción" fullWidth value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveCategory}>{editingId ? 'Guardar' : 'Crear'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Eliminar categoría</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar esta categoría?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={deleteCategory}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast?.open} autoHideDuration={2500} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast?.severity ?? 'success'} variant="filled" sx={{ width: '100%' }}>
          {toast?.message ?? ''}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesPage;

