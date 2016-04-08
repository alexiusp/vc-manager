import {Component, Input, EventEmitter, Output} from 'angular2/core';

import { StorageItem } from './models';

@Component({
  selector: '[storage-item]',
	templateUrl: 'app/corps/storage/storage.item.component.html'
})
export class StorageItemComponent {
	@Input('storage-item')
	item : StorageItem;

  @Output('on-change') onChange = new EventEmitter();

  transfer() {
    let v = !this.item.isTransfer;
    this.item.isTransfer = v;
    if(!!this.onChange) this.onChange.emit(this.item);
  }

  sell() {
    let v = !this.item.isSell;
    this.item.isSell = v;
    if(!!this.onChange) this.onChange.emit(this.item);
  }

}
