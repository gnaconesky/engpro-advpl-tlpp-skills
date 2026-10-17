# Cadastro de Fornecedores (SA2) em PO-UI — passo a passo do zero

Este guia leva você de "nunca mexi com Angular" até uma tela PO-UI que lista,
inclui, altera e exclui fornecedores do Protheus.

```
 Navegador (Angular + PO-UI)  ──HTTP/JSON──►  AppServer REST  ──►  MATA020 (MVC)  ──►  SA2
   localhost:4200                              :4004/rest/custom/v1/fornecedores
```

- **Protheus**: uma API REST em TLPP (`protheus/fornecedores.api.tlpp`). As gravações
  passam pelo modelo MVC do **MATA020**, então valem as mesmas validações, gatilhos e
  pontos de entrada do cadastro padrão.
- **Front-end**: um app Angular com componentes PO-UI (`frontend/`), com login, lista
  com pesquisa e paginação e um formulário de inclusão e alteração.

> Versões usadas e testadas neste exemplo: **Node 22 LTS**, **Angular 19** e **PO-UI 19**.
> A versão do PO-UI tem que ser a mesma "major" do Angular (PO-UI 19 ↔ Angular 19).

---

## Parte 1 — Instalar as ferramentas (uma vez só)

1. **Node.js 22 LTS**: baixe em https://nodejs.org (instalador "LTS"). Ele já traz o `npm`.
   Depois, abra um terminal novo (Prompt de Comando ou PowerShell) e confira:
   ```bash
   node -v    # v22.x.x
   npm -v     # 10.x.x
   ```
2. **Angular CLI**, a ferramenta de linha de comando do Angular:
   ```bash
   npm install -g @angular/cli@19
   ng version
   ```
   Se o PowerShell bloquear a execução de scripts, rode uma vez
   `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
3. **VS Code** (recomendado): https://code.visualstudio.com. Instale também a extensão
   *Angular Language Service*.

---

## Parte 2 — Preparar o Protheus (back-end)

### 2.1 Compilar a API
1. Copie `protheus/fornecedores.api.tlpp` para a pasta de fontes do seu projeto.
2. Compile no RPO pelo VS Code com a extensão **TOTVS Developer Studio**, como qualquer fonte.
3. Em `fornecedores.api.tlpp` estão:
   - `listFornecedores`: `GET /custom/v1/fornecedores?page=1&pageSize=20&search=acme`
   - `getFornecedor`: `GET /custom/v1/fornecedores/:id`
   - `createFornecedor`: `POST /custom/v1/fornecedores`
   - `updateFornecedor`: `PUT /custom/v1/fornecedores/:id`
   - `deleteFornecedor`: `DELETE /custom/v1/fornecedores/:id`

   O `:id` é `A2_COD + A2_LOJA` com o tamanho do dicionário (ex.: `00000101`).

### 2.2 Ligar o servidor REST
> **Já tem um REST rodando** (ex.: na porta 4004, com outras APIs)? Use o mesmo e pule
> este passo. A API nova entra no mesmo servidor: basta compilar e reiniciar o AppServer.
> Só confira o prefixo da URL (chave `URL=` da seção de URI no `appserver.ini`, ex.: `/rest`).
> Se for diferente de `/rest`, troque-o em `environment.ts` e em `proxy.conf.json`.

1. Faça backup do `appserver.ini`.
2. Acrescente as seções de `protheus/appserver.ini.exemplo`, ajustando:
   - `Port`: porta livre (no exemplo, `8080`);
   - `ENVIRONMENT`: o nome do seu environment (ex.: `P12`).
3. **Reinicie o AppServer.** As rotas `@Get`/`@Post`/... são registradas na subida, então
   cada recompilação da API exige reiniciar.

### 2.3 Testar a API antes de fazer a tela
Teste sempre a API isolada primeiro. Se ela não funcionar, a tela também não vai funcionar.

```bash
# troque admin:123 por um usuario do Protheus e 99,01 por empresa,filial
curl -u admin:123 -H "tenantId: 99,01" "http://localhost:4004/rest/custom/v1/fornecedores?pageSize=5"
```
A resposta esperada é:
```json
{ "hasNext": true, "items": [ { "id": "00000101", "codigo": "000001", "loja": "01", "nome": "..." } ] }
```
Também dá para testar no Postman/Insomnia (Auth → *Basic Auth*, header `tenantId`).

---

## Parte 3 — Criar o projeto Angular com PO-UI

### 3.1 Gerar o projeto
Em uma pasta de trabalho (fora do RPO, ex.: `C:\projetos`):

```bash
ng new fornecedores-app --routing --style=css --ssr=false
cd fornecedores-app
```
Se perguntar sobre *analytics*, responda **N**.

### 3.2 Instalar o PO-UI
```bash
ng add @po-ui/ng-components@19
npm install @po-ui/ng-templates@19
npm install @totvs/protheus-lib-core@19 @totvs/po-theme@19 @totvs/common-assets subsink rxjs-compat
```
O `ng add` já instala o tema visual do PO-UI no `angular.json` e cria uma tela de exemplo,
que você vai substituir a seguir.

### 3.3 Copiar os arquivos deste exemplo
1. **Apague** os arquivos de exemplo gerados:
   `src/app/app.component.html`, `src/app/app.component.css` e `src/app/app.component.spec.ts`.
2. **Copie** todo o conteúdo da pasta `frontend/` deste exemplo para dentro de
   `fornecedores-app/`, substituindo o que já existir:

   Use o terminal (no Mac/Linux: `cp -R caminho/do/exemplo/frontend/. .`). O Finder do
   Mac e o Explorer, ao "substituir" a pasta `src`, apagam os arquivos que não vieram
   na cópia. Se isso acontecer, o `ng serve` reclama de `main.ts` e `styles.css`; este
   exemplo já traz esses arquivos para essa cópia não quebrar o projeto.

   ```
   fornecedores-app/
   ├── proxy.conf.json                       ← repassa /rest para o AppServer
   └── src/
       ├── environments/environment.ts       ← URL da API e tenantId
       └── app/
           ├── app.config.ts                 ← HttpClient, interceptors, PO-UI
           ├── app.routes.ts                 ← rotas (login, lista, inclusão, edição)
           ├── app.component.ts              ← menu lateral e barra superior
           ├── core/
           │   ├── auth.service.ts           ← guarda usuário/senha (Basic) na sessão
           │   ├── auth.interceptor.ts       ← põe Authorization e tenantId nas chamadas
           │   └── auth.guard.ts             ← obriga login antes das telas
           ├── login/login.component.ts      ← po-page-login
           └── fornecedores/
               ├── fornecedor.model.ts       ← formato do JSON
               ├── fornecedores.service.ts   ← chamadas GET/POST/PUT/DELETE
               ├── fornecedor-list.component.ts   ← po-page-list + po-table
               └── fornecedor-form.component.ts   ← po-page-edit + po-dynamic-form
   ```

### 3.4 Ajustar para o seu ambiente
1. **`proxy.conf.json`**: em `target`, coloque o endereço do REST
   (ex.: `http://192.168.0.10:4004`). O proxy evita problemas de CORS em desenvolvimento.
