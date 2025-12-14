import { Component } from '../../base/Component';
import type { IProduct } from '../../../types';
import type { IEvents } from '../../base/Events';
import { categoryMap } from '../../../utils/constants';

export abstract class Card<T extends IProduct> extends Component<T> {
  protected title: HTMLElement;
  protected image?: HTMLImageElement;
  protected price: HTMLElement;
  protected category?: HTMLElement;
  protected button?: HTMLButtonElement;

  protected productId: string;

  constructor(
    container: HTMLElement,
    protected readonly events: IEvents
  ) {
    super(container);

    this.title = container.querySelector('.card__title')!;
    this.price = container.querySelector('.card__price')!;
    this.image = container.querySelector('.card__image') ?? undefined;
    this.category = container.querySelector('.card__category') ?? undefined;
    this.button = container.querySelector('.card__button') ?? undefined;

    this.productId = '';
  }

  protected bindButton(eventName: string) {
    if (!this.button) return;

    this.button.addEventListener('click', () => {
      this.events.emit(eventName, { id: this.productId });
    });
  }

  protected setPrice(value: number | null) {
    if (value === null) {
      this.price.textContent = 'Бесценно';
      if (this.button) {
        this.button.disabled = true;
        this.button.textContent = 'Недоступно';
      }
    } else {
      this.price.textContent = `${value} синапсов`;
    }
  }

  protected setCategory(value?: string) {
  if (!this.category || !value) return;

  this.category.textContent = value;

  if (value in categoryMap) {
    const className = categoryMap[value as keyof typeof categoryMap];
    this.category.className = `card__category card__category_${className}`;
  }
}

  render(data?: Partial<T>): HTMLElement {
    if (data?.id) {
      this.productId = data.id;
    }

    if (data?.title) {
      this.title.textContent = data.title;
    }

    if (data?.image && this.image) {
      this.setImage(this.image, data.image, data.title);
    }

    if ('price' in (data ?? {})) {
      this.setPrice(data?.price ?? null);
    }

    if (data?.category) {
      this.setCategory(data.category);
    }

    return super.render(data);
  }
}
