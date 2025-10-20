import './scss/styles.scss';

// src/main.ts
import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { ShopApi } from './components/Models/ShopApi';

import { apiProducts } from './utils/data'; 
import type { IProduct, IBuyer } from './types';

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN as string;

// 1) Создаём экземпляры моделей
const productModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

console.log('--- ТЕСТЫ МОДЕЛЕЙ НА ЛОКАЛЬНЫХ ДАННЫХ ---');

// 2) ProductModel: сохранить и прочитать список (локальные данные)
productModel.setItems(apiProducts.items as IProduct[]);
console.log('Каталог (локальные данные):', productModel.getItems());


const firstId = productModel.getItems()[0]?.id;
if (firstId) {
  const first = productModel.getItem(firstId)!;
  productModel.setPreview(first);
  console.log('Товар для подробного просмотра:', productModel.getPreview());
}

// 3) CartModel: 
if (firstId) {
  const first = productModel.getItem(firstId)!;
  cartModel.addItem(first);
  console.log('Корзина после добавления:', cartModel.getItems());
  console.log('Есть товар в корзине?', cartModel.has(firstId));
  console.log('Счётчик корзины:', cartModel.getCount());
  console.log('Сумма корзины:', cartModel.getTotal());
  cartModel.removeItem(firstId);
  console.log('Корзина после удаления:', cartModel.getItems());
  console.log('Счётчик корзины:', cartModel.getCount());
  console.log('Сумма корзины:', cartModel.getTotal());
}

// 4) BuyerModel: 
buyerModel.set({ payment: 'card' });
buyerModel.set({ address: 'Невский пр., 1' });
buyerModel.set({ email: 'test@example.com' });
buyerModel.set({ phone: '+7 999 000-00-00' });
console.log('Данные покупателя (частичные):', buyerModel.get());
console.log('Ошибки валидации (ожидаем пусто):', buyerModel.validate());

// 5) Коммуникационный слой:
const shopApi = new ShopApi(API_ORIGIN, {
  headers: { 'Content-Type': 'application/json' },
});

(async () => {
  try {
    // Загрузка каталога с сервера
    const serverProducts = await shopApi.getProducts();
    productModel.setItems(serverProducts);
    console.log('Каталог (с сервера):', productModel.getItems());

    // Пример подготовки данных заказа
    const selectable = productModel.getItems().filter((p) => p.price !== null).slice(0, 2);
    selectable.forEach((p) => cartModel.addItem(p));

    const buyer = buyerModel.get() as IBuyer;
    const itemIds = cartModel.getItems().map((p) => p.id);
    const total = cartModel.getTotal();

    console.log('Готово к отправке (buyer, items, total):', buyer, itemIds, total);

  } catch (e) {
    console.error('Ошибка при работе с API:', e);
  }
})();
