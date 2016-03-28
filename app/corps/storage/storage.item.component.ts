import {Component, Input, EventEmitter, Output} from 'angular2/core';

import {CorporationStorageElement} from '../corporation';

@Component({
  selector: '[corp-storage-item]',
	templateUrl: 'app/corps/storage/storage.item.component.html'
})
export class StorageItemComponent {
	@Input('corp-storage-item')
	item : CorporationStorageElement;

	@Output('on-delete') onDelete = new EventEmitter();
	removeItem() {
		if(!!this.onDelete) this.onDelete.emit(null);
	}

	private _amount;
	@Output('on-change') onChange = new EventEmitter();
	setAmount(value : number) {
		//console.log("setAmount",value);
		this._amount = value;
		if(!!this.onChange) this.onChange.emit(value);
	}
}
