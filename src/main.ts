import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';

import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
//import { BuyerModel } from './components/Models/BuyerModel';
import { ShopApi } from './components/Models/ShopApi';

import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
//import { Modal } from './components/view/Modal';
import { CatalogCard } from './components/view/cards/CatalogCard';

import { API_URL } from './utils/constants';
import type { IProduct } from './types';

const events = new EventEmitter();

// API
const api = new Api(API_URL, {
  headers: { 'Content-Type': 'application/json' },
});
const shopApi = new ShopApi(api);

// Models
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
//const buyerModel = new BuyerModel(events);

// View
const header = new Header(
  document.querySelector('.header') as HTMLElement,
  events
);
const gallery = new Gallery(
  document.querySelector('.gallery') as HTMLElement
);
// const modal = new Modal(
//   document.querySelector('.modal') as HTMLElement,
//   events
// );

// helpers
const tplCatalog = document.querySelector(
  '#card-catalog'
) as HTMLTemplateElement;

function renderCatalog(): void {
  const cards = productModel.getItems().map((product: IProduct) => {
    const node = tplCatalog.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement;

    const card = new CatalogCard(node, {
      onSelect: () => productModel.setPreview(product),
      //onAdd: () => cartModel.addItem(product),
    });

    card.render({
     title: product.title,
     price: product.price,
    });
    card.category = product.category;
    card.image = product.image;

    return card.render();
  });

  gallery.render({ items: cards });
}

function renderHeader(): void {
  header.render({ count: cartModel.getCount() });
}

// Events
events.on('catalog:changed', renderCatalog);
events.on('basket:changed', renderHeader);

events.on('preview:changed', () => {
  // сюда позже превью
});

events.on('basket:open', () => {
  // сюда позже корзину
});

// init
(async () => {
  const products = await shopApi.getProducts();
  console.log('PRODUCTS FROM API:', products);
  productModel.setItems(products);
  renderHeader();
})();

const galleryRoot = document.querySelector('.gallery');

if (!galleryRoot) {
  throw new Error('Gallery root not found');
}
gallery.render({
  items: [
    document.createElement('div')
  ]
});

const testDiv = document.createElement('div');
  testDiv.textContent = 'TEST RENDER';
  testDiv.style.color = 'red';

  gallery.render({
    items: [testDiv],
});


