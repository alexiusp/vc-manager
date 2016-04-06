import {SelectableItem} from '../core/classes';
import {Company} from './contracts';

export class CompanyItem extends SelectableItem {
  private _item : Company;
  get item() {
    return this._item;
  }
  set item(i : Company) {
    this._item = i;
  }
  constructor(i : Company) {
    super();
    this._item = i;
    this.isOpen = false;
  }
  private _isOpen : boolean;
  get isOpen() {
    return !!this._isOpen;
  }
  set isOpen(val : boolean) {
    this._isOpen = val;
  }
}
