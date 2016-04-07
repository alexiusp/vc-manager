import {Component, Input, EventEmitter, Output} from 'angular2/core';

import { Company, CompanyDetail } from './contracts';
import { CompanyDetailComponent, CompanyOptions } from './company.detail.component';
import { CompanyInfoComponent } from './company.info.component';
import { CompanyStorageComponent } from './storage/company.storage.component';
import { CorporationService } from './corporation.service';
import { Dictionary, map } from '../core/dictionary';
import { CompanyStorageElement, BaseStorageElement } from './storage/contracts';
import { StorageItem } from './storage/models';
import { CompanyItem } from './models';

@Component({
  selector: 'companies-list',
	templateUrl: 'app/corps/companies.list.component.html',
	directives: [CompanyDetailComponent, CompanyInfoComponent, CompanyStorageComponent]
})
export class CompaniesListComponent {

  private _storages: map<StorageItem[]>;
  constructor(private _corporationService : CorporationService) {
    this.isListOpen = true;
    this.allSelected = false;
    this._storages = new map<StorageItem[]>();
    this._details = new map<CompanyDetail>();
    this.filterDropdownOpen = false;
    this.currentFilter = "all";
    this.filterTitle = "Filter";
	}

  @Input()
  get storages() { return this._storages; }
  set storages(list : map<StorageItem[]>) {
    this._storages = list;
  }
  companyStorageChange(cId : number, list : StorageItem[]) {
    if(!!this._storages) this._storages[cId] = list;
    /*
    let selected = false;
    for(let i of list) {
      if(i.isSelected) selected = true;
    }
    if(this.options[cId].isSelected != selected) this.selectOne(this.findCompanyById(cId));
    */
    if(!!this.onChange) this.onChange.emit({cId : cId, list : list});
  }
  @Output('on-change') onChange = new EventEmitter();

  private _companies : CompanyItem[];
  @Input('companies')
	set companies(cArr : CompanyItem[]) {
    let types = [];
    let isAllSelected = true;
    for(let c of cArr) {
      if(types.indexOf(c.item.type) == -1) types.push(c.item.type);
      if(!c.isSelected) isAllSelected = false;
    }
    this.allSelected = isAllSelected;
		//console.log("types:", types);
    types.unshift("all");
    this.types = types;
		this._companies = cArr;
	}
	get companies() {
    if(this.currentFilter != "all") {
      let cArr = [];
      for(let c of this._companies)
        if(c.item.type == this.currentFilter) cArr.push(c);
      return cArr;
    } else return this._companies
  }

  private types : string[];
  private filterDropdownOpen : boolean;
  private currentFilter : string;
  private filterTitle : string;
  toggleFilter() {
    this.filterDropdownOpen = !this.filterDropdownOpen;
  }
  filterList(type : string) {
    //console.log("filter:", type);
    this.currentFilter = type;
    this.filterTitle = (type == "all")? "Filter" : type;
    this.toggleFilter();
  }

  private _details : map<CompanyDetail>;
  @Input()
  set details(d: map<CompanyDetail>) {
    console.log("companies details list setter", d);
    this._details = d;
  }
  get details() {return this._details}

  @Input('is-manager')
  is_manager : boolean;

  @Output('on-select') onSelect = new EventEmitter();
  private allSelected : boolean;
  selectAll() {
    let s = !this.allSelected;
    for(let c of this.companies) {
      if(c.isSelected != s) {
        this.selectOne(c);
      }
    }
  }
  selectOne(c : CompanyItem) {
    let s = !c.isSelected;
    c.isSelected = s;
    let isAllSelected = true;
    for(let ci of this.companies) if(!ci.isSelected) isAllSelected = false;
    this.allSelected = isAllSelected;
    if(!!this.onSelect) this.onSelect.emit(c);
  }

  private isListOpen : boolean;
  openList() {
    this.isListOpen = !this.isListOpen;
  }
  openOne(c : CompanyItem) {
    c.isOpen = !c.isOpen;
  }

  @Output('on-invest') onInvest = new EventEmitter();

  invest(c : CompanyItem, amount : number) {
    if(!!this.onInvest) this.onInvest.emit({cId : c.item.id, amount: amount});
  }

  uloadProduction(c : Company) {
    let current = this.details[c.id].current_production;
    let current2 = c.current_production;
    let cStorage = this.storages[c.id];
    console.log("uloadProduction", current, cStorage);
    if(current.quantity > 0) {
      // look for production item in storage
      let prodItem : StorageItem;
      for(let item of cStorage) {
        if((item.item.ItemType.name == current.name) || (item.item.ItemType.name == current2.name)) prodItem = item;
        else {
          if(item.item.ItemType.image == current.img) prodItem = item;
          else {
            if(item.item[0].total_quantity == current.quantity) prodItem = item;
          }
        }
      }
      if(!!prodItem) {
        prodItem.isTransfer = !prodItem.isTransfer;
        let sList : StorageItem[] = [];
        for(let item of cStorage) {
          if(item.item.ItemType.id == prodItem.item.ItemType.id) item.isTransfer = prodItem.isTransfer;
          sList.push(item);
        }
        this.companyStorageChange(c.id, sList);
      } else console.error("Production item (%s) not found in storage:", current.name);
    }
  }
  putAllProductionToStorage() {
    for(let c of this.companies) if(c.isSelected) this.uloadProduction(c.item);
  }
  addFundsToAll(amount : number) {
    for(let c of this.companies) if(c.isSelected) this.invest(c, amount);
  }
  @Output('on-scroll') onScroll = new EventEmitter();
  scroll() {
    if(!!this.onScroll) this.onScroll.emit(null);
  }
}
