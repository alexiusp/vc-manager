import { Component, OnInit } from 'angular2/core';
import { RouteParams, Router } from 'angular2/router';

import { CorpInfo, Company, CompanyDetail } from './contracts';
import { CorporationStorageElement, CompanyStorageElement, BaseStorageElement } from './storage/contracts';
import { StorageItem } from './storage/models';

import { BaseTransaction, TransactionDirection, SellItemTransaction, TransferItemsTransaction, InvestTransaction } from './storage/transactions';
import { CorporationService } from './corporation.service';
import { CoreService } from '../core/core.service';
import { Dictionary, map } from '../core/dictionary';
import { ResultMessage } from '../request/response';
import { SupplyListComponent } from './storage/supply.list.component';
import { CompaniesListComponent } from './companies.list.component';
import { CorporationStorageComponent } from './storage/corporation.storage.component';
import { CompanyDetailItem } from './models';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'ap-corp-detail',
  templateUrl : 'app/corps/corporation.detail.component.html',
	directives: [SupplyListComponent, CompaniesListComponent, CorporationStorageComponent]
})
export class CorporationDetailComponent implements OnInit {
  private corpId : number;
  private corpInfo : CorpInfo; // corporation structure received from backend
  private corpStorage: StorageItem[];// corporation storage
  private progressValue: number;
  private maxProgress: number;
  private iProgress: number;
  private investList: InvestTransaction[];
  // new version of companies list handling
  private details : map<CompanyDetailItem>;

  private allSelected: boolean;
  constructor(
    private _coreService: CoreService,
    private _router : Router,
    private _corporationService: CorporationService,
    private _routeParams: RouteParams,
		private _storageService: StorageService
  ) {
    this.progressValue = 0;
    this.maxProgress = 0;
    this.iProgress = 0;
    this.resetLists();
  }
  ngOnInit() {
    if(!this._coreService.isLoggedIn) this._router.navigateByUrl('/');
    else {
      this.corpId = +this._routeParams.get('id');
			let f = this._storageService.loadData("c_filter");
			if(!!f) {
				this.companyFilter = f;
			} else {
				this.companyFilter = "all";
			}
      this.loadCorpInfo();
      //this.loadCorpStorage();
    }
  }
  loadCorpStorage() {
    this._coreService.isLoading = true;
    this._corporationService.getCorpStorage(this.corpId)
      .subscribe((res : BaseStorageElement[]) => {
        // transform incoming contracted data
        // to view presenter class
        let list : StorageItem[] = [];
        for(let i of res) {
          let t = new StorageItem(i);
          list.push(t);
        }
        //console.log("storage:", list);
        this.corpStorage = list;
        this._coreService.isLoading = false;
      });
  }