2. **`src/environments/environment.ts`**: em `tenantId`, coloque `empresa,filial`
   (ex.: `'01,0101'`).
3. **`angular.json`**: o PO-UI é maior que o limite padrão do Angular. Procure
   `"budgets"` e aumente os valores de `initial`:
   ```json
   "maximumWarning": "3MB",
   "maximumError": "5MB"
   ```
4. **`package.json`**: altere o script `start` para usar o proxy:
   ```json
   "start": "ng serve --proxy-config proxy.conf.json"
   ```

### 3.5 Rodar
```bash
npm start
```
Abra http://localhost:4200 e entre com um usuário do Protheus. Você vai ver:

- **Lista**: pesquisa por código, nome ou CNPJ, botão "Carregar mais" (paginação) e
  ações de Alterar/Excluir em cada linha;
- **Incluir/Alterar**: um formulário gerado a partir de uma lista de campos
  (`montarCampos()` em `fornecedor-form.component.ts`).

Quando o Protheus rejeita uma gravação (campo obrigatório, CNPJ inválido etc.), a
mensagem do MVC aparece automaticamente em um aviso vermelho. Quem faz isso é o
interceptor do PO-UI, que lê o campo `message` do erro devolvido pela API.

---

## Parte 4 — Entendendo o que foi feito (para evoluir sozinho)

| Quero... | Onde mexer |
|---|---|
| Mostrar mais uma coluna na lista | `columns` em `fornecedor-list.component.ts` |
| Adicionar um campo no formulário | `montarCampos()` no form + `fornecedor.model.ts` + `aCampos` e `FornecedorToJson` no `.tlpp` |
| Mudar o tamanho da página | `pageSize` na lista (o máximo da API é 100) |
| Trocar empresa/filial | `tenantId` em `environment.ts` |

Dicas:
- Ajuste os `maxLength` do formulário aos tamanhos do **SX3** do seu ambiente. A API usa
  `PadR(..., TamSX3())`, que corta o texto excedente sem avisar.
