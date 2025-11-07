# Linear - Ejemplos Prácticos para SimpleStock

Este documento contiene ejemplos reales de cómo usar Linear (MCP y CLI) en el contexto del proyecto SimpleStock.

## 🎯 Escenarios Comunes

### 1. Planificación de Sprint

**Con MCP en Claude:**

```
"Muéstrame todos los issues de la Fase 1 que están sin asignar y tienen
prioridad alta. Luego agrúpalos por módulo (Productos, Inventario, etc.)"

"Crea un proyecto llamado 'Sprint 1 - MVP Core' y agrégale todos los
issues de Facturación con prioridad 1"

"¿Cuál es la distribución de tareas por prioridad en el backlog?"
```

**Con CLI:**

```bash
# Listar issues sin asignar de alta prioridad
linearctl issue list --team SIM --priority 2 | grep "Unassigned"

# Crear proyecto de sprint
linearctl project create --team SIM \
  --name "Sprint 1 - MVP Core" \
  --description "Core business features - Fase 1"

# Ver distribución
linearctl issue list --team SIM | awk '{print $4}' | sort | uniq -c
```

---

### 2. Crear Issues desde Código

**Con MCP en Claude:**

```
"Analiza el archivo src/pages/products/ProductListPage.tsx y crea issues para:
1. Implementar paginación
2. Agregar filtros por categoría y precio
3. Implementar vista grid/lista switcheable
4. Agregar exportación a Excel

Todos con label 'productos' y prioridad 2"
```

**Con CLI:**

```bash
# Crear múltiples issues relacionados
linearctl issue create --team SIM \
  --title "[ProductList] Implementar paginación" \
  --description "Agregar paginación con controls en el footer de la tabla" \
  --priority 2 \
  --labels "productos,enhancement"

linearctl issue create --team SIM \
  --title "[ProductList] Filtros avanzados por categoría y precio" \
  --description "Implementar filtros en el header:
- Dropdown de categorías
- Range slider de precios
- Reset filters button" \
  --priority 2 \
  --labels "productos,enhancement"
```

---

### 3. Gestión de Bugs

**Con MCP en Claude:**

```
"Encontré un bug: cuando creo una factura sin seleccionar cliente,
la app crashea. Crea un issue de tipo bug con prioridad urgente,
asígnalo al equipo de frontend y etiquétalo como 'facturación' y 'blocker'"

"Lista todos los bugs activos ordenados por prioridad"
```

**Con CLI:**

```bash
# Crear bug crítico
linearctl issue create --team SIM \
  --title "[BUG] App crashea al crear factura sin cliente" \
  --description "## Pasos para reproducir:
1. Ir a /facturacion/crear
2. Agregar productos al carrito
3. Click en 'Generar factura' sin seleccionar cliente
4. App crashea con error en console

## Error:
\`Cannot read property 'id' of undefined\`

## Archivo afectado:
src/pages/invoicing/CreateInvoicePage.tsx:145

## Solución propuesta:
Agregar validación antes de generar factura" \
  --priority 1 \
  --labels "bug,facturación,blocker"

# Listar bugs activos
linearctl issue list --team SIM --labels "bug" --state active
```

---

### 4. Review de Progreso

**Con MCP en Claude:**

```
"Dame un resumen del progreso del proyecto:
- Total de issues
- Issues completados vs pendientes
- Issues por prioridad
- Issues bloqueados
- Próximas tareas críticas (prioridad 1 y 2)"

"¿Qué módulo tiene más issues pendientes?"

"Muéstrame los issues que llevan más de 1 semana sin actividad"
```

**Con CLI:**

