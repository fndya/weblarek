// src/components/view/cards/BasketCard.ts
import { Card } from '../base/Card';

interface BasketCardActions {
  onRemove: () => void;
}

export class BasketCard extends Card {
  private indexEl: HTMLElement;
  private buttonEl: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly actions: BasketCardActions
  ) {
    super(container);

    this.indexEl = container.querySelector('.basket__item-index')!;
    this.buttonEl = container.querySelector('.basket__item-delete')!;

    this.buttonEl.addEventListener('click', () => {
      this.actions.onRemove();
    });
  }

  set index(value: number) {
    this.indexEl.textContent = String(value);
  }
}
