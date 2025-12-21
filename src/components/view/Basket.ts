import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export interface BasketData {
  items: HTMLElement[];
  total: number;
  canOrder: boolean;
}

export class Basket extends Component<BasketData> {
  private list: HTMLElement;
  private totalEl: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.list = container.querySelector('.basket__list')!;
    this.totalEl = container.querySelector('.basket__price')!;
    this.orderButton = container.querySelector('.basket__button')!;

    this.orderButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('order:open');
    });
  }

  set items(value: HTMLElement[]) {
    this.list.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalEl.textContent = `${value} синапсов`;
  }

  set canOrder(value: boolean) {
    this.orderButton.disabled = !value;
  }
}
