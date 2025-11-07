# ⚡ Quick Start Guide - SimpleStock Implementation

Guía ultra-rápida para arrancar la implementación con IA.

---

## 🎯 TL;DR

```bash
# 1. Lee esto primero
cat AI-IMPLEMENTATION-STRATEGY.md

# 2. Usa estos prompts
cat PROMPT-TEMPLATES.md

# 3. Consulta especificaciones detalladas
cat TASK-SPECIFICATIONS.md

# 4. Trackea progreso
cat LINEAR-FINAL-REPORT.md
```

---

## 🚀 Arrancar en 3 Pasos

### Paso 1: Fase 0 (Setup) - 1 sesión

**Copia este prompt a la IA:**

```
Lee PROMPT-TEMPLATES.md y ejecuta el "Prompt Inicial: Fase 0 (Setup)"
```

**Resultado esperado:**
- `src/types/index.ts` con 138 interfaces
- `src/services/apiClient.ts` creado
- `src/contexts/AuthContext.tsx` creado
- `src/App.tsx` con rutas protegidas

**Validación:**
```bash
npm run build  # ✅ debe compilar
npm run dev    # ✅ debe arrancar
```

---

### Paso 2: Primera Feature (Categorías) - 1 sesión

**Copia este prompt a la IA:**

```
Lee PROMPT-TEMPLATES.md y ejecuta el "Prompt: Mini-Sprint 1 (Categorías)"
```

**Resultado esperado:**
- `src/services/categoryService.ts` creado
- `src/pages/products/CategoriesPage.tsx` creado
- CRUD completo funcionando

**Validación:**
```bash
npm run dev
# Ir a /productos/categorias
# Crear/Editar/Eliminar categoría ✅
```

---

### Paso 3: Continuar con el Plan

**Sigue el orden de `AI-IMPLEMENTATION-STRATEGY.md`:**

```
Mini-Sprint 2: Productos (SIM-49, 51, 50, 53)
Mini-Sprint 3: Clientes (SIM-64, 65, 63)
Mini-Sprint 4: Inventario (SIM-55, 56)
Mini-Sprint 5: Facturación (SIM-60, 59, 61)
```

---

## 📚 Documentación Clave

| Archivo | Qué Contiene | Cuándo Usarlo |
|---------|--------------|---------------|
| **AI-IMPLEMENTATION-STRATEGY.md** | Estrategia completa, mini-sprints, orden de implementación | Planificar qué hacer |
| **PROMPT-TEMPLATES.md** | Prompts listos para copiar-pegar | Al empezar cada tarea |
| **TASK-SPECIFICATIONS.md** | Especificaciones técnicas detalladas de las 43 tareas | Consulta de referencia |
| **LINEAR-FINAL-REPORT.md** | Resumen de tareas, estadísticas, estado | Ver progreso general |
| **QUICK-START-GUIDE.md** | Esta guía - arrancar rápido | Inicio del proyecto |

---

## 🎯 Orden Óptimo (MVP)

### Prioridad CRÍTICA (Hacer primero)

```
1. ✅ Fase 0: Setup
2. ✅ SIM-52: Categorías (bloquea productos)
3. → SIM-49: Crear Producto
4. → SIM-51: Detalle Producto
5. → SIM-50: Editar Producto
6. → SIM-53: Lista Productos mejorada
```

### Prioridad ALTA (Después)

```
7. → SIM-64: Crear/Editar Cliente
8. → SIM-65: Detalle Cliente
9. → SIM-63: Lista Clientes
10. → SIM-55: Entradas de Stock
11. → SIM-56: Salidas de Stock
```

### Prioridad URGENTE (Core MVP)

```
12. → SIM-60: Detalle Factura (hacer ANTES de crear)
13. → SIM-59: Crear Factura (wizard 5 pasos - COMPLEJO)
14. → SIM-61: Seguimiento de Pagos
```

**🎉 CHECKPOINT: MVP Completo**

---

## 💡 Reglas de Oro

### ✅ SÍ Hacer

1. **Una tarea a la vez** (máximo 3-5 archivos)
2. **Validar después de cada tarea** (build + test manual)
3. **Commit frecuente** (después de cada tarea)
4. **Seguir las especificaciones** al pie de la letra
5. **Mantener consistencia** con código existente
6. **Checkpoints cada 3-4 tareas**

### ❌ NO Hacer

1. **No optimizar prematuramente** (primero que funcione)
2. **No instalar librerías nuevas** sin validar necesidad
3. **No cambiar arquitectura** sin justificación
4. **No saltarse validaciones** de la especificación
5. **No continuar si algo falla** (arreglar primero)
6. **No tocar más de 5 archivos** por sesión

---

## 🔥 Prompt de Emergencia

Si algo salió mal y no sabes cómo arreglarlo:

```markdown
# HELP: Algo Salió Mal

## Error
[Pega el error completo]

## Qué Estaba Haciendo
Implementando [SIM-XX]: [nombre de tarea]

## Archivos que Toqué
- [archivo 1]
- [archivo 2]

## Último Estado Funcional
Commit: [hash del último commit que funcionaba]

## Por Favor
1. Analiza el error
2. Dame solución paso a paso
3. Explica QUÉ salió mal y POR QUÉ

## Contexto
- Frontend: SimpleStock (React + TypeScript + MUI)
- Especificación: TASK-SPECIFICATIONS.md
- Estrategia: AI-IMPLEMENTATION-STRATEGY.md
```

---

## 🎪 Comandos Útiles

### Desarrollo
```bash
# Arrancar dev server
npm run dev

# Build production
npm run build

# Type check
npm run type-check

# Preview build
npm run preview
```

