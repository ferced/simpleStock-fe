### Qué se hizo

- Se movió la definición del sidebar a un archivo de configuración dedicado.
- Nuevo archivo `src/config/navigation.ts` con `enabled` por ítem y soporte para children.
- `src/constants/navigation.ts` ahora exporta los ítems filtrados desde el config (`getEnabledNavigation`).
- Sin cambios de UI visibles salvo que ahora es fácil ocultar/mostrar entradas sin tocar el componente.

### Cómo ocultar/mostrar

- Editar `src/config/navigation.ts` y cambiar `enabled: false/true` por ítem.

### Archivos clave

- `src/config/navigation.ts`
- `src/constants/navigation.ts`

### Notas

- No se modificó el tipo base `NavItem`; se usa un `NavItemConfig` extendido sólo para configuración.


