// src/components/view/forms/OrderPaymentForm.ts
import { Form } from '../base/Form';
import type { IEvents } from '../../base/Events';

interface PaymentFormData {
  payment?: string;
  address?: string;
  errors?: Record<string, string>;
  canSubmit?: boolean;
}

export class OrderPaymentForm extends Form<PaymentFormData> {
  private paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = Array.from(
      container.querySelectorAll('.button_alt')
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        events.emit('form:change', {
          field: 'payment',
          value: button.dataset.method,
        });
      });
    });

    container.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      events.emit('order:next');
    });
  }
}
