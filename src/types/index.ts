export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Способ оплаты
export type TPayment = 'card' | 'cash';

// Товар
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Покупатель
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Заказ (что отправляем на сервер при оформлении)
export interface IOrderRequestApi {
  payment: 'online' | 'cash';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Ответ сервера на заказ
export interface IOrderResponse {
  id: string;            // id заказа
  total: number;
}

export interface IProductsListResponse {
  total: number;
  items: IProduct[];
}
