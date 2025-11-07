# Linear MCP Server - Guía Completa

## 🎯 ¿Qué es MCP?

**Model Context Protocol (MCP)** es un protocolo estándar que permite que modelos de IA (como Claude) accedan a tus datos de Linear de forma segura y estructurada.

### Ventajas sobre el CLI:
- ✅ **Integración nativa**: Trabaja directamente en Claude sin comandos manuales
- ✅ **Más potente**: Acceso completo a la API de Linear
- ✅ **Conversacional**: Crea/modifica issues hablando naturalmente con Claude
- ✅ **Sin instalación local**: Servidor centralizado por Linear
- ✅ **Más rápido**: No hay latencia de CLI

## 🚀 Configuración Rápida

### Para Claude Code (Recomendado)

```bash
# Ejecuta el script de configuración
bash setup-linear-mcp.sh

# O manualmente:
claude mcp add --transport sse linear-server https://mcp.linear.app/sse
```

Luego en Claude Code, ejecuta `/mcp` para autenticarte.

### Para Claude Desktop

**macOS/Linux:**
Edita `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/sse"]
    }
  }
}
```

**Windows:**
Edita `%APPDATA%/Claude/claude_desktop_config.json` con el mismo contenido.

### Para Otros Editores

**Cursor, VSCode, Windsurf, Zed:**
- Command: `npx`
- Args: `-y mcp-remote https://mcp.linear.app/sse`

Consulta la documentación específica de tu editor.

## 💬 Cómo Usar MCP con Linear

Una vez configurado, puedes interactuar con Linear de forma natural en Claude:

### Ejemplos de Uso

**Crear issues:**
```
"Crea un issue en Linear para implementar autenticación con Google OAuth"
"Agrega una tarea de prioridad alta para arreglar el bug del login"
```

**Buscar issues:**
```
"Muéstrame todos los issues de facturación"
"¿Cuáles son las tareas pendientes de alta prioridad?"
"Busca issues relacionados con el inventario"
```

**Actualizar issues:**
```
"Marca SIM-15 como completado"
"Cambia la prioridad de SIM-20 a urgente"
"Asígnale SIM-30 a Juan"
```

**Trabajar con proyectos:**
```
"Lista todos los proyectos activos"
"Crea un proyecto llamado 'MVP Q1 2025'"
"¿Qué issues están en el proyecto de Dashboard?"
```

**Comentarios:**
```
"Agrega un comentario a SIM-25 diciendo que ya está en progreso"
"Muéstrame los comentarios recientes en SIM-40"
```

## 🛠️ Herramientas MCP Disponibles

El servidor MCP de Linear proporciona estas herramientas:

### Issues
- `create_issue` - Crear nuevos issues
- `update_issue` - Actualizar issues existentes
- `search_issues` - Buscar issues
- `get_issue` - Obtener detalles de un issue

### Proyectos
- `list_projects` - Listar proyectos
- `create_project` - Crear proyectos
- `update_project` - Actualizar proyectos

### Teams
- `list_teams` - Listar equipos
- `get_team` - Obtener info de un equipo

### Comentarios
- `create_comment` - Agregar comentarios
- `list_comments` - Ver comentarios

### Usuarios
- `list_users` - Listar usuarios del workspace

## 🔧 Configuración Avanzada

### Autenticación con API Key (Opcional)

Si prefieres usar tu API key directamente:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/sse"],
      "env": {
        "LINEAR_API_KEY": "tu_api_key_aqui"
      }
    }
  }
}
```

**Nota:** La autenticación OAuth es más segura y recomendada.

### Usar HTTP en lugar de SSE

Si tienes problemas con SSE:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

### WSL (Windows Subsystem for Linux)

Agrega `--transport sse-only` a los args:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/sse", "--transport", "sse-only"]
    }
  }
}
```

## 🐛 Troubleshooting

### Error de autenticación

Limpia el caché de autenticación:

```bash
rm -rf ~/.mcp-auth
```

Luego vuelve a autenticarte con `/mcp` en Claude.

### El servidor no responde

1. Verifica que tienes Node.js y npx instalados:
   ```bash
   node --version
   npx --version
   ```

2. Prueba la conexión al servidor:
   ```bash
   curl -I https://mcp.linear.app/sse
   ```

3. Verifica tu configuración:
   ```bash
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

### No aparecen las herramientas MCP

1. Reinicia completamente tu editor/app de Claude
2. Verifica que la configuración esté en el archivo correcto
3. Revisa los logs del editor para errores

### Permisos insuficientes

Asegúrate de que tu API key tiene los permisos necesarios:
- `read` - Para leer issues, proyectos, etc.
- `write` - Para crear y modificar issues

## 📊 Comparación: CLI vs MCP

| Característica | CLI (`linearctl`) | MCP Server |
|----------------|-------------------|------------|
| Instalación | Global npm package | Sin instalación local |
| Uso | Comandos manuales | Conversacional en Claude |
| Integración | Terminal | Nativa en Claude |
| Velocidad | Rápido | Muy rápido |
| Flexibilidad | Limitada a comandos | Completamente flexible |
| Scripting | Excelente | No aplica |
| UX | Técnica | Natural |

**Recomendación:**
- Usa **MCP** para trabajo diario con Claude
- Usa **CLI** para scripts automatizados y CI/CD

## 🎯 Workflows Recomendados

### Planificación de Sprint

```
"Lista todos los issues de prioridad 1 y 2 que no están asignados"
"Crea un proyecto llamado 'Sprint 12' y agrégale los issues SIM-15, SIM-16, SIM-17"
"Asígnale las tareas de facturación a María"
```

### Review de Progreso

```
"¿Cuántos issues se completaron esta semana?"
"Muéstrame los issues que están bloqueados"
"Lista las tareas en progreso del equipo de frontend"
```

### Creación Rápida de Tareas

```
"Basándote en el archivo ProductListPage.tsx, crea issues para:
1. Agregar paginación
2. Implementar filtros avanzados
3. Agregar exportación a CSV"
```

## 📚 Recursos

- **Docs oficiales**: https://linear.app/docs/mcp
- **API de Linear**: https://developers.linear.app/docs
- **MCP Specification**: https://modelcontextprotocol.io
- **Tu workspace**: https://linear.app/simplestock

## 🔐 Seguridad

- ✅ OAuth 2.1 con dynamic client registration
- ✅ Tokens nunca se almacenan en archivos de configuración
- ✅ Servidor centralizado y auditado por Linear
- ✅ Comunicación encriptada (HTTPS)
- ✅ Autenticación por workspace

## 🚀 Próximos Pasos

1. **Configura MCP**: Ejecuta `bash setup-linear-mcp.sh`
2. **Autentica**: Usa `/mcp` en Claude para conectarte a Linear
3. **Experimenta**: Prueba crear/buscar issues conversacionalmente
4. **Automatiza**: Integra en tu workflow diario

---

**💡 Tip Pro:** Combina MCP con el contexto del proyecto. Por ejemplo:

```
"Lee el archivo ROADMAP.md y crea issues en Linear para todas las tareas de la Fase 1 que falten"
```

Claude leerá el roadmap, identificará las tareas faltantes y las creará automáticamente en Linear. ✨
