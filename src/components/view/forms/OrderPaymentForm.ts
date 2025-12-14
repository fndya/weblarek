import { Form } from '../base/Form';
import type { IEvents } from '../../base/Events';

type PaymentFormData = {
  payment?: string;
  address?: string;
  errors?: Record<string, string>;
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
    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('order:next');
    });
  }

  render(data?: Partial<PaymentFormData>): HTMLElement {
    if (data?.errors) {
      this.setErrors(data.errors);
    }

    return super.render(data);
  }
}
