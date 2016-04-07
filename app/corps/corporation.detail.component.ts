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
import { AlertListComponent } from '../messages/alert.list.component';
import { CompaniesListComponent } from './companies.list.component';
import { CorporationStorageComponent } from './storage/corporation.storage.component';
import { CompanyItem } from './models';

@Component({
  selector: 'ap-corp-detail',
  templateUrl : 'app/corps/corporation.detail.component.html',
	directives: [SupplyListComponent, AlertListComponent, CompaniesListComponent, CorporationStorageComponent]
})
export class CorporationDetailComponent implements OnInit {
  private corpId : number;
  private corpInfo : CorpInfo; // corporation structure received from backend
  private corpStorage: StorageItem[];// corporation storage
  private _storages: map<StorageItem[]>;// company storage
  private progressValue: number;
  private maxProgress: number;
  private iProgress: number;
  private messages: Array<ResultMessage>;
  private companiesDetails: map<CompanyDetail>;
  private companiesList : CompanyItem[];
  private investList: InvestTransaction[];

  private allSelected: boolean;
  constructor(
    private _coreService: CoreService,
    private _router : Router,
    private _corporationService: CorporationService,
    private _routeParams: RouteParams
  ) {
    this.companiesDetails = new map<CompanyDetail>();
    this.progressValue = 0;
    this.maxProgress = 0;
    this.iProgress = 0;
		this.messages = [];
    this.resetLists();
    this._storages = new map<StorageItem[]>();
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
      });
  }
  get storages() { return this._storages; }


  loadCompanyDetail(id : number) {
    if(this.corpInfo.is_manager) this._corporationService
      .getCompanyDetail(id)
      .subscribe((res) => {
        //console.log("company detail:", res);
        this.companiesDetails[id] = res;
      })
  }
	loadCorpDetail(callback?: any) {
		this._corporationService
			.getCorpDetail(this.corpId)
			.subscribe((res : CorpInfo) => {
				this.corpInfo = res;
				if(!!callback) callback();
			});
	}
  loadCorpInfo() {
		this.loadCorpDetail(() => {
			this.loadCorpStorage();
      this.companiesList = [];
			if(!!this.corpInfo.is_manager) {
        for(let c of this.corpInfo.companies) {
          this.companiesList.push(new CompanyItem(c));
  				this.loadCompanyDetail(c.id);
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
              this._storages[c.id] = list;
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
			this._corporationService.addFundsToCorporation(this.corpId, amount)
				.subscribe((res:ResultMessage[]) => {
          //console.log("result:",res);
					//this.messages = res;
					this.loadCorpDetail();
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
    this.clearMessages();
    this.loadCorpInfo();
  }
  clearMessages() {
    this.messages = [];
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
    for(let c of this.companiesList) {
      for(let s of this.storages[c.item.id]) {
        if(s.isTransfer && (this.findItemTransaction(s, list) == -1)) s.isTransfer = false;
        if(s.isSell && (this.findItemTransaction(s, list) == -1)) s.isSell = false;
      }
      this.companyStorageChange({ cId : c.item.id, list : this.storages[c.item.id] });
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
  private selectedCompanies: Company[]; // selected companies
  parseSelectedCompanies() {
    let cArr : Company[] = [];
    for(let c of this.companiesList) {
      if(c.isSelected) cArr.push(c.item);
    }
    this.selectedCompanies = cArr;
  }
  selectCompany(c : CompanyItem) {
    for(let i in this.companiesList) {
      if(c.item.id == this.companiesList[i].item.id) this.companiesList[i].isSelected = c.isSelected;
    }
    this.parseSelectedCompanies();
  }
  companiesChange(list : Company[]) {
    //console.log("companies change", list);
    let cList = [];
    for(let c of this.corpInfo.companies) {
      let ci = new CompanyItem(c);
      for(let i of list) {
        if(i.id == c.id) ci.isSelected = true;
      }
      for(let oc of this.companiesList) {
        if(oc.item.id == c.id) ci.isOpen = oc.isOpen;
      }
      cList.push(ci);
    }
    this.companiesList = cList;
    this.parseSelectedCompanies();
  }
  companyStorageChange(changeEvent : {cId : number, list : StorageItem[]}) {
    //console.log("companyStorageChange", changeEvent);
    let company = this.companiesDetails[changeEvent.cId];
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
    let list = [];
    let present = false;
    if(!!this.investList) for(let i of this.investList) {
      if(i.target.id!== investEvent.cId) list.push(i);
      else {
        i.amount = investEvent.amount;
        present = true;
        list.push(i);
      }
    }
    if(!present) {
      let t : InvestTransaction = {
        owner : TransactionObject.Company,
        amount: investEvent.amount,
        target: this.companiesDetails[investEvent.cId]
      }
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
