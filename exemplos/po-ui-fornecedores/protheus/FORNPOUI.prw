#include "totvs.ch"

//-------------------------------------------------------------------
/*/{Protheus.doc} FORNPOUI
Abre a tela PO-UI de fornecedores dentro do Protheus.
O build do Angular deve estar compilado no RPO como fornecedores.app.
Cadastre esta funcao no menu (Configurador > Ambiente > Cadastros > Menus).
/*/
//-------------------------------------------------------------------
User Function FORNPOUI()
  FwCallApp("fornecedores")
Return
