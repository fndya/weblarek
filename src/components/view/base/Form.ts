import { Component } from '../../base/Component';
import type { IEvents } from '../../base/Events';

type FormErrors = Record<string, string>;

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(
    container: HTMLElement,
    protected readonly events: IEvents
  ) {
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
  }

  protected setErrors(errors: FormErrors = {}) {
    this.errorsContainer.replaceChildren(
      ...Object.values(errors).map((text) => {
        const el = document.createElement('div');
        el.textContent = text;
        return el;
      })
    );
  }
}
