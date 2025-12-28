import { Card } from '../base/Card';
import { CDN_URL, categoryMap } from '../../../utils/constants';

interface PreviewCardActions {
  onClick: () => void;
}

export class PreviewCard extends Card {
  private descriptionEl: HTMLElement;
  private buttonEl: HTMLButtonElement;
  private imageEl?: HTMLImageElement;
  private categoryEl: HTMLElement;

  constructor(container: HTMLElement, private readonly actions: PreviewCardActions) {
    super(container);

    this.descriptionEl = container.querySelector('.card__text')!;
    this.buttonEl = container.querySelector('.card__button')!;
    this.imageEl = container.querySelector('.card__image') ?? undefined;
    this.categoryEl = container.querySelector('.card__category')!;

    this.buttonEl.addEventListener('click', () => {
      this.actions.onClick();
    });
  }

  set description(value: string) {
    this.descriptionEl.textContent = value;
  }

  set image(value: string) {
    if (!this.imageEl) return;
    this.imageEl.src = `${CDN_URL}${value}`;
  }

  set category(value: string) {
    this.categoryEl.textContent = value;

    const mapped = categoryMap[value as keyof typeof categoryMap];

    this.categoryEl.classList.remove('card__category_other');
    this.categoryEl.classList.add('card__category', `${mapped}`);
  }

  set buttonText(value: string) {
    this.buttonEl.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonEl.disabled = value;
  }
}
