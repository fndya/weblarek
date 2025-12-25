import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { ProductModel } from './components/Models/ProductModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { CartModel } from './components/Models/CartModel';
import { ShopApi } from './components/Models/ShopApi';

import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';

import { CatalogCard } from './components/view/cards/CatalogCard';
import { PreviewCard } from './components/view/cards/PreviewCard';

import { API_URL } from './utils/constants';
import type { IProduct } from './types';

import { Header } from './components/view/Header';

import { BasketCard } from './components/view/cards/BasketCard';
import { Basket } from './components/view/Basket';

import { OrderPaymentForm } from './components/view/forms/OrderPaymentForm';
import { OrderContactsForm } from './components/view/forms/OrderContactsForm';

import { Success } from './components/view/Success';

/* =====================
   ИНИЦИАЛИЗАЦИЯ
===================== */

const events = new EventEmitter();

const api = new Api(API_URL, {
  headers: { 'Content-Type': 'application/json' },
});

const shopApi = new ShopApi(api);

// модели
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// view
const galleryRoot = document.querySelector<HTMLElement>('.gallery')!;
const modalRoot = document.querySelector<HTMLElement>('.modal')!;

const gallery = new Gallery(galleryRoot);
const modal = new Modal(modalRoot, events);

const headerEl = document.querySelector('.header') as HTMLElement;
const header = new Header(headerEl, events);

/* =====================
   СОСТОЯНИЕ МОДАЛКИ
===================== */

type ModalView = 'none' | 'basket' | 'preview' | 'order' | 'contacts' | 'success';
let currentModalView: ModalView = 'none';

/* =====================
   ЗАГРУЗКА КАТАЛОГА
===================== */

(async () => {
  const products = await shopApi.getProducts();
  productModel.setItems(products);
})();

/* =====================
   РЕНДЕР КАТАЛОГА
===================== */

function renderCatalog() {
  const cards = productModel.getItems().map((product: IProduct) => {
    const template = document.querySelector<HTMLTemplateElement>('#card-catalog')!;
    const node = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new CatalogCard(node, {
      onSelect: () => {
        events.emit('card:select', { id: product.id });
      },
    });

    card.render({
      title: product.title,
      price: product.price,
    });

    card.image = product.image;
    card.category = product.category;

    return card.render();
  });

  gallery.render({ items: cards });
}

events.on('catalog:changed', () => {
  renderCatalog();
});

/* =====================
   ВЫБОР КАРТОЧКИ
===================== */

events.on('card:select', (data) => {
  const { id } = data as { id: string };

  const product = productModel.getItems().find((p) => p.id === id);
  if (!product) return;

  productModel.setPreview(product);
});

/* =====================
   ПРЕВЬЮ ТОВАРА
===================== */

events.on('preview:changed', () => {
  const product = productModel.getPreview();
  if (!product) return;

  currentModalView = 'preview';

  const template = document.querySelector<HTMLTemplateElement>('#card-preview')!;
  const node = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const card = new PreviewCard(node, {
    onBuy: () => {
      events.emit('product:add', { id: product.id });
    },
    onRemove: () => {
      events.emit('product:remove', { id: product.id });
    },
  });

  card.render({
    title: product.title,
    price: product.price,
  });

  card.image = product.image;
  card.description = product.description;
  card.inBasket = cartModel.has(product.id);
  card.category = product.category;

  modal.open(card.render());
});

/* =====================
   ХЕДЕР / СЧЕТЧИК
===================== */

events.on('basket:changed', () => {
  // обновляем счётчик всегда
  header.render({
    count: cartModel.getCount(),
  });

  // перерисовываем корзину ТОЛЬКО если она реально открыта
  if (currentModalView === 'basket') {
    events.emit('basket:open', {});
  }
});

/* =====================
   КОРЗИНА
===================== */

events.on('basket:open', () => {
  currentModalView = 'basket';

  const items = cartModel.getItems();

  // пустая корзина
  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Корзина пуста';
    modal.open(empty);
    return;
  }

  // карточки корзины
  const basketCards = items.map((product) => {
    const cardTpl = document.querySelector<HTMLTemplateElement>('#card-basket')!;
    const cardNode = cardTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new BasketCard(cardNode, {
      onRemove: () => {
        events.emit('product:remove', { id: product.id });
      },
    });

    card.render({
      title: product.title,
      price: product.price,
    });

    return card.render();
  });

  const basketTpl = document.querySelector<HTMLTemplateElement>('#basket')!;
  const basketNode = basketTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const basket = new Basket(basketNode, events);
  basket.render({
    items: basketCards,
    total: cartModel.getTotal(),
    canOrder: cartModel.getCount() > 0,
  });

  modal.open(basket.render());
});

