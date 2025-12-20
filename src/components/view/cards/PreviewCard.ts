// src/components/view/cards/PreviewCard.ts
import { Card } from '../base/Card';
import { CDN_URL } from '../../../utils/constants';

interface PreviewCardActions {
  onBuy: () => void;
  onRemove: () => void;
}

export class PreviewCard extends Card {
  private descriptionEl: HTMLElement;
  private buttonEl: HTMLButtonElement;
  private imageEl!: HTMLImageElement;

  constructor(
    container: HTMLElement,
    private readonly actions: PreviewCardActions
  ) {
    super(container);

    
    this.descriptionEl = container.querySelector('.card__text')!;
    this.buttonEl = container.querySelector('.card__button')!;

    this.buttonEl.addEventListener('click', () => {
      if (this.buttonEl.textContent === 'Удалить') {
        this.actions.onRemove();
      } else {
        this.actions.onBuy();
      }
    });
  }

  set description(value: string) {
    this.descriptionEl.textContent = value;
  }

  set image(value: string) {
    this.imageEl.src = `${CDN_URL}${value}`;
  }

  set inBasket(value: boolean) {
    this.buttonEl.textContent = value ? 'Удалить' : 'Купить';
  }
}
