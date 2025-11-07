#!/bin/bash

echo "🚀 Creating Linear issues for SimpleStock Frontend..."
echo ""

# FASE 1 - CORE BUSINESS (MVP) - PRIORITY 2 & 1
echo "📦 FASE 1 - CORE BUSINESS (MVP)"
echo ""

# PRODUCTOS
echo "🏷️  Creating PRODUCTOS tasks..."

linearctl issue create --team SIM --title "[Productos] Crear página de Crear Producto" \
  --description "Implementar formulario completo para crear productos con:
- Info básica (nombre, código/SKU, categoría)
- Precios (costo, venta, mayorista)
- Impuestos (IVA, otros)
- Imágenes del producto
- Stock inicial
- Proveedores vinculados" \
  --priority 2

linearctl issue create --team SIM --title "[Productos] Crear página de Editar Producto" \
  --description "Implementar formulario de edición de productos con:
- Ajustar stock manualmente
- Modificar precios
- Vincular/desvincular proveedores
- Historial de cambios" \
  --priority 2

linearctl issue create --team SIM --title "[Productos] Crear página de Detalle de Producto" \
  --description "Vista completa del producto con:
- Historial de stock (tabla/gráfico temporal)
- Historial de precios
- Log de movimientos del producto
- Proveedores actuales
- Estadísticas de ventas" \
  --priority 2

linearctl issue create --team SIM --title "[Productos] Gestión de Categorías - CRUD completo" \
  --description "Implementar:
- Lista de categorías
- Crear/Editar/Eliminar categorías
- Asignar productos a categorías
- Árbol jerárquico de categorías" \
  --priority 2

linearctl issue create --team SIM --title "[Productos] Mejorar ProductListPage" \
  --description "Agregar:
- Vista Grid/Lista switcheable
- Búsqueda avanzada (múltiples campos)
- Filtros avanzados (stock bajo, sin stock, por proveedor, rango de precio)
- Exportar a Excel/CSV
- Acciones en batch" \
  --priority 2

# INVENTARIO
echo "📊 Creating INVENTARIO tasks..."

linearctl issue create --team SIM --title "[Inventario] Vista General de Stock mejorada" \
  --description "Implementar:
- Stock por categoría (tabla/gráfico)
- Stock por ubicación/sucursal
- Valorización total de inventario
- KPIs de rotación de stock" \
  --priority 2

linearctl issue create --team SIM --title "[Inventario] Registro de Entradas de Stock" \
  --description "Formularios para:
- Entrada por compra
- Entrada por ajuste manual
- Entrada por devolución de cliente" \
  --priority 2

linearctl issue create --team SIM --title "[Inventario] Registro de Salidas de Stock" \
  --description "Formularios para:
- Salida por venta
- Salida por ajuste manual
- Salida por daño/merma/pérdida" \
  --priority 2

linearctl issue create --team SIM --title "[Inventario] Sistema de Transferencias" \
  --description "Implementar:
- Formulario de transferencia entre ubicaciones
- Historial de transferencias
- Tracking de productos en tránsito" \
  --priority 3

# FACTURACIÓN - MÁXIMA PRIORIDAD
echo "💰 Creating FACTURACIÓN tasks..."

linearctl issue create --team SIM --title "[Facturación] Mejorar lista de facturas" \
  --description "Agregar:
- Filtros por estado (borrador, enviada, pagada, vencida)
- Búsqueda avanzada (por cliente, fecha, monto)
- Vista de timeline de facturación" \
  --priority 1

linearctl issue create --team SIM --title "[Facturación] Crear Factura - Flujo completo" \
  --description "Implementar wizard de 5 pasos:
1. Seleccionar cliente (con búsqueda)
2. Agregar productos (con stock disponible, cantidad, precio)
3. Aplicar descuentos (por item o total)
4. Términos de pago (contado, 30/60/90 días)
5. Generar factura final" \
  --priority 1

linearctl issue create --team SIM --title "[Facturación] Detalle de Factura completo" \
  --description "Implementar:
- Vista previa completa
- Exportar como Imagen (PNG/JPG)
- Exportar como PDF
- Imprimir factura
- Enviar por Email" \
  --priority 1

linearctl issue create --team SIM --title "[Facturación] Sistema de Seguimiento de Pagos" \
  --description "Implementar:
- Registrar pago total
- Registrar pagos parciales
- Historial de pagos por factura
- Dashboard de pagos pendientes
- Alertas de vencimiento" \
  --priority 1

linearctl issue create --team SIM --title "[Facturación] Notas de Crédito" \
  --description "Implementar:
- Crear nota de crédito (desde factura)
- Lista de notas de crédito
- Aplicar crédito a nuevas facturas" \
  --priority 2

