import {Component, Input, EventEmitter, Output} from 'angular2/core';

import { Company, CompanyDetail } from './contracts';
import { CorporationService } from './corporation.service';
import { Dictionary, map } from '../core/dictionary';
import { CompanyStorageElement, BaseStorageElement } from './storage/contracts';
import { StorageItem } from './storage/models';
import { CompanyItem, CompanyDetailItem } from './models';
import { CompanyPanelComponent } from './company.panel.component';
import { CoreService } from '../core/core.service';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'companies-list',
	templateUrl: 'app/corps/companies.list.component.html',
	directives: [CompanyPanelComponent]
})
export class CompaniesListComponent {

  private loading : boolean;

  constructor(private _corporationService : CorporationService,
    private _coreService : CoreService,
    private _storageService : StorageService) {
    this.isListOpen = true;
    this.allSelected = false;
    this._details = new map<CompanyDetailItem>();
    this.filterDropdownOpen = false;
    this.loading = true;
    this._coreService.observeLoading((value) => {
      this.loading = !!value;
    });
    let f = this._storageService.loadData("c_filter");
    if(!!f) {
      this.currentFilter = f;
      this.filterTitle = (f == "all")? "Filter" : f;
    } else {
      this.currentFilter = "all";
      this.filterTitle = "Filter";
    }
	}

  companyStorageChange(cId : number, list : StorageItem[]) {
    if(!!this.details[cId]) this.details[cId].storage = list;
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

  private _companies : Company[];
  @Input('companies')
	set companies(cArr : Company[]) {
    let types = [];
    for(let c of cArr) {
      if(types.indexOf(c.type) == -1) types.push(c.type);
    }
		//console.log("types:", types);
    types.unshift("all");
    this.types = types;
		this._companies = cArr;
	}
	get companies() {
    if(this.currentFilter != "all") {
      let cArr = [];
      for(let c of this._companies)
        if(c.type == this.currentFilter) cArr.push(c);
      return cArr;
    } else return this._companies
  }

  private types : string[];
  private filterDropdownOpen : boolean;
  private currentFilter : string;
  private filterTitle : string;
  toggleFilter() {
    if(!this.loading) this.filterDropdownOpen = !this.filterDropdownOpen;
  }
	@Output('on-filter') onFilter = new EventEmitter();
  filterList(type : string) {
    //console.log("filter:", type);
    this.currentFilter = type;
    this._storageService.saveData("c_filter", type);
    this.filterTitle = (type == "all")? "Filter" : type;
    this.toggleFilter();
		if(!!this.onFilter) this.onFilter.emit(type);
  }
  checkAllSelected() {
    let isAllSelected = true;
    for(let c of this.companies) {
      if(!this.details[c.id].isSelected) isAllSelected = false;
    }
    this.allSelected = isAllSelected;
  }
  private _details : map<CompanyDetailItem>;
  @Input()
  set details(d: map<CompanyDetailItem>) {
    //console.log("companies details list setter", d);
    this._details = d;
    this.checkAllSelected();
  }
  get details() {return this._details}

  @Input('is-manager')
  is_manager : boolean;

  @Output('on-select') onSelect = new EventEmitter();
  private allSelected : boolean;
  selectAll() {
    let s = !this.allSelected;
    if(!this.loading) for(let c of this.companies) {
      let d = this.details[c.id];
      if(d.isSelected != s) {
        this.selectOne(d);
      }
    }
  }
  selectOne(c : CompanyDetailItem) {
    if(!this.loading) {
      let s = !c.isSelected;
      c.isSelected = s;
      this.checkAllSelected();
      if(!!this.onSelect) this.onSelect.emit(c);
    }
  }

  private isListOpen : boolean;
	@Output('on-open') onOpen = new EventEmitter();
  openList() {
    this.isListOpen = !this.isListOpen;
		if(!!this.onOpen) this.onOpen.emit(this.isListOpen);
  }

  @Output('on-invest') onInvest = new EventEmitter();

  invest(c : Company, amount : number) {
		//console.log("invest to selected", +amount);
    if(!!this.onInvest) this.onInvest.emit({cId : c.id, amount: +amount});
  }
	unload(c : Company, unloadAll : boolean) {
		if(unloadAll) this.putCompStorageToCorp(c);
		else this.unloadProduction(c);
	}
  unloadProduction(c : Company) {
    let current = (!this.details[c.id].isLoading)? this.details[c.id].item.current_production : c.current_production;
    let current2 = c.current_production;
    let cStorage = this.details[c.id].storage;
    //console.log("unloadProduction", current, cStorage);
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
    if(!this.loading) for(let c of this.companies) if(this.details[c.id].isSelected) this.unloadProduction(c);
  }
	putCompStorageToCorp(c : Company) {
		let sList : StorageItem[] = [];
		let cStorage = this.details[c.id].storage;
		for(let item of cStorage) {
			item.isTransfer = true;
			sList.push(item);
		}
		this.companyStorageChange(c.id, sList);
	}
	putAllStorageToCorp() {
		if(!this.loading) for(let c of this.companies) if(this.details[c.id].isSelected) this.putCompStorageToCorp(c);
	}
  addFundsToAll(amount : number) {
		//console.log("addFundsToAll", amount);
    if(!this.loading) for(let c of this.companies) if(this.details[c.id].isSelected) this.invest(c, +amount);
  }
  @Output('on-scroll') onScroll = new EventEmitter();
  scroll() {
    if(!!this.onScroll) this.onScroll.emit(null);
  }
}
