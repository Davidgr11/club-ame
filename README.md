# Club América - Gestión de Jugadores

Sistema web para gestionar la lista de jugadores del Club América.

## Características

- ✅ Vista pública de jugadores
- ✅ Panel de administración con edición en tiempo real
- ✅ Agregar, editar y eliminar jugadores
- ✅ Persistencia en JSONBin
- ✅ Interfaz responsive

## Estructura del Proyecto

```
├── index.html              # Vista pública
├── admin.html              # Panel de administración
├── build/scripts/app.js     # JavaScript para vista pública
├── netlify/functions/       # Funciones serverless
│   ├── get-jugadores.js     # Obtener jugadores
│   └── update-jugadores.js  # Actualizar jugadores
└── netlify.toml            # Configuración de Netlify
```

## Configuración Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Configurar variables de entorno en Netlify Dashboard:
   - `JSONBIN_BIN_ID`: ID del bin de JSONBin
   - `JSONBIN_API_KEY`: API key de JSONBin

3. Ejecutar localmente:
   ```bash
   npm run dev
   ```

## Despliegue

El proyecto está configurado para desplegarse automáticamente en Netlify.

### Variables de Entorno Requeridas

En el dashboard de Netlify, configurar:
- `JSONBIN_BIN_ID`
- `JSONBIN_API_KEY`

## Uso

### Vista Pública
- Acceder a `/` o `/index.html`
- Ver la lista de jugadores

### Panel de Administración
- Acceder a `/admin.html`
- Editar nombres y números directamente en los inputs
- Agregar nuevos jugadores
- Eliminar jugadores existentes
- Guardar cambios en la base de datos
#   c l u b - a m e  
 