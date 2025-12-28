import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { ProductModel } from './components/Models/ProductModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { CartModel } from './components/Models/CartModel';
import { ShopApi } from './components/Models/ShopApi';

import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';

import { CatalogCard } from './components/view/cards/CatalogCard';
import { PreviewCard } from './components/view/cards/PreviewCard';
import { BasketCard } from './components/view/cards/BasketCard';

import { Basket } from './components/view/Basket';

import { OrderPaymentForm } from './components/view/forms/OrderPaymentForm';
import { OrderContactsForm } from './components/view/forms/OrderContactsForm';

import { Success } from './components/view/Success';

import { API_URL } from './utils/constants';
import type { IProduct } from './types';

import { ensureElement, cloneTemplate } from './utils/utils';

/* =====================
   ИНИЦИАЛИЗАЦИЯ
===================== */

const events = new EventEmitter();

const api = new Api(API_URL, {
  headers: { 'Content-Type': 'application/json' },
});

const shopApi = new ShopApi(api);

const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const galleryRoot = ensureElement<HTMLElement>('.gallery');
const modalRoot = ensureElement<HTMLElement>('.modal');
const headerRoot = ensureElement<HTMLElement>('.header');

const gallery = new Gallery(galleryRoot);
const modal = new Modal(modalRoot, events);
const header = new Header(headerRoot, events);

/* =====================
   ЗАГРУЗКА ШАБЛОНОВ
===================== */

const tplCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const tplPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const tplBasketCard = ensureElement<HTMLTemplateElement>('#card-basket');
const tplBasket = ensureElement<HTMLTemplateElement>('#basket');
const tplOrder = ensureElement<HTMLTemplateElement>('#order');
const tplContacts = ensureElement<HTMLTemplateElement>('#contacts');
const tplSuccess = ensureElement<HTMLTemplateElement>('#success');

/* =====================
   ЗАГРУЗКА КАРТОЧЕК
===================== */

const previewCard = new PreviewCard(cloneTemplate(tplPreview), {
  onClick: () => {
    const product = productModel.getPreview();
    if (!product) return;

    if (cartModel.has(product.id)) {
      cartModel.removeItem(product.id);
    } else {
      if (product.price === null) return;
      cartModel.addItem(product);
    }

    modal.close();
  },
});

const basketView = new Basket(cloneTemplate(tplBasket), events);

const paymentForm = new OrderPaymentForm(cloneTemplate(tplOrder), events);
const contactsForm = new OrderContactsForm(cloneTemplate(tplContacts), events);

const successView = new Success(cloneTemplate(tplSuccess), events);

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
    const card = new CatalogCard(cloneTemplate(tplCatalog), {
      onSelect: () => events.emit('card:select', { id: product.id }),
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

events.on('catalog:changed', renderCatalog);

/* =====================
   ВЫБОР ТОВАРА
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

  const inBasket = cartModel.has(product.id);
  const canBuy = product.price !== null;

  const buttonText = !canBuy ? 'Недоступно' : inBasket ? 'Удалить' : 'Купить';

  previewCard.render({
    title: product.title,
    price: product.price,
  });

  previewCard.image = product.image;
  previewCard.description = product.description;
  previewCard.category = product.category;

  previewCard.buttonText = buttonText;
  previewCard.buttonDisabled = !canBuy;

  modal.open(previewCard.render());
});

/* =====================
  СЧЕТЧИК В ХЕДЕРЕ
===================== */

events.on('basket:changed', () => {
  header.render({ count: cartModel.getCount() });

  renderBasket();
});

/* =====================
   РЕНДЕР ДАННЫХ КОРЗИНЫ
===================== */

function renderBasket() {
  const items = cartModel.getItems();

  const basketCards = items.map((product, index) => {
    const card = new BasketCard(cloneTemplate(tplBasketCard), {
      onRemove: () => {
        events.emit('product:remove:basket', { id: product.id });
      },
    });

    const el = card.render({
      title: product.title,
      price: product.price,
    });

    card.index = index + 1;

    return el;
  });

  basketView.render({
    items: basketCards,
    total: cartModel.getTotal(),
    canOrder: cartModel.getCount() > 0,
  });
}


/* =====================
   ОТКРЫТИЕ КОРЗИНЫ
===================== */

events.on('basket:open', () => {
  renderBasket();
  modal.open(basketView.render());
});

/* =====================
   УДАЛЕНИЕ ИЗ КОРЗИНЫ
===================== */

events.on('product:remove:basket', (data) => {
  const { id } = data as { id: string };
  cartModel.removeItem(id);
});

/* =====================
   ОФОРМЛЕНИЕ ЗАКАЗА
===================== */

events.on('order:open', () => {
  const buyer = buyerModel.get();
  const errors = buyerModel.validatePaymentStep();

  paymentForm.render({
    payment: buyer.payment,
    address: buyer.address,
    errors,
    canSubmit: Object.keys(errors).length === 0,
  });

  modal.open(paymentForm.render());
});

/* =====================
   ОБНОВЛЕНИЕ ФОРМ ПРИ buyer:changed
===================== */

events.on('buyer:changed', () => {
  const buyer = buyerModel.get();

  const paymentErrors = buyerModel.validatePaymentStep();
  paymentForm.render({
    payment: buyer.payment,
    address: buyer.address,
    errors: paymentErrors,
    canSubmit: Object.keys(paymentErrors).length === 0,
  });

  const contactErrors = buyerModel.validateContactsStep();
  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    errors: contactErrors,
    canSubmit: Object.keys(contactErrors).length === 0,
  });
});

/* =====================
   ИЗМЕНЕНИЯ ПОЛЕЙ ФОРМ
===================== */

events.on('form:change', (data) => {
  const { field, value } = data as { field: string; value: string };
  buyerModel.set({ [field]: value });
});

/* =====================
   SUBMIT 1-й ФОРМЫ (order:submit)
===================== */

events.on('order:submit', () => {
  const errors = buyerModel.validatePaymentStep();

  if (Object.keys(errors).length > 0) {
    paymentForm.render({
      ...buyerModel.get(),
      errors,
      canSubmit: false,
    });
    return;
  }

  openContactsForm();
});

function openContactsForm() {
  const buyer = buyerModel.get();
  const errors = buyerModel.validateContactsStep();

  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    errors,
    canSubmit: Object.keys(errors).length === 0,
  });

  modal.open(contactsForm.render());
}

/* =====================
   SUBMIT 2-й ФОРМЫ (contacts:submit)
===================== */

events.on('contacts:submit', async () => {
  const errors = buyerModel.validateContactsStep();

  if (Object.keys(errors).length > 0) {
    contactsForm.render({
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
    showSuccess(result.total);
  } catch (e) {
    console.error('Ошибка оформления заказа', e);
  }
});

function showSuccess(total: number) {
  successView.render({ total });
  modal.open(successView.render());

  cartModel.clear();
  buyerModel.clear();
}

events.on('success:close', () => {
  modal.close();
});
