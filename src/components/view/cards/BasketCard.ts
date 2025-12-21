// src/components/view/cards/BasketCard.ts
import { Card } from '../base/Card';
import { categoryMap } from '../../../utils/constants';

interface BasketCardActions {
  onRemove: () => void;
}

export class BasketCard extends Card {
  private indexEl: HTMLElement;
  private buttonEl: HTMLButtonElement;
  private categoryEl!: HTMLElement;

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
  set category(value: string) {
    this.categoryEl.textContent = value;
    const mapped = categoryMap[value as keyof typeof categoryMap];
    this.categoryEl.classList.remove('card__category_other');
    this.categoryEl.classList.add('card__category', `${mapped}`);
  }
}
