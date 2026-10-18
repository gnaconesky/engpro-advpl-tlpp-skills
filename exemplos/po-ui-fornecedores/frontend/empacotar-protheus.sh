#!/bin/sh
# Gera fornecedores.app para compilar no RPO (macOS/Linux).
# Uso: sh empacotar-protheus.sh   (na raiz do projeto Angular)
#
# O .app e um zip cuja raiz e uma pasta com o nome do app (fornecedores/).
# O FwCallApp extrai essa pasta em http-root/app-root e a renomeia para
# fornecedores_env_<environment>.
set -e
APP=fornecedores
npx ng build --base-href ./
rm -rf dist/pacote "$APP.app"
mkdir -p dist/pacote
cp -R dist/fornecedores-app/browser "dist/pacote/$APP"
cd dist/pacote
# -X: sem atributos extras do macOS
zip -r -X "../../$APP.app" "$APP"
cd ../..
echo "Gerado: $(pwd)/$APP.app"
