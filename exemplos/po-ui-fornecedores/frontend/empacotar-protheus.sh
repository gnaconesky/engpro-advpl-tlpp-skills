#!/bin/sh
# Gera fornecedores.app para compilar no RPO (macOS/Linux).
# Uso: sh empacotar-protheus.sh   (na raiz do projeto Angular)
set -e
npx ng build --base-href ./
rm -f fornecedores.app
cd dist/fornecedores-app/browser
zip -r ../../../fornecedores.app .
cd ../../..
echo "Gerado: $(pwd)/fornecedores.app"
