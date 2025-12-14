import type { IBuyer } from '../../types';
import type { IEvents } from '../base/Events';

type BuyerPartial = Partial<IBuyer>;
export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel {
  private data: BuyerPartial = {};

  constructor(private readonly events: IEvents) {}

  // сохранить частичные данные
  public set(partial: BuyerPartial): void {
    this.data = { ...this.data, ...partial };
    this.emitChange();
  }

  // получить все сохранённые данные
  public get(): BuyerPartial {
    return { ...this.data };
  }

  // очистить всё
  public clear(): void {
    this.data = {};
    this.emitChange();
  }

  // валидация
  public validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};
    const { payment, address, email, phone } = this.data;

    if (!payment) errors.payment = 'Не выбран вид оплаты';
    if (!address?.trim()) errors.address = 'Укажите адрес доставки';
    if (!email?.trim()) errors.email = 'Укажите e-mail';
    if (!phone?.trim()) errors.phone = 'Укажите телефон';

    return errors;
  }

  private emitChange(): void {
    this.events.emit('buyer:changed', {
      data: this.get(),
      errors: this.validate(),
    });
  }
}
