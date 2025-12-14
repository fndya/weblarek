import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';

export class Modal extends Component<HTMLElement> {
  private content: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents
  ) {
    super(container);

    this.content = container.querySelector('.modal__content')!;
    this.closeButton = container.querySelector('.modal__close')!;

    // закрытие по крестику
    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    // закрытие по клику на фон
    this.container.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    // закрытие по событию
    this.events.on('modal:close', () => this.close());
  }

  open(content: HTMLElement): void {
    this.content.replaceChildren(content);
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.content.replaceChildren();
  }
}
