import { Form } from '../base/Form';
import type { IEvents } from '../../base/Events';

type ContactsFormData = {
  email?: string;
  phone?: string;
  errors?: Record<string, string>;
  canSubmit?: boolean;
};

export class OrderContactsForm extends Form<ContactsFormData> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInput = container.querySelector<HTMLInputElement>(
      'input[name="email"]'
    )!;

    this.phoneInput = container.querySelector<HTMLInputElement>(
      'input[name="phone"]'
    )!;
  }

  set email(value: string | undefined) {
    this.emailInput.value = value ?? '';
  }

  set phone(value: string | undefined) {
    this.phoneInput.value = value ?? '';
  }

  set errors(value: Record<string, string>) {
    super.errors = value;
  }
}
