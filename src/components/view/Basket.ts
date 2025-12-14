import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

type BasketData = {
  items: HTMLElement[];
  total: number;
};

export class Basket extends Component<BasketData> {
  private list: HTMLElement;
  private total: HTMLElement;
  private orderButton: HTMLButtonElement;
  private empty: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents
  ) {
    super(container);

    this.list = container.querySelector('.basket__list')!;
    this.total = container.querySelector('.basket__total-price')!;
    this.orderButton = container.querySelector('.basket__button')!;
    this.empty = container.querySelector('.basket__empty')!;

    // открыть оформление заказа
    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  render(data?: Partial<BasketData>): HTMLElement {
    const items = data?.items ?? [];

    // список товаров
    if (items.length === 0) {
      this.list.replaceChildren();
      this.empty.classList.remove('basket__empty_hidden');
      this.orderButton.disabled = true;
    } else {
      this.list.replaceChildren(...items);
      this.empty.classList.add('basket__empty_hidden');
      this.orderButton.disabled = false;
    }

    // итоговая стоимость
    if (typeof data?.total === 'number') {
      this.total.textContent = `${data.total} синапсов`;
    }

    return super.render(data);
  }
}
