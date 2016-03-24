import { Component, OnInit } from 'angular2/core';

import { StorageService } from '../storage/storage.service';
import { AccountService } from './account.service';
import { Account } from './account';

@Component({
  selector: 'ap-profile',
  templateUrl : 'app/account/profile.component.html',
  //styleUrls: ['app/dashboard.component.css']
})
export class ProfileComponent implements OnInit {
  private _profile : Account;
  constructor(
    private _accountService: AccountService//,
    //private _storageService: StorageService
  ) {}

  ngOnInit() {
    this._profile = this._accountService.User;
  }
}
