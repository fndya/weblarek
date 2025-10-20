// src/components/Models/CartModel.ts
import type { IProduct } from '../../types';

export class CartModel {
  private basket: IProduct[] = [];

  // все товары в корзине
  public getItems(): IProduct[] {
    return this.basket.slice();
  }

  // добавить товар
  public addItem(product: IProduct): void {
    if (!this.has(product.id)) {
      this.basket.push(product);
    }
  }

  // удалить товар по id
  public removeItem(id: string): void {
    this.basket = this.basket.filter((p) => p.id !== id);
  }

  // очистить корзину
  public clear(): void {
    this.basket = [];
  }

  // сумма всех товаров (null-цена не учитывается)
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
}
