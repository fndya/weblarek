import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { ShopApi } from './components/Models/ShopApi';

import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';

import { CatalogCard } from './components/view/cards/CatalogCard';
import { PreviewCard } from './components/view/cards/PreviewCard';

import { API_URL } from './utils/constants';
import type { IProduct } from './types';

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

// view
const galleryRoot = document.querySelector<HTMLElement>('.gallery')!;
const modalRoot = document.querySelector<HTMLElement>('.modal')!;

const gallery = new Gallery(galleryRoot);
const modal = new Modal(modalRoot, events);

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
    const template = document.querySelector<HTMLTemplateElement>(
      '#card-catalog'
    )!;
    const node = template.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;

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

  const template = document.querySelector<HTMLTemplateElement>(
    '#card-preview'
  )!;
  const node = template.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;

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
   КОРЗИНА
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

