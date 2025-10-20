// src/components/Models/ShopApi.ts
import type { IProduct, IBuyer, IOrderRequestApi, IOrderResponse, TPayment } from '../../types';
import type { IApi } from '../../types';
import { Api } from '../base/Api';

type ProductsListResponse = {
  total: number;
  items: IProduct[];
};

const mapPaymentToApi = (payment: TPayment): IOrderRequestApi['payment'] =>
  payment === 'card' ? 'online' : 'cash';

export class ShopApi {
  private api: IApi;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.api = new Api(baseUrl, options);
  }

  public async getProducts(): Promise<IProduct[]> {
    const res = await this.api.get('/product');
    const data = res as ProductsListResponse;      
    return Array.isArray(data.items) ? data.items : [];
  }

  public async getProduct(id: string): Promise<IProduct> {
    const res = await this.api.get(`/product/${id}`);
    return res as IProduct;
  }

  public async postOrder(buyer: IBuyer, items: string[], total: number): Promise<IOrderResponse> {
    const payload: IOrderRequestApi = {
      payment: mapPaymentToApi(buyer.payment),
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      total,
      items,
    };
    const res = await this.api.post('/order', payload, 'POST');
    return res as IOrderResponse;
  }
}