# CLIENTES
echo "👥 Creating CLIENTES tasks..."

linearctl issue create --team SIM --title "[Clientes] Mejorar lista de clientes" \
  --description "Agregar:
- Búsqueda avanzada (nombre, email, empresa)
- Filtros (por balance, por estado de cuenta)
- Vista de tarjetas vs tabla" \
  --priority 2

linearctl issue create --team SIM --title "[Clientes] Crear/Editar Cliente - Formulario completo" \
  --description "Implementar:
- Información básica (nombre, ID fiscal)
- Info de contacto (email, teléfono, dirección)
- Info de facturación (razón social, CUIT/RUT)
- Límite de crédito configurable
- Términos de pago preferidos" \
  --priority 2

linearctl issue create --team SIM --title "[Clientes] Detalle de Cliente completo" \
  --description "Implementar vista con:
- Historial de transacciones
- Facturas del cliente
- Estado de cuenta (balance, pagos pendientes)
- Productos comprados frecuentes
- Estadísticas (total gastado, promedio, frecuencia)
- Gráficos de comportamiento" \
  --priority 2

linearctl issue create --team SIM --title "[Clientes] Estado de Cuenta" \
  --description "Implementar:
- Resumen de cuenta (saldo total, vencido, a vencer)
- Reporte de antigüedad de saldos (0-30, 31-60, 61-90, +90 días)
- Exportar a PDF
- Enviar por email" \
  --priority 2

echo ""
echo "📦 FASE 2 - OPERACIONES AVANZADAS"
echo ""

# PROVEEDORES
echo "🚚 Creating PROVEEDORES tasks..."

linearctl issue create --team SIM --title "[Proveedores] Mejorar lista de proveedores" \
  --description "Agregar:
- Búsqueda y filtros avanzados
- Rating/calificación de proveedores
- Vista mejorada" \
  --priority 3

linearctl issue create --team SIM --title "[Proveedores] Crear/Editar Proveedor" \
  --description "Implementar:
- Información del proveedor (datos fiscales)
- Productos que provee (catálogo)
- Términos comerciales (plazos, descuentos)
- Datos de contacto" \
  --priority 3

linearctl issue create --team SIM --title "[Proveedores] Detalle de Proveedor" \
  --description "Implementar:
- Historial de compras
- Catálogo de productos
- Órdenes de compra activas
- Historial de pagos
- KPIs (tiempo de entrega, cumplimiento)" \
  --priority 3

linearctl issue create --team SIM --title "[Proveedores] Sistema de Órdenes de Compra" \
  --description "Implementar:
- Crear orden de compra
- Lista de órdenes con estados
- Aprobación de órdenes
- Recepción de mercancía
- Actualización automática de inventario" \
  --priority 3

# REPORTES BÁSICOS
echo "📈 Creating REPORTES tasks..."

linearctl issue create --team SIM --title "[Reportes] Reportes de Ventas básicos" \
  --description "Implementar:
- Ventas diarias (gráfico + tabla)
- Ventas mensuales (comparativo)
- Ventas por producto (ranking)
- Ventas por cliente
- Ventas por categoría
- Exportar (PDF, Excel)" \
  --priority 3

linearctl issue create --team SIM --title "[Reportes] Reportes de Inventario" \
  --description "Implementar:
- Reporte de stock actual
- Productos con stock bajo
- Reporte de movimientos
- Valorización de inventario
- Stock muerto
- Rotación de inventario" \
  --priority 3

echo ""
echo "📦 FASE 3 - ANÁLISIS Y ADMINISTRACIÓN"
echo ""

# DASHBOARD AVANZADO
echo "📊 Creating DASHBOARD tasks..."

linearctl issue create --team SIM --title "[Dashboard] Gráfico de Ventas interactivo" \
  --description "Implementar gráfico de ventas con:
- Selector de período (día, semana, mes, año)
- Múltiples series (comparar períodos)
- Interactividad (zoom, tooltips)" \
  --priority 3

linearctl issue create --team SIM --title "[Dashboard] Top Productos Más Vendidos" \
  --description "Widget con:
- Ranking de productos
- Cantidad vendida y revenue
- Gráfico visual
- Link a detalle" \
  --priority 3

linearctl issue create --team SIM --title "[Dashboard] Widget de Facturas Pendientes" \
  --description "Implementar:
- Desglose por estado
- Monto total pendiente
- Alertas de vencimiento
- Acciones rápidas" \
  --priority 3

linearctl issue create --team SIM --title "[Dashboard] Estadísticas Rápidas adicionales" \
  --description "Agregar métricas:
- Ticket promedio
- Tasa de conversión
- ROI
- Días de inventario" \
  --priority 3

