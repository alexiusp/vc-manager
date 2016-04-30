import {Component, Input, EventEmitter, Output, OnInit} from 'angular2/core';

import { CoreService } from '../../core/core.service';
import { MessagesService } from '../../messages/messages.service';
import {BaseStorageElement} from './contracts';
import {BaseBusiness, Company, CompanyDetail } from '../contracts';
import {
	BaseTransaction,
	InvestTransaction,
	SellItemTransaction,
	TransferItemTransaction,
	TransactionDirection,
	TransactionType
} from './transactions';
import {StorageItemComponent} from './storage.item.component';
import {Dictionary} from '../../core/dictionary';
import { CorporationService } from '../corporation.service';
import { ResultMessage } from '../../request/response';

@Component({
  selector: 'supply-list',
	templateUrl: 'app/corps/storage/supply.list.component.html',
	directives: [StorageItemComponent]
})
export class SupplyListComponent implements OnInit {
  private _transactionList : Dictionary<BaseTransaction[]>;
  private progressValue: number;
  private maxProgress: number;
  private iProgress: number;
	private corpName: string;

	constructor(private _corporationService: CorporationService,
    private _coreService : CoreService,
    private _messages : MessagesService) {
		this._transactionList = new Dictionary<BaseTransaction[]>();
		this._init();
	}
	ngOnInit() {
		this.corpName = "Corporation";
	}
  _init() {
    this._companies = [];
    this._items = [];
    this._trade = [];
    this._investments = [];
  }
  private isActive : boolean;
  checkEmptiness() {
    this.checkTransfer();
    this.isActive = (!!this.trade && this.trade.length > 0)
      || (!!this.investments && this.investments.length > 0)
      || (this.hasTransfer);
    this.hasTrade = (!!this.trade && this.trade.length > 0);
    this.hasInvestments = (!!this.investments && this.investments.length > 0);
    //console.log("isActive", this.isActive);
    //console.log("hasTrade", this.hasTrade);
    //console.log("hasInvestments", this.hasInvestments);
  }
  private hasTransfer : boolean;
  checkTransfer() {
    let empty = true;
    if(!!this._items) for(let i of this._items) {
      if(i.direction === TransactionDirection.FromCompany) empty = false;
      else {
        if((!!this.companies && this.companies.length > 0)) empty = false;
      }
    }
    this.hasTransfer = !empty;
    //console.log("hasTransfer", this.hasTransfer);
  }

  // sell transactions
  private hasTrade;
  private _trade : SellItemTransaction[];
  @Input('trade')
  set trade(tArr : SellItemTransaction[]) {
    this._trade = tArr;
    //console.log("set trade", tArr);
    this.checkEmptiness();
  }
  get trade() { return this._trade; }
  @Output('on-remove-trade') onRemoveTrade = new EventEmitter();
  removeTrade(sellItem : SellItemTransaction) {
    //console.log("remove sell", sellItem);
    let sIdx = -1;
    for(let i in this._trade) {
			if(sellItem.isEqual(this._trade[i])) sIdx = +i;
    }
    if(sIdx > -1) {
      this._trade.splice(sIdx, 1);
      this.checkEmptiness();
      if(!!this.onRemoveTrade) this.onRemoveTrade.emit(this._trade);
    } else console.error("wrong sell transaction", sellItem);
  }


