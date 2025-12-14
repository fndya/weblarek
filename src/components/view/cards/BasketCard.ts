import { Card } from '../base/Card';
import type { IProduct } from '../../../types';
import type { IEvents } from '../../base/Events';

export class BasketCard extends Card<IProduct> {
  constructor(
    container: HTMLElement,
    events: IEvents
  ) {
    super(container, events);

    // в корзине кнопка всегда "Удалить"
    if (this.button) {
      this.button.textContent = 'Удалить';

      this.button.addEventListener('click', () => {
        this.events.emit('product:remove', { id: this.productId });
      });
    }
  }
}
