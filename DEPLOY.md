# Instrucciones para hacer Deploy en Vercel

Este documento explica cómo hacer deploy de Calypso Universe en Vercel de manera sencilla.

## Requisitos previos

1. Una cuenta en [Vercel](https://vercel.com)
2. El proyecto subido a un repositorio Git (GitHub, GitLab o Bitbucket)

## Pasos para hacer deploy

### 1. Preparación del proyecto

Asegúrate de que el proyecto está listo para deployment:

- El archivo `vercel.json` está en la raíz del proyecto
- Todas las dependencias están correctamente listadas en `package.json`
- El script de build está definido: `npm run build`

### 2. Conexión con Vercel

1. Inicia sesión en tu cuenta de Vercel
2. Haz clic en "Add New..." y selecciona "Project"
3. Importa tu repositorio Git:
   - Conecta tu cuenta GitHub/GitLab/Bitbucket si aún no lo has hecho
   - Selecciona el repositorio correspondiente a este proyecto

### 3. Configuración del proyecto

En la pantalla de configuración del proyecto:

1. **Framework Preset**: Asegúrate de que esté seleccionado "Vite" (debería detectarse automáticamente)
2. **Build Command**: Deja el valor predeterminado `npm run build`
3. **Output Directory**: Asegúrate de que sea `dist`
4. **Environment Variables**: No se requieren para este proyecto

### 4. Deploy

1. Haz clic en "Deploy"
2. Espera a que termine el proceso de build y despliegue
3. Una vez completado, Vercel proporcionará una URL para tu aplicación (por ejemplo, `calypso-universe.vercel.app`)

### 5. Configuración personalizada (opcional)

Una vez desplegado, puedes:

- Asignar un dominio personalizado en la sección "Domains"
- Configurar análisis en la sección "Analytics"
- Verificar los registros de build y despliegue en la sección "Deployments"

## Actualización del proyecto

Para actualizaciones futuras:

1. Realiza los cambios en tu código
2. Haz commit y push a tu repositorio
3. Vercel automáticamente detectará los cambios y desplegará la nueva versión

## Solución de problemas comunes

- **Error en el build**: Verifica los logs de build en Vercel para identificar el problema
- **Redirecciones no funcionan**: Asegúrate de que el archivo `vercel.json` está configurado correctamente
- **Assets no se cargan**: Verifica las rutas relativas en tu código
- **PWA no funciona**: Confirma que los archivos `manifest.json` y service worker están correctamente configurados 