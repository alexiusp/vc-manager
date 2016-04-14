import { BaseStorageElement } from './contracts';
import { BaseBusiness } from '../contracts';

/* Direction from/to Corporation/Company */
export enum TransactionObject {
  Company,//=0
  Corp//=1
}
export enum TransactionAction {
  moveProduction,
  clearStorage
}
interface CountableItems {
  amount	: number;
}
interface MoneyTransaction {
  price?: number;
}
/* abstract base class */
export interface BaseTransaction {
  owner  : TransactionObject;
}
export interface BaseItemTransaction extends BaseTransaction, CountableItems {
  item    : BaseStorageElement;// a transaction is about one item
  source  : BaseBusiness;// cource company
}
/*
export interface MassItemTransaction extends BaseTransaction {
  action  : TransactionAction;// if it is a multy item transaction
}
*/
/* comparison function */
export function itemTransactionEqual(a : BaseItemTransaction, b : BaseItemTransaction) {
  let checkSource = (a.source.id == b.source.id);
  let checkItem = (!!a.item && !!b.item)? (a.item.ItemType.id == b.item.ItemType.id) : true;
  //let checkAction = (!!a.action && !!b.action) ? (a.action == b.action) : true;
  let checkOwner = (a.owner == b.owner);
  return (checkSource && checkItem && checkOwner);// && checkAction
}
/* Point to point item transfer transaction */
export interface TransferItemTransaction extends BaseItemTransaction {
  target?: BaseBusiness;
}
/* selling transaction */
export interface SellItemTransaction extends BaseItemTransaction, MoneyTransaction {
}
/* investment transaction */
export interface InvestTransaction extends BaseTransaction, MoneyTransaction {
  target?: BaseBusiness;
}
export function isInvestTransaction(t : InvestTransaction | any) : t is InvestTransaction {
  return (!!(<InvestTransaction>t).target && !(<BaseItemTransaction>t).item);
}
