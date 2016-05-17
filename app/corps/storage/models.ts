/**
* Models - UI specific representations of contracted data
**/
import {BaseStorageElement} from './contracts';
import {SelectableItem} from '../../core/classes';

export class StorageItem extends SelectableItem {
  _item : BaseStorageElement;
  get item() {
    return this._item;
  }
  set item(i : BaseStorageElement) {
    this._item = i;
  }
  constructor(i : BaseStorageElement) {
    super();
    this._item = i;
  }
  private _isTransfer : boolean;
  get isTransfer() {
    return !!this._isTransfer;
  }
  set isTransfer(val : boolean) {
    this._isTransfer = val;
    let s = this.isSell || val;
    //console.log("set Transfer", val, s);
    this.isSelected = s;
  }
	public amountTransfer : number;
  private _isSell : boolean;
  get isSell() {
    return !!this._isSell;
  }
  set isSell(val : boolean) {
    this._isSell = val;
    let s = this.isTransfer || val;
    //console.log("set Sell", val, s);
    this.isSelected = s;
  }
	public amountSell : number;
}
