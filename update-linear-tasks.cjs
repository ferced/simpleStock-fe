#!/usr/bin/env node

/**
 * 🚀 LINEAR TASK UPDATER - AUTOMATED SPECIFICATION SYNC
 *
 * Script creativo para actualizar todas las tareas de Linear
 * con especificaciones técnicas detalladas y coherentes.
 */

const { execSync } = require('child_process');

// Configuración
const ALREADY_UPDATED = ['SIM-49', 'SIM-52', 'SIM-55', 'SIM-59', 'SIM-60', 'SIM-61', 'SIM-64', 'SIM-71', 'SIM-80'];
const DELAY_MS = 1500;

// Definiciones de tareas y sus especificaciones
const SPECS = {
  // ==================== PRODUCTOS ====================
  'SIM-50': `Ver TASK-SPECIFICATIONS.md líneas 415-525 para detalles completos.

## Resumen Ejecutivo
Página de edición de productos con formulario pre-poblado, validación de cambios de precio y ajuste de stock.

## Stack: React 18 + TypeScript + MUI 5
## Prioridad: 🔴 URGENTE - Fase 1
## Estimación: 3-4 días`,

  'SIM-51': `Consultar TASK-SPECIFICATIONS.md para especificaciones completas.

## Resumen
Detalle completo de producto con tabs (Info | Historial Stock | Historial Precios | Proveedores), gráficos y acciones.

## Interfaces Clave
- ProductDetail (extends Product con historial)
- PriceChange (cambios de precio)

## Stack: MUI Tabs + Recharts
## Prioridad: 🔴 ALTA - Fase 1
## Estimación: 3-4 días`,

  'SIM-53': `Referencia completa: TASK-SPECIFICATIONS.md

## Mejoras Principales
- Paginación (10/20/50 items)
- Filtros: categoría, precio, stock, proveedor
- Vista switcheable: tabla/grid
- Ordenamiento por columnas
- Exportar CSV/Excel
- Acciones rápidas

## Stack: MUI + xlsx
## Prioridad: 🔴 ALTA - Fase 1
## Estimación: 2-3 días`,

  'SIM-84': `## Sistema de Códigos de Barras
Generación, escaneo e impresión de etiquetas.

## Tipos Soportados
- EAN13, UPC, CODE128, CODE39

## Features
- Generar códigos únicos
- Escanear con input o cámara
- Imprimir etiquetas (PDF)
- Búsqueda por código

## Librerías: jsbarcode + jsPDF
## Prioridad: 🟢 BAJA - Fase 4
## Estimación: 3-4 días`,

  // ==================== INVENTARIO ====================
  'SIM-54': `## Vista General Mejorada
KPIs, gráficos de distribución, valorización y alertas.

## KPIs
- Total SKUs/Items/Valor
- Stock Bajo/Sin Stock
- Rotación y Días de Inventario

## Gráficos
- Pie Chart: Distribución por categoría
- Tabla: Stock por ubicación
- Valorización detallada

## Stack: MUI + Recharts + jsPDF
## Prioridad: 🔴 ALTA - Fase 1
## Estimación: 3-4 días`,

  'SIM-56': `## Salidas de Stock
Registro de salidas con validación de disponibilidad.

## Tipos de Salida
- Venta (vincula con factura)
- Ajuste
- Daño (notas requeridas)
- Pérdida (notas requeridas)

## Validación Crítica
quantity <= stock disponible en ubicación

## Stack: MUI + dayjs
## Prioridad: 🔴 URGENTE - Fase 1
## Estimación: 3-4 días`,

  'SIM-57': `## Transferencias Entre Ubicaciones
Sistema de transferencias con movimientos duales automáticos.

## Comportamiento
- Crear 2 movimientos: salida origen + entrada destino
- Actualizar stock en ambas ubicaciones
- Validar origen ≠ destino

## Historial
- Tabla de transferencias
- Filtros múltiples

## Stack: MUI
## Prioridad: 🔴 ALTA - Fase 1
## Estimación: 2-3 días`,

  'SIM-85': `## Conteo Físico de Inventario
Sistema completo con detección de discrepancias y ajustes automáticos.

## Flujo
1. Seleccionar ubicación
2. Cargar productos con stock sistema
3. Ingresar cantidades contadas
4. Calcular diferencias
5. Generar ajustes automáticos

## Reportes
- PDF con discrepancias
- Highlight de diferencias > 10%

## Stack: MUI + jsPDF
## Prioridad: 🟡 MEDIA - Fase 4
## Estimación: 3-4 días`,

  'SIM-86': `## Conteo Cíclico
Basado en SIM-85 pero con programación y priorización.

## Diferencias vs SIM-85
- Productos específicos (no todos)
- Programación recurrente
- Priorización por valor/rotación
- Calendar view

## Stack: Comparte componentes con SIM-85 + react-calendar
## Prioridad: 🟢 BAJA - Fase 4
## Estimación: 2-3 días`,

  // ==================== FACTURACIÓN ====================
  'SIM-58': `## Mejorar Lista de Facturas
Filtros avanzados, paginación, búsqueda y exportación.

## Mejoras Clave
- Filtros: estado, fechas, cliente, montos
- Búsqueda por número/cliente
- Acciones batch
- KPIs en header
- Exportar CSV/Excel

## Stack: MUI + xlsx
## Prioridad: 🔴 ALTA - Fase 1
## Estimación: 2-3 días`,

  'SIM-62': `## Notas de Crédito
Sistema de NC vinculadas a facturas con validaciones.

## Validaciones
- amount <= total factura
- Solo facturas paid/sent
- Razón requerida

## Comportamiento
- Reducir saldo de factura
- Generar número único (NC-XXXX)
- Exportar PDF profesional

## Integración con SIM-60 (Detalle Factura)

## Stack: MUI + jsPDF
## Prioridad: 🟠 MEDIA - Fase 2
## Estimación: 3-4 días`,

  // ==================== CLIENTES ====================
  'SIM-63': `## Mejorar Lista de Clientes
Similar a mejoras de SIM-53 y SIM-58.

## Mejoras
- Paginación
- Búsqueda: nombre, email, empresa
- Filtro: clientes con deuda
- Indicador: clientes con deuda vencida
- Ordenamiento por columnas
- Exportar CSV

## Acciones
- Ver detalle (SIM-65)
- Crear factura (SIM-59)
- Editar (SIM-64)
- Botón "Nuevo Cliente"

## Stack: MUI
## Prioridad: 🔴 ALTA - Fase 1
## Estimación: 2-3 días`,

  'SIM-65': `## Detalle de Cliente Completo
Vista 360° del cliente con tabs y estadísticas.

## Tabs
1. **Facturas**: Todas las facturas del cliente
2. **Transacciones**: Historial de pagos
3. **Estadísticas**: Productos top, gráfico de compras

## KPIs
- Total Comprado
- Ticket Promedio
- Última Compra
- Crédito Disponible

## Acciones
- Editar Cliente
- Nueva Factura (prellenar cliente)
- Ver Estado de Cuenta

## Stack: MUI + Recharts
## Prioridad: 🔴 ALTA - Fase 1
## Estimación: 4-5 días`,

  'SIM-66': `## Estado de Cuenta del Cliente
Reporte de antigüedad y saldo.

## Contenido
- Resumen de cuenta
- Facturas pendientes con antigüedad
- Reporte de antigüedad (0-30, 31-60, 61-90, >90 días)
- Historial de pagos

## Exportación
- PDF profesional
- Enviar por email

## Stack: MUI + jsPDF
## Prioridad: 🟡 MEDIA - Fase 2
## Estimación: 2-3 días`,

  // ==================== PROVEEDORES ====================
  'SIM-67': `## Mejorar Lista de Proveedores
Similar a listas de productos/clientes.

## Mejoras
- Paginación
- Búsqueda: nombre, email
- Columnas: Productos que provee, Última orden
- Ordenamiento
- Exportar CSV

## Acciones
- Ver detalle (SIM-69)
- Editar (SIM-68)
- Crear orden de compra (SIM-70)

## Stack: MUI
## Prioridad: 🟡 MEDIA - Fase 2
## Estimación: 2 días`,

  'SIM-68': `## Crear/Editar Proveedor
Formulario de proveedores.

## Campos
- Información básica: nombre, email, teléfono
- Información fiscal: taxId, dirección
- Comercial: términos de pago, website

## Validación
- Email único
- Formato de taxId

## Stack: MUI
## Prioridad: 🟠 MEDIA - Fase 2
## Estimación: 2-3 días`,

  'SIM-69': `## Detalle de Proveedor
Vista completa con tabs.

## Tabs
1. **Productos**: Productos que provee
2. **Órdenes**: Historial de órdenes de compra
3. **Estadísticas**: Total gastado, tasa de entrega

## KPIs
- Total Órdenes
- Total Gastado
- Tasa de Entrega a Tiempo

## Acciones
- Editar Proveedor
- Nueva Orden de Compra

## Stack: MUI
## Prioridad: 🟡 MEDIA - Fase 2
## Estimación: 3-4 días`,

  'SIM-70': `## Sistema de Órdenes de Compra
Workflow completo de órdenes.

## Flujo
1. Crear orden: seleccionar proveedor, productos, cantidades
2. Estados: draft → sent → confirmed → received → cancelled
3. Recibir mercancía: crea entradas de stock (SIM-55)
4. Comparar cantidades esperadas vs recibidas

## Features
- Lista con filtros por estado
- Aprobación (opcional)
- Generar PDF de orden

## Stack: MUI + jsPDF
## Prioridad: 🟠 MEDIA - Fase 2
## Estimación: 5-6 días`,

  // ==================== REPORTES ====================
  'SIM-72': `## Reportes de Inventario
Análisis completo del inventario.

## Reportes
- Stock actual por categoría/ubicación
- Productos con stock bajo
- Stock muerto (sin movimientos > 90 días)
- Valorización detallada
- Rotación de inventario

## Exportación: PDF/Excel

## Stack: MUI + Recharts + jsPDF + xlsx
## Prioridad: 🟡 MEDIA - Fase 2
## Estimación: 4-5 días`,

  'SIM-77': `## Reportes Financieros
KPIs financieros y análisis.

## Contenido
- Ingresos totales
- Gastos totales
- Ganancia neta
- Cuentas por cobrar/pagar
- Flujo de caja
- Gráficos de tendencias

## Stack: MUI + Recharts + jsPDF
## Prioridad: 🟡 MEDIA - Fase 3
## Estimación: 5-6 días`,

  'SIM-78': `## Dashboard Analítico
Dashboard avanzado con análisis predictivo.

## Features
- Análisis de tendencias (gráficos interactivos)
- Pronósticos de ventas
- KPIs comparados vs período anterior
- Alertas automáticas
- Recomendaciones

## Dependencias: SIM-71, 72, 77

## Stack: MUI + Recharts avanzado
## Prioridad: 🟡 MEDIA - Fase 3
## Estimación: 5-6 días`,

  // ==================== DASHBOARD ====================
  'SIM-73': `## Gráfico de Ventas Interactivo
Mejora al dashboard principal.

## Features
- Line Chart de ventas últimos 30 días
- Tooltips interactivos
- Comparación con período anterior
- Toggle: diario/semanal/mensual

## Integración: src/pages/dashboard/MainDashboard.tsx

## Stack: Recharts
## Prioridad: 🟡 MEDIA - Fase 3
## Estimación: 2-3 días`,

  'SIM-74': `## Widget Top Productos
Card en dashboard.

## Contenido
- Top 5 productos más vendidos
- Cantidad vendida + revenue
- Link a ProductDetailPage

## Stack: MUI Card
## Prioridad: 🟡 MEDIA - Fase 3
## Estimación: 1-2 días`,

  'SIM-75': `## Widget Facturas Pendientes
Card de alertas en dashboard.

## Contenido
- Facturas vencidas (overdue)
- Monto total pendiente
- Link a InvoiceListPage filtrado

## Stack: MUI Card
## Prioridad: 🟡 MEDIA - Fase 3
## Estimación: 1-2 días`,

  'SIM-76': `## Estadísticas Rápidas
Más widgets configurables.

## Widgets Adicionales
- Clientes nuevos este mes
- Productos sin stock
- Órdenes pendientes

## Feature: Usuario elige qué widgets ver

## Stack: MUI + localStorage para config
## Prioridad: 🟡 MEDIA - Fase 3
## Estimación: 2 días`,

  // ==================== ADMINISTRACIÓN ====================
  'SIM-79': `## Gestión de Usuarios
CRUD de usuarios del sistema.

## Features
- Lista con rol, estado, última conexión
- Crear: nombre, email, contraseña, rol
- Editar usuario
- Activar/desactivar
- Ver actividad

## Dependencia: SIM-80 (necesita roles)

## Stack: MUI
## Prioridad: 🟠 MEDIA - Fase 3
## Estimación: 3-4 días`,

  'SIM-81': `## Configuración del Sistema
Settings en tabs.

## Tabs
1. **Empresa**: nombre, taxId, dirección, logo
2. **Facturación**: prefijo, numeración, tasa impuesto, moneda
3. **Notificaciones**: config de emails, alertas

## Stack: MUI Tabs + TextField
## Prioridad: 🟡 MEDIA - Fase 3
## Estimación: 3-4 días`,

  'SIM-82': `## Respaldo y Restauración
Sistema de backups.

## Features
- Crear backup manual
- Lista de backups (fecha, tamaño)
- Descargar backup
- Restaurar (con confirmación)
- Programar backups automáticos

## Stack: MUI + backend APIs
## Prioridad: 🟡 MEDIA - Fase 3
## Estimación: 3-4 días`,

  'SIM-83': `## Log de Auditoría
Registro de todas las acciones del sistema.

## Contenido
- Usuario, acción, recurso, fecha, IP
- Filtros: usuario, acción, recurso, fechas
- Ver JSON diff de cambios
- Exportar logs
- Read-only (no editar/eliminar)

## Stack: MUI Table
## Prioridad: 🟢 BAJA - Fase 3
## Estimación: 2-3 días`,

  // ==================== AYUDA ====================
  'SIM-87': `## Guía de Usuario
Sección de ayuda con artículos.

## Features
- Artículos en markdown
- Búsqueda de artículos
- Categorías
- Screenshots

## Modificar: src/pages/help/HelpPage.tsx

## Stack: MUI + markdown parser
## Prioridad: 🟢 BAJA - Fase 4
## Estimación: 2-3 días`,

  'SIM-88': `## Tutoriales en Video
Sección de videos.

## Features
- Embed de YouTube/Vimeo
- Categorías de videos
- Búsqueda

## Stack: MUI + react-player
## Prioridad: 🟢 BAJA - Fase 4
## Estimación: 2-3 días`,

  'SIM-89': `## FAQ
Preguntas frecuentes.

## Features
- Accordion de preguntas/respuestas
- Búsqueda en FAQs
- Categorías

## Stack: MUI Accordion
## Prioridad: 🟢 BAJA - Fase 4
## Estimación: 1-2 días`,

  'SIM-90': `## Contactar Soporte
Formulario de contacto.

## Campos
- Nombre, email, asunto, mensaje
- Categoría de consulta
- Envío a email de soporte

## Stack: MUI + email service
## Prioridad: 🟢 BAJA - Fase 4
## Estimación: 1-2 días`,

  'SIM-91': `## Información del Sistema
Info y credits.

## Contenido
- Versión de la app
- Información de licencia
- Credits
- Release notes

## Stack: MUI
## Prioridad: 🟢 BAJA - Fase 4
## Estimación: 1 día`
};

