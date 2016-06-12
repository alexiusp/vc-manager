import {Component, Input, EventEmitter, Output, OnInit} from 'angular2/core';

import { CoreService } from '../../core/core.service';
import { MessagesService } from '../../messages/messages.service';
import {BaseStorageElement} from './contracts';
import {BaseBusiness, Company, CompanyDetail } from '../contracts';
import {
	IItemPackage,
	ItemsPackageTransaction,
	BaseTransaction,
	InvestTransaction,
	SellItemTransaction,
	TransferItemTransaction,
	ItemsTransaction,
	ClearStorageTransaction,
	TransactionDirection,
	TransactionType,
	TransactionDeserialize
} from './transactions';
import {StorageItemComponent} from './storage.item.component';
import {Dictionary} from '../../core/dictionary';
import { CorporationService } from '../corporation.service';
import { ResultMessage } from '../../request/response';
import { AccountService } from '../../account/account.service';
import { StorageService } from '../../storage/storage.service';

@Component({
  selector: 'supply-list',
	templateUrl: 'app/corps/storage/supply.list.component.html',
	directives: [StorageItemComponent]
})
export class SupplyListComponent implements OnInit {
	private saveList: any[];
  private progressValue: number;
  private maxProgress: number;
  private iProgress: number;
	private corpName: string;

