// src/components/Models/ShopApi.ts
import type {
  IProduct,
  IOrderRequestApi,
  IOrderResponse,
} from '../../types';
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

  order(data: IOrderRequestApi): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', data);
  }
}
