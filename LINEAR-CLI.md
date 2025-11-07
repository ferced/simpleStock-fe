# Linear CLI - Guía de Uso para SimpleStock

## ✅ CLI Instalado: `linearctl`

El CLI oficial de Linear (`@linear/cli`) tiene problemas con Windows/Git Bash. En su lugar, se instaló **`linearctl`**, que es más robusto y funciona perfectamente en Windows.

## 🚀 Instalación

El CLI ya está instalado globalmente y configurado con tu API key:

```bash
npm install -g linearctl
```

## 🔑 Configuración

Ya está configurado con tu API key. Si necesitas reconfigurar:

```bash
linearctl init
```

## 📝 Comandos Principales

### Crear un issue
```bash
linearctl issue create \
  --team SIM \
  --title "Título del issue" \
  --description "Descripción detallada" \
  --priority 1
```

**Prioridades:**
- `1` = Urgente (🔴)
- `2` = Alta (🟠)
- `3` = Normal (🟡)
- `4` = Baja (🟢)

### Listar issues
```bash
# Todos los issues del team
linearctl issue list --team SIM

# Solo issues abiertos
linearctl issue list --team SIM --state active

# Issues por prioridad
linearctl issue list --team SIM --priority 1
```

### Ver detalle de un issue
```bash
linearctl issue get SIM-123
```

### Actualizar un issue
```bash
linearctl issue update SIM-123 \
  --title "Nuevo título" \
  --state "In Progress"
```

### Otros comandos útiles
```bash
# Ver todos los comandos
linearctl --help

# Ver ayuda de un comando específico
linearctl issue --help
linearctl issue create --help

# Ver equipos disponibles
linearctl team list

# Ver estados del workflow
linearctl status list --team SIM
```

## 📦 Tareas Creadas para SimpleStock

Se crearon **46 tareas** organizadas en 4 fases:

### Fase 1 - Core Business (MVP) - 19 tareas
- **Productos**: 5 tareas (crear, editar, detalle, categorías, mejoras)
- **Inventario**: 4 tareas (vista general, entradas, salidas, transferencias)
- **Facturación**: 5 tareas (lista, crear, detalle, pagos, notas de crédito) - **PRIORIDAD 1**
- **Clientes**: 4 tareas (lista, crear/editar, detalle, estado de cuenta)

### Fase 2 - Operaciones Avanzadas - 8 tareas
- **Proveedores**: 4 tareas (lista, crear/editar, detalle, órdenes de compra)
- **Reportes**: 2 tareas (ventas, inventario)

### Fase 3 - Análisis y Administración - 11 tareas
- **Dashboard**: 4 tareas (gráfico ventas, top productos, facturas pendientes, estadísticas)
- **Reportes Financieros**: 2 tareas (reportes financieros, dashboard analítico)
- **Administración**: 5 tareas (usuarios, roles, config sistema, respaldos, auditoría)

### Fase 4 - Optimizaciones - 8 tareas
- **Productos Avanzado**: 1 tarea (códigos de barras)
- **Inventario Avanzado**: 2 tareas (conteo físico, conteo cíclico)
- **Ayuda**: 5 tareas (guía, tutoriales, FAQ, soporte, info sistema)

## 🔗 Links Útiles

- **Ver todas las tareas**: https://linear.app/simplestock/team/SIM/active
- **Backlog completo**: https://linear.app/simplestock/team/SIM/backlog
- **Documentación de linearctl**: https://www.npmjs.com/package/linearctl
- **API de Linear**: https://developers.linear.app/docs

## 🎯 Alias Útiles (opcional)

Puedes agregar estos alias a tu `.bashrc` o `.zshrc`:

```bash
alias lc='linearctl'
alias lcl='linearctl issue list --team SIM'
alias lcc='linearctl issue create --team SIM'
```

Después de agregarlos, puedes usar:
```bash
lc issue list --team SIM  # en lugar de linearctl
lcl                        # listar issues
lcc --title "Mi tarea"     # crear issue
```

## 🐛 Troubleshooting

### El comando `linearctl` no funciona
```bash
# Verificar instalación
npm list -g linearctl

# Reinstalar si es necesario
npm uninstall -g linearctl
npm install -g linearctl
```

### Error de autenticación
```bash
# Reconfigurar API key
linearctl init
```

### Ver versión
```bash
linearctl --version
```

## 📄 Script de Creación de Tareas

El archivo `create-tasks.sh` contiene el script usado para crear todas las tareas. Puedes modificarlo para crear tareas adicionales.

Para ejecutarlo nuevamente:
```bash
bash create-tasks.sh
```

**Nota**: Esto creará tareas duplicadas. Usa con precaución.
