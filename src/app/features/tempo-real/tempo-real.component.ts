import { Component } from '@angular/core';

/**
 * Placeholder da Entrega 0. A Entrega 4 implementa:
 * estado atual das aplicações a partir do banco, atualização automática
 * a cada minuto (polling) e botão "Atualizar" manual (escopo §5).
 */
@Component({
  selector: 'app-tempo-real',
  standalone: true,
  template: `
    <section class="flex flex-col gap-2">
      <h2 class="text-lg font-semibold">Acompanhamento em tempo real</h2>
      <p>Disponível na Entrega 4.</p>
    </section>
  `,
})
export class TempoRealComponent {}
