import {Component, Input, EventEmitter, Output} from 'angular2/core';

import { StorageItem } from './models';
import { StorageItemComponent } from './storage.item.component';

@Component({
  selector: '[company-storage]',
	templateUrl: 'app/corps/storage/company.storage.component.html',
  directives: [StorageItemComponent]
})
export class CompanyStorageComponent {

  constructor(){
  }

  private _items : StorageItem[];
  @Input('company-storage')
	set items(itemArr : StorageItem[]) {
		//console.log("storage list setter", itemArr);
    this._items = itemArr;
	}
	get items() { return this._items; }
  findItemIndex(item : StorageItem) : number {
    for(let i in this._items) {
      if(this._items[i].item.ItemType.id == item.item.ItemType.id) return +i;
    }
    return -1;
  }
  @Output('on-change') onChange = new EventEmitter();
  change(item) {
    let i = this.findItemIndex(item);
    this._items[i] = item;
    if(!!this.onChange) this.onChange.emit(this._items);
  }
}
