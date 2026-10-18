import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  PoDialogService,
  PoModule,
  PoNotificationService,
  PoPageAction,
  PoPageFilter,
  PoTableAction,
  PoTableColumn
} from '@po-ui/ng-components';

import { HttpErrorResponse } from '@angular/common/http';

import { mensagemErroSemCorpo } from '../core/http-error';
import { Fornecedor } from './fornecedor.model';
import { FornecedoresService } from './fornecedores.service';

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-page-list p-title="Fornecedores" [p-actions]="pageActions" [p-filter]="filter">
      <po-table
        [p-columns]="columns"
        [p-items]="items"
        [p-actions]="tableActions"
        [p-loading]="loading"
        [p-show-more-disabled]="!hasNext"
        (p-show-more)="carregarMais()">
      </po-table>
    </po-page-list>
  `
})
export class FornecedorListComponent implements OnInit {
  private readonly service = inject(FornecedoresService);
  private readonly router = inject(Router);
  private readonly dialog = inject(PoDialogService);
  private readonly notification = inject(PoNotificationService);

  private readonly pageSize = 20;
  private page = 1;
  private search = '';

  items: Fornecedor[] = [];
  hasNext = false;
  loading = false;

  readonly pageActions: PoPageAction[] = [
    { label: 'Incluir', icon: 'an an-plus', action: () => this.router.navigate(['/fornecedores/novo']) }
  ];

  readonly filter: PoPageFilter = {
    placeholder: 'Pesquisar por codigo, nome ou CNPJ',
    action: (texto: string) => this.pesquisar(texto)
  };

  readonly columns: PoTableColumn[] = [
    { property: 'codigo', label: 'Codigo', width: '10%' },
    { property: 'loja', label: 'Loja', width: '6%' },
    { property: 'nome', label: 'Razao social' },
    { property: 'nomeFantasia', label: 'Nome fantasia' },
    { property: 'cnpjCpf', label: 'CNPJ/CPF' },
    { property: 'municipio', label: 'Municipio' },
    { property: 'estado', label: 'UF', width: '6%' },
    {
      property: 'bloqueado',
      label: 'Status',
      type: 'label',
      labels: [
        { value: '1', color: 'color-07', label: 'Bloqueado' },
        { value: '2', color: 'color-11', label: 'Ativo' },
        { value: '', color: 'color-11', label: 'Ativo' }
      ]
    }
  ];

  readonly tableActions: PoTableAction[] = [
    { label: 'Alterar', icon: 'an an-pencil-simple', action: (f: Fornecedor) => this.router.navigate(['/fornecedores/editar', f.id]) },
    { label: 'Excluir', icon: 'an an-trash', type: 'danger', action: (f: Fornecedor) => this.confirmarExclusao(f) }
  ];

  ngOnInit(): void {
    this.carregar();
  }

  pesquisar(texto: string): void {
    this.search = texto?.trim() ?? '';
    this.page = 1;
    this.items = [];
    this.carregar();
  }

  carregarMais(): void {
    this.page++;
    this.carregar();
  }

  private carregar(): void {
    this.loading = true;
    this.service.listar(this.page, this.pageSize, this.search).subscribe({
      next: resp => {
        this.items = [...this.items, ...resp.items];
        this.hasNext = resp.hasNext;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.notificarErro(error);
      }
    });
  }

  private notificarErro(error: HttpErrorResponse): void {
    const mensagem = mensagemErroSemCorpo(error);
    if (mensagem) {
      this.notification.error(mensagem);
    }
  }

  private confirmarExclusao(f: Fornecedor): void {
    this.dialog.confirm({
      title: 'Excluir fornecedor',
      message: `Confirma a exclusao de ${f.codigo}/${f.loja} - ${f.nome}?`,
      confirm: () =>
        this.service.excluir(f.id!).subscribe(() => {
          this.notification.success('Fornecedor excluido.');
          this.items = this.items.filter(item => item.id !== f.id);
        })
    });
  }
}
