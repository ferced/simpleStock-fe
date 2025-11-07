# Linear Integration - SimpleStock Frontend

Este proyecto tiene integración completa con Linear para gestión de tareas.

## 🎯 Dos Formas de Trabajar con Linear

### 1. MCP Server (Recomendado para Claude) ⭐

**Uso conversacional directamente en Claude**

```bash
# Configuración rápida
bash setup-linear-mcp.sh

# Luego en Claude:
/mcp  # Autenticarse

# Ejemplos de uso:
"Crea un issue para implementar el dashboard de ventas"
"Muéstrame todos los issues de alta prioridad"
"Marca SIM-15 como completado"
```

📖 **Documentación completa**: [LINEAR-MCP.md](./LINEAR-MCP.md)

### 2. CLI Tool (Para scripts y automatización)

**Uso mediante comandos de terminal**

```bash
# Crear issue
linearctl issue create --team SIM --title "Mi tarea" --description "Descripción" --priority 2

# Listar issues
linearctl issue list --team SIM

# Ver detalle
linearctl issue get SIM-123
```

📖 **Documentación completa**: [LINEAR-CLI.md](./LINEAR-CLI.md)

## 🚀 Quick Start

### Opción A: MCP (Para usar con Claude)

1. Ejecuta el script de configuración:
   ```bash
   bash setup-linear-mcp.sh
   ```

2. Sigue las instrucciones para tu entorno (Claude Code, Claude Desktop, etc.)

3. Reinicia Claude y autentica con `/mcp`

4. ¡Listo! Ahora puedes trabajar con Linear conversacionalmente

### Opción B: CLI (Para terminal)

1. El CLI ya está instalado globalmente:
   ```bash
   linearctl --version
   ```

2. Si necesitas reinstalar:
   ```bash
   npm install -g linearctl
   linearctl init
   ```

3. Usa los comandos documentados en [LINEAR-CLI.md](./LINEAR-CLI.md)

## 📋 Tareas del Proyecto

El proyecto tiene **46 tareas** organizadas en 4 fases:

- **Fase 1 - Core Business (MVP)**: 19 tareas
  - Productos, Inventario, Facturación, Clientes

- **Fase 2 - Operaciones Avanzadas**: 8 tareas
  - Proveedores, Reportes básicos

- **Fase 3 - Análisis y Admin**: 11 tareas
  - Dashboard avanzado, Reportes financieros, Administración

- **Fase 4 - Optimizaciones**: 8 tareas
  - Códigos de barras, Conteos de inventario, Ayuda

🔗 **Ver todas las tareas**: https://linear.app/simplestock/team/SIM/active

## 🛠️ Scripts Disponibles

### `setup-linear-mcp.sh`
Configuración interactiva del servidor MCP de Linear para diferentes entornos.

```bash
bash setup-linear-mcp.sh
```

### `create-tasks.sh`
Script usado para crear las 46 tareas del proyecto (ya ejecutado).

**⚠️ Nota**: Ejecutar nuevamente creará tareas duplicadas.

## 📚 Documentación

- [LINEAR-MCP.md](./LINEAR-MCP.md) - Guía completa del servidor MCP
- [LINEAR-CLI.md](./LINEAR-CLI.md) - Guía completa del CLI
- [Documentación oficial de Linear](https://linear.app/docs)
- [API de Linear](https://developers.linear.app/docs)

## 🎯 ¿Cuándo usar qué?

| Escenario | Herramienta |
|-----------|-------------|
| Trabajando en Claude | **MCP** |
| Creando tareas rápidamente | **MCP** |
| Scripts de automatización | **CLI** |
| CI/CD pipelines | **CLI** |
| Integración con otros tools | **CLI** |
| Exploración conversacional | **MCP** |

## 💡 Tips Profesionales

### Con MCP en Claude:

```
# Contexto + Creación automática
"Lee el archivo src/pages/products/ProductListPage.tsx y crea issues
para mejorar el componente basándote en los TODOs y comentarios"

# Planificación de sprint
"Lista los 10 issues de mayor prioridad que no están asignados
y agrúpalos por módulo"

# Review de código + tareas
"Analiza los archivos de auth y crea issues para implementar
autenticación con OAuth y 2FA"
```

### Con CLI en scripts:

```bash
# Crear múltiples issues desde un archivo
while IFS= read -r task; do
  linearctl issue create --team SIM --title "$task" --priority 3
done < tasks.txt

# Listar y filtrar
linearctl issue list --team SIM --state active | grep -i "facturación"

# Automatizar updates
linearctl issue update SIM-123 --state "In Progress"
```

## 🔗 Links Útiles

- **Workspace**: https://linear.app/simplestock
- **Team Board**: https://linear.app/simplestock/team/SIM
- **Backlog**: https://linear.app/simplestock/team/SIM/backlog
- **Projects**: https://linear.app/simplestock/projects

## 🐛 Troubleshooting

### MCP no funciona
1. Verifica que Node.js y npx están instalados
2. Limpia caché: `rm -rf ~/.mcp-auth`
3. Reinicia Claude completamente
4. Re-autentica con `/mcp`

### CLI no funciona
1. Verifica instalación: `linearctl --version`
2. Reinstala: `npm install -g linearctl`
3. Reconfigura: `linearctl init`

### No puedo crear issues
- Verifica permisos de tu API key en Linear
- Asegúrate de estar autenticado correctamente
- Verifica que el team ID es correcto (SIM)

## 📞 Soporte

- Issues del proyecto: https://github.com/ferced/simpleStock-fe/issues
- Docs de Linear: https://linear.app/docs
- API Support: https://linear.app/support

---

**Última actualización**: Configuración completa con MCP + CLI
**Tareas totales**: 46 issues creados
**Team**: SIM (Simplestock)
