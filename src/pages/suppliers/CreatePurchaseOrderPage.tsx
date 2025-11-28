import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
import { SectionHeader } from '../../components/common/SectionHeader';
import dayjs from 'dayjs';

interface Supplier {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
  address: string;
  paymentTerms: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  stock: number;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

interface PurchaseOrderForm {
  supplierId: string;
  supplierName: string;
  expectedDate: string;
  notes: string;
  paymentTerms: string;
  shippingAddress: string;
  items: OrderItem[];
}

const mockSuppliers: Supplier[] = [
  { id: 'sup-1', name: 'Proveedor Alpha', contactEmail: 'alpha@proveedor.com', phone: '+54 11 1234-5678', address: 'Av. Corrientes 1234, CABA', paymentTerms: '30 días' },
  { id: 'sup-2', name: 'Proveedor Beta', contactEmail: 'beta@proveedor.com', phone: '+54 11 2345-6789', address: 'Av. Santa Fe 5678, CABA', paymentTerms: '15 días' },
  { id: 'sup-3', name: 'Proveedor Gamma', contactEmail: 'gamma@proveedor.com', phone: '+54 11 3456-7890', address: 'Av. Rivadavia 9012, CABA', paymentTerms: '60 días' },
  { id: 'sup-4', name: 'Distribuidora Delta', contactEmail: 'delta@distribuidora.com', phone: '+54 11 4567-8901', address: 'Av. Cabildo 3456, CABA', paymentTerms: '45 días' },
];

const mockProducts: Product[] = [
  { id: 'prod-1', sku: 'SKU-001', name: 'Laptop HP ProBook 450', category: 'Electrónica', unitPrice: 450000, stock: 15 },
  { id: 'prod-2', sku: 'SKU-002', name: 'Monitor LG 27" 4K', category: 'Electrónica', unitPrice: 180000, stock: 25 },
  { id: 'prod-3', sku: 'SKU-003', name: 'Teclado Mecánico Logitech', category: 'Accesorios', unitPrice: 35000, stock: 50 },
  { id: 'prod-4', sku: 'SKU-004', name: 'Mouse Inalámbrico Microsoft', category: 'Accesorios', unitPrice: 15000, stock: 80 },
  { id: 'prod-5', sku: 'SKU-005', name: 'Disco SSD Samsung 1TB', category: 'Almacenamiento', unitPrice: 95000, stock: 30 },
  { id: 'prod-6', sku: 'SKU-006', name: 'Memoria RAM 16GB DDR4', category: 'Componentes', unitPrice: 45000, stock: 40 },
  { id: 'prod-7', sku: 'SKU-007', name: 'Webcam Logitech C920', category: 'Accesorios', unitPrice: 55000, stock: 20 },
  { id: 'prod-8', sku: 'SKU-008', name: 'Auriculares Sony WH-1000XM4', category: 'Audio', unitPrice: 120000, stock: 12 },
];

export const CreatePurchaseOrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addQuantity, setAddQuantity] = useState(1);
  const [addDiscount, setAddDiscount] = useState(0);

  const [form, setForm] = useState<PurchaseOrderForm>({
    supplierId: '',
    supplierName: '',
    expectedDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    notes: '',
    paymentTerms: '',
    shippingAddress: '',
    items: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      // Simular carga de orden existente
      setTimeout(() => {
        setForm({
          supplierId: 'sup-1',
          supplierName: 'Proveedor Alpha',
          expectedDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
          notes: 'Entregar en horario de oficina',
          paymentTerms: '30 días',
          shippingAddress: 'Depósito Central, Av. Principal 1234',
          items: [
            { id: '1', productId: 'prod-1', productName: 'Laptop HP ProBook 450', sku: 'SKU-001', quantity: 5, unitPrice: 450000, discount: 5, subtotal: 2137500 },
            { id: '2', productId: 'prod-2', productName: 'Monitor LG 27" 4K', sku: 'SKU-002', quantity: 10, unitPrice: 180000, discount: 0, subtotal: 1800000 },
          ],
        });
        setIsLoading(false);
      }, 500);
    }
  }, [isEditing]);

  const selectedSupplier = useMemo(() => {
    return mockSuppliers.find(s => s.id === form.supplierId) || null;
  }, [form.supplierId]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return mockProducts;
    const search = productSearch.toLowerCase();
    return mockProducts.filter(
      p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)
    );
  }, [productSearch]);

  const totals = useMemo(() => {
    const subtotal = form.items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.21; // IVA 21%
    const total = subtotal + tax;
    return { subtotal, tax, total, itemCount: form.items.length };
  }, [form.items]);

  const handleSupplierChange = (supplier: Supplier | null) => {
    if (supplier) {
      setForm(prev => ({
        ...prev,
        supplierId: supplier.id,
        supplierName: supplier.name,
        paymentTerms: supplier.paymentTerms,
        shippingAddress: supplier.address,
      }));
      setErrors(prev => ({ ...prev, supplierId: '' }));
    } else {
      setForm(prev => ({
        ...prev,
        supplierId: '',
        supplierName: '',
        paymentTerms: '',
        shippingAddress: '',
      }));
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const existingIndex = form.items.findIndex(item => item.productId === selectedProduct.id);

    if (existingIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedItems = [...form.items];
      const item = updatedItems[existingIndex];
      item.quantity += addQuantity;
      item.discount = addDiscount;
      item.subtotal = item.quantity * item.unitPrice * (1 - item.discount / 100);
      setForm(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Agregar nuevo item
      const subtotal = addQuantity * selectedProduct.unitPrice * (1 - addDiscount / 100);
      const newItem: OrderItem = {
        id: Date.now().toString(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        sku: selectedProduct.sku,
        quantity: addQuantity,
        unitPrice: selectedProduct.unitPrice,
        discount: addDiscount,
        subtotal,
      };
      setForm(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }

    setShowProductDialog(false);
    setSelectedProduct(null);
    setAddQuantity(1);
    setAddDiscount(0);
    setProductSearch('');
  };

  const handleRemoveItem = (itemId: string) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setForm(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const subtotal = quantity * item.unitPrice * (1 - item.discount / 100);
          return { ...item, quantity, subtotal };
        }
        return item;
      }),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.supplierId) {
      newErrors.supplierId = 'Seleccioná un proveedor';
    }
    if (!form.expectedDate) {
      newErrors.expectedDate = 'Ingresá la fecha esperada de entrega';
    }
    if (form.items.length === 0) {
      newErrors.items = 'Agregá al menos un producto a la orden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (sendToSupplier: boolean = false) => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      // TODO: Guardar orden en el backend
      await new Promise(r => setTimeout(r, 1000));

      if (sendToSupplier) {
        // TODO: Enviar al proveedor
        console.log('Orden enviada al proveedor');
      }

      navigate('/proveedores/ordenes');
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Stack spacing={4}>
        <SectionHeader title="Cargando orden..." subtitle="Por favor esperá" />
        <LinearProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <SectionHeader
        title={isEditing ? `Editar Orden ${id}` : 'Nueva Orden de Compra'}
        subtitle={isEditing ? 'Modificá los detalles de la orden' : 'Creá una nueva orden para tu proveedor'}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/proveedores/ordenes')}
          >
            Volver
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Información del Proveedor */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" fontWeight={600}>
                  Información del Proveedor
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Autocomplete
                      options={mockSuppliers}
                      getOptionLabel={(option) => option.name}
                      value={selectedSupplier}
                      onChange={(_, value) => handleSupplierChange(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Proveedor"
                          error={Boolean(errors.supplierId)}
                          helperText={errors.supplierId}
                          required
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Stack>
                            <Typography variant="body2" fontWeight={600}>
                              {option.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.contactEmail} | {option.phone}
                            </Typography>
                          </Stack>
                        </li>
                      )}
                    />
                  </Grid>

                  {selectedSupplier && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Condiciones de Pago"
                          value={form.paymentTerms}
                          onChange={(e) => setForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Fecha Esperada de Entrega"
                          type="date"
                          value={form.expectedDate}
                          onChange={(e) => setForm(prev => ({ ...prev, expectedDate: e.target.value }))}
                          error={Boolean(errors.expectedDate)}
                          helperText={errors.expectedDate}
                          InputLabelProps={{ shrink: true }}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Dirección de Entrega"
                          value={form.shippingAddress}
                          onChange={(e) => setForm(prev => ({ ...prev, shippingAddress: e.target.value }))}
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Resumen de la Orden
                </Typography>
                <Divider />

                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Productos:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {totals.itemCount} items
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Subtotal:
                    </Typography>
                    <Typography variant="body2">
                      ${totals.subtotal.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      IVA (21%):
                    </Typography>
                    <Typography variant="body2">
                      ${totals.tax.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight={700}>
                      Total:
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                      ${totals.total.toLocaleString('es-AR')}
                    </Typography>
                  </Box>
                </Stack>

                <Divider />

                <Stack spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => handleSave(true)}
                    disabled={isSaving || form.items.length === 0}
                    fullWidth
                  >
                    Guardar y Enviar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                    fullWidth
                  >
                    Guardar Borrador
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Productos de la Orden */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={600}>
                    Productos de la Orden
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowProductDialog(true)}
                    disabled={!form.supplierId}
                  >
                    Agregar Producto
                  </Button>
                </Box>

                {errors.items && (
                  <Alert severity="error">{errors.items}</Alert>
                )}

                {!form.supplierId ? (
                  <Alert severity="info">
                    Seleccioná un proveedor para agregar productos a la orden
                  </Alert>
                ) : form.items.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">
                      No hay productos en la orden. Hacé clic en "Agregar Producto" para comenzar.
                    </Typography>
                  </Box>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>SKU</TableCell>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Precio Unit.</TableCell>
                        <TableCell align="center">Cantidad</TableCell>
                        <TableCell align="right">Descuento</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {form.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Chip label={item.sku} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {item.productName}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            ${item.unitPrice.toLocaleString('es-AR')}
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              size="small"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              inputProps={{ min: 1, style: { textAlign: 'center', width: 60 } }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {item.discount > 0 ? (
                              <Chip label={`-${item.discount}%`} size="small" color="success" />
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              ${item.subtotal.toLocaleString('es-AR')}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Notas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600}>
                  Notas Adicionales
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Instrucciones especiales, comentarios, etc."
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para agregar productos */}
      <Dialog
        open={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Agregar Producto a la Orden</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre o SKU..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      selected={selectedProduct?.id === product.id}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <TableCell>
                        <Chip label={product.sku} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Chip label={product.category} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        ${product.unitPrice.toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell align="right">{product.stock}</TableCell>
                      <TableCell>
                        {selectedProduct?.id === product.id && (
                          <Chip label="Seleccionado" size="small" color="primary" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {selectedProduct && (
              <>
                <Divider />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Alert severity="info">
                      Producto seleccionado: <strong>{selectedProduct.name}</strong> - ${selectedProduct.unitPrice.toLocaleString('es-AR')}
                    </Alert>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Cantidad"
                      value={addQuantity}
                      onChange={(e) => setAddQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label="Descuento"
                      value={addDiscount}
                      onChange={(e) => setAddDiscount(parseInt(e.target.value))}
                    >
                      <MenuItem value={0}>Sin descuento</MenuItem>
                      <MenuItem value={5}>5%</MenuItem>
                      <MenuItem value={10}>10%</MenuItem>
                      <MenuItem value={15}>15%</MenuItem>
                      <MenuItem value={20}>20%</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                      <Typography variant="subtitle1" fontWeight={600}>
                        Subtotal: ${(addQuantity * selectedProduct.unitPrice * (1 - addDiscount / 100)).toLocaleString('es-AR')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProductDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleAddProduct}
            disabled={!selectedProduct}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default CreatePurchaseOrderPage;
