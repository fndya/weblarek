import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class ProductModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(private readonly events: IEvents) {}

  // сохранить массив товаров
  public setItems(items: IProduct[]): void {
    this.items = Array.isArray(items) ? items.slice() : [];
    this.events.emit('catalog:changed', { items: this.getItems() });
  }

  // получить весь каталог
  public getItems(): IProduct[] {
    return this.items.slice();
  }

  // получить один товар по id
  public getItem(id: string): IProduct | undefined {
    return this.items.find((p) => p.id === id);
  }

  // сохранить товар для подробного просмотра
  public setPreview(product: IProduct | null): void {
    this.preview = product;
    this.events.emit('product:selected', { product });
  }

  // получить товар для подробного просмотра
  public getPreview(): IProduct | null {
    return this.preview;
  }
}
