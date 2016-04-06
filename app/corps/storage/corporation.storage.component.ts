import {Component, Input, EventEmitter, Output, OnInit} from 'angular2/core';

import { StorageItem } from './models';
import { CorporationService } from '../corporation.service';
import { StorageItemComponent } from './storage.item.component';
@Component({
  selector: 'corporation-storage',
	templateUrl: 'app/corps/storage/corporation.storage.component.html',
  directives: [StorageItemComponent]
})
export class CorporationStorageComponent implements OnInit {

  constructor(private _corporationService: CorporationService){
    this.isListOpen = true;
  }
  ngOnInit() {
  }

  private _items : StorageItem[];
  @Input('items')
	set items(itemArr : StorageItem[]) {
		//console.log("storage list setter", JSON.stringify(itemArr));
    this._items = itemArr;
	}
	get items() { return this._items; }
  findItemIndex(item : StorageItem) : number {
    for(let i in this._items) {
      if(this._items[i].item.ItemType.id == item.item.ItemType.id) return +i;
    }
    return -1;
  }

  private isListOpen : boolean;
  openList() {
    this.isListOpen = !this.isListOpen;
  }

  @Output('on-change') onChange = new EventEmitter();

  change(item) {
    let i = this.findItemIndex(item);
    this._items[i] = item;
    if(!!this.onChange) this.onChange.emit(this._items);
  }

  @Output('on-scroll') onScroll = new EventEmitter();
  scroll() {
    if(!!this.onScroll) this.onScroll.emit(null);
  }
}
