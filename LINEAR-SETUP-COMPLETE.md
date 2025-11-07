# ✅ Linear - Configuración Completa

## 🎉 Todo Listo para Usar Linear

La integración con Linear está completamente configurada con **dos métodos de trabajo**:

### 1️⃣ MCP Server (Recomendado) ⭐

**Para trabajar conversacionalmente con Claude**

```bash
# Configuración en 1 paso
bash setup-linear-mcp.sh
```

Luego en Claude: `/mcp` para autenticarte

### 2️⃣ CLI Tool

**Para scripts y automatización**

```bash
# Ya está instalado y configurado
linearctl issue list --team SIM
```

---

## 📚 Documentación Disponible

| Archivo | Descripción |
|---------|-------------|
| **README-LINEAR.md** | 📖 Documentación principal - Empieza aquí |
| **LINEAR-MCP.md** | 🔌 Guía completa del servidor MCP |
| **LINEAR-CLI.md** | 💻 Guía completa del CLI |
| **LINEAR-EXAMPLES.md** | 💡 Ejemplos prácticos y casos de uso |

---

## 🛠️ Scripts Listos para Usar

| Script | Uso |
|--------|-----|
| `setup-linear-mcp.sh` | Configuración interactiva de MCP |
| `create-tasks.sh` | Script de creación masiva de tareas |

---

## 📊 Estado del Proyecto

### Tareas Creadas: ✅ 46 issues

**Por Fase:**
- 🔴 **Fase 1 - Core Business**: 19 tareas (Productos, Inventario, Facturación, Clientes)
- 🟠 **Fase 2 - Operaciones**: 8 tareas (Proveedores, Reportes)
- 🟡 **Fase 3 - Análisis**: 11 tareas (Dashboard, Admin, Reportes Financieros)
- 🟢 **Fase 4 - Optimizaciones**: 8 tareas (Códigos de barras, Conteos, Ayuda)

**Por Prioridad:**
- P1 (Urgente): 4 tareas
- P2 (Alta): 15 tareas
- P3 (Normal): 18 tareas
- P4 (Baja): 9 tareas

**Issues creados**: `SIM-6` hasta `SIM-91` (46 tareas)

🗑️ **Issue de prueba a eliminar**: `SIM-5`

---

## 🔗 Links Importantes

- **🏠 Workspace**: https://linear.app/simplestock
- **📋 Board del Team**: https://linear.app/simplestock/team/SIM/active
- **📦 Backlog**: https://linear.app/simplestock/team/SIM/backlog
- **📊 Projects**: https://linear.app/simplestock/projects

---

## 🚀 Próximos Pasos

### Opción A: Usar MCP con Claude (Recomendado)

1. **Configura MCP**:
   ```bash
   bash setup-linear-mcp.sh
   ```

2. **Autentica en Claude**:
   ```
   /mcp
   ```

3. **Empieza a trabajar conversacionalmente**:
   ```
   "Muéstrame las tareas de alta prioridad"
   "Crea un issue para implementar el dashboard"
   "Marca SIM-15 como en progreso"
   ```

### Opción B: Usar CLI

1. **Verifica la instalación**:
   ```bash
   linearctl --version
   ```

2. **Lista las tareas**:
   ```bash
   linearctl issue list --team SIM
   ```

3. **Crea un issue**:
   ```bash
   linearctl issue create --team SIM \
     --title "Mi tarea" \
     --description "Descripción" \
     --priority 2
   ```

---

## 💡 Ejemplos Rápidos

### Con MCP (Conversacional)

```
"Dame un resumen del progreso del proyecto"
"Crea 3 issues para mejorar el componente de productos"
"¿Qué tareas están bloqueadas?"
"Asigna las tareas de facturación a María"
```

### Con CLI (Comandos)

```bash
# Ver tareas urgentes
linearctl issue list --team SIM --priority 1

# Crear issue
linearctl issue create --team SIM --title "Nueva tarea"

# Actualizar issue
linearctl issue update SIM-15 --state "In Progress"

# Ver detalle
linearctl issue get SIM-15
```

