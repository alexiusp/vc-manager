import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import { Router } from 'angular2/router';

import {ResponseWrapper} from './response';
import {Credentials} from '../account/credentials';
import {Account} from '../account/account';
import { CoreService } from '../core/core.service';

enum RequestType {GET,POST,PUT}

@Injectable()
export class RequestService {
  constructor (
		private http: Http,
		private _router : Router,
		private _coreService: CoreService
	)	{}
  private _cookies;
  doRequest(type : RequestType, url : string, body? : string, options? : RequestOptions) {
    let _url = '/' + url;
    let reqObserable : Observable<Response>;
		switch(type) {
			case RequestType.PUT:
				reqObserable = this.http.put(_url, body, options);
				break;
			case RequestType.POST:
				reqObserable = this.http.post(_url, body, options);
				break;
			case RequestType.GET:
			default:
				reqObserable = this.http.get(_url);
				break;
		}
    return reqObserable.map(res =>  <ResponseWrapper<any>> res.json())
      .do((res : ResponseWrapper<any>) => {
				//console.log("Request to [" + url + "] result:", res);
				if(res.error == -1) {
					console.error("Auth error:", res.message);
					this._coreService.isLoggedIn = false;
					this._router.navigateByUrl('/');
				}
			}).catch(this.handleError);
  }
  login(user : Credentials) : Observable<ResponseWrapper<any>> {
    let body = JSON.stringify(user);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.doRequest(RequestType.POST, 'api/login', body, options);
  }
  getCorpsList() : Observable<ResponseWrapper<any>> {
    return this.doRequest(RequestType.GET, 'api/corps');
  }
  getCorpDetail(id:number) : Observable<ResponseWrapper<any>> {
    return this.doRequest(RequestType.GET, 'api/corp/'+id);
  }
  getCorpStorage(id:number) : Observable<ResponseWrapper<any>> {
    return this.doRequest(RequestType.GET, 'api/corp/storage/'+id);
  }
  getCompanyDetail(id:number) : Observable<ResponseWrapper<any>> {
    return this.doRequest(RequestType.GET, 'api/company/'+id);
  }
  getCompanyStorage(id:number) : Observable<ResponseWrapper<any>> {
    return this.doRequest(RequestType.GET, 'api/company/'+id+'/storage');
  }
  moveItemToCorporation(compId:number, itemId:number, amount:number) : Observable<ResponseWrapper<any>> {
    let body = JSON.stringify({
      item: itemId,
      amount:amount
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.doRequest(RequestType.POST, 'api/company/'+compId+'/storage', body, options);
  }
  addFundsToCompany(compId:number, amount:number) : Observable<ResponseWrapper<any>> {
    let body = JSON.stringify({
      amount:amount
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.doRequest(RequestType.POST, 'api/company/'+compId+'/funds', body, options);
  }
	addFundsToCorporation(corpId:number, amount:number) : Observable<ResponseWrapper<any>> {
    let body = JSON.stringify({
      amount:amount
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.doRequest(RequestType.POST, 'api/corp/'+corpId+'/funds', body, options);
  }
	moveItemsToCompany(compId:number, items:any[]) : Observable<ResponseWrapper<any>> {
    let body = JSON.stringify({
      items:items
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.doRequest(RequestType.PUT, 'api/company/'+compId+'/storage', body, options);
  }
  sellItemFromCorporation(corpId, itemId, amount, price) : Observable<ResponseWrapper<any>> {
    let body = JSON.stringify({
      itemId  : itemId,
      amount  : amount,
      price   : price
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.doRequest(RequestType.POST, 'api/corp/'+corpId+'/exchange', body, options);
  }
  sellItemFromCompany(compId, itemId, amount, price) : Observable<ResponseWrapper<any>> {
    let body = JSON.stringify({
      itemId  : itemId,
      amount  : amount,
      price   : price
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.doRequest(RequestType.POST, 'api/company/'+compId+'/exchange', body, options);
  }
  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().message || 'Server error');
  }
}
