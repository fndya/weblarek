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
        const method = button.name as 'card' | 'cash';

        this.events.emit('form:change', {
          field: 'payment',
          value: method,
        });
      });
    });


    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('order:next');
      });
    }

  set payment(value: 'card' | 'cash' | undefined) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle('button_alt-active', btn.name === value);
    });
  }
  set canSubmit(value: boolean | undefined) {
    this.submitButton.disabled = !value;
  }

  render(data?: Partial<PaymentFormData>): HTMLElement {
    if (data?.errors) {
      this.setErrors(data.errors);
    }
    return super.render(data);
  }
}