---

## 📖 Guías Detalladas

Para aprender más sobre cada herramienta, consulta:

1. **[README-LINEAR.md](./README-LINEAR.md)** - Empieza aquí para overview completo
2. **[LINEAR-MCP.md](./LINEAR-MCP.md)** - Todo sobre MCP (configuración, uso, troubleshooting)
3. **[LINEAR-CLI.md](./LINEAR-CLI.md)** - Todo sobre CLI (comandos, opciones, scripts)
4. **[LINEAR-EXAMPLES.md](./LINEAR-EXAMPLES.md)** - Casos de uso reales del proyecto

---

## ⚙️ Configuración Técnica

### MCP Server
- **Endpoint**: `https://mcp.linear.app/sse`
- **Transport**: Server-Sent Events (SSE)
- **Auth**: OAuth 2.1 con dynamic client registration
- **Config file**: `.mcp/linear-config.json`

### CLI Tool
- **Package**: `linearctl` v0.1.3
- **Global install**: ✅ Instalado
- **API Key**: ✅ Configurado
- **Team**: SIM (Simplestock)

---

## 🔐 Seguridad

### Archivos excluidos de Git:
- `.mcp-auth/` - Caché de autenticación MCP
- `.mcp/linear-config.json` - Config con API key
- `linear-backups/` - Backups locales de issues
- Scripts temporales de Node.js

### API Key Protection:
- ✅ No se commitea al repositorio
- ✅ Almacenada en variables de entorno
- ✅ Usada solo localmente

---

## 🐛 Troubleshooting

### MCP no funciona

1. Verifica Node.js: `node --version`
2. Limpia caché: `rm -rf ~/.mcp-auth`
3. Reinicia Claude completamente
4. Re-ejecuta: `bash setup-linear-mcp.sh`

### CLI no funciona

1. Verifica instalación: `linearctl --version`
2. Reinstala: `npm install -g linearctl`
3. Reconfigura: `linearctl init`

### No puedo crear issues

- Verifica permisos de API key en Linear
- Confirma team ID correcto (SIM)
- Revisa que estás autenticado

---

## 📞 Recursos de Ayuda

- **Docs de Linear**: https://linear.app/docs
- **Docs MCP**: https://linear.app/docs/mcp
- **API Linear**: https://developers.linear.app/docs
- **Issues del repo**: https://github.com/ferced/simpleStock-fe/issues

---

## ✨ Features Configuradas

- ✅ Servidor MCP de Linear
- ✅ CLI tool (linearctl)
- ✅ Scripts de configuración automatizados
- ✅ Documentación completa (4 guías)
- ✅ Ejemplos prácticos
- ✅ 46 tareas creadas en Linear
- ✅ Configuración de seguridad (.gitignore)
- ✅ Workflows automatizados

---

## 🎯 Workflows Recomendados

### Daily Workflow

1. **Mañana**: Revisa tareas del día
   ```
   "¿Qué tareas tengo asignadas para hoy?"
   ```

2. **Durante el día**: Actualiza progreso
   ```
   "Marca SIM-X como en progreso"
   "Agrega un comentario a SIM-Y explicando el blocker"
   ```

3. **Noche**: Review y planificación
   ```
   "¿Qué completé hoy? ¿Qué falta para mañana?"
   ```

### Sprint Planning

```
"Muéstrame todas las tareas de Fase 1 sin asignar"
"Crea un proyecto de Sprint y agrégale las 10 tareas prioritarias"
"Distribuye las tareas equitativamente entre el equipo"
```

### Code Review + Issues

```
"Revisa el último commit y crea issues para los TODOs encontrados"
"Analiza ProductListPage.tsx y sugiere mejoras como issues"
```

---

**🎉 Todo listo! Ahora puedes gestionar tus tareas de SimpleStock desde Linear de forma profesional.**

**Última actualización**: $(date)
**Version**: 1.0.0
**Status**: ✅ Production Ready
