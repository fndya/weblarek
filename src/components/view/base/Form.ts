import { Component } from '../../base/Component';
import type { IEvents } from '../../base/Events';

type FormErrors = Record<string, string>;

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(container: HTMLElement, protected readonly events: IEvents) {
    super(container);

    this.submitButton = container.querySelector('button[type="submit"]')!;
    this.errorsContainer = container.querySelector('.form__errors')!;

    container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.name) return;

      this.events.emit('form:change', {
        field: target.name,
        value: target.value,
      });
    });

    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();

      const formName = container.getAttribute('name');
      if (!formName) return;

      this.events.emit(`${formName}:submit`);
    });
  }

  set canSubmit(value: boolean | undefined) {
    this.submitButton.disabled = !value;
  }

  set errors(value: FormErrors) {
    this.errorsContainer.textContent = Object.values(value).join('\n');
  }
}
