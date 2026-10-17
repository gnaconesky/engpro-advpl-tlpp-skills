/** Espelha o JSON devolvido por fornecedores.api.tlpp. */
export interface Fornecedor {
  id?: string;
  codigo: string;
  loja: string;
  nome: string;
  nomeFantasia: string;
  tipo: 'F' | 'J' | 'X';
  cnpjCpf?: string;
  endereco: string;
  codMunicipio?: string;
  municipio: string;
  estado: string;
  email?: string;
  telefone?: string;
  bloqueado?: '1' | '2';
}

/** Formato TTALK de colecao. */
export interface FornecedorPage {
  items: Fornecedor[];
  hasNext: boolean;
}
