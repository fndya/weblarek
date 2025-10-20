// src/components/Models/ProductsModel.ts
import type { IProduct } from '../../types';

export class ProductModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  // сохранить массив товаров
  public setItems(items: IProduct[]): void {
    this.items = Array.isArray(items) ? items.slice() : [];
  }

  // получить весь каталог
  public getItems(): IProduct[] {
    return this.items.slice();
  }

  // получить один товар по id
  public getItem(id: string): IProduct | undefined {
    return this.items.find((p) => p.id === id);
  }

  // сохранить товар для подробного просмотра (модалка)
  public setPreview(product: IProduct | null): void {
    this.preview = product;
  }

  // получить товар для подробного просмотра
  public getPreview(): IProduct | null {
    return this.preview;
  }
}
