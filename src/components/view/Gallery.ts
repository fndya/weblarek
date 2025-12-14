import { Component } from '../base/Component';

export class Gallery extends Component<HTMLElement[]> {
  constructor(container: HTMLElement) {
    super(container);
  }

  render(cards: HTMLElement[] = []): HTMLElement {
    this.container.replaceChildren(...cards);
    return this.container;
  }
}
