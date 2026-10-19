import { Routes } from '@angular/router';

import { authGuard } from './core/auth.guard';
import { LoginComponent } from './login/login.component';
import { FuncionarioFormComponent } from './funcionarios/funcionario-form.component';
import { FuncionarioListComponent } from './funcionarios/funcionario-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'funcionarios', component: FuncionarioListComponent, canActivate: [authGuard] },
  { path: 'funcionarios/:id', component: FuncionarioFormComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'funcionarios' },
  { path: '**', redirectTo: 'funcionarios' }
];
