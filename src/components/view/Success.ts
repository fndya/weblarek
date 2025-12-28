import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

type SuccessData = {
  total: number;
};

export class Success extends Component<SuccessData> {
  private descriptionEl: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.descriptionEl = container.querySelector(
      '.order-success__description'
    )!;

    this.closeButton = container.querySelector(
      '.order-success__close'
    )!;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.descriptionEl.textContent = `Списано ${value} синапсов`;
  }
}