### Git
```bash
# Ver cambios
git status
git diff

# Commit (sigue el formato)
git add .
git commit -m "feat(module): description (SIM-XX)"

# Ver historial
git log --oneline

# Volver atrás (si algo salió mal)
git reset --hard HEAD~1  # ⚠️ CUIDADO: borra cambios
```

### Linear
```bash
# Ver tareas
linearctl issue list --team SIM

# Ver detalle
linearctl issue get SIM-XX

# Actualizar estado
linearctl issue update SIM-XX --state "In Progress"
linearctl issue update SIM-XX --state "Done"
```

---

## 📊 Trackear Progreso

### Crea `PROGRESS.md` en la raíz:

```markdown
# Progreso SimpleStock

Última actualización: [fecha]

## Fase 0: Setup
- [x] Interfaces TypeScript ✅
- [x] API Client ✅
- [x] Auth Context ✅

## Mini-Sprint 1: Categorías
- [x] SIM-52 ✅ (commit: abc123)

## Mini-Sprint 2: Productos
- [x] SIM-49 ✅ (commit: def456)
- [x] SIM-51 ✅ (commit: ghi789)
- [ ] SIM-50 🚧 EN PROGRESO

## Estadísticas
- Completadas: 3/13 MVP (23%)
- En progreso: SIM-50
- Próxima: SIM-53

## Blockers
Ninguno

## Notas
- Categorías funcionando perfecto
- Productos: falta mejorar lista
```

---

## 🎯 Validación de Checkpoint

Cada 3-4 tareas, ejecuta este checklist:

```markdown
### Checkpoint [Número]

#### Funcional
- [ ] Flujo end-to-end funciona
- [ ] Todas las validaciones implementadas
- [ ] Loading states OK
- [ ] Mensajes de error/éxito OK

#### Técnico
- [ ] npm run build - compila ✅
- [ ] TypeScript sin errores ✅
- [ ] No console.errors ✅
- [ ] Commits descriptivos ✅

#### UX
- [ ] Sigue estilo MUI ✅
- [ ] Responsive ✅
- [ ] Consistente con otras páginas ✅

#### Documentación
- [ ] PROGRESS.md actualizado
- [ ] Tareas en Linear actualizadas

✅ TODO OK → Continuar
❌ ALGO FALLA → Arreglar antes de continuar
```

---

## 🔗 Links Importantes

### Proyecto
- **Linear Board**: https://linear.app/simplestock/team/SIM
- **Repo**: [tu repo]

### Documentación Interna
- **Especificaciones**: `./TASK-SPECIFICATIONS.md`
- **Estrategia**: `./AI-IMPLEMENTATION-STRATEGY.md`
- **Prompts**: `./PROMPT-TEMPLATES.md`
- **Reporte Final**: `./LINEAR-FINAL-REPORT.md`

### Código
- **Frontend**: `./src/`
- **Tipos**: `./src/types/index.ts`
- **Servicios**: `./src/services/`
- **Páginas**: `./src/pages/`

---

## 💬 Prompt Template Genérico

Para cualquier tarea no cubierta:

```markdown
# TAREA: [SIM-XX] - [Título]

## Contexto
SimpleStock - Sistema de inventario y facturación
Stack: React 18 + TypeScript + Material-UI 5

## Referencias
- Especificación: `TASK-SPECIFICATIONS.md` (buscar SIM-XX)
- Interfaces: `src/types/index.ts` (ya existen)

## Archivos a Crear/Modificar
[Listar según especificación]

## Criterios de Aceptación
[Copiar de TASK-SPECIFICATIONS.md]

## Validación
1. Compila sin errores
2. Test manual: [describir flujo]
3. Cumple criterios de aceptación

## Commit
```bash
git commit -m "feat(module): description (SIM-XX)"
```

¿Empezamos?
```

---

## 🎊 Última Verificación Antes de Empezar

### ✅ Tengo Todo Listo

- [ ] Node.js instalado (v18+)
- [ ] npm install ejecutado
- [ ] npm run dev funciona
- [ ] VSCode con TypeScript extension
- [ ] Git configurado
- [ ] Leí AI-IMPLEMENTATION-STRATEGY.md
- [ ] Tengo PROMPT-TEMPLATES.md a mano

### 🚀 Primera Sesión

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: TypeScript watch (opcional)
npm run type-check -- --watch
```

**Prompt a la IA:**
```
Vamos a implementar SimpleStock siguiendo AI-IMPLEMENTATION-STRATEGY.md

Empecemos con Fase 0 (Setup). Lee el prompt correspondiente en
PROMPT-TEMPLATES.md y ejecutémoslo paso a paso.

¿Listo?
```

---

## 📞 ¿Dudas?

### Consulta estos archivos según la situación:

| Situación | Archivo |
|-----------|---------|
| "¿Por dónde empiezo?" | **QUICK-START-GUIDE.md** (este) |
| "¿En qué orden hago las tareas?" | **AI-IMPLEMENTATION-STRATEGY.md** |
| "¿Qué prompt uso para X tarea?" | **PROMPT-TEMPLATES.md** |
| "¿Cuáles son los detalles de SIM-XX?" | **TASK-SPECIFICATIONS.md** |
| "¿Cuántas tareas faltan?" | **LINEAR-FINAL-REPORT.md** |
| "¿Qué hice la última vez?" | **PROGRESS.md** (créalo tú) |

---

**🎉 Listo! Ahora sí, ¡a implementar!** 🚀

**Primera sesión:** Fase 0 (Setup) - 2-3 horas
**Segunda sesión:** SIM-52 (Categorías) - 1-2 horas
**Tercera sesión:** SIM-49 (Crear Producto) - 2-3 horas

**Meta del primer día:** Fase 0 + Categorías funcionando ✅

---

**Fecha**: 2025-10-27
**Versión**: 1.0
**Status**: 🟢 Ready to Start