	constructor(
		private _corporationService: CorporationService,
    private _coreService : CoreService,
    private _messages : MessagesService,
		private _account : AccountService,
		private _storage : StorageService
		) {
		this.saveList = [];
		this._init();
	}
	ngOnInit() {
		this.corpName = "Corporation";
		if(!!this._storage) this._load();
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
  private _items : ItemsPackageTransaction[];
	@Input('items')
	set items(itemArr : ItemsPackageTransaction[]) {
		//console.log("set items", itemArr);
    this._items = itemArr;
    this.parseTransfer();
	}
	get items() { return this._items; }
  private toCompTransfer : ItemsTransaction;
  private toCorpTransfer : ItemsPackageTransaction[];
	// parse items transaction array into two arrays
  parseTransfer() {
		//console.log("parseTransfer", this._items);
		this.toCompTransfer = null;
		let corpTransfer = [];
    if(!!this._items) {
			for(let i of this._items) {
				//console.log("transfer item:", i);
	      if(i.direction === TransactionDirection.FromCorporation) {
					this.corpName = i.business.name;
					//console.log("corpName ", this.corpName);
	        if((!!this.companies) && this.companies.length > 0) this.toCompTransfer = i;
	      } else corpTransfer.push(i);
				//console.log(i.getTitle());
	    }
		}
		this.toCorpTransfer = corpTransfer;
		this.checkEmptiness();
  };
  @Output('on-remove-item') onRemoveItem = new EventEmitter();
  removeTransfer(item : IItemPackage, transaction : ItemsPackageTransaction) {
    //console.log("remove transfer", item, transaction, this._items);
		// find transaction in list
    let sIdx = -1;
    for(let i in this._items) {
			if(transaction.isEqual(this._items[i])) sIdx = +i;
    }
		//console.log("transaction to remove", sIdx);
    if(sIdx > -1) {
			// remove old transaction
			this._items.splice(sIdx, 1);
			let newTrans = transaction;
			if(transaction.type == TransactionType.ClearStorage) {
				// convert ClearStorageTransaction to ItemsTransaction
				newTrans = new ItemsTransaction(transaction.direction, transaction.business);
				newTrans.addItems(transaction.items);
			}
			//remove item from transaction
			newTrans.removeItem(item);
			// if transaction has more items - add it back to list
			if(newTrans.items.length > 0) this._items.push(newTrans);
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
  footer handlers
  */
	private businessesToRefresh : BaseBusiness[];
	addBusiness(b : BaseBusiness) {
		if(!this.businessesToRefresh) this.businessesToRefresh = [];
		for(let c of this.businessesToRefresh) if(b.id == c.id) return;
		this.businessesToRefresh.push(b);
	}
	findBusiness(b : BaseBusiness, list : ItemsTransaction[]) : number {
		for(let i in list) {
			if(list[i].business.id === b.id) return +i;
		}
		return -1;
	}
	compileTransactions() {
		let gList : BaseTransaction[] = [];
		// add all transfers from company to corporation
		for(let t of this.toCorpTransfer) gList.push(t);
		// add all transfers from corporation to company
		if(!!this.companies && this.companies.length > 0 && !!this.toCompTransfer) {
			for(let c of this.companies) {
				let t = new ItemsTransaction(TransactionDirection.FromCorporation, c);
				for(let i of this.toCompTransfer.items) t.addItem(i);
				gList.push(t);
				//console.log(t.serialize());
			}
		}
		// add all trades
		for(let t of this.trade) gList.push(t);
		// add all investments
		for(let t of this.investments) gList.push(t);
		// put to property
		return gList;
	}
  go() {
		this.businessesToRefresh = [];
		let tList = this.compileTransactions();
		// calculate the number of operations for progress bar
		let tNum = tList.length;
		this.initProgress(tNum);
		// go through transactions
		for(let t of tList) {
			//console.log("Transaction:", t);
			// add business to refresh list
			this.addBusiness(t.business);
			// add loading counter
			this._coreService.isLoading = true;
			switch(t.type) {
				case TransactionType.Trade:
					if(t instanceof SellItemTransaction) {
						let func;
						if(t.direction === TransactionDirection.FromCompany)
							func = this._corporationService.sellItemFromCompany(t.business.id, (<BaseStorageElement>t.item).ItemType.id, +t.amount, +t.money);
						if(t.direction == TransactionDirection.FromCorporation)
							func = this._corporationService.sellItemFromCorporation(t.business.id, (<BaseStorageElement>t.item).ItemType.id, +t.amount, +t.money);
						func.subscribe((res:ResultMessage[]) => {
							this._coreService.isLoading = false;
							this.parseErrors(t, res);
							//console.log("trade result",res);
							this.incrementProgress();
						});
					}
					break;
				case TransactionType.Invest:
					if(t instanceof InvestTransaction) {
						// TODO: implement corporation investment
						this._corporationService.addFundsToCompany(t.business.id, +t.money).subscribe((res:ResultMessage[]) => {
							this._coreService.isLoading = false;
							this.parseErrors(t, res);
							//console.log("invest money in companies result", res);
							this.incrementProgress();
						});
					}
					break;
				case TransactionType.ClearStorage:
					// TODO: implement
					break;
				case TransactionType.Transfer:
					if(t instanceof ItemsTransaction) {
						if(t.direction === TransactionDirection.FromCompany) {
							for(let i of t.items)
								this._corporationService.moveItemToCorporation(t.business.id, i.item.ItemType.id, +i.amount)
								.subscribe((res:ResultMessage[]) => {
									this._coreService.isLoading = false;
									this.parseErrors(t, res);
									//console.log("transfer item to corporation result:",res);
									this.incrementProgress();
								});
						} else {
							let items = [];
							for(let i of t.items) items.push({id:i.item.ItemType.id,amount:i.amount});
							this._corporationService.moveItemsToCompany(t.business.id, items)
			          .subscribe((res:ResultMessage[]) => {
			            this._coreService.isLoading = false;
									let mArr : ResultMessage[] = [];
									for(let i in res) {
										let m = res[i];
										if(m.class !== "flash_success") {
											m.msg += t.getTitle();
										}
										mArr.push(m);
									}
			            this._messages.addMessages(mArr);
			            //console.log("transfer items to company result:", mArr);
			            this.incrementProgress();
			          });
						}
					}
					break;
			}
		}
  }
/**
** Operations on saved transactions lists
**/
	save() {// save current transactions list
		let list = this.compileTransactions();
		let saveList = [];
		for(let i of list) saveList.push(i.serialize());
		//console.log("save list:", saveList);
		if(!this.saveList) this.saveList = [];
		let label = "save" + (this.saveList.length+1);
		this.saveList.push({
			name	: label,
			isEdit: false,
			list	: saveList
		});
		//console.log("saveList:", this.saveList);
		this._save();
	}
	change(label : string, save : any) {
		//console.log("change:", label, save);
		this._storage.removeData(this._account.User.id + '_' + save.name);
		save.name = label;
		save.isEdit = false;
		this._save();
	}
	delete(save : any) {
		this._storage.removeData(this._account.User.id + '_' + save.name);
		let l = [];
		for(let i of this.saveList) {
			if(i.name !== save.name) l.push(i);
		}
		this.saveList = l;
		this._save();
	}
	_save() {
		if(this._storage.isLoaded) {
			let l = [];
			let tKey = this._account.User.id + "_transactions";
			for(let i of this.saveList) {
				l.push(i.name);
				this._storage.saveData(this._account.User.id + '_' + i.name, i.list);
			}
			this._storage.saveData(tKey, l);
			//console.log("end _save:", tKey, l);
		}
	}
	_load() {
		if(this._storage.isLoaded) {
			// load saveList from localStorage
			let tKey = this._account.User.id + "_transactions";
			let l = this._storage.loadData(tKey);
			//console.log("transactions list:", l);
			if(!l) return;
			let saveList = [];
			for(let k of l) {
				let list = this._storage.loadData(this._account.User.id + '_' +  k);
				saveList.push(
					{
						name	: k,
						isEdit: false,
						list	: list
					}
				);
			}
			this.saveList = saveList;
			//console.log("loaded saveList:", saveList);
		}
	}
	load(save: any) {
		this._init();
		//console.log("loading saved transaction list: ", save);
		let sArr : SellItemTransaction[] = [];
		let tArr : ItemsPackageTransaction[] = [];
		let invArr : InvestTransaction[] = [];
		for(let i of save.list) {
			let t : BaseTransaction = TransactionDeserialize(i);
			//console.log("parsed transaction", t);
			switch(t.type) {
				case TransactionType.Trade:
					sArr.push(<SellItemTransaction>t);
					break;
				case TransactionType.Transfer:
					tArr.push(<ItemsTransaction>t);
					break;
				case TransactionType.Invest:
					invArr.push(<InvestTransaction>t);
					break;
				case TransactionType.ClearStorage:
					tArr.push(<ClearStorageTransaction>t);
					break;
			}
		}
		// companies array
		let cArr = [];
		// final items transaction array
		let iArr = [];
		let fromCorporation : ItemsTransaction;
		for(let t of tArr) {
			if(t.direction == TransactionDirection.FromCompany) {
				iArr.push(t);
			}	else {
				cArr.push(t.business);
				if(!fromCorporation) {// we need to create this only once
					fromCorporation  = new ItemsTransaction(TransactionDirection.FromCorporation, t.business);
					for(let i of t.items) fromCorporation.addItem(i);
				}
			}
		}
		if(!!fromCorporation) iArr.push(fromCorporation);
		if(!!this.onRemoveCompany) this.onRemoveCompany.emit(cArr);
    if(!!this.onRemoveItem) this.onRemoveItem.emit(iArr);
    if(!!this.onRemoveTrade) this.onRemoveTrade.emit(sArr);
    if(!!this.onChangeInvestments) this.onChangeInvestments.emit(invArr);
	}
/*
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
*/
  parseErrors(t : BaseTransaction, mArr : ResultMessage[]) {
    if(!!mArr) {
      let res = [];
      for(let m of mArr) {
        if(m.class !== "flash_success") m.msg += t.getTitle();
        res.push(m);
      }
      this._messages.addMessages(res);
    }
  }
	clear() {
    this._init();
    if(!!this.onRemoveCompany) this.onRemoveCompany.emit([]);
    if(!!this.onRemoveItem) this.onRemoveItem.emit([]);
    if(!!this.onRemoveTrade) this.onRemoveTrade.emit([]);
    if(!!this.onChangeInvestments) this.onChangeInvestments.emit([]);
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
