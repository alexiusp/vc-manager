import {Component, Input, EventEmitter, Output} from 'angular2/core';

import {CorporationStorageElement} from '../corporation';
import {StorageItemComponent} from './storage.item.component';

@Component({
  selector: 'supply-list',
	templateUrl: 'app/corps/storage/supply.list.component.html',
	directives: [StorageItemComponent]
})
export class SupplyListComponent {
	private _items : CorporationStorageElement[];
	private _amounts : number[];

	constructor() {
		this._items = [];
		this._amounts = [];
	}
	@Input('items')
	set items(itemArr : CorporationStorageElement[]) {
		//console.log("supply list setter", JSON.stringify(itemArr));
		this._items = [];
		if(!!itemArr && itemArr.length > 0) {
			for(let i of itemArr)
				this.addItem(i);
		}
	}
	get items() { return this._items; }

	addItem(item : CorporationStorageElement) {
		this._items.push(item);
		this._amounts[item.ItemType.id] = item[0].total_quantity;
	}
	removeItem(index: number) {
		console.log("removeItem", index);
		this._amounts.splice(this._items[index].ItemType.id, 1);
		this._items.splice(index, 1);
	}
	changeAmount(item : CorporationStorageElement, value : number) {
		console.log("changeAmount", item, value);
		this._amounts[item.ItemType.id] = +value;
	}
	@Output('on-transfer') onTransfer = new EventEmitter();
	transfer() {
		let supplyList : TransferItem[] = [];
		for(let item of this._items) {
			let itemId = item.ItemType.id;
			let t = <TransferItem> {
				id : itemId,
				amount: +this._amounts[itemId]
			};
			supplyList.push(t);
		}
		if(!!this.onTransfer) this.onTransfer.emit(supplyList);
	}
	sale() {

	}
	save() {

	}
}
export interface TransferItem {
	id			: number;
	amount	: number;
}
