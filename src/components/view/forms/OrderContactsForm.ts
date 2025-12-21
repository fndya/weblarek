import { Form } from '../base/Form';
import type { IEvents } from '../../base/Events';

export interface ContactsFormData {
  email?: string;
  phone?: string;
  errors?: Record<string, string>;
  canSubmit?: boolean;
}

export class OrderContactsForm extends Form<ContactsFormData> {
  private formEl: HTMLFormElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    // ⬅️ получаем form из контейнера
    this.formEl = container.querySelector('form')!;

    // ввод email / phone
    this.formEl.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target) return;

      if (target.name === 'email' || target.name === 'phone') {
        this.events.emit('form:change', {
          field: target.name,
          value: target.value,
        });
      }
    });

    // submit
    this.formEl.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      this.events.emit('order:pay');
    });
  }

  // сеттеры для render()
  set email(value: string | undefined) {
    const input = this.formEl.elements.namedItem('email') as HTMLInputElement | null;
    if (input && value !== undefined && input.value !== value) {
      input.value = value;
    }
  }

  set phone(value: string | undefined) {
    const input = this.formEl.elements.namedItem('phone') as HTMLInputElement | null;
    if (input && value !== undefined && input.value !== value) {
      input.value = value;
    }
  }

  set errors(value: Record<string, string> | undefined) {
    this.setErrors(value ?? {});
  }

  set canSubmit(value: boolean | undefined) {
    this.submitButton.disabled = !value;
  }
}
