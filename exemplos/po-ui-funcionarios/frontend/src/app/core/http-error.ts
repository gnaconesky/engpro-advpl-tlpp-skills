import { HttpErrorResponse } from '@angular/common/http';

/**
 * Texto para erros sem "message" no corpo (o PO-UI so exibe sozinho quando ha "message").
 * Retorna vazio quando o PO-UI ja vai mostrar a mensagem do Protheus.
 */
export function mensagemErroSemCorpo(error: HttpErrorResponse): string {
  if (error?.error?.message) {
    return '';
  }
  if (error.status === 0) {
    return `Sem resposta do servidor REST (${error.url ?? 'URL desconhecida'}). Verifique endereco, porta e CORS.`;
  }
  return `Erro ${error.status} ao acessar ${error.url ?? 'a API'}.`;
}
