import {Component, Input, EventEmitter, Output} from 'angular2/core';
import { Router } from 'angular2/router';

import { Company } from './contracts';

export class CompanyOptions {
  isOpen      : boolean;//detail panel opened
  isSelected  : boolean;//company is selected
  constructor() {
    this.isOpen = false;
    this.isSelected = false;
  }
}

@Component({
  selector: '[company-detail]',
	templateUrl: 'app/corps/company.detail.component.html',
})
export class CompanyDetailComponent {
  constructor(private _router : Router) {}

  private _company;
  @Input('company-detail')
  set company(c : Company) {
    this._company = c;
  }
  get company() {return this._company}

  @Input('is-manager')
  is_manager : boolean;

  @Output('on-invest') onInvest = new EventEmitter();

  addFundsToCompany(amount : number) {
    if(!!this.onInvest) this.onInvest.emit(amount);
  }

  @Output('on-unload') onUnload = new EventEmitter();
  unloadProduction() {
    //console.log("company-detail unloadProduction click");
    if(!!this.onUnload) this.onUnload.emit(null);
  }

	openProduction() {
		this._router.navigate( ['Company', { id: this.company.id }] );
	}
}
