import { BaseStorageElement } from './contracts';
import { BaseBusiness } from '../contracts';

export enum TransactionType {
	Trade,
	Transfer,
	Invest,
	ClearStorage
}
export enum TransactionDirection {
	FromCompany,
	FromCorporation,
	ToCompany,
	ToCorporation
}
/* abstract base interface */
export interface IBaseTransaction {
	type			: TransactionType;
	direction	: TransactionDirection;
	business	: BaseBusiness;
	isEqual(target : IBaseTransaction) : boolean;
	getTitle() : string;
}
export interface ICountableTransaction {
	amount	: number;
}
export interface IMoneyTransaction {
	money	: number;
}
export interface IItemTransaction {
	item : BaseStorageElement
}
export interface IItemPackage extends IItemTransaction, ICountableTransaction {
}
// base class for all transactions
export class BaseTransaction implements IBaseTransaction {
	constructor(public type			: TransactionType,
		public direction	: TransactionDirection,
		public business	: BaseBusiness) {}
	public isEqual(target : BaseTransaction) : boolean {
		if(this.type !== target.type) return false;
		if(this.direction !== target.direction) return false;
		if(this.business.id !== target.business.id) return false;
		return true;
	}
	public getTitle() : string {
		return "Transaction: ";
	}
}
// intermediate class to work with items array
class ItemsPackageTransaction extends BaseTransaction {
	private _items : IItemPackage[];
	constructor(
		type			: TransactionType,
		direction	: TransactionDirection,
		business	: BaseBusiness) {
		super(type, direction, business);
		this._items = [];
	}
	public get items() { return this._items; }
	public addItem(item : IItemPackage) {
		this._items.push(item);
	}
	public removeItem(item : IItemPackage) {
		let iArr : IItemPackage[] = [];
		for(let i of this._items) if(i.item.ItemType.id !== item.item.ItemType.id) iArr.push(i);
		this._items = iArr;
	}
	// replaces an item - used to change amount
	public replaceItem(item : IItemPackage) {
		let iArr : IItemPackage[] = [];
		for(let i of this._items)
			if(i.item.ItemType.id !== item.item.ItemType.id) iArr.push(i);
			else iArr.push(item);
		this._items = iArr;
	}
	public hasItem(item : IItemPackage) {
		for(let i of this._items)
			if((item.item.ItemType.id === i.item.ItemType.id) && (item.amount === i.amount)) return true;
		return false;
	}
	public isEqual(target : BaseTransaction) : boolean {
		if(!super.isEqual(target)) return false;
		if(target instanceof ItemsTransaction) {
			for(let t of target.items) if(!this.hasItem(t)) return false;
			return true;
		} else return false;
	}
}
// final transaction class to work with transfer of multiple items
export class ItemsTransaction extends ItemsPackageTransaction {
	constructor(direction	: TransactionDirection,
		business	: BaseBusiness) {
		super(TransactionType.Transfer, direction, business);
	}
	public getTitle() : string {
		let source = (this.direction === TransactionDirection.FromCompany) ? this.business.name : "Corporation";
		let target = (this.direction === TransactionDirection.FromCorporation) ? this.business.name : "Corporation";
		return super.getTitle() + "Transfer of " + this.items.length + " item packages from " + source + " to " + target;
	}
}
export class ClearStorageTransaction extends ItemsPackageTransaction {
	constructor(direction	: TransactionDirection,
		business	: BaseBusiness) {
		super(TransactionType.ClearStorage, direction, business);
	}
	public getTitle() : string {
		let source = (!!this.business) ? this.business.name : "Corporation";
		return super.getTitle() + "Clear storage of " + source + " which contains " + this.items.length + " item packages";
	}
}
// single item transfer transaction - DEPRECATED
export class TransferItemTransaction extends BaseTransaction implements ICountableTransaction, IItemTransaction {
	constructor(public amount	: number,
		public item    : BaseStorageElement,
		direction	: TransactionDirection,
		business	: BaseBusiness) {
		super(TransactionType.Transfer, direction, business);
	}
	public isEqual(target : BaseTransaction) : boolean {
		if(!super.isEqual(target)) return false;
		if(target instanceof TransferItemTransaction) {
			if(this.item.ItemType.id !== target.item.ItemType.id) return false;
			return true;
		} else return false;
	}
	public getTitle() : string {
		let source = (this.direction === TransactionDirection.FromCompany) ? this.business.name : "Corporation";
		let target = (this.direction === TransactionDirection.FromCorporation) ? this.business.name : "Corporation";
		return super.getTitle() + "Transfer of " + this.amount + " " + this.item.ItemType.name + " from " + source + " to " + target;
	}
}
export class InvestTransaction extends BaseTransaction implements IMoneyTransaction {
	constructor(public money	: number,
		direction	: TransactionDirection,
		business	: BaseBusiness) {
		super(TransactionType.Invest, direction, business);
	}
	public getTitle() : string {
		return super.getTitle() + "Invest " + this.money + " vDollars to " + this.business.name;
	}
}
export class SellItemTransaction extends BaseTransaction implements IMoneyTransaction, ICountableTransaction {
	constructor(public amount	: number,
		public item    : BaseStorageElement,
		public money	: number,
		direction	: TransactionDirection,
		business	: BaseBusiness) {
			super(TransactionType.Trade, direction, business);
		}
		public isEqual(target : BaseTransaction) : boolean {
			if(!super.isEqual(target)) return false;
			if(target instanceof SellItemTransaction) {
				if(this.item.ItemType.id !== target.item.ItemType.id) return false;
				return true;
			} else return false;
		}
		public getTitle() : string {
			let source = (!!this.business)? this.business.name : "Corporation";
			return super.getTitle() + "Sell " + this.amount + " of " + this.item.ItemType.name + " for " + this.money + " vDollars from " + source;
		}
}
