import { Card } from '../base/Card';
import type { IProduct } from '../../../types';
import type { IEvents } from '../../base/Events';

export class CatalogCard extends Card<IProduct> {
  constructor(
    container: HTMLElement,
    events: IEvents
  ) {
    super(container, events);

    // клик по карточке — открыть превью
    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.productId });
    });

    // кнопка «Купить»
    this.bindButton('product:add');
  }
}