/* =====================
   ДОБАВЛЕНИЕ / УДАЛЕНИЕ
===================== */

events.on('product:add', (data) => {
  const { id } = data as { id: string };

  const product = productModel.getItems().find((p) => p.id === id);
  if (!product) return;

  cartModel.addItem(product);
  events.emit('modal:close');
});

events.on('product:remove', (data) => {
  const { id } = data as { id: string };

  cartModel.removeItem(id);
  events.emit('modal:close');
});

/* =====================
   ФОРМЫ
===================== */

let orderPaymentForm: OrderPaymentForm | null = null;
let contactsForm: OrderContactsForm | null = null;

function getPaymentStepErrors() {
  const buyer = buyerModel.get();
  const errors: Record<string, string> = {};

  if (!buyer.payment) {
    errors.payment = 'Не выбран вид оплаты';
  }

  if (!buyer.address?.trim()) {
    errors.address = 'Укажите адрес доставки';
  }

  return errors;
}

function getContactsStepErrors() {
  const buyer = buyerModel.get();
  const errors: Record<string, string> = {};

  if (!buyer.email?.trim()) {
    errors.email = 'Укажите e-mail';
  }

  if (!buyer.phone?.trim()) {
    errors.phone = 'Укажите телефон';
  }

  return errors;
}

events.on('order:open', () => {
  currentModalView = 'order';

  const tpl = document.querySelector<HTMLTemplateElement>('#order')!;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

  orderPaymentForm = new OrderPaymentForm(node, events);
  contactsForm = null;

  const buyer = buyerModel.get();
  const errors = getPaymentStepErrors();

  orderPaymentForm.render({
    payment: buyer.payment,
    address: buyer.address,
    errors,
    canSubmit: Object.keys(errors).length === 0,
  });

  modal.open(orderPaymentForm.render());
});

events.on('buyer:changed', () => {
  const buyer = buyerModel.get();

  if (contactsForm) {
    const errors = getContactsStepErrors();

    contactsForm.render({
      email: buyer.email,
      phone: buyer.phone,
      errors,
      canSubmit: Object.keys(errors).length === 0,
    });
    return;
  }

  if (orderPaymentForm) {
    const errors = getPaymentStepErrors();

    orderPaymentForm.render({
      payment: buyer.payment,
      address: buyer.address,
      errors,
      canSubmit: Object.keys(errors).length === 0,
    });
  }
});

events.on('form:change', (data) => {
  const { field, value } = data as { field: string; value: string };
  buyerModel.set({ [field]: value });
});

events.on('order:next', () => {
  const errors = getPaymentStepErrors();

  if (Object.keys(errors).length > 0) {
    orderPaymentForm?.render({
      ...buyerModel.get(),
      errors,
      canSubmit: false,
    });
    return;
  }

  events.emit('order:contacts');
});

events.on('order:contacts', () => {
  currentModalView = 'contacts';

  const tpl = document.querySelector<HTMLTemplateElement>('#contacts')!;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

  orderPaymentForm = null;

  contactsForm = new OrderContactsForm(node, events);

  const buyer = buyerModel.get();
  const errors = getContactsStepErrors();

  modal.open(
    contactsForm.render({
      email: buyer.email,
      phone: buyer.phone,
      errors,
      canSubmit: Object.keys(errors).length === 0,
    })
  );
});

events.on('order:pay', async () => {
  const errors = getContactsStepErrors();
  if (Object.keys(errors).length > 0) {
    contactsForm?.render({
      ...buyerModel.get(),
      errors,
      canSubmit: false,
    });
    return;
  }

  const buyer = buyerModel.get();

  const order = {
    payment: (buyer.payment === 'card' ? 'online' : 'cash') as 'online' | 'cash',
    email: buyer.email!,
    phone: buyer.phone!,
    address: buyer.address!,
    total: cartModel.getTotal(),
    items: cartModel.getItems().map((p) => p.id),
  };

  try {
    const result = await shopApi.order(order);
    events.emit('order:success', result);
  } catch (e) {
    console.error('Ошибка оформления заказа', e);
  }
});

events.on('order:success', ({ total }: { total: number }) => {
  currentModalView = 'success';

  const tpl = document.querySelector<HTMLTemplateElement>('#success')!;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const success = new Success(node);
  success.render({ total });

  modal.open(success.render());

  cartModel.clear();
  buyerModel.clear();
});
