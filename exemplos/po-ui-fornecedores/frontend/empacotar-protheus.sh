#!/bin/sh
# Gera fornecedores.app para compilar no RPO (macOS/Linux).
# Uso: sh empacotar-protheus.sh [URL_DO_REST]
#   URL_DO_REST: endereco completo do REST que atende a API, visto pelo navegador
#                (padrao: http://127.0.0.1:4004/rest)
#
# O .app e um zip cuja raiz e uma pasta com o nome do app (fornecedores/).
# O FwCallApp extrai essa pasta em http-root/app-root e a renomeia para
# fornecedores_env_<environment>.
set -e
APP=fornecedores
API_URL="${1:-http://127.0.0.1:4004/rest}"

npx ng build --base-href ./
rm -rf dist/pacote "$APP.app"
mkdir -p dist/pacote
cp -R dist/fornecedores-app/browser "dist/pacote/$APP"

# Dentro do Protheus o app e servido pela porta do WebApp; o REST da API fica em
# outro endereco, entao o pacote usa a URL completa (no npm start continua "/rest").
CFG="dist/pacote/$APP/assets/data/appConfig.json"
sed "s#\"api_baseUrl\": *\"[^\"]*\"#\"api_baseUrl\": \"$API_URL\"#" "$CFG" > "$CFG.tmp"
mv "$CFG.tmp" "$CFG"
echo "api_baseUrl do pacote: $API_URL"

cd dist/pacote
# -X: sem atributos extras do macOS
zip -r -X "../../$APP.app" "$APP"
cd ../..
echo "Gerado: $(pwd)/$APP.app"
