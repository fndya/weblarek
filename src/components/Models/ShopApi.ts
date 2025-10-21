// src/components/Models/ShopApi.ts
import type {
  IProduct,
  IBuyer,
  IOrderRequestApi,
  IOrderResponse,
  TPayment,
  IProductsListResponse,
  IApi
} from '../../types';

export class ShopApi {
  constructor(private api: IApi) {}

  private mapPayment(payment: TPayment): IOrderRequestApi['payment'] {
    return payment === 'card' ? 'online' : 'cash';
  }

  public async getProducts(): Promise<IProduct[]> {
    const res = await this.api.get<IProductsListResponse>('/product/');
    return res.items;
  }

  public async getProduct(id: string): Promise<IProduct> {
    const res = await this.api.get<IProduct>(`/product/${id}`);
    return res;
  }

  public async postOrder(buyer: IBuyer, items: string[], total: number): Promise<IOrderResponse> {
    const payload: IOrderRequestApi = {
      payment: this.mapPayment(buyer.payment),
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      total,
      items,
    };
    const res = await this.api.post<IOrderResponse>('/order', payload);
    return res;
  }
}