  // transfer transactions
  private _companies : CompanyDetail[];
  @Input()
  set companies(cArr : CompanyDetail[]) {
    //console.log("set companies", cArr);
    this._companies = cArr;
    this.parseTransfer();
  }
  get companies() { return this._companies; }
  private _items : TransferItemTransaction[];
	@Input('items')
	set items(itemArr : TransferItemTransaction[]) {
		//console.log("set items", itemArr);
    this._items = itemArr;
    this.parseTransfer();
	}
	get items() { return this._items; }
  private toCompTransfer : TransferItemTransaction[];
  private toCorpTransfer : TransferItemTransaction[];
  parseTransfer() {
    this.toCompTransfer = [];
    this.toCorpTransfer = [];
    if(!!this._items) {
			for(let i of this._items) {
				//console.log("transfer item:", i);
	      if(i.direction === TransactionDirection.FromCorporation) {
					this.corpName = i.business.name;
					//console.log("corpName ", this.corpName);
	        if((!!this.companies) && this.companies.length > 0) this.toCompTransfer.push(i);
	      } else this.toCorpTransfer.push(i);
	    }
		}
		this.checkEmptiness();
  };
  @Output('on-remove-item') onRemoveItem = new EventEmitter();
  removeTransfer(item : TransferItemTransaction) {
    //console.log("remove item", item);
    let sIdx = -1;
    for(let i in this._items) {
			if(item.isEqual(this._items[i])) sIdx = +i;
    }
    if(sIdx > -1) {
      this._items.splice(sIdx, 1);
      this.checkEmptiness();
      this.checkTransfer();
      if(!!this.onRemoveItem) this.onRemoveItem.emit(this._items);
    } else console.error("wrong transfer item", item);
  }
  @Output('on-remove-company') onRemoveCompany = new EventEmitter();
  removeCompany(d : CompanyDetail) {
    //console.log("remove company", c);
    let newArr = [];
    for(let c of this.companies) {
      if(c.id != d.id) newArr.push(c);
    }
    if(!!this.onRemoveCompany) this.onRemoveCompany.emit(newArr);
  }

  private hasInvestments  : boolean;
  private _investments : InvestTransaction[];
  @Input()
  set investments(iArr : InvestTransaction[]) {
    //console.log("set investments", iArr);
    this._investments = iArr;
    this.checkEmptiness();
  }
  get investments() { return this._investments; }
  @Output('on-change-investments') onChangeInvestments = new EventEmitter();
  removeInvestment(i : InvestTransaction) {
    let list = [];
    for(let item of this.investments) {
      if(item.business.id != i.business.id) list.push(item);
    }
    this.investments = list;
    if(!!this.onChangeInvestments) this.onChangeInvestments.emit(list);
  }
  @Output('on-refresh') onRefresh = new EventEmitter();
  /*
  compileTransactions() {
    let gList : BaseTransaction[] = [];
    if(!!this.investments) for(let item of this.investments) gList.push(item);
    if(!!this.trade) for(let item of this.trade) gList.push(item);
    if(!!this.items) for(let item of this.items) {
      if(item.owner == TransactionObject.Company) gList.push(item);
      else for(let comp of this.companies)  {
        item.target = comp;
        gList.push(item);
      }
    }
    return gList;
  }
  */
  /*
  footer handlers
  */
	save() {
    //let list = this.compileTransactions();
    //console.log("save list:", list);
    //this._transactionList
	}
  clear() {
    this._init();
    if(!!this.onRemoveCompany) this.onRemoveCompany.emit([]);
    if(!!this.onRemoveItem) this.onRemoveItem.emit([]);
    if(!!this.onRemoveTrade) this.onRemoveTrade.emit([]);
    if(!!this.onChangeInvestments) this.onChangeInvestments.emit([]);
  }
	private businessesToRefresh : BaseBusiness[];
	addBusiness(b : BaseBusiness) {
		if(!this.businessesToRefresh) this.businessesToRefresh = [];
		for(let c of this.businessesToRefresh) if(b.id == c.id) return;
		this.businessesToRefresh.push(b);
	}
  go() {
		this.businessesToRefresh = [];
		// calculate the number of operations for progress bar
    let tNum = 0;
    if(!!this.investments) tNum += this.investments.length;
    if(!!this.trade) tNum += this.trade.length;
    let corpList = [];
		let corpTransList : TransferItemTransaction[] = [];
    let compList : TransferItemTransaction[] = [];
    if(!!this.items) {
      // split transfer list by owner
      for(let i of this.items) {
        if(i.direction === TransactionDirection.FromCorporation) {
          corpList.push({
            id      : i.item.ItemType.id,
            amount  : i.amount
          });
					corpTransList.push(i);
        } else compList.push(i);
      }
    }
    tNum += compList.length;
    if((corpList.length > 0) && !!this.companies) tNum += this.companies.length;
    this.initProgress(tNum);
    // transfer items to companies.
    if((corpList.length > 0) && !!this.companies) {
      for(let c of this.companies) {
				this.addBusiness(c);
        this._coreService.isLoading = true;
        this._corporationService.moveItemsToCompany(c.id, corpList)
          .subscribe((res:ResultMessage[]) => {
            this._coreService.isLoading = false;
						let mArr : ResultMessage[] = [];
						for(let i in res) {
							let m = res[i];
							if(m.class !== "flash_success") {
								let t = corpTransList[i];
								t.business = c;
								m.msg += this.printTransactionInfo(t);
							}
							mArr.push(m);
						}
            this._messages.addMessages(mArr);
            console.log("transfer items to company result:", mArr);
            this.incrementProgress();
          });
      }
    }
    // transfer items to corporation
    if(compList.length > 0) {
      for(let t of compList) {
        this._coreService.isLoading = true;
				this.addBusiness(t.business);
        this._corporationService.moveItemToCorporation(t.business.id, t.item.ItemType.id, t.amount)
        .subscribe((res:ResultMessage[]) => {
          this._coreService.isLoading = false;
          this.parseErrors(t, res);
          console.log("transfer items to corporation result:",res);
          this.incrementProgress();
        });
      }
    }
    // invest money in companies
    if(!!this.investments) for(let t of this.investments) {
			// TODO: implement corporation investment
			this.addBusiness(t.business);
      this._coreService.isLoading = true;
      this._corporationService.addFundsToCompany(t.business.id, t.money).subscribe((res:ResultMessage[]) => {
        this._coreService.isLoading = false;
        this.parseErrors(t, res);
        console.log("invest money in companies result", res);
        this.incrementProgress();
      });
    }
    // sell goods
    if(!!this.trade) for(let t of this.trade) {
      let func;
			this.addBusiness(t.business);
      this._coreService.isLoading = true;
      if(t.direction === TransactionDirection.FromCompany) func = this._corporationService.sellItemFromCompany(t.business.id, t.item.ItemType.id, t.amount, t.money);
      if(t.direction == TransactionDirection.FromCorporation) func = this._corporationService.sellItemFromCorporation(t.business.id, t.item.ItemType.id, t.amount, t.money);
      func.subscribe((res:ResultMessage[]) => {
        this._coreService.isLoading = false;
        this.parseErrors(t, res);
        console.log("trade result",res);
        this.incrementProgress();
      });
    }
  }

