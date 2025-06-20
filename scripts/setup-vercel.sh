#!/bin/bash

# Script de configuración para Vercel Deployment
# Uso: ./scripts/setup-vercel.sh

set -e

echo "🚀 Configurando despliegue a Vercel..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel@latest
fi

# Verificar configuración de Git
if [ ! -d ".git" ]; then
    echo "❌ Error: No se encontró repositorio Git. Inicializa Git primero."
    exit 1
fi

echo "✅ Verificaciones básicas completadas"

# Configurar Vercel (si no está configurado)
if [ ! -f ".vercel/project.json" ]; then
    echo "🔧 Configurando proyecto en Vercel..."
    vercel --yes
else
    echo "✅ Proyecto ya configurado en Vercel"
fi

# Verificar que los workflows estén en su lugar
if [ ! -f ".github/workflows/deploy-vercel-enhanced.yml" ]; then
    echo "❌ Error: No se encontró el workflow de GitHub Actions."
    echo "Asegúrate de que los archivos .github/workflows/ estén en su lugar."
    exit 1
fi

echo "📋 Próximos pasos:"
echo ""
echo "1. Configura los secrets en GitHub:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID" 
echo "   - VERCEL_PROJECT_ID"
echo ""
echo "2. Obtén las credenciales de Vercel:"
echo "   - Ve a https://vercel.com/dashboard"
echo "   - Settings → Tokens (para VERCEL_TOKEN)"
echo "   - Project Settings → General (para IDs)"
echo ""
echo "3. Configura environments en GitHub:"
echo "   - Settings → Environments"
echo "   - Crea 'preview' y 'production'"
echo ""
echo "4. Haz push de los cambios:"
echo "   git add ."
echo "   git commit -m 'Add Vercel deployment workflows'"
echo "   git push"
echo ""
echo "🎉 ¡Configuración completada! El workflow se activará en el próximo push."

# Mostrar información del proyecto actual
echo ""
echo "📊 Información del proyecto:"
echo "Nombre: $(node -p "require('./package.json').name")"
echo "Versión: $(node -p "require('./package.json').version")"
echo "Framework: Next.js" 