import {Injectable} from 'angular2/core';

@Injectable()
export class CoreService {
  constructor () {
    this._isLoggedIn = false;
    this._loginObservers = [];
    this._loadingCounter = 0;
    this._loadingObservers = [];
  }
  private _loginObservers : any[];
  private _isLoggedIn : boolean;
  get isLoggedIn() : boolean {
    return this._isLoggedIn;
  }
  set isLoggedIn(val:boolean) {
    if(!!val != this._isLoggedIn) {
			//console.info("isLoggedIn changed to", val);
      this._isLoggedIn = !!val;
      for(let callback of this._loginObservers) callback(this._isLoggedIn);
    }
  }
  observeLogin(callback) {
    if(!!callback && typeof callback === "function") this._loginObservers.push(callback)
  }

  private _loading : boolean;
  private _loadingCounter : number;
  private _loadingObservers : any[];
  get isLoading() : boolean {
    return !!this._loading;
  }
  set isLoading(val : boolean) {
    if(!!val) this._loadingCounter++;
    else this._loadingCounter--;
    console.info("loading counter:", this._loadingCounter);
    this._loading = this._loadingCounter > 0;
    for(let callback of this._loadingObservers) callback(this.isLoading);
    if(this._loadingCounter < 0) this._loadingCounter = 0;
  }
  observeLoading(callback) {
    if(!!callback && typeof callback === "function") this._loadingObservers.push(callback);
  }
}
