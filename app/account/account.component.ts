import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
import {NgForm}    from 'angular2/common';

import { StorageService } from '../storage/storage.service';
import { AccountService } from './account.service';
import { ResponseWrapper } from '../request/response';
import { Account } from './account';

import {Credentials} from './credentials';

@Component({
  selector: 'ap-account',
  templateUrl : 'app/account/account.component.html',
})
export class AccountComponent implements OnInit {
  user : Credentials;
  constructor(
    private _router : Router,
    private _accountService: AccountService,
    private _storageService: StorageService
  ) {}

  private accountSaved : boolean;
	private account : any;
  ngOnInit() {
		this.remember = true;
    let user : Credentials = this._storageService.loadData('user');
    if(!!user) {
      this.accountSaved = true;
      this.user = user;
      console.log("user loaded:", this.user);
			this.account = this._storageService.loadData("acc");
    } else {
      this.accountSaved = false;
      this.user = new Credentials();
    }
  }
	recall() {
		this.user = this._storageService.loadData('user');
		this.login();
	}
	private remember;
  login() {
    if(!!this.user.username) this._accountService.login(this.user)
		.subscribe((res : ResponseWrapper<Account>) => {
			if(this.remember) {
				this._storageService.saveData("user", this.user);
				let userData = {
					name 		: res.data.username,
					avatar	: res.data.avatar_img
				};
				this._storageService.saveData("acc", userData);
			}
      if(res.error == 0) this._router.navigateByUrl('/corps');
    });
  }
}
