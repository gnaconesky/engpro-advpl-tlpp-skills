import { Routes } from '@angular/router';

import { authGuard } from './core/auth.guard';
import { LoginComponent } from './login/login.component';
import { FornecedorFormComponent } from './fornecedores/fornecedor-form.component';
import { FornecedorListComponent } from './fornecedores/fornecedor-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'fornecedores', component: FornecedorListComponent, canActivate: [authGuard] },
  { path: 'fornecedores/novo', component: FornecedorFormComponent, canActivate: [authGuard] },
  { path: 'fornecedores/editar/:id', component: FornecedorFormComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'fornecedores' },
  { path: '**', redirectTo: 'fornecedores' }
];
