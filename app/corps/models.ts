import { SelectableItem, LoadableItem } from '../core/classes';
import { Company, CompanyDetail } from './contracts';
import { StorageItem } from './storage/models';

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

export class CompanyDetailItem extends LoadableItem {
  private _item : CompanyDetail;
  private _storage : StorageItem[];
  constructor(i? : CompanyDetail) {
    super();
    if(!!i) {
      this._item = i;
      this.checkLoading();
    }
    this.isOpen = false;
  }
  checkLoading() {
    if(!!this._item && !!this._storage) this.isLoading = false;
    else this.isLoading = true;
  }
  get item() {
    return this._item;
  }
  set item(i : CompanyDetail) {
    this._item = i;
    this.checkLoading();
  }
  get storage() {
    return this._storage;
  }
  set storage(list : StorageItem[]) {
    this._storage = list;
    this.checkLoading();
  }

  private _isOpen : boolean;
  get isOpen() {
    return !!this._isOpen;
  }
  set isOpen(val : boolean) {
    this._isOpen = val;
  }
}
