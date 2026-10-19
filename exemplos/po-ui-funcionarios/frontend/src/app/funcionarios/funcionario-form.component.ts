import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoDynamicFormField, PoModule, PoNotificationService } from '@po-ui/ng-components';

import { mensagemErroSemCorpo } from '../core/http-error';
import { CAMPOS_EDITAVEIS, Funcionario } from './funcionario.model';
import { FuncionariosService } from './funcionarios.service';
import { descricaoSituacao } from './situacao';

const UFS = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE',
  'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO', 'EX'];

/** Dados exibidos na tela: o funcionario + textos so de leitura. */
type FuncionarioTela = Partial<Funcionario> & { funcaoTexto?: string; centroCustoTexto?: string; situacaoTexto?: string };

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-page-edit
      [p-title]="titulo"
      [p-disable-submit]="!form?.valid || saving || !carregado"
      (p-cancel)="voltar()"
      (p-save)="salvar()">
      <po-dynamic-form
        [p-fields]="fields"
        [p-value]="funcionario"
        (p-form)="form = $event">
      </po-dynamic-form>
    </po-page-edit>
  `
})
export class FuncionarioFormComponent implements OnInit {
  private readonly service = inject(FuncionariosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(PoNotificationService);

  id = '';
  titulo = 'Funcionário';
  form?: NgForm;
  saving = false;
  carregado = false;
  funcionario: FuncionarioTela = {};
  readonly fields: PoDynamicFormField[] = this.montarCampos();

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.service.obter(this.id).subscribe({
      next: f => {
        this.funcionario = {
          ...f,
          funcaoTexto: [f.funcao, f.funcaoDescricao].filter(Boolean).join(' - '),
          centroCustoTexto: [f.centroCusto, f.centroCustoDescricao].filter(Boolean).join(' - '),
          situacaoTexto: descricaoSituacao(f.situacao)
        };
        this.titulo = `${f.matricula} - ${f.nome}`;
        this.carregado = true;
      },
      error: (error: HttpErrorResponse) => this.notificarErro(error)
    });
  }

  salvar(): void {
    // Envia apenas os campos que a API aceita alterar
    const dados: Partial<Funcionario> = {};
    for (const campo of CAMPOS_EDITAVEIS) {
      (dados as Record<string, unknown>)[campo] = this.funcionario[campo] ?? '';
    }

    this.saving = true;
    this.service.alterar(this.id, dados).subscribe({
      next: () => {
        this.notification.success('Funcionário alterado com sucesso.');
        this.voltar();
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        this.notificarErro(error);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/funcionarios']);
  }

  private notificarErro(error: HttpErrorResponse): void {
    // Erros com "message" (validacoes do GPEA010) ja sao exibidos pelo interceptor do PO-UI
    const mensagem = mensagemErroSemCorpo(error);
    if (mensagem) {
      this.notification.error(mensagem);
    }
  }

  /** Tamanhos conforme o dicionario padrao (SX3). Ajuste se o seu ambiente for diferente. */
  private montarCampos(): PoDynamicFormField[] {
    return [
      { property: 'matricula', label: 'Matrícula', gridColumns: 2, disabled: true, divider: 'Dados do funcionário' },
      { property: 'nome', label: 'Nome', gridColumns: 6, disabled: true },
      { property: 'cpf', label: 'CPF', gridColumns: 4, disabled: true },
      { property: 'nascimento', label: 'Nascimento', type: 'date', gridColumns: 3, disabled: true },
      { property: 'admissao', label: 'Admissão', type: 'date', gridColumns: 3, disabled: true },
      { property: 'situacaoTexto', label: 'Situação', gridColumns: 3, disabled: true },
      { property: 'funcaoTexto', label: 'Função', gridColumns: 6, disabled: true },
      { property: 'centroCustoTexto', label: 'Centro de custo', gridColumns: 6, disabled: true },

      { property: 'email', label: 'E-mail', type: 'email', maxLength: 50, gridColumns: 6, divider: 'Contato' },
      { property: 'dddTelefone', label: 'DDD', maxLength: 2, gridColumns: 1, pattern: '^[0-9]*$', errorMessage: 'Só números' },
      { property: 'telefone', label: 'Telefone', maxLength: 20, gridColumns: 2 },
      { property: 'dddCelular', label: 'DDD', maxLength: 2, gridColumns: 1, pattern: '^[0-9]*$', errorMessage: 'Só números' },
      { property: 'celular', label: 'Celular', maxLength: 10, gridColumns: 2 },

      { property: 'cep', label: 'CEP (somente números)', maxLength: 8, gridColumns: 3, pattern: '^[0-9]*$',
        errorMessage: 'Informe apenas números', divider: 'Endereço' },
      { property: 'endereco', label: 'Endereço', maxLength: 30, gridColumns: 7 },
      { property: 'numero', label: 'Número', maxLength: 6, gridColumns: 2 },
      { property: 'complemento', label: 'Complemento', maxLength: 15, gridColumns: 4 },
      { property: 'bairro', label: 'Bairro', maxLength: 15, gridColumns: 3 },
      { property: 'municipio', label: 'Município', maxLength: 20, gridColumns: 3 },
      { property: 'estado', label: 'UF', gridColumns: 2, options: UFS }
    ];
  }
}
