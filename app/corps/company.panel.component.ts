import {Component, Input, EventEmitter, Output} from 'angular2/core';
import { Router } from 'angular2/router';

import { CompanyItem, CompanyDetailItem } from './models';
import { VMoneyPipe } from '../vmoney.pipe';
import { Company, CompanyDetail } from './contracts';
import { StorageItem } from './storage/models';
import { StorageItemComponent } from './storage/storage.item.component';

@Component({
  selector: '[company-panel]',
	templateUrl: 'app/corps/company.panel.component.html',
  pipes : [VMoneyPipe],
  directives: [StorageItemComponent]
})
export class CompanyPanelComponent {
  constructor(private _router : Router) {
  }

  @Output('on-select') onSelect = new EventEmitter();
  selectCompany() {
    if(!this.detail.isLoading && !!this.onSelect) this.onSelect.emit(null);
  }

  openCompany() {
    if(!this.detail.isLoading) this.detail.isOpen = !this.detail.isOpen;
  }

  @Input('company-panel')
  detail : CompanyDetailItem;

  @Input()
  company : Company;

  @Output('on-invest') onInvest = new EventEmitter();
  addFunds(amount : number) {
    if(!!this.onInvest && !!amount) this.onInvest.emit(amount);
  }
  removeFunds(amount : number) {
    if(!!this.onInvest && !!amount) this.onInvest.emit(-amount);
  }

  openProduction() {
    this._router.navigate( ['Company', { id: this.company.id }] );
  }

  @Output('on-unload') onUnload = new EventEmitter();
  unloadProduction() {
    if(!!this.onUnload) this.onUnload.emit(false);
  }
  unloadStorage() {
    if(!!this.onUnload) this.onUnload.emit(true);
  }

  findItemIndex(item : StorageItem) : number {
    for(let i in this.detail.storage) {
      if(this.detail.storage[i].item.ItemType.id == item.item.ItemType.id) return +i;
    }
    return -1;
  }
  @Output('on-change') onChange = new EventEmitter();
  change(item) {
    let i = this.findItemIndex(item);
    this.detail.storage[i] = item;
    if(!!this.onChange) this.onChange.emit(this.detail.storage);
  }
}
