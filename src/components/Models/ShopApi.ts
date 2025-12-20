// src/components/Models/ShopApi.ts
import type { IProduct } from '../../types';
import { Api } from '../base/Api';

interface ProductsResponse {
  total: number;
  items: IProduct[];
}

export class ShopApi {
  constructor(private readonly api: Api) {}

  async getProducts(): Promise<IProduct[]> {
    const res = await this.api.get<ProductsResponse>('/product');
    return res.items;
  }

  order(data: Record<string, unknown>): Promise<unknown> {
    return this.api.post('/order', data);
  }
}
