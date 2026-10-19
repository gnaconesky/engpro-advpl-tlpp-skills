import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoPageLogin, PoPageLoginModule } from '@po-ui/ng-templates';

import { AuthService } from '../core/auth.service';
import { FuncionariosService } from '../funcionarios/funcionarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PoPageLoginModule],
  template: `
    <po-page-login
      [p-hide-remember-user]="true"
      p-product-name="Protheus"
      [p-loading]="loading"
      (p-login-submit)="entrar($event)">
    </po-page-login>
  `
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly service = inject(FuncionariosService);
  private readonly router = inject(Router);
  private readonly notification = inject(PoNotificationService);

  loading = false;

  entrar(form: PoPageLogin): void {
    this.loading = true;
    this.auth.login(form.login, form.password);

    // Valida as credenciais com uma chamada leve a propria API
    this.service.listar(1, 1).subscribe({
      next: () => this.router.navigate(['/funcionarios']),
      error: () => {
        this.auth.logout();
        this.loading = false;
        this.notification.error('Usuario ou senha invalidos, ou servidor REST indisponivel.');
      }
    });
  }
}
