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
                SupplyListComponent.prototype.parseTransfer = function () {
                    this.toCompTransfer = [];
                    this.toCorpTransfer = [];
                    if (!!this._items) {
                        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                            var i = _a[_i];
                            //console.log("transfer item:", i);
                            if (i.direction === transactions_1.TransactionDirection.FromCorporation) {
                                this.corpName = i.business.name;
                                //console.log("corpName ", this.corpName);
                                if ((!!this.companies) && this.companies.length > 0)
                                    this.toCompTransfer.push(i);
                            }
                            else
                                this.toCorpTransfer.push(i);
                        }
                    }
                    this.checkEmptiness();
                };
                ;
                SupplyListComponent.prototype.removeTransfer = function (item) {
                    //console.log("remove item", item);
                    var sIdx = -1;
                    for (var i in this._items) {
                        if (item.isEqual(this._items[i]))
                            sIdx = +i;
                    }
                    if (sIdx > -1) {
                        this._items.splice(sIdx, 1);
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
                /*
                compileTransactions() {
                  let gList : BaseTransaction[] = [];
                  if(!!this.investments) for(let item of this.investments) gList.push(item);
                  if(!!this.trade) for(let item of this.trade) gList.push(item);
                  if(!!this.items) for(let item of this.items) {
                    if(item.owner == TransactionObject.Company) gList.push(item);
                    else for(let comp of this.companies)  {
                      item.target = comp;
                      gList.push(item);
                    }
                  }
                  return gList;
                }
                */
                /*
                footer handlers
                */
                SupplyListComponent.prototype.save = function () {
                    //let list = this.compileTransactions();
                    //console.log("save list:", list);
                    //this._transactionList
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
                SupplyListComponent.prototype.go = function () {
                    var _this = this;
                    this.businessesToRefresh = [];
                    // calculate the number of operations for progress bar
                    var tNum = 0;
                    if (!!this.investments)
                        tNum += this.investments.length;
                    if (!!this.trade)
                        tNum += this.trade.length;
                    var corpList = [];
                    var corpTransList = [];
                    var compList = [];
                    if (!!this.items) {
                        // split transfer list by owner
                        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                            var i = _a[_i];
                            if (i.direction === transactions_1.TransactionDirection.FromCorporation) {
                                corpList.push({
                                    id: i.item.ItemType.id,
                                    amount: i.amount
                                });
                                corpTransList.push(i);
                            }
                            else
                                compList.push(i);
                        }
                    }
                    tNum += compList.length;
                    if ((corpList.length > 0) && !!this.companies)
                        tNum += this.companies.length;
                    this.initProgress(tNum);
                    // transfer items to companies.
                    if ((corpList.length > 0) && !!this.companies) {
                        var _loop_1 = function(c) {
                            this_1.addBusiness(c);
                            this_1._coreService.isLoading = true;
                            this_1._corporationService.moveItemsToCompany(c.id, corpList)
                                .subscribe(function (res) {
                                _this._coreService.isLoading = false;
                                var mArr = [];
                                for (var i in res) {
                                    var m = res[i];
                                    if (m.class !== "flash_success") {
                                        var t = corpTransList[i];
                                        t.business = c;
                                        m.msg += _this.printTransactionInfo(t);
                                    }
                                    mArr.push(m);
                                }
                                _this._messages.addMessages(mArr);
                                console.log("transfer items to company result:", mArr);
                                _this.incrementProgress();
                            });
                        };
                        var this_1 = this;
                        for (var _b = 0, _c = this.companies; _b < _c.length; _b++) {
                            var c = _c[_b];
                            _loop_1(c);
                        }
                    }
                    // transfer items to corporation
                    if (compList.length > 0) {
                        var _loop_2 = function(t) {
                            this_2._coreService.isLoading = true;
                            this_2.addBusiness(t.business);
                            this_2._corporationService.moveItemToCorporation(t.business.id, t.item.ItemType.id, t.amount)
                                .subscribe(function (res) {
                                _this._coreService.isLoading = false;
                                _this.parseErrors(t, res);
                                console.log("transfer items to corporation result:", res);
                                _this.incrementProgress();
                            });
                        };
                        var this_2 = this;
                        for (var _d = 0, compList_1 = compList; _d < compList_1.length; _d++) {
                            var t = compList_1[_d];
                            _loop_2(t);
                        }
                    }
                    // invest money in companies
                    if (!!this.investments)
                        var _loop_3 = function(t) {
                            // TODO: implement corporation investment
                            this_3.addBusiness(t.business);
                            this_3._coreService.isLoading = true;
                            this_3._corporationService.addFundsToCompany(t.business.id, t.money).subscribe(function (res) {
                                _this._coreService.isLoading = false;
                                _this.parseErrors(t, res);
                                console.log("invest money in companies result", res);
                                _this.incrementProgress();
                            });
                        };
                        var this_3 = this;
                        for (var _e = 0, _f = this.investments; _e < _f.length; _e++) {
                            var t = _f[_e];
                            _loop_3(t);
                        }
                    // sell goods
                    if (!!this.trade)
                        var _loop_4 = function(t) {
                            var func = void 0;
                            this_4.addBusiness(t.business);
                            this_4._coreService.isLoading = true;
                            if (t.direction === transactions_1.TransactionDirection.FromCompany)
                                func = this_4._corporationService.sellItemFromCompany(t.business.id, t.item.ItemType.id, t.amount, t.money);
                            if (t.direction == transactions_1.TransactionDirection.FromCorporation)
                                func = this_4._corporationService.sellItemFromCorporation(t.business.id, t.item.ItemType.id, t.amount, t.money);
                            func.subscribe(function (res) {
                                _this._coreService.isLoading = false;
                                _this.parseErrors(t, res);
                                console.log("trade result", res);
                                _this.incrementProgress();
                            });
                        };
                        var this_4 = this;
                        for (var _g = 0, _h = this.trade; _g < _h.length; _g++) {
                            var t = _h[_g];
                            _loop_4(t);
                        }
                };
                SupplyListComponent.prototype.printTransactionInfo = function (t) {
                    var start = " in transaction: ";
                    var isInvest = t.type === transactions_1.TransactionType.Invest;
                    var invest = (isInvest && t instanceof transactions_1.InvestTransaction) ? "investment of " + t.money + " to " + t.business.name : "";
                    var itemT = (!isInvest && t instanceof transactions_1.TransferItemTransaction) ? "transfer an item " + t.item.ItemType.name : "";
                    var itemS = (!isInvest && t instanceof transactions_1.SellItemTransaction) ? "sell an item " + t.item.ItemType.name : "";
                    var business = " to " + t.business.name;
                    if (!isInvest) {
                        business = (t instanceof transactions_1.TransferItemTransaction && t.direction === transactions_1.TransactionDirection.FromCorporation) ? " to " + t.business.name : " from " + t.business.name;
                    }
                    return start + invest + itemS + itemT + business;
                };
                SupplyListComponent.prototype.parseErrors = function (t, mArr) {
                    if (!!mArr) {
                        var res = [];
                        for (var _i = 0, mArr_1 = mArr; _i < mArr_1.length; _i++) {
                            var m = mArr_1[_i];
                            if (m.class !== "flash_success")
                                m.msg += this.printTransactionInfo(t);
                            res.push(m);
                        }
                        this._messages.addMessages(res);
                    }
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