```bash
# Total de issues
echo "Total issues:" $(linearctl issue list --team SIM | wc -l)

# Por estado
echo "Completados:" $(linearctl issue list --team SIM --state done | wc -l)
echo "En progreso:" $(linearctl issue list --team SIM --state started | wc -l)
echo "Pendientes:" $(linearctl issue list --team SIM --state backlog | wc -l)

# Por prioridad
echo "Urgentes (P1):" $(linearctl issue list --team SIM --priority 1 | wc -l)
echo "Altas (P2):" $(linearctl issue list --team SIM --priority 2 | wc -l)

# Issues por módulo
linearctl issue list --team SIM | grep -o '\[.*\]' | sort | uniq -c
```

---

### 5. Documentación Automática

**Con MCP en Claude:**

```
"Lee todos los archivos .tsx de src/pages/products/ y:
1. Documenta qué falta implementar en cada página
2. Crea issues en Linear para cada funcionalidad faltante
3. Etiquétalos apropiadamente con módulo y prioridad"

"Genera un roadmap en formato markdown basado en los issues
actuales del backlog, agrupados por fase y prioridad"
```

---

### 6. Asignación de Tareas

**Con MCP en Claude:**

```
"Asigna todas las tareas de 'Facturación' a María y las de
'Inventario' a Juan. Las de 'Productos' divídelas entre ambos"

"¿Quién tiene más tareas asignadas actualmente?"

"Reasigna las tareas de baja prioridad que están sin asignar
distribuyéndolas equitativamente entre el equipo"
```

**Con CLI:**

```bash
# Asignar issues específicos
linearctl issue update SIM-15 --assignee "maria@simplestock.com"
linearctl issue update SIM-16 --assignee "maria@simplestock.com"
linearctl issue update SIM-17 --assignee "maria@simplestock.com"

# Ver distribución de carga
linearctl issue list --team SIM --state active | \
  awk '{print $3}' | sort | uniq -c | sort -nr
```

---

### 7. Integración con Git

**Con MCP en Claude:**

```
"Cuando haga commit, quiero que me sugieras el issue de Linear relacionado
basándote en los archivos modificados. Por ejemplo, si edito
ProductListPage.tsx, sugiéreme el SIM-X correspondiente"
```

**Con CLI (Git hooks):**

```bash
# .git/hooks/prepare-commit-msg
#!/bin/bash

BRANCH=$(git branch --show-current)

# Si la rama tiene SIM-XXX, agregarlo al mensaje
if [[ $BRANCH =~ (SIM-[0-9]+) ]]; then
    ISSUE="${BASH_REMATCH[1]}"
    ISSUE_TITLE=$(linearctl issue get $ISSUE --format "{{.Title}}")

    # Agregar al mensaje de commit
    echo "" >> "$1"
    echo "Related to: $ISSUE - $ISSUE_TITLE" >> "$1"
fi
```

---

### 8. Métricas y KPIs

**Con MCP en Claude:**

```
"Calcula las siguientes métricas del proyecto:
- Velocity (issues completados por semana)
- Tiempo promedio de resolución
- Tasa de issues bloqueados
- Distribución de trabajo por módulo"

"Genera un reporte semanal con los issues completados,
en progreso y bloqueados"
```

**Con CLI:**

```bash
# Velocity - Issues completados en los últimos 7 días
linearctl issue list --team SIM --state done | \
  awk -v date="$(date -d '7 days ago' +%Y-%m-%d)" \
  '$NF > date {count++} END {print "Velocity: " count " issues/week"}'

# Issues por módulo
echo "Issues por módulo:"
linearctl issue list --team SIM | \
  grep -o '\[[^]]*\]' | \
  sed 's/\[//;s/\]//' | \
  sort | uniq -c | sort -rn
```

---

### 9. Templates de Issues

**Con MCP en Claude:**

```
"Crea un issue de tipo 'Feature' para implementar autenticación con Google.
Usa el siguiente template:

## Descripción
[Descripción de la feature]

## Criterios de Aceptación
- [ ] Usuario puede hacer login con Google
- [ ] Se guarda token en localStorage
- [ ] Se redirige al dashboard después de login exitoso

## Consideraciones Técnicas
- Usar Firebase Auth
- Implementar error handling
- Agregar tests

## Prioridad: Alta
## Estimación: 5 story points"
```

