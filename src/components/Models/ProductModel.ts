import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class ProductModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(private readonly events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed'); // ❗ КРИТИЧНО
  }

  getItems(): IProduct[] {
    return this.items;
  }

  setPreview(product: IProduct): void {
    this.preview = product;
    this.events.emit('preview:changed');
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
