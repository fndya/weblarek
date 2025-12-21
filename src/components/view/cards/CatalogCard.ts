// src/components/view/cards/CatalogCard.ts
import { Card } from '../base/Card';
import { CDN_URL } from '../../../utils/constants';
import { categoryMap } from '../../../utils/constants';

interface CatalogCardActions {
  onSelect: () => void;
}

export class CatalogCard extends Card {
  private imageEl!: HTMLImageElement;
  private categoryEl!: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly actions: CatalogCardActions
  ) {
    super(container);

    this.imageEl = container.querySelector('.card__image')!;
    this.categoryEl = container.querySelector('.card__category')!;

    this.container.addEventListener('click', () => {
      this.actions.onSelect();
    });
  }

  set image(value: string) {
    this.imageEl.src = `${CDN_URL}${value}`;
  }

  set category(value: string) {
    this.categoryEl.textContent = value;
    const mapped = categoryMap[value as keyof typeof categoryMap];
    this.categoryEl.classList.remove('card__category_other');
    this.categoryEl.classList.add('card__category', `${mapped}`);
  }
}
