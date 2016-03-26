import {Injectable} from 'angular2/core';

@Injectable()
export class CoreService {
  constructor () {
    this._isLoggedIn = false;
    this._observers = [];
  }
  private _isLoggedIn : boolean;
  get isLoggedIn() : boolean {
    return this._isLoggedIn;
  }
  set isLoggedIn(val:boolean) {
    if(!!val != this._isLoggedIn) {
			console.info("isLoggedIn changed to", val);
      this._isLoggedIn = !!val;
      this._observers.forEach(callback => callback());
    }
  }
  private _observers : any[];
  observeLogin(callback) {
    this._observers.push(callback)
  }
}
