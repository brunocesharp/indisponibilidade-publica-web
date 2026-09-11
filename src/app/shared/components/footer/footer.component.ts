import { Component } from '@angular/core';

/** Rodapé simples da Aplicação Pública. */
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="p-4 text-sm text-center text-gray-500 border-t">
      Tribunal de Contas do Estado de Minas Gerais — {{ ano }}
    </footer>
  `,
})
export class FooterComponent {
  readonly ano = new Date().getFullYear();
}