**Con CLI:**

```bash
# Usar heredoc para descripción compleja
linearctl issue create --team SIM \
  --title "[Auth] Implementar login con Google OAuth" \
  --description "$(cat <<'EOF'
## Descripción
Implementar autenticación con Google usando Firebase Auth

## Criterios de Aceptación
- [ ] Usuario puede hacer login con Google
- [ ] Se guarda token en localStorage
- [ ] Se redirige al dashboard después de login exitoso
- [ ] Manejo de errores apropiado
- [ ] Tests unitarios e integración

## Stack Técnico
- Firebase Authentication
- React Context para auth state
- Protected routes

## Estimación
5 story points (1 semana)
EOF
)" \
  --priority 2 \
  --labels "auth,feature,frontend"
```

---

### 10. Automatización con Scripts

**Script para crear issues desde TODOs en código:**

```bash
#!/bin/bash
# create-issues-from-todos.sh

# Buscar todos los TODOs en el código
grep -rn "TODO:" src/ --include="*.tsx" --include="*.ts" | while IFS=: read -r file line text; do
    # Extraer el texto del TODO
    todo=$(echo "$text" | sed 's/.*TODO: //')

    # Crear issue en Linear
    linearctl issue create --team SIM \
      --title "[TODO] $todo" \
      --description "Encontrado en: $file:$line

$text

Archivo: \`$file\`
Línea: $line" \
      --priority 3 \
      --labels "tech-debt,todo"

    echo "✓ Created issue for: $todo"
done
```

**Script de backup de issues:**

```bash
#!/bin/bash
# backup-linear-issues.sh

BACKUP_DIR="linear-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Exportar todos los issues
linearctl issue list --team SIM --format json > \
  "$BACKUP_DIR/issues_$TIMESTAMP.json"

echo "✓ Backup guardado en: $BACKUP_DIR/issues_$TIMESTAMP.json"
```

---

## 🎯 Best Practices

1. **Nomenclatura consistente**
   - Siempre usar prefijo con módulo: `[Productos]`, `[Facturación]`, etc.
   - Tipos de issues: `[BUG]`, `[FEATURE]`, `[ENHANCEMENT]`, `[TODO]`

2. **Prioridades claras**
   - P1: Bloqueantes o críticas para MVP
   - P2: Importantes para la funcionalidad core
   - P3: Nice to have pero no bloqueante
   - P4: Backlog futuro

3. **Labels descriptivos**
   - Por módulo: `productos`, `inventario`, `facturación`
   - Por tipo: `bug`, `feature`, `enhancement`, `tech-debt`
   - Por estado: `blocker`, `needs-review`, `ready-for-qa`

4. **Descripciones completas**
   - Siempre incluir contexto
   - Criterios de aceptación claros
   - Referencias a código si aplica

5. **Actualizar regularmente**
   - Marcar como completado apenas se termine
   - Comentar progreso o blockers
   - Mantener estimaciones actualizadas

---

## 💡 Pro Tips

### Combinar MCP con análisis de código

```
"Lee todos los archivos de src/pages/auth/ y compáralos con las tareas
en Linear etiquetadas con 'auth'. Dime qué está implementado y qué falta"
```

### Generar documentación desde issues

```
"Genera un README.md de arquitectura basándote en todos los issues
de 'productos' completados, explicando cómo está estructurado el módulo"
```

### Detección de regresiones

```
"Revisa los últimos commits y compáralos con issues marcados como
completados. ¿Hay alguna funcionalidad que se haya roto?"
```

---

**Para más información:**
- [LINEAR-MCP.md](./LINEAR-MCP.md) - Guía del servidor MCP
- [LINEAR-CLI.md](./LINEAR-CLI.md) - Guía del CLI
- [README-LINEAR.md](./README-LINEAR.md) - Documentación principal