  printTransactionInfo(t: BaseTransaction) {
    let start = " in transaction: "
		let isInvest = t.type === TransactionType.Invest;
		let invest = (isInvest && t instanceof InvestTransaction)? "investment of " + t.money + " to " + t.business.name : "";
    let itemT = (!isInvest && t instanceof TransferItemTransaction)? "transfer an item " + (<TransferItemTransaction>t).item.ItemType.name : "";
		let itemS = (!isInvest && t instanceof SellItemTransaction)? "sell an item " + (<SellItemTransaction>t).item.ItemType.name : "";
		let business = " to " + t.business.name;
		if(!isInvest) {
			business = (t instanceof TransferItemTransaction && t.direction === TransactionDirection.FromCorporation)? " to " + t.business.name : " from " + t.business.name;
		}
    return start + invest + itemS + itemT + business;
  }
  parseErrors(t : BaseTransaction, mArr : ResultMessage[]) {
    if(!!mArr) {
      let res = [];
      for(let m of mArr) {
        if(m.class !== "flash_success") m.msg += this.printTransactionInfo(t);
        res.push(m);
      }
      this._messages.addMessages(res);
    }
  }
  /*
  progress indicator
  */
  initProgress(maxNum : number) {
    this.maxProgress = maxNum;
    this.iProgress = 0;
    this.progressValue = 10;
  }
  incrementProgress() {
    //console.log("incrementProgress")
    this.iProgress++;
    if (this.iProgress >= this.maxProgress) this.endProgress();
    else this.progressValue += 100/this.maxProgress;
    //console.log("progress:",this.progressValue);
  }
  endProgress() {
    this.progressValue = 0;
    if(!!this.onRefresh) this.onRefresh.emit(this.businessesToRefresh);
  }
}