  loadCompanyDetail(id : number) {
    this._coreService.isLoading = true;
    if(this.corpInfo.is_manager) this._corporationService
      .getCompanyDetail(id)
      .subscribe((res) => {
        //console.log("company detail:", res);
        this.details[id].item = res;
        this._coreService.isLoading = false;
      })
  }
	loadCorpDetail(callback?: any) {
    this._coreService.isLoading = true;
		this._corporationService
			.getCorpDetail(this.corpId)
			.subscribe((res : CorpInfo) => {
        if(!this.details) this.details = new map<CompanyDetailItem>();
				this.corpInfo = res;
        this._coreService.isLoading = false;
				if(!!callback) callback();
			});
	}
	loadCompanyInfo(c : Company) {
		console.log("loadCompanyInfo ", c.name);
		this.details[c.id] = new CompanyDetailItem();
		this.loadCompanyDetail(c.id);
		this._coreService.isLoading = true;
		this._corporationService.getCompanyStorage(c.id)
			.subscribe((res : BaseStorageElement[]) => {
				// transform incoming contracted data
				// to view presenter class
				let list : StorageItem[] = [];
				if(!!res) for(let i of res) {
					let t = new StorageItem(i);
					list.push(t);
				}
				//console.log("company storage:", list);
				this.details[c.id].storage = list;
				this._coreService.isLoading = false;
			});
	}
  loadCorpInfo() {
		this.loadCorpDetail(() => {
			this.loadCorpStorage();
			if(!!this.corpInfo.is_manager) {
        for(let c of this.corpInfo.companies) {
					// load company info always for the first time
					if(!this.details[c.id]) this.loadCompanyInfo(c);
					else {
						// check if the filter is set
						let f = this.companyFilter || "all";
						//console.log("companies load:", c, f);
						if(f == "all" || c.type == f) this.loadCompanyInfo(c);
					}
			  }
      }
		});
  }
  initProgress(maxNum : number) {
		console.log("corp detail initProgress");
    this.maxProgress = maxNum;
    this.iProgress = 0;
    this.progressValue = 10;
  }
  incrementProgress() {
    this.iProgress++;
    if (this.iProgress >= this.maxProgress) {
      this.progressValue = 0;
      this.loadCorpInfo();
    } else {
      this.progressValue += 100/this.maxProgress;
    }
    //console.log("progress:",this.progressValue);
  }
  /*
  backend operations functions
  */
  investToCorp(amount : number) {
    //console.log("investToCorp", amount);
		if(this.corpInfo.is_manager) {
      this._coreService.isLoading = true;
			this._corporationService.addFundsToCorporation(this.corpId, amount)
				.subscribe((res:ResultMessage[]) => {
          //console.log("result:",res);
					//this.messages = res;
					this.loadCorpDetail();
          this._coreService.isLoading = false;
        });
		}
  }
	private companyFilter : string;
	setFilter(filter : string) {
		console.log("setFilter:", filter);
		this.companyFilter = filter;
	}
  refresh(tList? : BaseTransaction[]) {
		if(!!tList) {
			let cList : Company[] = [];
			for(let t of tList) {
				//if(t.owner == TransactionObject.Company)
			}
		} else {
			this.resetLists();
	    this.loadCorpInfo();
		}
  }
  resetLists() {
    this.tradeList = [];
    this.transferList = [];
    this.selectedCompanies = [];
    this.investList = [];
  }
  resetStorage() {
    if(!!this.corpStorage) {
      let sList = [];
      for(let i of this.corpStorage) {
        i.isSell = false;
        i.isTransfer = false;
        sList.push(i);
      }
      this.corpStorage = sList;
    }
  }
  /*
  Supply list companies list and corporation storage functions
  */
  // supply list
  private tradeList : SellItemTransaction[];
  private transferList : TransferItemsTransaction[];
  parseStorage() {
    if(!!this.corpStorage) {
      let corp = this._corporationService.getCorporation(this.corpId);
      let sList = [];
      let tList = [];
      for(let i of this.corpStorage) {
        if(i.isSell) {
          let s : SellItemTransaction = new SellItemTransaction(
						i.item[0].total_quantity,
						i.item,
						0,
						TransactionDirection.FromCorporation,
						corp
					);
          if(!!this.tradeList) for(let t of this.tradeList) {
            if(s.isEqual(t)) {
              s.money = t.money;
              s.amount = t.amount;
            }
          }
          sList.push(s);
        }
        if(i.isTransfer) {
          let s : TransferItemsTransaction = new TransferItemsTransaction(
						i.item[0].total_quantity,
						i.item,
						TransactionDirection.FromCorporation,
						corp
					);
          if(!!this.transferList) for(let t of this.transferList) {
            if(s.isEqual(t)) {
              s.amount = t.amount;
            }
          }
          tList.push(s);
        }
      }
      // copy all items from companies
      if(!!this.tradeList) for(let t of this.tradeList) {
        if(t.direction == TransactionDirection.FromCompany) sList.push(t);
      }
      if(!!this.transferList) for(let t of this.transferList) {
        if(t.direction == TransactionDirection.FromCompany) tList.push(t);
      }
      this.tradeList = sList;
      this.transferList = tList;
    }
  }
  findInStorage(item: BaseStorageElement) {
    let find = -1;
    for(let i in this.corpStorage) {
      if(this.corpStorage[i].item.ItemType.id == item.ItemType.id) return +i;
    }
    return find;
  }
  // corporation storage change
  storageChange(list:StorageItem[]) {
    this.corpStorage = list;
    this.parseStorage();
  }
  // trade list change
  findItemTransaction(item : StorageItem, list: TransferItemsTransaction[] | SellItemTransaction[]) : number {
    for(let i in list) {
      if(list[i].item.ItemType.id == item.item.ItemType.id) return +i;
    }
    return -1;
  }
  tradeChange(list : SellItemTransaction[]) {
    //console.log("tradeChange", list)
    // parse changed list
    let corpList = [];
    let compList = [];
    for(let sell of list) {
      if(sell.direction === TransactionDirection.FromCorporation) {
        corpList.push(sell);
      } else {
        compList.push(sell);
      }
    }
    // join with transfer
    for(let i of this.transferList) {
      if(i.direction == TransactionDirection.FromCorporation) {
        corpList.push(i);
      } else {
        compList.push(i);
      }
    }
    this.parseStorageTransactions(corpList);
    this.parseCompaniesTransactions(compList);
  }
  parseStorageTransactions(list : TransferItemsTransaction[] | SellItemTransaction[]) {
    let cList = [];
    for(let t of this.corpStorage) {
      if(t.isTransfer && (this.findItemTransaction(t, list) == -1)) {
        t.isTransfer = false;
      }
      if(t.isSell && (this.findItemTransaction(t, list) == -1)) {
        t.isSell = false;
      }
      cList.push(t);
    }
    this.storageChange(cList);
  }
  parseCompaniesTransactions(list : TransferItemsTransaction[] | SellItemTransaction[]) {
    //console.log("parseCompaniesTransactions", list);
    for(let c of this.corpInfo.companies) {
      for(let s of this.details[c.id].storage) {
        if(s.isTransfer && (this.findItemTransaction(s, list) == -1)) s.isTransfer = false;
        if(s.isSell && (this.findItemTransaction(s, list) == -1)) s.isSell = false;
      }
      this.companyStorageChange({ cId : c.id, list : this.details[c.id].storage });
    }
  }
  transferChange(list : TransferItemsTransaction[]) {
    //console.log("transferChange:", list);
    let corpList = [];
    let compList = [];
    for(let sell of list) {
      if(sell.direction === TransactionDirection.FromCorporation) {
        corpList.push(sell);
      } else {
        compList.push(sell);
      }
    }
    // join with trade
    for(let i of this.tradeList) {
      if(i.direction == TransactionDirection.FromCorporation) {
        corpList.push(i);
      } else {
        compList.push(i);
      }
    }
    this.parseStorageTransactions(corpList);
    this.parseCompaniesTransactions(compList);
  }
  // companies list
  private selectedCompanies: CompanyDetail[]; // selected companies
  parseSelectedCompanies() {
    let cArr : CompanyDetail[] = [];
    for(let c of this.corpInfo.companies) {
      if(this.details[c.id].isSelected) cArr.push(this.details[c.id].item);
    }
    this.selectedCompanies = cArr;
  }
  selectCompany(d : CompanyDetailItem) {
    this.details[d.item.id].isSelected = d.isSelected;
    this.parseSelectedCompanies();
  }
  companiesChange(list : CompanyDetail[]) {
    //console.log("companies change", list);
    let dList = new map<CompanyDetailItem>();
    for(let c of this.corpInfo.companies) {
      let d = this.details[c.id];
      d.isSelected = false;
      for(let i of list) {
        if(i.id == c.id) d.isSelected = true;
      }
      dList[c.id] = d;
    }
    this.details = dList;
    this.parseSelectedCompanies();
  }
  companyStorageChange(changeEvent : {cId : number, list : StorageItem[]}) {
    //console.log("companyStorageChange", changeEvent);
    let company = this.details[changeEvent.cId].item;
    let corp = this._corporationService.getCorporation(this.corpId);
    //console.log("company", company);
    let sList = [];
    let tList = [];
    for(let i of changeEvent.list) {
      let direction = TransactionDirection.FromCompany;
			let amount = i.item[0].total_quantity;
			let item = i.item;
      if(i.isSell) {
        let s : SellItemTransaction = new SellItemTransaction(amount, item, 0, direction, company);
        if(!!this.tradeList) for(let t of this.tradeList) {
          if(s.isEqual(t)) {
            s.money = t.money;
            s.amount = t.amount;
          }
        }
        sList.push(s);
        //console.log("sell transaction", s);
      }
      if(i.isTransfer) {
        let s : TransferItemsTransaction = new TransferItemsTransaction(amount, item, direction, company);
        if(!!this.transferList) for(let t of this.transferList) {
          if(s.isEqual(t)) {
            s.amount = t.amount;
          }
        }
        tList.push(s);
      }
    }
    // copy all corporation storage items and company storage items from other companies
    if(!!this.tradeList) for(let t of this.tradeList) {
      if(t.owner == TransactionObject.Corp) sList.push(t);
      if((t.owner == TransactionObject.Company) && (t.source.id != changeEvent.cId)) sList.push(t);
    }
    if(!!this.transferList) for(let t of this.transferList) {
      if(t.owner == TransactionObject.Corp) tList.push(t);
      if((t.owner == TransactionObject.Company) && (t.source.id != changeEvent.cId)) tList.push(t);
    }
    this.tradeList = sList;
    this.transferList = tList;
  }

  companyInvest(investEvent : {cId : number, amount : number}) {
		//console.log("invest event:", investEvent);
    let list = [];
    let present = false;
    if(!!this.investList) for(let i of this.investList) {
      if(i.target.id !== investEvent.cId) list.push(i);
      else {
        i.price = +investEvent.amount;
        present = true;
        list.push(i);
      }
    }
    if(!present) {
      let t : InvestTransaction = {
        owner : TransactionObject.Company,
        price: +investEvent.amount,
        target: this.details[investEvent.cId].item
      }
			//console.log("new invest transaction", t);
      list.push(t);
    }

    this.investList = list;
  }
  investmentsChange(list : InvestTransaction[]) {
    // TODO: implement investments list change event handler
    console.log("not implemented investmentsChange", list);
  }
  findPos(obj) {
    let curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return curtop;
    }
    return obj.offsetTop;
  }
  scrollTop() {
    let el = document.getElementById("_top");
    if(!!el.scrollIntoView) el.scrollIntoView(true);
    else {
      let pos = this.findPos(el);
      //console.log("top:", pos);
      window.scrollTo(0, pos);
    }
  }
}
