import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export class Modal extends Component<{}> {
  private content: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.content = container.querySelector('.modal__content')!;
    this.closeButton = container.querySelector('.modal__close')!;

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    container.addEventListener('click', (e) => {
      if (e.target === container) {
        this.close();
      }
    });

    events.on('modal:close', () => this.close());
  }

  open(node: HTMLElement) {
    this.content.replaceChildren(node);
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content.replaceChildren();
  }
}
