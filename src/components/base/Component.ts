export abstract class Component<T> {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(data?: Partial<T>): HTMLElement {
    if (data) {
      Object.assign(this, data);
    }
    return this.container;
  }
}
