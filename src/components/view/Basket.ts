import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export interface BasketData {
  items: HTMLElement[];
  total: number;
  canOrder: boolean;
}

export class Basket extends Component<BasketData> {
  private listEl: HTMLElement;
  private totalEl: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.listEl = container.querySelector('.basket__list')!;
    this.totalEl = container.querySelector('.basket__price')!;
    this.orderButton = container.querySelector('.basket__button')!;

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(value: HTMLElement[]) {
    if (value.length === 0) {
      this.listEl.replaceChildren();
      this.listEl.textContent = 'Корзина пуста';
      return;
    }

    this.listEl.textContent = '';
    this.listEl.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalEl.textContent = `${value} синапсов`;
  }

  set canOrder(value: boolean) {
    this.orderButton.disabled = !value;
  }
}
