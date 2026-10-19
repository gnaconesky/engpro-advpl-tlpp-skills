#include "totvs.ch"

//-------------------------------------------------------------------
/*/{Protheus.doc} FUNCPOUI
Abre a tela PO-UI de funcionarios dentro do Protheus.
O build do Angular deve estar compilado no RPO como funcionarios.app.
Cadastre esta funcao no menu do SIGAGPE
(Configurador > Ambiente > Cadastros > Menus).
/*/
//-------------------------------------------------------------------
User Function FUNCPOUI()
  FwCallApp("funcionarios")
Return
