import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { StorageService } from '../storage/storage.service';
import { AccountService } from './account.service';

import {Credentials} from './credentials';

@Component({
  selector: 'ap-account',
  templateUrl : 'app/account/account.component.html',
})
export class AccountComponent implements OnInit {
  user : Credentials;
  errorMessage : string;
  constructor(
    private _router : Router,
    private _accountService: AccountService,
    private _storageService: StorageService
  ) {}

  private accountSaved : boolean;
  ngOnInit() {
    this.errorMessage = "";
    let user : Credentials = this._storageService.loadData('user');
    if(!!user) {
      this.accountSaved = true;
      this.user = user;
      console.log("user loaded:", this.user);
    } else {
      this.accountSaved = false;
      this.user = new Credentials();
    }
  }

  login() {
    this.errorMessage = "";
    if(!!this.user.username) this._accountService.login(this.user, () => {
      this.errorMessage = this._accountService.getError();
      if(!this.errorMessage) this._router.navigateByUrl('/corps');
    });
  }
}
