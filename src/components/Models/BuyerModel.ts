import type { IBuyer } from '../../types';
import type { IEvents } from '../base/Events';

type BuyerPartial = Partial<IBuyer>;
export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel {
  private data: BuyerPartial = {};

  constructor(private readonly events: IEvents) {}

  set(partial: BuyerPartial): void {
    this.data = { ...this.data, ...partial };
    this.emitChange();
  }

  get(): BuyerPartial {
    return { ...this.data };
  }

  clear(): void {
    this.data = {};
    this.emitChange();
  }

  validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};
    const { payment, address, email, phone } = this.data;

    if (!payment) errors.payment = 'Не выбран вид оплаты';
    if (!address?.trim()) errors.address = 'Укажите адрес доставки';
    if (!email?.trim()) errors.email = 'Укажите e-mail';
    if (!phone?.trim()) errors.phone = 'Укажите телефон';

    return errors;
  }

  validatePaymentStep(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};
    const { payment, address } = this.data;

    if (!payment) errors.payment = 'Не выбран вид оплаты';
    if (!address?.trim()) errors.address = 'Укажите адрес доставки';

    return errors;
  }

  validateContactsStep(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};
    const { email, phone } = this.data;

    if (!email?.trim()) errors.email = 'Укажите e-mail';
    if (!phone?.trim()) errors.phone = 'Укажите телефон';

    return errors;
  }

  private emitChange(): void {
    this.events.emit('buyer:changed');
  }
}
  