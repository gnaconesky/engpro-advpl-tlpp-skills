import { Injectable, inject } from '@angular/core';
import { ProAppConfigService } from '@totvs/protheus-lib-core';

const TOKEN_KEY = 'protheus_basic_token';

/**
 * Dentro do Protheus (FwCallApp) o login e do proprio Protheus: o protheus-lib-core
 * envia o token do usuario logado e a empresa/filial em toda requisicao.
 *
 * No navegador (npm start) usamos autenticacao Basic so para desenvolvimento.
 * As credenciais ficam no sessionStorage do navegador (somem ao fechar a aba).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly proAppConfig = inject(ProAppConfigService);

  insideProtheus(): boolean {
    return this.proAppConfig.insideProtheus();
  }

  login(usuario: string, senha: string): void {
    sessionStorage.setItem(TOKEN_KEY, btoa(`${usuario}:${senha}`));
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.insideProtheus() || !!this.getToken();
  }

  /** Fecha o app e volta para o menu do Protheus. */
  fecharApp(): void {
    this.proAppConfig.callAppClose();
  }
}
