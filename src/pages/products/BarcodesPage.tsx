import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { SectionHeader } from '../../components/common/SectionHeader';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  barcode: string | null;
  price: number;
  stock: number;
}

interface LabelConfig {
  width: number;
  height: number;
  showName: boolean;
  showPrice: boolean;
  showSku: boolean;
  copies: number;
}

const mockProducts: Product[] = [
  { id: 'p1', sku: 'SKU-001', name: 'Laptop HP ProBook 450', category: 'Electrónica', barcode: '7790001234567', price: 450000, stock: 15 },
  { id: 'p2', sku: 'SKU-002', name: 'Monitor LG 27" 4K', category: 'Electrónica', barcode: '7790001234568', price: 180000, stock: 25 },
  { id: 'p3', sku: 'SKU-003', name: 'Teclado Mecánico Logitech', category: 'Accesorios', barcode: null, price: 35000, stock: 50 },
  { id: 'p4', sku: 'SKU-004', name: 'Mouse Inalámbrico Microsoft', category: 'Accesorios', barcode: '7790001234570', price: 15000, stock: 80 },
  { id: 'p5', sku: 'SKU-005', name: 'Disco SSD Samsung 1TB', category: 'Almacenamiento', barcode: null, price: 95000, stock: 30 },
  { id: 'p6', sku: 'SKU-006', name: 'Memoria RAM 16GB DDR4', category: 'Componentes', barcode: '7790001234572', price: 45000, stock: 40 },
  { id: 'p7', sku: 'SKU-007', name: 'Webcam Logitech C920', category: 'Accesorios', barcode: null, price: 55000, stock: 20 },
  { id: 'p8', sku: 'SKU-008', name: 'Auriculares Sony WH-1000XM4', category: 'Audio', barcode: '7790001234574', price: 120000, stock: 12 },
];

const generateEAN13 = (): string => {
  const prefix = '779'; // Código de país Argentina
  let code = prefix;
  for (let i = 0; i < 9; i++) {
    code += Math.floor(Math.random() * 10);
  }
  // Calcular dígito verificador
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return code + checkDigit;
};

