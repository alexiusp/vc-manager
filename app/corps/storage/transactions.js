System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var TransactionType, TransactionDirection, BaseTransaction, TransferItemTransaction, InvestTransaction, ClearStorageTransaction, SellItemTransaction;
    return {
        setters:[],
        execute: function() {
            (function (TransactionType) {
                TransactionType[TransactionType["Trade"] = 0] = "Trade";
                TransactionType[TransactionType["Transfer"] = 1] = "Transfer";
                TransactionType[TransactionType["Invest"] = 2] = "Invest";
                TransactionType[TransactionType["ClearStorage"] = 3] = "ClearStorage";
            })(TransactionType || (TransactionType = {}));
            exports_1("TransactionType", TransactionType);
            (function (TransactionDirection) {
                TransactionDirection[TransactionDirection["FromCompany"] = 0] = "FromCompany";
                TransactionDirection[TransactionDirection["FromCorporation"] = 1] = "FromCorporation";
                TransactionDirection[TransactionDirection["ToCompany"] = 2] = "ToCompany";
                TransactionDirection[TransactionDirection["ToCorporation"] = 3] = "ToCorporation";
            })(TransactionDirection || (TransactionDirection = {}));
            exports_1("TransactionDirection", TransactionDirection);
            BaseTransaction = (function () {
                function BaseTransaction(type, direction, business) {
                    this.type = type;
                    this.direction = direction;
                    this.business = business;
                }
                BaseTransaction.prototype.isEqual = function (target) {
                    if (this.type !== target.type)
                        return false;
                    if (this.direction !== target.direction)
                        return false;
                    if (this.business.id !== target.business.id)
                        return false;
                    return true;
                };
                return BaseTransaction;
            }());
            exports_1("BaseTransaction", BaseTransaction);
            TransferItemTransaction = (function (_super) {
                __extends(TransferItemTransaction, _super);
                function TransferItemTransaction(amount, item, direction, business) {
                    _super.call(this, TransactionType.Transfer, direction, business);
                    this.amount = amount;
                    this.item = item;
                }
                TransferItemTransaction.prototype.isEqual = function (target) {
                    if (!_super.prototype.isEqual.call(this, target))
                        return false;
                    if (target instanceof TransferItemTransaction) {
                        if (this.item.ItemType.id !== target.item.ItemType.id)
                            return false;
                        return true;
                    }
                    else
                        return false;
                };
                return TransferItemTransaction;
            }(BaseTransaction));
            exports_1("TransferItemTransaction", TransferItemTransaction);
            InvestTransaction = (function (_super) {
                __extends(InvestTransaction, _super);
                function InvestTransaction(money, direction, business) {
                    _super.call(this, TransactionType.Invest, direction, business);
                    this.money = money;
                }
                return InvestTransaction;
            }(BaseTransaction));
            exports_1("InvestTransaction", InvestTransaction);
            ClearStorageTransaction = (function (_super) {
                __extends(ClearStorageTransaction, _super);
                function ClearStorageTransaction(direction, business) {
                    _super.call(this, TransactionType.ClearStorage, direction, business);
                }
                return ClearStorageTransaction;
            }(BaseTransaction));
            exports_1("ClearStorageTransaction", ClearStorageTransaction);
            SellItemTransaction = (function (_super) {
                __extends(SellItemTransaction, _super);
                function SellItemTransaction(amount, item, money, direction, business) {
                    _super.call(this, TransactionType.Trade, direction, business);
                    this.amount = amount;
                    this.item = item;
                    this.money = money;
                }
                SellItemTransaction.prototype.isEqual = function (target) {
                    if (!_super.prototype.isEqual.call(this, target))
                        return false;
                    if (target instanceof SellItemTransaction) {
                        if (this.item.ItemType.id !== target.item.ItemType.id)
                            return false;
                        return true;
                    }
                    else
                        return false;
                };
                return SellItemTransaction;
            }(BaseTransaction));
            exports_1("SellItemTransaction", SellItemTransaction);
        }
    }
});
//# sourceMappingURL=transactions.js.map