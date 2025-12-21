import { Form } from '../base/Form';
import type { IEvents } from '../../base/Events';

type ContactsFormData = {
  email?: string;
  phone?: string;
  errors?: Record<string, string>;
  canSubmit?: boolean;
};

export class OrderContactsForm extends Form<ContactsFormData> {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events.emit('order:pay');
    });
  }

  set canSubmit(value: boolean | undefined) {
    this.submitButton.disabled = !value;
  }

  render(data?: Partial<ContactsFormData>): HTMLElement {
    if (data?.errors) {
      this.setErrors(data.errors);
    }
    return super.render(data);
  }
}
