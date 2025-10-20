// src/components/Models/BuyerModel.ts
import type { IBuyer } from '../../types';

type BuyerPartial = Partial<IBuyer>;

// объект ошибок валидации: только для полей с ошибками
export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class BuyerModel {
  private data: BuyerPartial = {};

  // сохранить частичные данные (не затирая остальные)
  public set(partial: BuyerPartial): void {
    this.data = { ...this.data, ...partial };
  }

  // получить все сохранённые на текущий момент данные
  public get(): BuyerPartial {
    return { ...this.data };
  }

  // очистить всё
  public clear(): void {
    this.data = {};
  }

  // простая валидация по ТЗ: поле валидно, если оно НЕ пустое
  // возвращаем объект только с ошибочными полями
  public validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};
    const { payment, address, email, phone } = this.data;

    if (!payment) errors.payment = 'Не выбран вид оплаты';
    if (!address?.trim()) errors.address = 'Укажите адрес доставки';
    if (!email?.trim()) errors.email = 'Укажите e-mail';
    if (!phone?.trim()) errors.phone = 'Укажите телефон';

    return errors;
  }
}
