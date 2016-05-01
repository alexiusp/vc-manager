System.register(['angular2/core', '../../core/core.service', '../../messages/messages.service', './transactions', './storage.item.component', '../../core/dictionary', '../corporation.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, core_service_1, messages_service_1, transactions_1, storage_item_component_1, dictionary_1, corporation_service_1;
    var SupplyListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            },
            function (messages_service_1_1) {
                messages_service_1 = messages_service_1_1;
            },
            function (transactions_1_1) {
                transactions_1 = transactions_1_1;
            },
            function (storage_item_component_1_1) {
                storage_item_component_1 = storage_item_component_1_1;
            },
            function (dictionary_1_1) {
                dictionary_1 = dictionary_1_1;
            },
            function (corporation_service_1_1) {
                corporation_service_1 = corporation_service_1_1;
            }],
        execute: function() {
            SupplyListComponent = (function () {
                function SupplyListComponent(_corporationService, _coreService, _messages) {
                    this._corporationService = _corporationService;
                    this._coreService = _coreService;
                    this._messages = _messages;
                    this.onRemoveTrade = new core_1.EventEmitter();
                    this.onRemoveItem = new core_1.EventEmitter();
                    this.onRemoveCompany = new core_1.EventEmitter();
                    this.onChangeInvestments = new core_1.EventEmitter();
                    this.onRefresh = new core_1.EventEmitter();
                    this._transactionList = new dictionary_1.Dictionary();
                    this._init();
                }
                SupplyListComponent.prototype.ngOnInit = function () {
                    this.corpName = "Corporation";
                };
                SupplyListComponent.prototype._init = function () {
                    this._companies = [];
                    this._items = [];
                    this._trade = [];
                    this._investments = [];
                };
                SupplyListComponent.prototype.checkEmptiness = function () {
                    this.checkTransfer();
                    this.isActive = (!!this.trade && this.trade.length > 0)
                        || (!!this.investments && this.investments.length > 0)
                        || (this.hasTransfer);
                    this.hasTrade = (!!this.trade && this.trade.length > 0);
                    this.hasInvestments = (!!this.investments && this.investments.length > 0);
                    //console.log("isActive", this.isActive);
                    //console.log("hasTrade", this.hasTrade);
                    //console.log("hasInvestments", this.hasInvestments);
                };
                SupplyListComponent.prototype.checkTransfer = function () {
                    var empty = true;
                    if (!!this._items)
                        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                            var i = _a[_i];
                            if (i.direction === transactions_1.TransactionDirection.FromCompany)
                                empty = false;
                            else {
                                if ((!!this.companies && this.companies.length > 0))
                                    empty = false;
                            }
                        }
                    this.hasTransfer = !empty;
                    //console.log("hasTransfer", this.hasTransfer);
                };
                Object.defineProperty(SupplyListComponent.prototype, "trade", {
                    get: function () { return this._trade; },
                    set: function (tArr) {
                        this._trade = tArr;
                        //console.log("set trade", tArr);
                        this.checkEmptiness();
                    },
                    enumerable: true,
                    configurable: true
                });
                SupplyListComponent.prototype.removeTrade = function (sellItem) {
                    //console.log("remove sell", sellItem);
                    var sIdx = -1;
                    for (var i in this._trade) {
                        if (sellItem.isEqual(this._trade[i]))
                            sIdx = +i;
                    }
                    if (sIdx > -1) {
                        this._trade.splice(sIdx, 1);
                        this.checkEmptiness();
                        if (!!this.onRemoveTrade)
                            this.onRemoveTrade.emit(this._trade);
                    }
                    else
                        console.error("wrong sell transaction", sellItem);
                };
                Object.defineProperty(SupplyListComponent.prototype, "companies", {
                    get: function () { return this._companies; },
                    set: function (cArr) {
                        //console.log("set companies", cArr);
                        this._companies = cArr;
                        this.parseTransfer();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SupplyListComponent.prototype, "items", {
                    get: function () { return this._items; },
                    set: function (itemArr) {
                        //console.log("set items", itemArr);
                        this._items = itemArr;
                        this.parseTransfer();
                    },
                    enumerable: true,
                    configurable: true
                });
                // parse items transaction array into two arrays
                SupplyListComponent.prototype.parseTransfer = function () {
                    this.toCompTransfer = null;
                    var corpTransfer = [];
                    if (!!this._items) {
                        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                            var i = _a[_i];
                            //console.log("transfer item:", i);
                            if (i.direction === transactions_1.TransactionDirection.FromCorporation) {
                                this.corpName = i.business.name;
                                //console.log("corpName ", this.corpName);
                                if ((!!this.companies) && this.companies.length > 0)
                                    this.toCompTransfer = i;
                            }
                            else
                                corpTransfer.push(i);
                        }
                    }
                    this.toCorpTransfer = corpTransfer;
                    this.checkEmptiness();
                };
                ;
                SupplyListComponent.prototype.removeTransfer = function (item, transaction) {
                    //console.log("remove item", item);
                    // find transaction in list
                    var sIdx = -1;
                    for (var i in this._items) {
                        if (transaction.isEqual(this._items[i]))
                            sIdx = +i;
                    }
                    if (sIdx > -1) {
                        // remove old transaction
                        this._items.splice(sIdx, 1);
                        //remove item from transaction
                        transaction.removeItem(item);
                        // if transaction has more items - add it back to list
                        if (transaction.items.length > 0)
                            this._items.push(transaction);
                        this.checkEmptiness();
                        this.checkTransfer();
                        if (!!this.onRemoveItem)
                            this.onRemoveItem.emit(this._items);
                    }
                    else
                        console.error("wrong transfer item", item);
                };
                SupplyListComponent.prototype.removeCompany = function (d) {
                    //console.log("remove company", c);
                    var newArr = [];
                    for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (c.id != d.id)
                            newArr.push(c);
                    }
                    if (!!this.onRemoveCompany)
                        this.onRemoveCompany.emit(newArr);
                };
                Object.defineProperty(SupplyListComponent.prototype, "investments", {
                    get: function () { return this._investments; },
                    set: function (iArr) {
                        //console.log("set investments", iArr);
                        this._investments = iArr;
                        this.checkEmptiness();
                    },
                    enumerable: true,
                    configurable: true
                });
                SupplyListComponent.prototype.removeInvestment = function (i) {
                    var list = [];
                    for (var _i = 0, _a = this.investments; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.business.id != i.business.id)
                            list.push(item);
                    }
                    this.investments = list;
                    if (!!this.onChangeInvestments)
                        this.onChangeInvestments.emit(list);
                };
                SupplyListComponent.prototype.addBusiness = function (b) {
                    if (!this.businessesToRefresh)
                        this.businessesToRefresh = [];
                    for (var _i = 0, _a = this.businessesToRefresh; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (b.id == c.id)
                            return;
                    }
                    this.businessesToRefresh.push(b);
                };
                SupplyListComponent.prototype.findBusiness = function (b, list) {
                    for (var i in list) {
                        if (list[i].business.id === b.id)
                            return +i;
                    }
                    return -1;
                };
                SupplyListComponent.prototype.compileTransactions = function () {
                    var gList = [];
                    // add all transfers from company to corporation
                    for (var _i = 0, _a = this.toCorpTransfer; _i < _a.length; _i++) {
                        var t = _a[_i];
                        gList.push(t);
                    }
                    // add all transfers from corporation to company
                    if (!!this.companies && this.companies.length > 0 && !!this.toCompTransfer) {
                        for (var _b = 0, _c = this.companies; _b < _c.length; _b++) {
                            var c = _c[_b];
                            var t = new transactions_1.ItemsTransaction(transactions_1.TransactionDirection.FromCorporation, c);
                            for (var _d = 0, _e = this.toCompTransfer.items; _d < _e.length; _d++) {
                                var i = _e[_d];
                                t.addItem(i);
                            }
                            gList.push(t);
                        }
                    }
                    // add all trades
                    for (var _f = 0, _g = this.trade; _f < _g.length; _f++) {
                        var t = _g[_f];
                        gList.push(t);
                    }
                    // add all investments
                    for (var _h = 0, _j = this.investments; _h < _j.length; _h++) {
                        var t = _j[_h];
                        gList.push(t);
                    }
                    // put to property
                    return gList;
                };
                SupplyListComponent.prototype.save = function () {
                    //let list = this.compileTransactions();
                    //console.log("save list:", list);
                    //this._transactionList
                };
                SupplyListComponent.prototype.go = function () {
                    var _this = this;
                    this.businessesToRefresh = [];
                    var tList = this.compileTransactions();
                    // calculate the number of operations for progress bar
                    var tNum = tList.length;
                    this.initProgress(tNum);
                    // go through transactions
                    var _loop_1 = function(t) {
                        console.log("Transaction:", t);
                        // add business to refresh list
                        this_1.addBusiness(t.business);
                        // add loading counter
                        this_1._coreService.isLoading = true;
                        switch (t.type) {
                            case transactions_1.TransactionType.Trade:
                                if (t instanceof transactions_1.SellItemTransaction) {
                                    var func = void 0;
                                    if (t.direction === transactions_1.TransactionDirection.FromCompany)
                                        func = this_1._corporationService.sellItemFromCompany(t.business.id, t.item.ItemType.id, t.amount, t.money);
                                    if (t.direction == transactions_1.TransactionDirection.FromCorporation)
                                        func = this_1._corporationService.sellItemFromCorporation(t.business.id, t.item.ItemType.id, t.amount, t.money);
                                    func.subscribe(function (res) {
                                        _this._coreService.isLoading = false;
                                        _this.parseErrors(t, res);
                                        console.log("trade result", res);
                                        _this.incrementProgress();
                                    });
                                }
                                break;
                            case transactions_1.TransactionType.Invest:
                                if (t instanceof transactions_1.InvestTransaction) {
                                    // TODO: implement corporation investment
                                    this_1._corporationService.addFundsToCompany(t.business.id, t.money).subscribe(function (res) {
                                        _this._coreService.isLoading = false;
                                        _this.parseErrors(t, res);
                                        console.log("invest money in companies result", res);
                                        _this.incrementProgress();
                                    });
                                }
                                break;
                            case transactions_1.TransactionType.ClearStorage:
                                // TODO: implement
                                break;
                            case transactions_1.TransactionType.Transfer:
                                if (t instanceof transactions_1.ItemsTransaction) {
                                    if (t.direction === transactions_1.TransactionDirection.FromCompany) {
                                        for (var _i = 0, _a = t.items; _i < _a.length; _i++) {
                                            var i = _a[_i];
                                            this_1._corporationService.moveItemToCorporation(t.business.id, i.item.ItemType.id, i.amount)
                                                .subscribe(function (res) {
                                                _this._coreService.isLoading = false;
                                                _this.parseErrors(t, res);
                                                console.log("transfer items to corporation result:", res);
                                                _this.incrementProgress();
                                            });
                                        }
                                    }
                                    else {
                                        this_1._corporationService.moveItemsToCompany(t.business.id, t.items)
                                            .subscribe(function (res) {
                                            _this._coreService.isLoading = false;
                                            var mArr = [];
                                            for (var i in res) {
                                                var m = res[i];
                                                if (m.class !== "flash_success") {
                                                    m.msg += t.getTitle();
                                                }
                                                mArr.push(m);
                                            }
                                            _this._messages.addMessages(mArr);
                                            console.log("transfer items to company result:", mArr);
                                            _this.incrementProgress();
                                        });
                                    }
                                }
                                break;
                        }
                    };
                    var this_1 = this;
                    for (var _b = 0, tList_1 = tList; _b < tList_1.length; _b++) {
                        var t = tList_1[_b];
                        _loop_1(t);
                    }
                };
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
                SupplyListComponent.prototype.parseErrors = function (t, mArr) {
                    if (!!mArr) {
                        var res = [];
                        for (var _i = 0, mArr_1 = mArr; _i < mArr_1.length; _i++) {
                            var m = mArr_1[_i];
                            if (m.class !== "flash_success")
                                m.msg += t.getTitle();
                            res.push(m);
                        }
                        this._messages.addMessages(res);
                    }
                };
                SupplyListComponent.prototype.clear = function () {
                    this._init();
                    if (!!this.onRemoveCompany)
                        this.onRemoveCompany.emit([]);
                    if (!!this.onRemoveItem)
                        this.onRemoveItem.emit([]);
                    if (!!this.onRemoveTrade)
                        this.onRemoveTrade.emit([]);
                    if (!!this.onChangeInvestments)
                        this.onChangeInvestments.emit([]);
                };
                /*
                progress indicator
                */
                SupplyListComponent.prototype.initProgress = function (maxNum) {
                    this.maxProgress = maxNum;
                    this.iProgress = 0;
                    this.progressValue = 10;
                };
                SupplyListComponent.prototype.incrementProgress = function () {
                    //console.log("incrementProgress")
                    this.iProgress++;
                    if (this.iProgress >= this.maxProgress)
                        this.endProgress();
                    else
                        this.progressValue += 100 / this.maxProgress;
                    //console.log("progress:",this.progressValue);
                };
                SupplyListComponent.prototype.endProgress = function () {
                    this.progressValue = 0;
                    if (!!this.onRefresh)
                        this.onRefresh.emit(this.businessesToRefresh);
                };
                __decorate([
                    core_1.Input('trade'), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], SupplyListComponent.prototype, "trade", null);
                __decorate([
                    core_1.Output('on-remove-trade'), 
                    __metadata('design:type', Object)
                ], SupplyListComponent.prototype, "onRemoveTrade", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], SupplyListComponent.prototype, "companies", null);
                __decorate([
                    core_1.Input('items'), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], SupplyListComponent.prototype, "items", null);
                __decorate([
                    core_1.Output('on-remove-item'), 
                    __metadata('design:type', Object)
                ], SupplyListComponent.prototype, "onRemoveItem", void 0);
                __decorate([
                    core_1.Output('on-remove-company'), 
                    __metadata('design:type', Object)
                ], SupplyListComponent.prototype, "onRemoveCompany", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], SupplyListComponent.prototype, "investments", null);
                __decorate([
                    core_1.Output('on-change-investments'), 
                    __metadata('design:type', Object)
                ], SupplyListComponent.prototype, "onChangeInvestments", void 0);
                __decorate([
                    core_1.Output('on-refresh'), 
                    __metadata('design:type', Object)
                ], SupplyListComponent.prototype, "onRefresh", void 0);
                SupplyListComponent = __decorate([
                    core_1.Component({
                        selector: 'supply-list',
                        templateUrl: 'app/corps/storage/supply.list.component.html',
                        directives: [storage_item_component_1.StorageItemComponent]
                    }), 
                    __metadata('design:paramtypes', [corporation_service_1.CorporationService, core_service_1.CoreService, messages_service_1.MessagesService])
                ], SupplyListComponent);
                return SupplyListComponent;
            }());
            exports_1("SupplyListComponent", SupplyListComponent);
        }
    }
});
//# sourceMappingURL=supply.list.component.js.map