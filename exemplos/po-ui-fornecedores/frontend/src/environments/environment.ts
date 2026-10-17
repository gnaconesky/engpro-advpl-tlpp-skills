export const environment = {
  // Caminho relativo ao REST. O protheus-lib-core completa com o endereco do servidor:
  // - dentro do Protheus (FwCallApp): usa o REST informado pelo proprio Protheus;
  // - no navegador (npm start): usa o api_baseUrl de public/assets/data/appConfig.json ("/rest"),
  //   que o proxy.conf.json repassa para o AppServer.
  apiFornecedores: '/custom/v1/fornecedores',
  // Empresa,Filial usados so no navegador. Dentro do Protheus vale a empresa logada.
  tenantId: '99,01'
};
