import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  PoModule,
  PoNotificationService,
  PoPageAction,
  PoPageFilter,
  PoTableAction,
  PoTableColumn
} from '@po-ui/ng-components';

import { mensagemErroSemCorpo } from '../core/http-error';
import { Funcionario } from './funcionario.model';
import { FuncionariosService } from './funcionarios.service';
import { SITUACOES } from './situacao';

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-page-list p-title="Funcionários" [p-actions]="pageActions" [p-filter]="filter">
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
export class FuncionarioListComponent implements OnInit {
  private readonly service = inject(FuncionariosService);
  private readonly router = inject(Router);
  private readonly notification = inject(PoNotificationService);

  private readonly pageSize = 20;
  private page = 1;
  private search = '';
  private demitidos = false;

  items: Funcionario[] = [];
  hasNext = false;
  loading = false;

  pageActions: PoPageAction[] = this.montarAcoes();

  readonly filter: PoPageFilter = {
    placeholder: 'Pesquisar por matrícula, nome ou CPF',
    action: (texto: string) => this.pesquisar(texto)
  };

  readonly columns: PoTableColumn[] = [
    { property: 'matricula', label: 'Matrícula', width: '10%' },
    { property: 'nome', label: 'Nome' },
    { property: 'funcaoDescricao', label: 'Função' },
    { property: 'centroCustoDescricao', label: 'Centro de custo' },
    { property: 'admissao', label: 'Admissão', type: 'date', width: '10%' },
    { property: 'situacao', label: 'Situação', type: 'label', labels: SITUACOES, width: '10%' }
  ];

  readonly tableActions: PoTableAction[] = [
    { label: 'Visualizar / Alterar', icon: 'an an-pencil-simple', action: (f: Funcionario) => this.router.navigate(['/funcionarios', f.id]) }
  ];

  ngOnInit(): void {
    this.carregar();
  }

  pesquisar(texto: string): void {
    this.search = texto?.trim() ?? '';
    this.recarregar();
  }

  carregarMais(): void {
    this.page++;
    this.carregar();
  }

  private alternarDemitidos(): void {
    this.demitidos = !this.demitidos;
    this.pageActions = this.montarAcoes();
    this.recarregar();
  }

  private montarAcoes(): PoPageAction[] {
    return [
      {
        label: this.demitidos ? 'Ocultar demitidos' : 'Mostrar demitidos',
        icon: 'an an-funnel',
        action: () => this.alternarDemitidos()
      }
    ];
  }

  private recarregar(): void {
    this.page = 1;
    this.items = [];
    this.carregar();
  }

  private carregar(): void {
    this.loading = true;
    this.service.listar(this.page, this.pageSize, this.search, this.demitidos).subscribe({
      next: resp => {
        this.items = [...this.items, ...resp.items];
        this.hasNext = resp.hasNext;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const mensagem = mensagemErroSemCorpo(error);
        if (mensagem) {
          this.notification.error(mensagem);
        }
      }
    });
  }
}
