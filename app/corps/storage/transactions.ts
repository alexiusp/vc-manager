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
}
export interface ICountableTransaction {
	amount	: number;
}
export interface IMoneyTransaction {
	money	: number;
}

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
}
export class TransferItemsTransaction extends BaseTransaction implements ICountableTransaction {
	constructor(public amount	: number,
		public item    : BaseStorageElement,
		direction	: TransactionDirection,
		business	: BaseBusiness) {
		super(TransactionType.Transfer, direction, business);
	}
	public isEqual(target : BaseTransaction) : boolean {
		if(!super.isEqual(target)) return false;
		if(target instanceof TransferItemsTransaction) {
			if(this.item.ItemType.id !== target.item.ItemType.id) return false;
			return true;
		} else return false;
	}
}
export class InvestTransaction extends BaseTransaction implements IMoneyTransaction {
	constructor(public money	: number,
		direction	: TransactionDirection,
		business	: BaseBusiness) {
		super(TransactionType.Invest, direction, business);
	}
}
export class ClearStorageTransaction extends BaseTransaction {
	constructor(direction	: TransactionDirection,
		business	: BaseBusiness) {
		super(TransactionType.ClearStorage, direction, business);
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
}
