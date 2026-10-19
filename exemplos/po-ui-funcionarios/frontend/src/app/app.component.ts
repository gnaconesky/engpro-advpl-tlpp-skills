import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PoMenuItem, PoModule, PoToolbarAction } from '@po-ui/ng-components';

import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PoModule, RouterOutlet],
  template: `
    @if (auth.isLoggedIn()) {
      <div class="po-wrapper">
        <po-toolbar p-title="Protheus - Gestão de Pessoal" [p-actions]="toolbarActions"></po-toolbar>
        <po-menu [p-menus]="menus"></po-menu>
        <router-outlet></router-outlet>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `
})
export class AppComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly menus: PoMenuItem[] = [
    { label: 'Funcionários', link: '/funcionarios', icon: 'an an-users', shortLabel: 'Funcion.' }
  ];

  // Dentro do Protheus o botao fecha o app e volta ao menu; no navegador faz logout
  readonly toolbarActions: PoToolbarAction[] = [
    this.auth.insideProtheus()
      ? { label: 'Fechar', icon: 'an an-x', action: () => this.auth.fecharApp() }
      : { label: 'Sair', icon: 'an an-sign-out', action: () => this.logout() }
  ];

  private logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
