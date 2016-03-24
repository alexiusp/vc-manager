import { Injectable } from 'angular2/core';
// services
import { StorageService } from '../storage/storage.service';
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
    private _requestService : RequestService,
    private _storageService: StorageService
  ) {}
  private _user : Account;
  private _errorMessage:string;
  getError() {return this._errorMessage}
  get User() {
    return this._user;
  }
  login(user : Credentials, callback) {
    console.log("user login:", user);
    this._requestService.login(user)
      .subscribe(res => {
        this.onLogin(user, res);
        if(!!callback) callback();
      },
      error =>  this.onError(error));
  }
  onLogin(user : Credentials, userData : ResponseWrapper<Account>) {
    console.log("login request finished:", userData);
    if(userData.error > 0) this.onError(userData.message);
    else {
      this._user = userData.data;
      this._core.isLoggedIn = true;
      this._storageService.saveData("user", user);
    }
  }
  onError(error) {
    this._errorMessage = error.toString();
    console.error(error);
  }
}
