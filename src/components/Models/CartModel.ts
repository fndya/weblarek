import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class CartModel {
  private basket: IProduct[] = [];

  constructor(private readonly events: IEvents) {}

  // все товары в корзине
  public getItems(): IProduct[] {
    return this.basket.slice();
  }

  // добавить товар
  public addItem(product: IProduct): void {
    if (!this.has(product.id)) {
      this.basket.push(product);
      this.emitChange();
    }
  }

  // удалить товар по id
  public removeItem(id: string): void {
    this.basket = this.basket.filter((p) => p.id !== id);
    this.emitChange();
  }

  // очистить корзину
  public clear(): void {
    this.basket = [];
    this.emitChange();
  }

  // сумма всех товаров
  public getTotal(): number {
    return this.basket.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  // количество позиций
  public getCount(): number {
    return this.basket.length;
  }

  // товар уже в корзине?
  public has(id: string): boolean {
    return this.basket.some((p) => p.id === id);
  }

  private emitChange(): void {
    this.events.emit('basket:changed', {
      items: this.getItems(),
      total: this.getTotal(),
      count: this.getCount(),
    });
  }
}
