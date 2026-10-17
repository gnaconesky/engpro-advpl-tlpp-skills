import { Injectable } from '@angular/core';

const TOKEN_KEY = 'protheus_basic_token';

/**
 * Autenticacao Basic simples para desenvolvimento.
 * As credenciais ficam so no sessionStorage do navegador (somem ao fechar a aba).
 * Em producao prefira OAuth2 (/api/oauth2/v1/token) ou o app embarcado via FwCallApp.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
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
    return !!this.getToken();
  }
}
