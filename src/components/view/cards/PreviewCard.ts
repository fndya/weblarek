import { Card } from '../base/Card';
import type { IProduct } from '../../../types';
import type { IEvents } from '../../base/Events';

type PreviewCardData = IProduct & {
  inBasket: boolean;
};

export class PreviewCard extends Card<PreviewCardData> {
  constructor(
    container: HTMLElement,
    events: IEvents
  ) {
    super(container, events);

    // кнопка Купить / Удалить
    this.button?.addEventListener('click', () => {
      if (!this.productId) return;

      this.events.emit(
        this.button?.textContent === 'Удалить'
          ? 'product:remove'
          : 'product:add',
        { id: this.productId }
      );

      // закрыть модалку после действия
      this.events.emit('modal:close');
    });
  }

  render(data?: Partial<PreviewCardData>): HTMLElement {
    super.render(data);

    // состояние кнопки
    if (this.button && typeof data?.inBasket === 'boolean') {
      this.button.textContent = data.inBasket ? 'Удалить' : 'Купить';
    }

    return this.container;
  }
}
