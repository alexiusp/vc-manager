System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var TransactionType, TransactionDirection, BaseTransaction, ItemsPackageTransaction, ItemsTransaction, ClearStorageTransaction, TransferItemTransaction, InvestTransaction, SellItemTransaction;
    function TransactionDeserialize(input) {
        var obj = JSON.parse(input);
        if (obj.type === undefined)
            return undefined;
        var result;
        switch (obj.type) {
            case TransactionType.Trade:
                result = SellItemTransaction.deserialize(input);
                break;
            case TransactionType.Invest:
                result = InvestTransaction.deserialize(input);
                break;
            case TransactionType.Transfer:
                result = ItemsTransaction.deserialize(input);
                break;
            case TransactionType.ClearStorage:
                result = ClearStorageTransaction.deserialize(input);
                break;
        }
        return result;
    }
    exports_1("TransactionDeserialize", TransactionDeserialize);
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
                BaseTransaction.prototype.serialize = function (obj) {
                    var business = {
                        id: this.business.id,
                        name: this.business.name,
                        img: this.business.img
                    };
                    var res = (!!obj) ? obj : {};
                    res.business = business;
                    res.type = this.type;
                    res.direction = this.direction;
                    return JSON.stringify(res);
                };
                BaseTransaction.prototype.deserialize = function (input) {
                    return undefined;
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
                ItemsPackageTransaction.prototype.addItems = function (items) {
                    this._items = this._items.concat(items);
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
                ItemsPackageTransaction.prototype.hasItemExact = function (item) {
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var i = _a[_i];
                        if ((item.item.ItemType.id === i.item.ItemType.id) && (item.amount === i.amount))
                            return true;
                    }
                    return false;
                };
                ItemsPackageTransaction.prototype.hasItem = function (item) {
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var i = _a[_i];
                        if (item.ItemType.id === i.item.ItemType.id)
                            return true;
                    }
                    return false;
                };
                ItemsPackageTransaction.prototype.findItem = function (item) {
                    for (var i in this._items)
                        if ((item.ItemType.id === this._items[i].item.ItemType.id))
                            return +i;
                    return -1;
                };
                ItemsPackageTransaction.prototype.isEqual = function (target) {
                    var result = _super.prototype.isEqual.call(this, target);
                    if (target instanceof ItemsTransaction) {
                        for (var _i = 0, _a = target.items; _i < _a.length; _i++) {
                            var t = _a[_i];
                            if (!this.hasItem(t.item))
                                return false;
                        }
                        return true;
                    }
                    else
                        return result;
                };
                // compares only base properties without items
                ItemsPackageTransaction.prototype.isLike = function (target) {
                    return _super.prototype.isEqual.call(this, target);
                };
                ItemsPackageTransaction.prototype.serialize = function (obj) {
                    var _items = [];
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var i = _a[_i];
                        var _item = {
                            //total_quantity: i.item[0].total_quantity,
                            id: i.item.ItemType.id,
                            name: i.item.ItemType.name,
                            image: i.item.ItemType.image,
                            type: i.item.ItemType.type
                        };
                        _items.push({
                            amount: i.amount,
                            item: {
                                0: {
                                    total_quantity: -1
                                },
                                ItemType: _item
                            }
                        });
                    }
                    var res = (!!obj) ? obj : {};
                    res.items = _items;
                    return _super.prototype.serialize.call(this, res);
                };
                return ItemsPackageTransaction;
            }(BaseTransaction));
            exports_1("ItemsPackageTransaction", ItemsPackageTransaction);
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
                ItemsTransaction.prototype.serialize = function (obj) {
                    var res = (!!obj) ? obj : {};
                    //res.title = this.getTitle();
                    return _super.prototype.serialize.call(this, res);
                };
                ItemsTransaction.deserialize = function (input) {
                    var obj = JSON.parse(input);
                    var t = new ItemsTransaction(obj.direction, obj.business);
                    for (var _i = 0, _a = obj.items; _i < _a.length; _i++) {
                        var i = _a[_i];
                        t.addItem(i);
                    }
                    return t;
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
                ClearStorageTransaction.prototype.serialize = function (obj) {
                    var res = (!!obj) ? obj : {};
                    //res.title = this.getTitle();
                    return _super.prototype.serialize.call(this, res);
                };
                ClearStorageTransaction.deserialize = function (input) {
                    var obj = JSON.parse(input);
                    // we don't need to deserialize items
                    return new ClearStorageTransaction(obj.direction, obj.business);
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
                InvestTransaction.prototype.serialize = function (obj) {
                    var res = (!!obj) ? obj : {};
                    res.money = this.money;
                    //res.title = this.getTitle();
                    return _super.prototype.serialize.call(this, res);
                };
                InvestTransaction.deserialize = function (input) {
                    var obj = JSON.parse(input);
                    return new InvestTransaction(+obj.money, obj.direction, obj.business);
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
                SellItemTransaction.prototype.hasItem = function (item) {
                    if (item.ItemType.id === this.item.ItemType.id)
                        return true;
                    return false;
                };
                SellItemTransaction.prototype.serialize = function (obj) {
                    var i = this.item;
                    var item = {
                        id: i.ItemType.id,
                        name: i.ItemType.name,
                        image: i.ItemType.image,
                        type: i.ItemType.type
                    };
                    var res = (!!obj) ? obj : {};
                    res.item = item;
                    res.money = this.money;
                    res.amount = this.amount;
                    //res.title = this.getTitle();
                    return _super.prototype.serialize.call(this, res);
                };
                SellItemTransaction.deserialize = function (input) {
                    var obj = JSON.parse(input);
                    var item = {
                        0: {
                            total_quantity: 0
                        },
                        ItemType: obj.item
                    };
                    return new SellItemTransaction(+obj.amount, item, +obj.money, obj.direction, obj.business);
                };
                return SellItemTransaction;
            }(BaseTransaction));
            exports_1("SellItemTransaction", SellItemTransaction);
        }
    }
});
//# sourceMappingURL=transactions.js.map