// ============================================================================
// LÓGICA PRINCIPAL
// ============================================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateTask(taskId, description) {
  try {
    const escapedDesc = description.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const cmd = `linearctl issue update ${taskId} --description "${escapedDesc}"`;

    console.log(`\n🔄 Actualizando ${taskId}...`);
    execSync(cmd, { stdio: 'pipe' });
    console.log(`✅ ${taskId} actualizado`);
    return true;
  } catch (error) {
    console.error(`❌ Error actualizando ${taskId}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('\n🚀 LINEAR TASK UPDATER');
  console.log('======================================\n');

  const tasksToUpdate = Object.keys(SPECS).filter(id => !ALREADY_UPDATED.includes(id));

  console.log(`📋 Tareas a actualizar: ${tasksToUpdate.length}`);
  console.log(`⏭️  Tareas ya actualizadas: ${ALREADY_UPDATED.length}`);
  console.log(`⏱️  Tiempo estimado: ${Math.ceil(tasksToUpdate.length * DELAY_MS / 1000 / 60)} minutos\n`);
  console.log('Iniciando en 3 segundos...\n');

  await sleep(3000);

  let success = 0;
  let failed = 0;

  for (const [index, taskId] of tasksToUpdate.entries()) {
    const description = SPECS[taskId];
    console.log(`[${index + 1}/${tasksToUpdate.length}] `, '');

    const result = updateTask(taskId, description);
    if (result) {
      success++;
    } else {
      failed++;
    }

    // Delay entre requests
    if (index < tasksToUpdate.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\n======================================');
  console.log('🎉 ACTUALIZACIÓN COMPLETADA\n');
  console.log(`✅ Exitosas: ${success}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`📊 Total: ${success + failed}\n`);
  console.log('🔗 Ver en Linear: https://linear.app/simplestock/team/SIM\n');
}

// Ejecutar
main().catch(console.error);
