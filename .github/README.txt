# GitHub Actions - Vercel Deployment

Este directorio contiene los workflows de GitHub Actions para el despliegue automático a Vercel.

## Workflows Disponibles

### 1. `deploy-vercel.yml` - Workflow Básico
Workflow simple para despliegue automático a Vercel.

**Triggers:**
- Push a `main` o `develop`
- Pull Requests a `main`

### 2. `deploy-vercel-enhanced.yml` - Workflow Avanzado (Recomendado)
Workflow mejorado con validaciones, testing y manejo de errores robusto.

**Características:**
- ✅ Validación de código (linting + type checking)
- ✅ Build testing antes del deploy
- ✅ Deploy separado para preview y producción
- ✅ Comentarios automáticos en PRs
- ✅ Deploy manual con selección de ambiente
- ✅ Manejo de errores mejorado

**Triggers:**
- Push a `main` o `develop`
- Pull Requests a `main`
- Deploy manual (workflow_dispatch)

## Configuración Requerida

### 1. Secrets de GitHub

Configura los siguientes secrets en tu repositorio de GitHub:

```
VERCEL_TOKEN=tu_token_de_vercel
VERCEL_ORG_ID=tu_org_id_de_vercel
VERCEL_PROJECT_ID=tu_project_id_de_vercel
```

### 2. Obtener Credenciales de Vercel

#### Vercel Token:
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Tokens
3. Create Token
4. Copia el token generado

#### Vercel Org ID y Project ID:
1. Ve a tu proyecto en Vercel
2. Settings → General
3. Copia los IDs mostrados

### 3. Configurar Environments en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Environments
3. Crea dos environments:
   - `preview` (para PRs)
   - `production` (para main branch)

## Uso

### Deploy Automático
- **Push a `main`**: Deploy automático a producción
- **Push a `develop`**: Deploy automático a preview
- **Pull Request**: Deploy automático a preview

### Deploy Manual
1. Ve a Actions en GitHub
2. Selecciona "Enhanced Deploy to Vercel"
3. Click "Run workflow"
4. Selecciona el ambiente (preview/production)
5. Click "Run workflow"

## Estructura del Workflow

```
validate → deploy-preview (PRs)
        → deploy-production (main branch)
```

### Jobs:
1. **validate**: Linting, type checking, build testing
2. **deploy-preview**: Deploy para preview/PRs
3. **deploy-production**: Deploy a producción

## Troubleshooting

### Error: "Vercel token not found"
- Verifica que el secret `VERCEL_TOKEN` esté configurado correctamente

### Error: "Build failed"
- Revisa los logs del job `validate`
- Asegúrate de que el código pase linting y type checking

### Error: "Deployment failed"
- Verifica que los IDs de Vercel sean correctos
- Asegúrate de que el proyecto esté configurado en Vercel

## Notas Importantes

- El workflow usa Node.js 18
- Las dependencias se cachean para builds más rápidos
- Los deploys de PRs son automáticos y se comentan en el PR
- Los deploys a producción requieren que el código esté en `main`
- Se incluye manejo de errores robusto siguiendo principios de clean architecture 
