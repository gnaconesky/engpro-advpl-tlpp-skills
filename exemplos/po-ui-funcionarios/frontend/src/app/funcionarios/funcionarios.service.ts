import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Funcionario, FuncionarioPage } from './funcionario.model';

@Injectable({ providedIn: 'root' })
export class FuncionariosService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiFuncionarios;

  listar(page: number, pageSize: number, search = '', demitidos = false): Observable<FuncionarioPage> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) {
      params = params.set('search', search);
    }
    if (demitidos) {
      params = params.set('demitidos', 'true');
    }
    return this.http.get<FuncionarioPage>(this.url, { params });
  }

  obter(id: string): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.url}/${encodeURIComponent(id)}`);
  }

  alterar(id: string, dados: Partial<Funcionario>): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.url}/${encodeURIComponent(id)}`, dados);
  }
}
