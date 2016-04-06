import { Injectable } from 'angular2/core';
import { Response } from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
// services
import { RequestService } from '../request/request.service';
import { CoreService } from '../core/core.service';

// models
import { ResponseWrapper } from '../request/response';
import { Credentials } from './credentials';
import { Account } from './account';

@Injectable()
export class AccountService {
  constructor (
    private _core : CoreService,
    private _requestService : RequestService
  ) {}
  private _user : Account;
  private _errorMessage:string;
  getError() {return this._errorMessage}
  get User() {
    return this._user;
  }
  login(user : Credentials) {
		console.log("user login:", user);
		return this._requestService.login(user)
		.do((res : ResponseWrapper<Account>) => {
			this.onLogin(user, res);
		}).catch(this.handleError);
  }
  onLogin(user : Credentials, userData : ResponseWrapper<Account>) {
    console.log("login request finished:", userData);
    if(userData.error > 0) this.onError(userData.message);
    else {
      this._user = userData.data;
      this._core.isLoggedIn = true;
    }
  }
  onError(error: string) {
    this._errorMessage = error.toString();
    console.error(error);
  }
	handleError(error: Response) {
		let errString = error.json().message || 'Server error';
		this.onError(errString)
		return Observable.throw(errString);
	}
}
