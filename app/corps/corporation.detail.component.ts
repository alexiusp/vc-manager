import { Component, OnInit } from 'angular2/core';
import { RouteParams, Router } from 'angular2/router';

import { CorpInfo, Company, CompanyDetail } from './contracts';
import { CorporationStorageElement, CompanyStorageElement, BaseStorageElement } from './storage/contracts';
import { StorageItem } from './storage/models';

import { TransactionObject, SellItemTransaction, TransferItemTransaction, BaseItemTransaction, itemTransactionEqual, InvestTransaction } from './storage/transactions';
import { CorporationService } from './corporation.service';
import { CoreService } from '../core/core.service';
import { Dictionary, map } from '../core/dictionary';
import { ResultMessage } from '../request/response';
import { SupplyListComponent } from './storage/supply.list.component';
import { CompaniesListComponent } from './companies.list.component';
import { CorporationStorageComponent } from './storage/corporation.storage.component';
import { CompanyDetailItem } from './models';

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
    private _routeParams: RouteParams
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
        this.details = new map<CompanyDetailItem>();
				this.corpInfo = res;
        this._coreService.isLoading = false;
				if(!!callback) callback();
			});
	}
  loadCorpInfo() {
		this.loadCorpDetail(() => {
			this.loadCorpStorage();
			if(!!this.corpInfo.is_manager) {
        for(let c of this.corpInfo.companies) {
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
      }
		});
  }
  initProgress(maxNum : number) {
    this.maxProgress = maxNum;
    this.iProgress = 0;
    this.progressValue = 10;
  }
  incrementProgress() {
    //console.log("incrementProgress")
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
    console.log("investToCorp", amount);
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

  /*
	putItemsToCompanies(list : TransferItem[]) {
		console.log("putItemsToCompanies", list);
		if(this.corpInfo.is_manager) {
			let cNum = this.corpInfo.companies.length;
			this.initProgress(cNum);
			let counter = 0;
			for(let c of this.corpInfo.companies) {
				if(this.selectedCompanies[c.id]) {
					counter++;
					let compId = c.id;
					this._corporationService.moveItemsToCompany(compId, list)
						.subscribe((res:ResultMessage[]) => {
							console.log("result:",res);
							this.messages = res;
							this.loadCompanyDetail(compId);
							this.incrementProgress();
							this.supplyList = [];
						})
				} else this.incrementProgress();
			}
			if(!counter) {
				this.messages = [new ResultMessage("flash_error","No companies selected!")];
			}
		}
	}
  */
  refresh() {
    this.resetLists();
    this.loadCorpInfo();
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
  private transferList : TransferItemTransaction[];
  parseStorage() {
    if(!!this.corpStorage) {
      let corp = this._corporationService.getCorporation(this.corpId);
      let sList = [];
      let tList = [];
      for(let i of this.corpStorage) {
        if(i.isSell) {
          let s : SellItemTransaction = {
            owner : TransactionObject.Corp,
            amount : i.item[0].total_quantity,
            item    : i.item,
            price   : 0,
            source  : corp
          };
          if(!!this.tradeList) for(let t of this.tradeList) {
            if(itemTransactionEqual(t,s)) {
              s.price = t.price;
              s.amount = t.amount;
            }
          }
          sList.push(s);
        }
        if(i.isTransfer) {
          let s : TransferItemTransaction = {
            owner : TransactionObject.Corp,
            amount : i.item[0].total_quantity,
            item    : i.item,
            source  : corp
          };
          if(!!this.transferList) for(let t of this.transferList) {
            if(itemTransactionEqual(t,s)) {
              s.amount = t.amount;
              s.target = t.target;
            }
          }
          tList.push(s);
        }
      }
      // copy all items from companies
      if(!!this.tradeList) for(let t of this.tradeList) {
        if(t.owner == TransactionObject.Company) sList.push(t);
      }
      if(!!this.transferList) for(let t of this.transferList) {
        if(t.owner == TransactionObject.Company) tList.push(t);
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
  findItemTransaction(item : StorageItem, list: BaseItemTransaction[]) : number {
    let find = -1;
    for(let i in list) {
      if(list[i].item.ItemType.id == item.item.ItemType.id) return +i;
    }
    return find;
  }
  tradeChange(list : SellItemTransaction[]) {
    //console.log("tradeChange", list)
    // parse changed list
    let corpList = [];
    let compList = [];
    for(let sell of list) {
      if(sell.owner == TransactionObject.Corp) {
        corpList.push(sell);
      } else {
        compList.push(sell);
      }
    }
    // join with transfer
    for(let i of this.transferList) {
      if(i.owner == TransactionObject.Corp) {
        corpList.push(i);
      } else {
        compList.push(i);
      }
    }
    this.parseStorageTransactions(corpList);
    this.parseCompaniesTransactions(compList);
  }
  parseStorageTransactions(list : BaseItemTransaction[]) {
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
  parseCompaniesTransactions(list : BaseItemTransaction[]) {
    //console.log("parseCompaniesTransactions", list);
    for(let c of this.corpInfo.companies) {
      for(let s of this.details[c.id].storage) {
        if(s.isTransfer && (this.findItemTransaction(s, list) == -1)) s.isTransfer = false;
        if(s.isSell && (this.findItemTransaction(s, list) == -1)) s.isSell = false;
      }
      this.companyStorageChange({ cId : c.id, list : this.details[c.id].storage });
    }
  }
  transferChange(list : TransferItemTransaction[]) {
    //console.log("transferChange:", list);
    let corpList = [];
    let compList = [];
    for(let sell of list) {
      if(sell.owner == TransactionObject.Corp) {
        corpList.push(sell);
      } else {
        compList.push(sell);
      }
    }
    // join with trade
    for(let i of this.tradeList) {
      if(i.owner == TransactionObject.Corp) {
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
      let b : BaseItemTransaction = {
        owner : TransactionObject.Company,
        amount : i.item[0].total_quantity,
        item    : i.item,
        source  : company
      };
      if(i.isSell) {
        let s : SellItemTransaction = <SellItemTransaction>b;
        s.price = 0;
        if(!!this.tradeList) for(let t of this.tradeList) {
          if(itemTransactionEqual(t,s)) {
            s.price = t.price;
            s.amount = t.amount;
          }
        }
        sList.push(s);
        //console.log("sell transaction", s);
      }
      if(i.isTransfer) {
        let s : TransferItemTransaction = <TransferItemTransaction>b;
        s.target = corp;
        if(!!this.transferList) for(let t of this.transferList) {
          if(itemTransactionEqual(t,s)) {
            s.amount = t.amount;
          }
        }
        tList.push(s);
      }
    }
    // copy all corporation storage items and company storage from other companies
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
