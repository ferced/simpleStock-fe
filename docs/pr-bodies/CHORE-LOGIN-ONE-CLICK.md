### Qué se hizo

- Login de un clic: el botón "Ingresar" ahora llama a `useAuth().login()` y redirige al dashboard.
- Se usa el login mock del `AuthContext` (guarda `authToken` y `authUser`).

### Archivos clave

- `src/pages/auth/LoginPage.tsx`

### Notas

- No se cambiaron validaciones UI del formulario; funciona con cualquier input (mock).



