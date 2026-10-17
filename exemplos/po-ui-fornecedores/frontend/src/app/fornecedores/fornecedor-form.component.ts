import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForceOptionComponentEnum, PoDynamicFormField, PoModule, PoNotificationService } from '@po-ui/ng-components';

import { Fornecedor } from './fornecedor.model';
import { FornecedoresService } from './fornecedores.service';

const UFS = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE',
  'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO', 'EX'];

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [PoModule],
  template: `
    <po-page-edit
      [p-title]="id ? 'Alterar fornecedor' : 'Incluir fornecedor'"
      [p-disable-submit]="!form?.valid || saving"
      (p-cancel)="voltar()"
      (p-save)="salvar()">
      <po-dynamic-form
        [p-fields]="fields"
        [p-value]="fornecedor"
        (p-form)="form = $event">
      </po-dynamic-form>
    </po-page-edit>
  `
})
export class FornecedorFormComponent implements OnInit {
  private readonly service = inject(FornecedoresService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notification = inject(PoNotificationService);

  id: string | null = null;
  form?: NgForm;
  saving = false;
  fornecedor: Partial<Fornecedor> = { tipo: 'J', loja: '01', bloqueado: '2' };
  fields: PoDynamicFormField[] = [];

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.fields = this.montarCampos(!!this.id);

    if (this.id) {
      this.service.obter(this.id).subscribe(f => (this.fornecedor = f));
    }
  }

  salvar(): void {
    // po-dynamic-form altera o proprio objeto p-value, por isso enviamos this.fornecedor
    const dados = this.fornecedor as Fornecedor;
    const operacao = this.id ? this.service.alterar(this.id, dados) : this.service.incluir(dados);

    this.saving = true;
    operacao.subscribe({
      next: () => {
        this.notification.success('Fornecedor salvo com sucesso.');
        this.voltar();
      },
      // A mensagem de erro do Protheus (campo "message") ja e exibida pelo interceptor do PO-UI
      error: () => (this.saving = false)
    });
  }

  voltar(): void {
    this.router.navigate(['/fornecedores']);
  }

  /** Tamanhos conforme o dicionario padrao (SX3). Ajuste se o seu ambiente for diferente. */
  private montarCampos(edicao: boolean): PoDynamicFormField[] {
    return [
      { property: 'codigo', label: 'Codigo', maxLength: 6, gridColumns: 3, disabled: edicao,
        help: 'Deixe em branco para usar a numeracao automatica, se configurada' },
      { property: 'loja', label: 'Loja', required: true, maxLength: 2, gridColumns: 2, disabled: edicao },
      { property: 'tipo', label: 'Tipo', required: true, gridColumns: 4,
        forceOptionsComponentType: ForceOptionComponentEnum.select,
        options: [
          { label: 'Juridica', value: 'J' },
          { label: 'Fisica', value: 'F' },
          { label: 'Outros (exterior)', value: 'X' }
        ] },
      { property: 'bloqueado', label: 'Bloqueado', gridColumns: 3,
        options: [
          { label: 'Nao', value: '2' },
          { label: 'Sim', value: '1' }
        ] },
      { property: 'nome', label: 'Razao social', required: true, maxLength: 40, gridColumns: 6 },
      { property: 'nomeFantasia', label: 'Nome fantasia', required: true, maxLength: 20, gridColumns: 6 },
      { property: 'cnpjCpf', label: 'CNPJ/CPF (somente numeros)', maxLength: 14, gridColumns: 4,
        pattern: '^[0-9]*$', errorMessage: 'Informe apenas numeros' },
      { property: 'email', label: 'E-mail', maxLength: 100, gridColumns: 4, type: 'email' },
      { property: 'telefone', label: 'Telefone', maxLength: 15, gridColumns: 4 },
      { property: 'endereco', label: 'Endereco', required: true, maxLength: 40, gridColumns: 6 },
      { property: 'estado', label: 'UF', required: true, gridColumns: 2, options: UFS },
      { property: 'codMunicipio', label: 'Cod. municipio (IBGE)', maxLength: 5, gridColumns: 3,
        help: 'Codigo da tabela CC2; ao informar, o Protheus preenche o municipio' },
      { property: 'municipio', label: 'Municipio', maxLength: 60, gridColumns: 7 }
    ];
  }
}
