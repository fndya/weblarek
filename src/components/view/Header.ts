import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

type HeaderData = {
  count: number;
};

export class Header extends Component<HeaderData> {
  private basketButton: HTMLButtonElement;
  private counter: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents
  ) {
    super(container);

    this.basketButton = container.querySelector('.header__basket')!;
    this.counter = container.querySelector('.header__basket-counter')!;

    // открыть корзину
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  render(data?: Partial<HeaderData>): HTMLElement {
    if (typeof data?.count === 'number') {
      this.counter.textContent = String(data.count);
      this.counter.classList.toggle('header__basket-counter_active', data.count > 0);
    }

    return super.render(data);
  }
}
