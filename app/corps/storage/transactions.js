System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var TransactionType, TransactionDirection, BaseTransaction, ItemsPackageTransaction, ItemsTransaction, ClearStorageTransaction, TransferItemTransaction, InvestTransaction, SellItemTransaction;
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
            // base class for all transactions
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
                BaseTransaction.prototype.getTitle = function () {
                    return "Transaction: ";
                };
                return BaseTransaction;
            }());
            exports_1("BaseTransaction", BaseTransaction);
            // intermediate class to work with items array
            ItemsPackageTransaction = (function (_super) {
                __extends(ItemsPackageTransaction, _super);
                function ItemsPackageTransaction(type, direction, business) {
                    _super.call(this, type, direction, business);
                    this._items = [];
                }
                Object.defineProperty(ItemsPackageTransaction.prototype, "items", {
                    get: function () { return this._items; },
                    enumerable: true,
                    configurable: true
                });
                ItemsPackageTransaction.prototype.addItem = function (item) {
                    this._items.push(item);
                };
                ItemsPackageTransaction.prototype.removeItem = function (item) {
                    var iArr = [];
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var i = _a[_i];
                        if (i.item.ItemType.id !== item.item.ItemType.id)
                            iArr.push(i);
                    }
                    this._items = iArr;
                };
                // replaces an item - used to change amount
                ItemsPackageTransaction.prototype.replaceItem = function (item) {
                    var iArr = [];
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var i = _a[_i];
                        if (i.item.ItemType.id !== item.item.ItemType.id)
                            iArr.push(i);
                        else
                            iArr.push(item);
                    }
                    this._items = iArr;
                };
                ItemsPackageTransaction.prototype.hasItem = function (item) {
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var i = _a[_i];
                        if ((item.item.ItemType.id === i.item.ItemType.id) && (item.amount === i.amount))
                            return true;
                    }
                    return false;
                };
                ItemsPackageTransaction.prototype.isEqual = function (target) {
                    if (!_super.prototype.isEqual.call(this, target))
                        return false;
                    if (target instanceof ItemsTransaction) {
                        for (var _i = 0, _a = target.items; _i < _a.length; _i++) {
                            var t = _a[_i];
                            if (!this.hasItem(t))
                                return false;
                        }
                        return true;
                    }
                    else
                        return false;
                };
                return ItemsPackageTransaction;
            }(BaseTransaction));
            // final transaction class to work with transfer of multiple items
            ItemsTransaction = (function (_super) {
                __extends(ItemsTransaction, _super);
                function ItemsTransaction(direction, business) {
                    _super.call(this, TransactionType.Transfer, direction, business);
                }
                ItemsTransaction.prototype.getTitle = function () {
                    var source = (this.direction === TransactionDirection.FromCompany) ? this.business.name : "Corporation";
                    var target = (this.direction === TransactionDirection.FromCorporation) ? this.business.name : "Corporation";
                    return _super.prototype.getTitle.call(this) + "Transfer of " + this.items.length + " item packages from " + source + " to " + target;
                };
                return ItemsTransaction;
            }(ItemsPackageTransaction));
            exports_1("ItemsTransaction", ItemsTransaction);
            ClearStorageTransaction = (function (_super) {
                __extends(ClearStorageTransaction, _super);
                function ClearStorageTransaction(direction, business) {
                    _super.call(this, TransactionType.ClearStorage, direction, business);
                }
                ClearStorageTransaction.prototype.getTitle = function () {
                    var source = (!!this.business) ? this.business.name : "Corporation";
                    return _super.prototype.getTitle.call(this) + "Clear storage of " + source + " which contains " + this.items.length + " item packages";
                };
                return ClearStorageTransaction;
            }(ItemsPackageTransaction));
            exports_1("ClearStorageTransaction", ClearStorageTransaction);
            // single item transfer transaction - DEPRECATED
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
                TransferItemTransaction.prototype.getTitle = function () {
                    var source = (this.direction === TransactionDirection.FromCompany) ? this.business.name : "Corporation";
                    var target = (this.direction === TransactionDirection.FromCorporation) ? this.business.name : "Corporation";
                    return _super.prototype.getTitle.call(this) + "Transfer of " + this.amount + " " + this.item.ItemType.name + " from " + source + " to " + target;
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
                InvestTransaction.prototype.getTitle = function () {
                    return _super.prototype.getTitle.call(this) + "Invest " + this.money + " vDollars to " + this.business.name;
                };
                return InvestTransaction;
            }(BaseTransaction));
            exports_1("InvestTransaction", InvestTransaction);
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
                SellItemTransaction.prototype.getTitle = function () {
                    var source = (!!this.business) ? this.business.name : "Corporation";
                    return _super.prototype.getTitle.call(this) + "Sell " + this.amount + " of " + this.item.ItemType.name + " for " + this.money + " vDollars from " + source;
                };
                return SellItemTransaction;
            }(BaseTransaction));
            exports_1("SellItemTransaction", SellItemTransaction);
        }
    }
});
//# sourceMappingURL=transactions.js.map