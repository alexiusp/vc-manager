import {Injectable} from 'angular2/core';

@Injectable()
export class StorageService {
  _ls : Storage;

  constructor() {
    this._ls = window.localStorage;
  }
  get isLoaded() : boolean {
    return !!this._ls;
  }
  loadData(key: string) {
    return JSON.parse(this._ls.getItem(key));
  }
  saveData(key: string, data: any) {
    this._ls.setItem(key, JSON.stringify(data));
  }
  removeData(key: string) {
    this._ls.removeItem(key);
  }
}
