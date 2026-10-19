/** Espelha o JSON devolvido por funcionarios.api.tlpp. */
export interface Funcionario {
  id: string;
  matricula: string;
  nome: string;
  cpf?: string;            // so no detalhe (dado pessoal)
  nascimento?: string;     // AAAA-MM-DD
  admissao?: string;       // AAAA-MM-DD
  situacao?: string;       // ' ' normal, A afastado, D demitido, F ferias, T transferido
  funcao?: string;
  funcaoDescricao?: string;
  centroCusto?: string;
  centroCustoDescricao?: string;
  // Campos editaveis
  email?: string;
  dddTelefone?: string;
  telefone?: string;
  dddCelular?: string;
  celular?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  estado?: string;
}

/** Formato TTALK de colecao. */
export interface FuncionarioPage {
  items: Funcionario[];
  hasNext: boolean;
}

/** Propriedades que a API aceita alterar. */
export const CAMPOS_EDITAVEIS: (keyof Funcionario)[] = [
  'email', 'dddTelefone', 'telefone', 'dddCelular', 'celular',
  'cep', 'endereco', 'numero', 'complemento', 'bairro', 'municipio', 'estado'
];
