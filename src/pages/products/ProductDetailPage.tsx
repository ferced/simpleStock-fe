import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Alert,
} from '@mui/material';
import { ProductDetail, StockMovement, SupplierSummary } from '../../types';

// Minimal mock generator until API endpoints are wired
const buildMockDetail = (id: string): ProductDetail => ({
  id,
  name: 'Producto de prueba',
  sku: 'TEST-001',
  categoryId: 'cat-1',
  price: 1200,
  taxRate: 21,
  stock: 35,
  suppliers: [
    { id: 'sup-1', name: 'Acme Corp', contactEmail: 'ventas@acme.test', phone: '555-0001' },
  ],
  updatedAt: new Date().toISOString(),
  description: 'Descripción del producto de prueba',
  costPrice: 800,
  wholesalePrice: 1000,
  minimumStock: 5,
  maximumStock: 200,
  imageUrls: [],
  barcode: '1234567890123',
  internalCode: 'INT-001',
  category: { id: 'cat-1', name: 'Electrónica' },
  stockHistory: new Array(8).fill(0).map((_, i) => ({
    id: `m-${i}`,
    productId: id,
    productName: 'Producto de prueba',
    type: i % 2 === 0 ? 'in' : 'out',
    quantity: (i + 1) * 2,
    source: i % 2 === 0 ? 'Compra' : undefined,
    destination: i % 2 !== 0 ? 'Venta' : undefined,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  })),
  priceHistory: new Array(6).fill(0).map((_, i) => ({
    id: `p-${i}`,
    productId: id,
    previousPrice: 900 + i * 50,
    newPrice: 950 + i * 50,
    changedBy: 'admin',
    createdAt: new Date(Date.now() - i * 604800000).toISOString(),
  })),
  createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
});

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    // TODO: replace with apiClient.get(`/products/${id}`)
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData(buildMockDetail(id));
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [id]);

  const lowStock = useMemo(() => {
    if (!data) return false;
    return data.stock < data.minimumStock;
  }, [data]);

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography>Cargando…</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Alert severity="error">Producto no encontrado</Alert>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/productos')}>
          Volver a productos
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{data.name}</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => navigate(`/productos/${data.id}/editar`)}>Editar</Button>
          <Button variant="outlined" onClick={() => navigate('/productos')}>Volver</Button>
        </Stack>
      </Stack>

      {lowStock && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Stock bajo: {data.stock} (mínimo {data.minimumStock})
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Información General" />
            <Divider />
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2">SKU: {data.sku}</Typography>
                <Typography variant="body2">Categoría: {data.category.name}</Typography>
                <Typography variant="body2">Precio: ${data.price.toFixed(2)}</Typography>
                <Typography variant="body2">Impuesto: {data.taxRate}%</Typography>
                <Typography variant="body2">Stock: {data.stock}</Typography>
                <Typography variant="body2">Actualizado: {new Date(data.updatedAt).toLocaleString()}</Typography>
                {data.description && (
                  <Typography variant="body2">Descripción: {data.description}</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Proveedores" />
            <Divider />
            <CardContent>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {data.suppliers.map((s: SupplierSummary) => (
                  <Chip key={s.id} label={s.name} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader title="Historial de Stock (últimos 20)" />
            <Divider />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell>Origen</TableCell>
                    <TableCell>Destino</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.stockHistory.slice(0, 20).map((m: StockMovement) => (
                    <TableRow key={m.id}>
                      <TableCell>{new Date(m.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{m.type}</TableCell>
                      <TableCell align="right">{m.quantity}</TableCell>
                      <TableCell>{m.source || '-'}</TableCell>
                      <TableCell>{m.destination || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Historial de Precios (resumen)" />
            <Divider />
            <CardContent>
              {data.priceHistory.length === 0 ? (
                <Typography variant="body2">Sin variaciones registradas</Typography>
              ) : (
                <Stack spacing={1}>
                  {data.priceHistory.map((p) => (
                    <Typography key={p.id} variant="body2">
                      {new Date(p.createdAt).toLocaleDateString()}: ${p.previousPrice.toFixed(2)} → ${p.newPrice.toFixed(2)} (por {p.changedBy})
                    </Typography>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetailPage;

