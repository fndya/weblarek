import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class CartModel {
  private basket: IProduct[] = [];

  constructor(private readonly events: IEvents) {}

  getItems(): IProduct[] {
    return [...this.basket];
  }

  addItem(product: IProduct): void {
    if (!this.has(product.id)) {
      this.basket.push(product);
      this.emitChange();
    }
  }

  removeItem(id: string): void {
    this.basket = this.basket.filter((p) => p.id !== id);
    this.emitChange();
  }

  clear(): void {
    this.basket = [];
    this.emitChange();
  }

  getTotal(): number {
    return this.basket.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  getCount(): number {
    return this.basket.length;
  }

  has(id: string): boolean {
    return this.basket.some((p) => p.id === id);
  }

  private emitChange(): void {
    this.events.emit('basket:changed');
  }
}
