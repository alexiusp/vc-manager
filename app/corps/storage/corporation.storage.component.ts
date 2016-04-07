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
    this.filterDropdownOpen = false;
    this.currentFilter = "all";
    this.filterTitle = "Filter";
  }

  private _items : StorageItem[];
  @Input('items')
	set items(itemArr : StorageItem[]) {
		//console.log("storage list setter", JSON.stringify(itemArr));
    let types = [];
    if(!!itemArr) for(let i of itemArr) {
      if(types.indexOf(i.item.ItemType.type) == -1) types.push(i.item.ItemType.type);
      //if(types.indexOf(i.item.ItemType.receipt_type) == -1) types.push(i.item.ItemType.receipt_type);
    }
		console.log("item types:", types);
    types.unshift("all");
    this.types = types;
    this._items = itemArr;
	}
	get items() {
    if(this.currentFilter != "all") {
      let iArr = [];
      for(let i of this._items)
        if(i.item.ItemType.type == this.currentFilter) iArr.push(i);
      return iArr;
    } else return this._items;
  }
  findItemIndex(item : StorageItem) : number {
    for(let i in this._items) {
      if(this._items[i].item.ItemType.id == item.item.ItemType.id) return +i;
    }
    return -1;
  }
  private types : string[];
  private filterDropdownOpen : boolean;
  private currentFilter : string;
  private filterTitle : string;
  toggleFilter() {
    this.filterDropdownOpen = !this.filterDropdownOpen;
  }
  filterList(type : string) {
    //console.log("filter:", type);
    this.currentFilter = type;
    this.filterTitle = (type == "all")? "Filter" : type;
    this.toggleFilter();
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
