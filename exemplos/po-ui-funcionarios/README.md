# Funcionários (SRA) em PO-UI — consulta e alteração

App separado para o **SIGAGPE**, no mesmo formato do exemplo de
[fornecedores](../po-ui-fornecedores/README.md). Reaproveita o mesmo ambiente (Node, Angular CLI,
REST da porta 4004 com CORS, extensão `.app` liberada no VS Code), então aqui estão só as diferenças.

**O que a tela faz**
- Lista os funcionários da filial com pesquisa por matrícula, nome ou CPF e paginação.
  Os demitidos ficam ocultos; o botão **Mostrar demitidos** os inclui.
- Abre o detalhe do funcionário. Os dados funcionais (matrícula, nome, CPF, admissão, situação,
  função, centro de custo) são só leitura.
- Permite alterar **contato e endereço** (e-mail, telefones, CEP, endereço, número, complemento,
  bairro, município, UF).

**O que fica no Protheus:** inclusão, demissão, transferência e exclusão continuam nas rotinas
padrão do SIGAGPE.

**Por que a alteração usa o GPEA010:** mudar endereço ou contato de funcionário gera evento no
eSocial. A API grava pela rotina automática do **GPEA010** (`MSExecAuto`), com as mesmas validações
e eventos do cadastro padrão, em vez de gravar direto na SRA.

**Dados pessoais (LGPD):** o CPF não vai na lista; aparece só no detalhe. Restrinja o acesso pelo
menu do SIGAGPE como faria com o cadastro padrão.

---

## Arquivos

```
po-ui-funcionarios/
├── protheus/
│   ├── funcionarios.api.tlpp   ← API REST (GET lista, GET detalhe, PUT alteração)
│   └── FUNCPOUI.prw            ← função de menu: FwCallApp("funcionarios")
└── frontend/                    ← arquivos para copiar no projeto Angular
    ├── empacotar-protheus.sh    ← gera funcionarios.app
    ├── proxy.conf.json
    ├── public/assets/data/appConfig.json
    └── src/app/funcionarios/    ← lista, formulário, service e modelo
```

---

## Passo a passo

### 1. API no Protheus
1. Compile `protheus/funcionarios.api.tlpp`. O REST é o mesmo dos fornecedores (porta 4004).
2. Reinicie o AppServer: `docker restart protheus-appserver-1`.
3. Teste:
   ```bash
   curl -u usuario:senha -H "tenantId: 99,01" "http://127.0.0.1:4004/rest/custom/v1/funcionarios?pageSize=5"
   curl -u usuario:senha -H "tenantId: 99,01" "http://127.0.0.1:4004/rest/custom/v1/funcionarios/000001"
   ```

### 2. Projeto Angular
```bash
cd ~/Projects/TestePOUI
ng new funcionarios-app --routing --style=css --ssr=false
cd funcionarios-app
ng add @po-ui/ng-components@19
npm install @po-ui/ng-templates@19
npm install @totvs/protheus-lib-core@19 @totvs/po-theme@19 @totvs/common-assets subsink rxjs-compat
rm src/app/app.component.html src/app/app.component.css src/app/app.component.spec.ts
cp -R ~/Projects/"WS Totvs"/engpro-advpl-tlpp-skills/exemplos/po-ui-funcionarios/frontend/. .
```
Como nos fornecedores:
- `angular.json`: aumente os `budgets` de `initial` (`3MB` / `5MB`);
- `package.json`: `"start": "ng serve --proxy-config proxy.conf.json"`;
- `src/environments/environment.ts`: ajuste o `tenantId` (usado só no navegador).

Rode com `npm start` e abra http://localhost:4200.

### 3. Dentro do Protheus
Na pasta do projeto (`funcionarios-app`):
```bash
sh empacotar-protheus.sh
cp funcionarios.app ~/Projects/"WS Totvs"/Fornecedores-app/
```
O script usa o REST `http://127.0.0.1:4004/rest`; para outro endereço, passe-o como parâmetro
(`sh empacotar-protheus.sh http://servidor:porta/rest`). Troque a pasta do `cp` pela pasta onde você compila.

1. Compile `funcionarios.app` e `protheus/FUNCPOUI.prw`.
2. No Configurador, adicione **`U_FUNCPOUI`** ao menu do **SIGAGPE**.
3. Entre no SIGAGPE por uma aba nova do WebApp e chame a rotina.

---

## Ajustes que podem ser necessários no seu ambiente

| Situação | O que fazer |
|---|---|
| A alteração retorna erro de campo obrigatório | O GPEA010 valida o registro inteiro. Corrija o cadastro no Protheus ou inclua o campo na lista `CamposSRA()` da API e no formulário |
| Erro ao chamar o `GPEA010` | Confira na TDN a assinatura da rotina automática do GPEA010 para a sua release; a API usa `MSExecAuto({\|x,y,k,w\| GPEA010(x,y,k,w)}, Nil, Nil, aCabec, 4)` |
| Algum campo não aparece | A API só expõe campos que existem no dicionário (`FieldPos`). Confira o nome do campo na SX3 e ajuste `CamposSRA()` |
| Tamanhos dos campos | Ajuste os `maxLength` de `montarCampos()` ao SX3 do seu ambiente |
| Lista vazia | `tenantId`/filial diferente da dos funcionários, ou todos demitidos (use **Mostrar demitidos**) |
