import { Form } from '../base/Form';
import type { IEvents } from '../../base/Events';

type PaymentFormData = {
  payment?: string;
  address?: string;
  errors?: Record<string, string>;
  canSubmit?: boolean;
};

export class OrderPaymentForm extends Form<PaymentFormData> {
  private paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = Array.from(
      container.querySelectorAll('.button_alt')
    );

    // выбор оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach((b) =>
          b.classList.remove('button_alt-active')
        );
        button.classList.add('button_alt-active');

        this.events.emit('form:change', {
          field: 'payment',
          value: button.dataset.method,
        });
      });
    });

    // переход ко 2 шагу
    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
    this.events.emit('order:next');
    });

  }

  set canSubmit(value: boolean | undefined) {
    this.submitButton.disabled = !value;
  }
}