- Campos obrigatórios, gatilhos e validações vêm do **MATA020**. Se o seu ambiente exige
  outros campos (ex.: natureza, conta contábil, banco), inclua-os no formulário e
  na lista `aCampos` do `.tlpp`.
- Componentes disponíveis e exemplos interativos: https://po-ui.io/documentation

---

## Parte 5 — Abrir dentro do Protheus (FwCallApp)

O mesmo app roda nos dois modos, sem mudar código:

| | No navegador (`npm start`) | Dentro do Protheus (`FwCallApp`) |
|---|---|---|
| Login | Tela de login do exemplo (Basic) | O do próprio Protheus (token automático) |
| Empresa/filial | `tenantId` do `environment.ts` | A empresa/filial logada |
| Endereço do REST | `api_baseUrl` do `appConfig.json` + proxy | Informado pelo Protheus |
| Botão da barra | Sair | Fechar (volta ao menu) |

Quem faz essa troca é a biblioteca **`@totvs/protheus-lib-core`** (instalada no passo 3.2),
carregada em `app.config.ts`. A configuração do modo navegador fica em
`public/assets/data/appConfig.json`.

### 5.1 Gerar o pacote `.app`
Na raiz do projeto Angular:
```bash
sh empacotar-protheus.sh
```
O script roda `ng build --base-href ./` e compacta o conteúdo de
`dist/fornecedores-app/browser` em **`fornecedores.app`** (um `.zip` com outra extensão).
O nome do arquivo é o nome do app que o `FwCallApp` vai abrir.

### 5.2 Compilar no RPO
1. No VS Code, conectado ao AppServer, compile **`fornecedores.app`** junto com
   **`protheus/FORNPOUI.prw`** (selecione os dois arquivos > *Compile*). O `.app` entra no
   RPO como recurso.
2. Não é preciso reiniciar o AppServer para atualizar o `.app`; basta recompilar.

### 5.3 Colocar no menu
1. Configurador (SIGACFG) > Ambiente > Cadastros > Menus.
2. Abra o menu do módulo desejado (ex.: Compras) e adicione um item com a função
   **`U_FORNPOUI`**.
3. Entre no módulo pelo SmartClient ou pelo WebApp e chame a rotina. A tela abre já
   autenticada, com a empresa e a filial da sessão.

### 5.4 Pré-requisitos e conferência
- O `FwCallApp` usa o **REST do próprio AppServer** para servir o app e as APIs. No seu
  caso é o REST da porta 4004, que já atende a API de fornecedores.
- Em **Docker**, o endereço do REST que o Protheus informa ao app é o de dentro do
  contêiner. Se a porta publicada for diferente da interna (ex.: `-p 4004:8080`), o app
  não encontra a API. Use a mesma porta dos dois lados (`-p 4004:4004`).
- A lib e o binário do Protheus precisam ser recentes o bastante para o `FwCallApp`;
  confira a página **"FwCallApp - Abrindo aplicativos Web no Protheus"** na TDN.

### 5.5 Atualizar a tela depois
Altere o código, rode `sh empacotar-protheus.sh` de novo e recompile o `fornecedores.app`.
Para desenvolver, continue usando `npm start`, que é mais rápido.

### Alternativa: servidor web próprio
Também é possível servir a pasta do build num IIS/Nginx com proxy `/rest` para o AppServer.
Nesse caso, troque a autenticação Basic por **OAuth2** (`POST /rest/api/oauth2/v1/token`).

---

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| `404` em `/rest/custom/v1/fornecedores` | AppServer não foi reiniciado após compilar, ou a seção REST do `.ini` está errada |
| `401` / volta para o login | Usuário ou senha incorretos, ou `Security=1` sem usuário válido |
| Erro de **CORS** no console do navegador | O app não está usando o proxy. Rode com `npm start`, não com `ng serve` puro |
| `Budget ... was not met` no build | Faltou aumentar os budgets no `angular.json` (passo 3.4) |
| Lista vazia, mas existem fornecedores | `tenantId` aponta para outra empresa/filial |
| Erro citando `SA2MASTER` | O ID do submodelo do MATA020 é diferente na sua release; confira em `ModelDef` |
| `FwCallApp` abre tela em branco | O `.app` foi gerado sem `--base-href ./` (use o `empacotar-protheus.sh`) ou o nome do `.app` difere do usado no `FwCallApp` |
| Dentro do Protheus a lista dá erro 404/conexão | REST do AppServer diferente do que atende a API, ou porta do Docker mapeada para outro número |
| Telas em inglês ("Save", "Cancel") | O PO-UI segue o idioma do navegador; em um navegador pt-BR aparecem em português |