export const BarcodesPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterBarcode, setFilterBarcode] = useState<'all' | 'with' | 'without'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Dialogs
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [scanResult, setScanResult] = useState<{ code: string; product: Product | null } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');

  // Label config
  const [labelConfig, setLabelConfig] = useState<LabelConfig>({
    width: 50,
    height: 30,
    showName: true,
    showPrice: true,
    showSku: true,
    copies: 1,
  });

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 500));
      setProducts(mockProducts);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (filterBarcode === 'with') {
      filtered = filtered.filter(p => p.barcode);
    } else if (filterBarcode === 'without') {
      filtered = filtered.filter(p => !p.barcode);
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(s) ||
             p.sku.toLowerCase().includes(s) ||
             (p.barcode && p.barcode.includes(s))
      );
    }

    return filtered;
  }, [products, search, filterBarcode]);

  const stats = useMemo(() => {
    const total = products.length;
    const withBarcode = products.filter(p => p.barcode).length;
    const withoutBarcode = products.filter(p => !p.barcode).length;
    return { total, withBarcode, withoutBarcode };
  }, [products]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleGenerateBarcode = (productId: string) => {
    const newBarcode = generateEAN13();
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, barcode: newBarcode } : p)
    );
  };

  const handleGenerateSelected = () => {
    const productsWithoutBarcode = selectedProducts.filter(id => {
      const product = products.find(p => p.id === id);
      return product && !product.barcode;
    });

    setProducts(prev =>
      prev.map(p => {
        if (productsWithoutBarcode.includes(p.id)) {
          return { ...p, barcode: generateEAN13() };
        }
        return p;
      })
    );

    setShowGenerateDialog(false);
    setSelectedProducts([]);
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simular escaneo
    setTimeout(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      if (randomProduct.barcode) {
        setScanResult({ code: randomProduct.barcode, product: randomProduct });
      } else {
        setScanResult({ code: generateEAN13(), product: null });
      }
      setIsScanning(false);
    }, 2000);
  };

  const handleManualSearch = () => {
    if (!manualCode.trim()) return;

    const product = products.find(p => p.barcode === manualCode || p.sku === manualCode);
    setScanResult({ code: manualCode, product: product || null });
  };

  const handlePrintLabels = () => {
    // Simular impresión
    console.log('Imprimiendo etiquetas:', {
      products: selectedProducts.map(id => products.find(p => p.id === id)),
      config: labelConfig,
    });
    setShowPrintDialog(false);
    setSelectedProducts([]);
  };

  const handleExportPDF = () => {
    // Simular exportación
    console.log('Exportando etiquetas a PDF');
    alert('Exportando etiquetas a PDF...');
  };

  // Renderizar código de barras visual (simplificado)
  const renderBarcode = (code: string) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '1px',
            height: 40,
            mb: 0.5,
          }}
        >
          {code.split('').map((digit, i) => (
            <Box
              key={i}
              sx={{
                width: parseInt(digit) % 2 === 0 ? 2 : 1,
                height: '100%',
                bgcolor: i % 2 === 0 ? 'black' : 'white',
              }}
            />
          ))}
        </Box>
        <Typography variant="caption" fontFamily="monospace">
          {code}
        </Typography>
      </Box>
    );
  };

  return (
    <Stack spacing={4}>
      <SectionHeader
        title="Gestión de Códigos de Barras"
        subtitle="Generá, escaneá e imprimí códigos de barras para tus productos"
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<CameraAltIcon />}
              onClick={() => setShowScanDialog(true)}
            >
              Escanear
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => setShowPrintDialog(true)}
              disabled={selectedProducts.length === 0}
            >
              Imprimir Etiquetas ({selectedProducts.length})
            </Button>
          </Stack>
        }
      />

      {/* Estadísticas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Total de Productos
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stats.total}
                </Typography>
                <Chip label="En catálogo" size="small" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Con Código de Barras
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {stats.withBarcode}
                </Typography>
                <Chip label="Listos para etiquetar" size="small" color="success" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Sin Código de Barras
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {stats.withoutBarcode}
                </Typography>
                <Chip label="Pendientes" size="small" color="warning" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Productos */}
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Buscar por nombre, SKU o código de barras"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Filtrar"
                  value={filterBarcode}
                  onChange={(e) => setFilterBarcode(e.target.value as 'all' | 'with' | 'without')}
                >
                  <MenuItem value="all">Todos los productos</MenuItem>
                  <MenuItem value="with">Con código de barras</MenuItem>
                  <MenuItem value="without">Sin código de barras</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Mostrando {filteredProducts.length} de {products.length} productos
                {selectedProducts.length > 0 && ` • ${selectedProducts.length} seleccionados`}
              </Typography>
              {selectedProducts.some(id => !products.find(p => p.id === id)?.barcode) && (
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setShowGenerateDialog(true)}
                >
                  Generar códigos para seleccionados
                </Button>
              )}
            </Box>

            {isLoading ? (
              <LinearProgress />
            ) : filteredProducts.length === 0 ? (
              <Stack alignItems="center" py={4}>
                <QrCodeScannerIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {search || filterBarcode !== 'all' ? 'No se encontraron productos' : 'No hay productos registrados'}
                </Typography>
              </Stack>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        indeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Código de Barras</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      selected={selectedProducts.includes(product.id)}
                      hover
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={product.sku} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                          onClick={() => navigate(`/productos/${product.id}`)}
                        >
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={product.category} size="small" />
                      </TableCell>
                      <TableCell>
                        {product.barcode ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" fontFamily="monospace">
                              {product.barcode}
                            </Typography>
                            <CheckCircleIcon fontSize="small" color="success" />
                          </Stack>
                        ) : (
                          <Chip
                            label="Sin código"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          ${product.price.toLocaleString('es-AR')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          {!product.barcode && (
                            <Tooltip title="Generar código">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleGenerateBarcode(product.id)}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {product.barcode && (
                            <>
                              <Tooltip title="Regenerar código">
                                <IconButton
                                  size="small"
                                  onClick={() => handleGenerateBarcode(product.id)}
                                >
                                  <RefreshIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Imprimir etiqueta">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    setSelectedProducts([product.id]);
                                    setShowPrintDialog(true);
                                  }}
                                >
                                  <PrintIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Dialog de Escaneo */}
      <Dialog open={showScanDialog} onClose={() => setShowScanDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <QrCodeScannerIcon />
              <Typography variant="h6">Escanear Código</Typography>
            </Stack>
            <IconButton onClick={() => setShowScanDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Área de cámara simulada */}
            <Box
              sx={{
                height: 200,
                bgcolor: 'grey.900',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {isScanning ? (
                <Stack alignItems="center" spacing={2}>
                  <LinearProgress sx={{ width: '80%' }} />
                  <Typography color="white">Escaneando...</Typography>
                </Stack>
              ) : (
                <Stack alignItems="center" spacing={1}>
                  <CameraAltIcon sx={{ fontSize: 48, color: 'grey.500' }} />
                  <Typography color="grey.500">
                    Cámara no disponible en esta demo
                  </Typography>
                </Stack>
              )}
            </Box>

            <Button
              variant="contained"
              startIcon={<CameraAltIcon />}
              onClick={handleScan}
              disabled={isScanning}
              fullWidth
            >
              {isScanning ? 'Escaneando...' : 'Simular Escaneo'}
            </Button>

            <Divider>o ingresá el código manualmente</Divider>

            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                placeholder="Código de barras o SKU"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
              />
              <Button variant="outlined" onClick={handleManualSearch}>
                Buscar
              </Button>
            </Stack>

            {/* Resultado del escaneo */}
            {scanResult && (
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {scanResult.product ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <ErrorIcon color="warning" />
                      )}
                      <Typography variant="subtitle2" fontWeight={600}>
                        {scanResult.product ? 'Producto encontrado' : 'Código no registrado'}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" fontFamily="monospace">
                      Código: {scanResult.code}
                    </Typography>

                    {scanResult.product && (
                      <>
                        <Divider />
                        <Stack spacing={1}>
                          <Typography variant="body2">
                            <strong>Producto:</strong> {scanResult.product.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>SKU:</strong> {scanResult.product.sku}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Precio:</strong> ${scanResult.product.price.toLocaleString('es-AR')}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Stock:</strong> {scanResult.product.stock} unidades
                          </Typography>
                        </Stack>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(`/productos/${scanResult.product!.id}`)}
                        >
                          Ver Producto
                        </Button>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Dialog de Generar Códigos */}
      <Dialog open={showGenerateDialog} onClose={() => setShowGenerateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generar Códigos de Barras</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              Se generarán códigos EAN-13 para {selectedProducts.filter(id => !products.find(p => p.id === id)?.barcode).length} productos sin código de barras.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Los códigos generados siguen el formato EAN-13 con prefijo de Argentina (779).
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGenerateDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleGenerateSelected}>
            Generar Códigos
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Imprimir Etiquetas */}
      <Dialog open={showPrintDialog} onClose={() => setShowPrintDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <PrintIcon />
            <Typography variant="h6">Imprimir Etiquetas</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Configuración de Etiqueta
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Ancho (mm)"
                      value={labelConfig.width}
                      onChange={(e) => setLabelConfig(prev => ({ ...prev, width: parseInt(e.target.value) || 50 }))}
                      inputProps={{ min: 20, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Alto (mm)"
                      value={labelConfig.height}
                      onChange={(e) => setLabelConfig(prev => ({ ...prev, height: parseInt(e.target.value) || 30 }))}
                      inputProps={{ min: 15, max: 60 }}
                    />
                  </Grid>
                </Grid>

                <Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={labelConfig.showName}
                        onChange={(e) => setLabelConfig(prev => ({ ...prev, showName: e.target.checked }))}
                      />
                    }
                    label="Mostrar nombre del producto"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={labelConfig.showPrice}
                        onChange={(e) => setLabelConfig(prev => ({ ...prev, showPrice: e.target.checked }))}
                      />
                    }
                    label="Mostrar precio"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={labelConfig.showSku}
                        onChange={(e) => setLabelConfig(prev => ({ ...prev, showSku: e.target.checked }))}
                      />
                    }
                    label="Mostrar SKU"
                  />
                </Stack>

                <TextField
                  type="number"
                  label="Copias por producto"
                  value={labelConfig.copies}
                  onChange={(e) => setLabelConfig(prev => ({ ...prev, copies: Math.max(1, parseInt(e.target.value) || 1) }))}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Vista Previa
                </Typography>

                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 150,
                  }}
                >
                  <Box
                    sx={{
                      width: labelConfig.width * 2,
                      minHeight: labelConfig.height * 2,
                      border: '1px solid black',
                      bgcolor: 'white',
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {labelConfig.showName && (
                      <Typography variant="caption" fontWeight={600} noWrap sx={{ maxWidth: '100%' }}>
                        Producto Demo
                      </Typography>
                    )}
                    {renderBarcode('7790001234567')}
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {labelConfig.showSku && (
                        <Typography variant="caption">SKU-001</Typography>
                      )}
                      {labelConfig.showPrice && (
                        <Typography variant="caption" fontWeight={600}>$45,000</Typography>
                      )}
                    </Stack>
                  </Box>
                </Box>

                <Alert severity="info">
                  Se imprimirán {selectedProducts.length * labelConfig.copies} etiquetas en total.
                </Alert>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrintDialog(false)}>Cancelar</Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportPDF}
          >
            Exportar PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrintLabels}
          >
            Imprimir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default BarcodesPage;
