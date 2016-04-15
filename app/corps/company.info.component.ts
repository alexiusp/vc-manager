import {Component, Input, EventEmitter, Output} from 'angular2/core';

import { CompanyItem } from './models';
import { VMoneyPipe } from '../vmoney.pipe';
import { CompanyDetail } from './contracts';

@Component({
  selector: '[company-info]',
	templateUrl: 'app/corps/company.info.component.html',
  pipes : [VMoneyPipe]
})
export class CompanyInfoComponent {
  constructor() {
  }

  @Output('on-select') onSelect = new EventEmitter();
  selectCompany() {
    if(!!this.onSelect) this.onSelect.emit(null);
  }

  @Output('on-open') onOpen = new EventEmitter();
  openCompany() {
    if(!!this.onOpen) this.onOpen.emit(null);
  }

  @Input('company-info')
  company : CompanyItem;

  @Input('detail')
  detail : CompanyDetail;

}
