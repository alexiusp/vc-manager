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

  private progress : any;
  ngOnInit() {
    let p = this._accountService.User;
    this._profile = p;
    this.progress = {
      health: (+p.health / +p.max_health)*100,
      energy: (+p.energy / +p.max_energy)*100,
      xp  : (+p.xp / +p.nextLevelExperience)*100
    }
  }
}
