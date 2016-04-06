import { BaseStorageElement } from './contracts';
import { BaseBusiness } from '../contracts';

/* Direction from/to Corporation/Company */
export enum TransactionObject {
  Company,//=0
  Corp//=1
}
/* abstract base class */
export interface BaseTransaction {
  owner  : TransactionObject;
  amount	: number;
}
export interface BaseItemTransaction extends BaseTransaction {
  item    : BaseStorageElement;
  source  : BaseBusiness;
}
/* comparison function */
export function itemTransactionEqual(a : BaseItemTransaction, b : BaseItemTransaction) {
  return ((a.source.id == b.source.id) && (a.item.ItemType.id == b.item.ItemType.id) && (a.owner == b.owner));
}
/* Point to point item transfer transaction */
export interface TransferItemTransaction extends BaseItemTransaction {
  target?: BaseBusiness;
}
/* selling transaction */
export interface SellItemTransaction extends BaseItemTransaction {
  price?: number;
}
/* investment transaction */
export interface InvestTransaction extends BaseTransaction {
  target?: BaseBusiness;
}
