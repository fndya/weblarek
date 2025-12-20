import { Component } from '../base/Component';

interface GalleryData {
  items: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
  set items(value: HTMLElement[]) {
    this.container.replaceChildren(...value);
  }
}
