import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {ResponseWrapper} from './response';
import {Credentials} from '../account/credentials';
import {Account} from '../account/account';

enum RequestType {GET,POST}

@Injectable()
export class RequestService {
  constructor (private http: Http) {}
  basic() {
    return this.http.get('http://localhost:3010/api')
                    .map(res => <string> res.json().data)
                    .catch(this.handleError);
  }
  private _cookies;
  doRequest(type : RequestType, url : string, body? : string, options? : RequestOptions) {
    let _url = 'http://localhost:3010/' + url;
    let reqObserable : Observable<Response>;
    if(type == RequestType.GET) {
      reqObserable = this.http.get(_url);
    } else {
      reqObserable = this.http.post(_url, body, options);
    }
    return reqObserable.map(res =>  <ResponseWrapper<any>> res.json())
      .do(res => console.log("Request to [" + url + "] result:", res))
      .catch(this.handleError);
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
  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().message || 'Server error');
  }
}
