#!/bin/sh
# Gera fornecedores.app para compilar no RPO (macOS/Linux).
# Uso: sh empacotar-protheus.sh   (na raiz do projeto Angular)
set -e
npx ng build --base-href ./
rm -f fornecedores.app
cd dist/fornecedores-app/browser
# -X sem atributos extras do macOS, -D sem entradas de diretorio (zip "limpo" para o Protheus)
zip -r -X -D ../../../fornecedores.app .
cd ../../..
echo "Gerado: $(pwd)/fornecedores.app"
