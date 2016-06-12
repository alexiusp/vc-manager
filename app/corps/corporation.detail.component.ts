import { Component, OnInit } from 'angular2/core';
import { RouteParams, Router } from 'angular2/router';

import { BaseBusiness, CorpInfo, Company, CompanyDetail } from './contracts';
import { CorporationStorageElement, CompanyStorageElement, BaseStorageElement } from './storage/contracts';
import { StorageItem } from './storage/models';

import {
	BaseTransaction,
	TransactionDirection,
	TransactionType,
	SellItemTransaction,
	ItemsPackageTransaction,
	ItemsTransaction,
	ClearStorageTransaction,
	InvestTransaction
} from './storage/transactions';
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
		//console.log("loadCompanyInfo ", c.name);
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
  private _detailsCopied;
  loadCorpInfo() {
		this.loadCorpDetail(() => {
			this.loadCorpStorage();
			if(!!this.corpInfo.is_manager) {
        this._detailsCopied = false;
        this._coreService.observeLoading((isLoading) => {
          //console.log("observing loading:", isLoading);
          if(!isLoading && !this._detailsCopied && !!this.details) {
            //console.log("copy details");
            let dArr = new map<CompanyDetailItem>();
            for(let c of this.corpInfo.companies) {
              let d = this.details[c.id];
              dArr[c.id] = d;
            }
            this.details = dArr;
            this._detailsCopied = true;
          }
        });
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
	// companies list filter
	private companyFilter : string;
	setFilter(filter : string) {
		//console.log("setFilter:", filter);
		this.companyFilter = filter;
	}
  refresh(tList? : BaseBusiness[]) {
    //console.log("refresh:", tList);
    this.resetLists();
		if(!!tList) {
      this.loadCorpInfo();
      for(let b of tList) {
        // TODO: implement!
      }
		} else {
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
  private transferList : ItemsTransaction[];
	// parses corporation storage for transfers and trades
  parseStorage() {
    if(!!this.corpStorage) {
      let corp = this._corporationService.getCorporation(this.corpId);
			// new transaction to use if no transaction found in list
			let transfer : ItemsTransaction = new ItemsTransaction(TransactionDirection.FromCorporation, corp);
			// new lists required for change event to happen
      let sList : SellItemTransaction[] = [];
      let tList : ItemsTransaction[] = [];
      for(let i of this.corpStorage) {
        if(i.isSell) {
					let amount = (!!i.amountSell)? i.amountSell : i.item[0].total_quantity;
					let money = (!!i.priceSell) ? i.priceSell : 0;
          let s : SellItemTransaction = new SellItemTransaction(
						amount,
						i.item,
						money,
						TransactionDirection.FromCorporation,
						corp
					);
          if(!!this.tradeList) for(let t of this.tradeList) {
            if(s.isEqual(t)) s = t;
          }
          sList.push(s);
        }
        if(i.isTransfer) {
					// put all storage items into new transaction
					let amount = (!!i.amountTransfer)? i.amountTransfer : i.item[0].total_quantity;
					transfer.addItem({item:i.item,amount:amount});
        }
      }
			if(transfer.items.length > 0) tList.push(transfer);
      // copy all transactions from companies
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
    for(let i in this.corpStorage) {
      if(this.corpStorage[i].item.ItemType.id == item.ItemType.id) return +i;
    }
    return -1;
  }
  // corporation storage change
  storageChange(list:StorageItem[]) {
		//console.log("corp storage change", list);
    this.corpStorage = list;
    this.parseStorage();
  }
  // find transaction of given direction in given list
  findItemTransaction(item : StorageItem, list: BaseTransaction[], direction : TransactionDirection) : number {
    for(let i in list) {
			let t = list[i];
			if(t.direction == direction) {
				if((t instanceof ItemsTransaction) || (t instanceof SellItemTransaction)) {
					if(t.hasItem(item.item)) return +i;
				}
			}
    }
    return -1;
  }
	// trade list change event handler
  tradeChange(list : SellItemTransaction[]) {
    //console.log("tradeChange", list)
    // parse changed list
    let corpList = [];
    let compList = [];
    for(let t of list) {
      if(t.direction === TransactionDirection.FromCorporation) {
        corpList.push(t);
      } else {
        compList.push(t);
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
	_parseStorage(storage : StorageItem[], list : BaseTransaction[], direction : TransactionDirection)  : StorageItem[] {
		//console.log("_parseStorage:", storage, list);
		let result : StorageItem[] = [];
		// search for clear storage transactions
		let isClear = false;
		for(let i of list) if (i.type == TransactionType.ClearStorage) isClear = true;
		for(let t of storage) {
			let i = this.findItemTransaction(t, list, direction);
			// if item is not found - its neither transfer nor sale active
			t.isTransfer = isClear;
			t.isSell = false;
			if(i !== -1) {
				// get first transaction in list
				let removed = list.splice(i, 1);
				// check its type
				if(removed[0].type == TransactionType.Transfer) {
					let transaction = <ItemsTransaction>removed[0];
					let item = transaction.items[transaction.findItem(t.item)];
					t.amountTransfer = item.amount;
					t.isTransfer = true;
				}
				if(removed[0].type == TransactionType.Trade) {
					let transaction = <SellItemTransaction>removed[0];
					t.amountSell = transaction.amount;
					t.priceSell = transaction.money;
					t.isSell = true;
				}
				// search for second transaction
				let second = this.findItemTransaction(t, list, direction);
				if(second !== -1) {
					if(list[second].type == TransactionType.Transfer) {
						let transaction = <ItemsTransaction>list[second];
						let item = transaction.items[transaction.findItem(t.item)];
						t.amountTransfer = item.amount;
						t.isTransfer = true;
					}
					if(list[second].type == TransactionType.Trade) {
						let transaction = <SellItemTransaction>list[second];
						t.amountSell = transaction.amount;
						t.priceSell = transaction.money;
						t.isSell = true;
					}
				}
				// put removed element back to original array
				// because transaction may have more than one item in it
				list = list.concat(removed);
			}
      result.push(t);
    }
		return result;
	}
	// actualises corporations storage with given transactions list
  parseStorageTransactions(list : BaseTransaction[]) {
    let cList = this._parseStorage(this.corpStorage, list, TransactionDirection.FromCorporation);
    this.storageChange(cList);
  }
	// actualises companies storage with given transactions list
  parseCompaniesTransactions(list : BaseTransaction[]) {
    //console.log("parseCompaniesTransactions", list);
    for(let c of this.corpInfo.companies) {
			// filter list of transactions by company
			let filteredList = [];
			for(let i of list) if(i.business.id == c.id) filteredList.push(i);
			// parse storage for items in transactions
			let cList = this._parseStorage(this.details[c.id].storage, filteredList, TransactionDirection.FromCompany);
      this.companyStorageChange({ cId : c.id, list : cList });
    }
  }
	// transfer list change event handler
  transferChange(list : ItemsTransaction[]) {
    //console.log("transferChange:", list);
		// split list by source business
    let corpList = [];
    let compList = [];
    for(let t of list) {
      if(t.direction === TransactionDirection.FromCorporation) {
        corpList.push(t);
      } else {
        compList.push(t);
      }
    }
    // join with trade list
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
		let direction = TransactionDirection.FromCompany;
    //console.log("company", company);
    let sList = [];
    let tList = [];
		let tItems = [];
		let isTotal : boolean = true;
    for(let i of changeEvent.list) {
			let item = i.item;
      if(i.isSell) {
				let amount = (!!(<StorageItem>i).amountSell) ? (<StorageItem>i).amountSell : i.item[0].total_quantity;
				let money = (!!(<StorageItem>i).priceSell) ? (<StorageItem>i).priceSell : 0;
        let s : SellItemTransaction = new SellItemTransaction(amount, item, money, direction, company);
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
				let total = +i.item[0].total_quantity;
				let amount = (!!(<StorageItem>i).amountTransfer) ? +((<StorageItem>i).amountTransfer) : +total;
				if(total != amount) isTotal = false;
				tItems.push({item:i.item,amount:amount});
      }
    }
		if(tItems.length > 0) {
			let transfer : ItemsPackageTransaction;
			// if full amount of all items must be transferred - its "clear storage"
			if((tItems.length == changeEvent.list.length) && isTotal) {
				transfer = new ClearStorageTransaction(direction, company);
			} else {
				transfer = new ItemsTransaction(direction, company);
			}
			transfer.addItems(tItems);
			tList.push(transfer);
		}
    // copy all corporation storage items
		// and company storage items from other companies
    if(!!this.tradeList) for(let t of this.tradeList) {
      if(t.direction == TransactionDirection.FromCorporation) sList.push(t);
      if((t.direction == TransactionDirection.FromCompany) && (t.business.id != changeEvent.cId)) sList.push(t);
    }
    if(!!this.transferList) for(let t of this.transferList) {
      if(t.direction == TransactionDirection.FromCorporation) tList.push(t);
      if((t.direction == TransactionDirection.FromCompany) && (t.business.id !== changeEvent.cId)) tList.push(t);
    }
		//console.info("companyStorageChange end:", tList);
    this.tradeList = sList;
    this.transferList = tList;
  }

  companyInvest(investEvent : {cId : number, amount : number}) {
		//console.log("invest event:", investEvent);
    let list = [];
    let present = false;
    if(!!this.investList) for(let i of this.investList) {
      if(i.business.id !== investEvent.cId) list.push(i);
      else {
        i.money = +investEvent.amount;
        present = true;
        list.push(i);
      }
    }
    if(!present) {
      let t : InvestTransaction = new InvestTransaction(+investEvent.amount, TransactionDirection.FromCompany, this.details[investEvent.cId].item);
			//console.log("new invest transaction", t);
      list.push(t);
    }
    this.investList = list;
  }
  investmentsChange(list : InvestTransaction[]) {
    // TODO: implement investments list change event handler
		// will be needed if we will save the investment amount in companies list
    //console.log("investmentsChange", list);
		this.investList = list;
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
