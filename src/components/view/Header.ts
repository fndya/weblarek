import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

interface HeaderData {
  count: number;
}

export class Header extends Component<HeaderData> {
  private basketButton: HTMLButtonElement;
  private counterEl: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.basketButton = container.querySelector('.header__basket')!;
    this.counterEl = container.querySelector('.header__basket-counter')!;

    this.basketButton.addEventListener('click', () => {
      events.emit('basket:open');
    });
  }

  set count(value: number) {
    this.counterEl.textContent = String(value);
    this.counterEl.hidden = value === 0;
  }
}
