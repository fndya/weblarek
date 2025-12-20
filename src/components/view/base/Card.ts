import { Component } from '../../base/Component';

export interface CardBaseData {
  title: string;
  price: number | null;
}

export abstract class Card extends Component<CardBaseData> {
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleEl = container.querySelector('.card__title')!;
    this.priceEl = container.querySelector('.card__price')!;
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }

  set price(value: number | null) {
    this.priceEl.textContent =
      value === null ? 'Бесценно' : `${value} синапсов`;
  }
}
