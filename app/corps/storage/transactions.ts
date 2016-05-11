import { BaseStorageElement, SerializedStorageElement } from './contracts';
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
	serialize(obj? : any) : string;
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
	public serialize(obj? : any) : string {
		let business = {
			id : this.business.id,
			name : this.business.name,
			img : this.business.img
		}
		let res = (!!obj)? obj : {};
		res.business = business;
		res.type = this.type;
		res.direction = this.direction;
		return JSON.stringify(res);
	}
}
// intermediate class to work with items array
export class ItemsPackageTransaction extends BaseTransaction {
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
	public hasItemExact(item : IItemPackage) : boolean {
		for(let i of this._items)
			if((item.item.ItemType.id === i.item.ItemType.id) && (item.amount === i.amount)) return true;
		return false;
	}
	public hasItem(item : BaseStorageElement) : boolean {
		for(let i of this._items)
			if(item.ItemType.id === i.item.ItemType.id) return true;
		return false;
	}
	public findItem(item : BaseStorageElement) : number {
		for(let i in this._items)
			if((item.ItemType.id === this._items[i].item.ItemType.id)) return +i;
		return -1;
	}
	public isEqual(target : BaseTransaction) : boolean {
		if(!super.isEqual(target)) return false;
		if(target instanceof ItemsTransaction) {
			for(let t of target.items) if(!this.hasItem(t.item)) return false;
			return true;
		} else return false;
	}
	// compares only base properties without items
	public isLike(target) : boolean {
		return super.isEqual(target);
	}
	public serialize(obj? : any) : string {
		let _items = [];
		for(let i of this._items) {
			let _item = {
				total_quantity: i.item[0].total_quantity,
				id : i.item.ItemType.id,
				name: i.item.ItemType.name,
				image: i.item.ItemType.image
			}
			_items.push({
				amount : i.amount,
				item : _item
			});
		}
		let res = (!!obj)? obj : {};
		res.items = _items;
		return super.serialize(res);
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
	public serialize(obj? : any) : string {
		let res = (!!obj)? obj : {};
		res.title = this.getTitle();
		return super.serialize(res);
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
	public serialize(obj? : any) : string {
		let res = (!!obj)? obj : {};
		res.title = this.getTitle();
		return super.serialize(res);
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
	public serialize(obj? : any) : string {
		let res = (!!obj)? obj : {};
		res.money = this.money;
		res.title = this.getTitle();
		return super.serialize(res);
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
		public hasItem(item : BaseStorageElement) : boolean {
			if(item.ItemType.id === this.item.ItemType.id) return true;
			return false;
		}
		public serialize(obj? : any) : string {
			let i = this.item;
			let item = {
				id : i.ItemType.id,
				name: i.ItemType.name,
				image: i.ItemType.image
			};
			let res = (!!obj)? obj : {};
			res.item = item;
			res.money = this.money;
			res.amount = this.amount;
			res.title = this.getTitle();
			return super.serialize(res);
		}
}
