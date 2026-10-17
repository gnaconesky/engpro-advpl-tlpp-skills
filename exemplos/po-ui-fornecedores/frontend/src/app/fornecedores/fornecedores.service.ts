import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Fornecedor, FornecedorPage } from './fornecedor.model';

@Injectable({ providedIn: 'root' })
export class FornecedoresService {
  private readonly http = inject(HttpClient);
  private readonly url = environment.apiFornecedores;

  listar(page: number, pageSize: number, search = ''): Observable<FornecedorPage> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<FornecedorPage>(this.url, { params });
  }

  obter(id: string): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.url}/${encodeURIComponent(id)}`);
  }

  incluir(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.url, fornecedor);
  }

  alterar(id: string, fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.url}/${encodeURIComponent(id)}`, fornecedor);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${encodeURIComponent(id)}`);
  }
}
