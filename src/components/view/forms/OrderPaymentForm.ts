import { Form } from '../base/Form';
import type { IEvents } from '../../base/Events';

type PaymentFormData = {
  payment?: 'card' | 'cash';
  address?: string;
  errors?: Record<string, string>;
  canSubmit?: boolean;
};

export class OrderPaymentForm extends Form<PaymentFormData> {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = Array.from(
      container.querySelectorAll<HTMLButtonElement>('.button_alt')
    );

    this.addressInput = container.querySelector<HTMLInputElement>(
      'input[name="address"]'
    )!;

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const method = button.name as 'card' | 'cash';

        this.events.emit('form:change', {
          field: 'payment',
          value: method,
        });
      });
    });
  }

  set payment(value: 'card' | 'cash' | undefined) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.toggle('button_alt-active', btn.name === value);
    });
  }

  set address(value: string | undefined) {
    this.addressInput.value = value ?? '';
  }

  set errors(value: Record<string, string>) {
    super.errors = value;
  }
}