# REPORTES FINANCIEROS
echo "💵 Creating REPORTES FINANCIEROS tasks..."

linearctl issue create --team SIM --title "[Reportes] Reportes Financieros" \
  --description "Implementar:
- Reporte de ingresos
- Reporte de gastos
- Reporte de ganancias
- Flujo de caja
- Cuentas por cobrar
- Cuentas por pagar" \
  --priority 3

linearctl issue create --team SIM --title "[Reportes] Dashboard Analítico" \
  --description "Implementar:
- Análisis de tendencias
- Pronósticos (proyecciones)
- KPIs en tiempo real
- Métricas avanzadas" \
  --priority 3

# ADMINISTRACIÓN
echo "⚙️  Creating ADMINISTRACIÓN tasks..."

linearctl issue create --team SIM --title "[Admin] Gestión de Usuarios" \
  --description "Implementar:
- Lista de usuarios con roles
- Crear/Editar usuario
- Permisos granulares
- Actividad de usuarios (log)" \
  --priority 4

linearctl issue create --team SIM --title "[Admin] Gestión de Roles" \
  --description "Implementar:
- Lista de roles
- Crear rol personalizado
- Editar permisos por rol
- Permisos por módulo" \
  --priority 4

linearctl issue create --team SIM --title "[Admin] Configuración del Sistema" \
  --description "Implementar:
- Config. general (empresa, impuestos, moneda)
- Config. de facturación (plantilla, numeración)
- Config. de notificaciones (email, alertas)" \
  --priority 4

linearctl issue create --team SIM --title "[Admin] Respaldo y Restauración" \
  --description "Implementar:
- Crear respaldo manual
- Restaurar desde respaldo
- Programar respaldos automáticos
- Historial de respaldos" \
  --priority 4

linearctl issue create --team SIM --title "[Admin] Log de Auditoría" \
  --description "Implementar:
- Acciones de usuarios
- Eventos del sistema
- Log de seguridad
- Filtros y exportación" \
  --priority 4

echo ""
echo "📦 FASE 4 - OPTIMIZACIONES"
echo ""

# PRODUCTOS AVANZADO
echo "🔧 Creating PRODUCTOS AVANZADOS tasks..."

linearctl issue create --team SIM --title "[Productos] Gestión de Códigos de Barras" \
  --description "Implementar:
- Generar códigos de barras
- Escanear códigos (cámara/lector)
- Gestión de etiquetas imprimibles
- Exportar etiquetas en PDF" \
  --priority 3

# INVENTARIO AVANZADO
echo "📦 Creating INVENTARIO AVANZADO tasks..."

linearctl issue create --team SIM --title "[Inventario] Conteo de Inventario Físico" \
  --description "Implementar:
- Formulario para registrar conteos
- Comparación con sistema
- Ajustes automáticos
- Reporte de discrepancias" \
  --priority 3

linearctl issue create --team SIM --title "[Inventario] Conteo Cíclico" \
  --description "Implementar:
- Conteo por categorías/ubicaciones
- Programación de conteos
- Investigación de causas
- Historial de ajustes" \
  --priority 3

# AYUDA Y SOPORTE
echo "❓ Creating AYUDA tasks..."

linearctl issue create --team SIM --title "[Ayuda] Guía de Usuario" \
  --description "Implementar:
- Documentación interactiva
- Búsqueda en guía
- Categorización por módulos" \
  --priority 4

linearctl issue create --team SIM --title "[Ayuda] Tutoriales en Video" \
  --description "Implementar:
- Embeds de videos
- Playlist por módulo
- Player integrado" \
  --priority 4

linearctl issue create --team SIM --title "[Ayuda] FAQ - Preguntas Frecuentes" \
  --description "Implementar:
- Lista de FAQs
- Búsqueda en FAQs
- Categorías" \
  --priority 4

linearctl issue create --team SIM --title "[Ayuda] Contactar Soporte" \
  --description "Implementar:
- Formulario de contacto
- Categoría del problema
- Adjuntar capturas
- Sistema de tickets" \
  --priority 4

linearctl issue create --team SIM --title "[Ayuda] Información del Sistema" \
  --description "Implementar:
- Versión actual
- Changelog
- Estado de servicios
- Info técnica para debugging" \
  --priority 4

echo ""
echo "✅ All tasks created successfully!"
echo ""
echo "📋 Summary:"
echo "   - Fase 1 (Core Business): 19 tasks"
echo "   - Fase 2 (Operaciones Avanzadas): 8 tasks"
echo "   - Fase 3 (Análisis y Admin): 11 tasks"
echo "   - Fase 4 (Optimizaciones): 8 tasks"
echo "   - Total: 46 tasks"
echo ""
echo "🔗 View tasks at: https://linear.app/simplestock"
