import { PoTableColumnLabel } from '@po-ui/ng-components';

/** Situacao na folha (RA_SITFOLH). */
export const SITUACOES: PoTableColumnLabel[] = [
  { value: '', color: 'color-11', label: 'Normal' },
  { value: 'A', color: 'color-08', label: 'Afastado' },
  { value: 'F', color: 'color-02', label: 'Férias' },
  { value: 'T', color: 'color-05', label: 'Transferido' },
  { value: 'D', color: 'color-07', label: 'Demitido' }
];

export function descricaoSituacao(codigo?: string): string {
  return SITUACOES.find(s => s.value === (codigo ?? '').trim())?.label ?? codigo ?? '';
}
