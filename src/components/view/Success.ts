import { Component } from '../base/Component';

type SuccessData = {
  total: number;
};

export class Success extends Component<SuccessData> {
  private descriptionEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.descriptionEl = container.querySelector(
      '.order-success__description'
    )!;
  }

  set total(value: number) {
    this.descriptionEl.textContent = `Списано ${value} синапсов`;
  }
}
