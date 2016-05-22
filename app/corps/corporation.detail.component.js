System.register(['angular2/core', 'angular2/router', './storage/models', './storage/transactions', './corporation.service', '../core/core.service', '../core/dictionary', './storage/supply.list.component', './companies.list.component', './storage/corporation.storage.component', './models', '../storage/storage.service'], function(exports_1, context_1) {
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
    var core_1, router_1, models_1, transactions_1, corporation_service_1, core_service_1, dictionary_1, supply_list_component_1, companies_list_component_1, corporation_storage_component_1, models_2, storage_service_1;
    var CorporationDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (models_1_1) {
                models_1 = models_1_1;
            },
            function (transactions_1_1) {
                transactions_1 = transactions_1_1;
            },
            function (corporation_service_1_1) {
                corporation_service_1 = corporation_service_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            },
            function (dictionary_1_1) {
                dictionary_1 = dictionary_1_1;
            },
            function (supply_list_component_1_1) {
                supply_list_component_1 = supply_list_component_1_1;
            },
            function (companies_list_component_1_1) {
                companies_list_component_1 = companies_list_component_1_1;
            },
            function (corporation_storage_component_1_1) {
                corporation_storage_component_1 = corporation_storage_component_1_1;
            },
            function (models_2_1) {
                models_2 = models_2_1;
            },
            function (storage_service_1_1) {
                storage_service_1 = storage_service_1_1;
            }],
        execute: function() {
            CorporationDetailComponent = (function () {
                function CorporationDetailComponent(_coreService, _router, _corporationService, _routeParams, _storageService) {
                    this._coreService = _coreService;
                    this._router = _router;
                    this._corporationService = _corporationService;
                    this._routeParams = _routeParams;
                    this._storageService = _storageService;
                    this.resetLists();
                }
                CorporationDetailComponent.prototype.ngOnInit = function () {
                    if (!this._coreService.isLoggedIn)
                        this._router.navigateByUrl('/');
                    else {
                        this.corpId = +this._routeParams.get('id');
                        var f = this._storageService.loadData("c_filter");
                        if (!!f) {
                            this.companyFilter = f;
                        }
                        else {
                            this.companyFilter = "all";
                        }
                        this.loadCorpInfo();
                    }
                };
                CorporationDetailComponent.prototype.loadCorpStorage = function () {
                    var _this = this;
                    this._coreService.isLoading = true;
                    this._corporationService.getCorpStorage(this.corpId)
                        .subscribe(function (res) {
                        // transform incoming contracted data
                        // to view presenter class
                        var list = [];
                        for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                            var i = res_1[_i];
                            var t = new models_1.StorageItem(i);
                            list.push(t);
                        }
                        //console.log("storage:", list);
                        _this.corpStorage = list;
                        _this._coreService.isLoading = false;
                    });
                };
                CorporationDetailComponent.prototype.loadCompanyDetail = function (id) {
                    var _this = this;
                    this._coreService.isLoading = true;
                    if (this.corpInfo.is_manager)
                        this._corporationService
                            .getCompanyDetail(id)
                            .subscribe(function (res) {
                            //console.log("company detail:", res);
                            _this.details[id].item = res;
                            _this._coreService.isLoading = false;
                        });
                };
                CorporationDetailComponent.prototype.loadCorpDetail = function (callback) {
                    var _this = this;
                    this._coreService.isLoading = true;
                    this._corporationService
                        .getCorpDetail(this.corpId)
                        .subscribe(function (res) {
                        if (!_this.details)
                            _this.details = new dictionary_1.map();
                        _this.corpInfo = res;
                        _this._coreService.isLoading = false;
                        if (!!callback)
                            callback();
                    });
                };
                CorporationDetailComponent.prototype.loadCompanyInfo = function (c) {
                    var _this = this;
                    //console.log("loadCompanyInfo ", c.name);
                    this.details[c.id] = new models_2.CompanyDetailItem();
                    this.loadCompanyDetail(c.id);
                    this._coreService.isLoading = true;
                    this._corporationService.getCompanyStorage(c.id)
                        .subscribe(function (res) {
                        // transform incoming contracted data
                        // to view presenter class
                        var list = [];
                        if (!!res)
                            for (var _i = 0, res_2 = res; _i < res_2.length; _i++) {
                                var i = res_2[_i];
                                var t = new models_1.StorageItem(i);
                                list.push(t);
                            }
                        //console.log("company storage:", list);
                        _this.details[c.id].storage = list;
                        _this._coreService.isLoading = false;
                    });
                };
                CorporationDetailComponent.prototype.loadCorpInfo = function () {
                    var _this = this;
                    this.loadCorpDetail(function () {
                        _this.loadCorpStorage();
                        if (!!_this.corpInfo.is_manager) {
                            _this._detailsCopied = false;
                            _this._coreService.observeLoading(function (isLoading) {
                                //console.log("observing loading:", isLoading);
                                if (!isLoading && !_this._detailsCopied && !!_this.details) {
                                    //console.log("copy details");
                                    var dArr = new dictionary_1.map();
                                    for (var _i = 0, _a = _this.corpInfo.companies; _i < _a.length; _i++) {
                                        var c = _a[_i];
                                        var d = _this.details[c.id];
                                        dArr[c.id] = d;
                                    }
                                    _this.details = dArr;
                                    _this._detailsCopied = true;
                                }
                            });
                            for (var _i = 0, _a = _this.corpInfo.companies; _i < _a.length; _i++) {
                                var c = _a[_i];
                                // load company info always for the first time
                                if (!_this.details[c.id])
                                    _this.loadCompanyInfo(c);
                                else {
                                    // check if the filter is set
                                    var f = _this.companyFilter || "all";
                                    //console.log("companies load:", c, f);
                                    if (f == "all" || c.type == f)
                                        _this.loadCompanyInfo(c);
                                }
                            }
                        }
                    });
                };
                /*
                backend operations functions
                */
                CorporationDetailComponent.prototype.investToCorp = function (amount) {
                    var _this = this;
                    //console.log("investToCorp", amount);
                    if (this.corpInfo.is_manager) {
                        this._coreService.isLoading = true;
                        this._corporationService.addFundsToCorporation(this.corpId, amount)
                            .subscribe(function (res) {
                            //console.log("result:",res);
                            //this.messages = res;
                            _this.loadCorpDetail();
                            _this._coreService.isLoading = false;
                        });
                    }
                };
                CorporationDetailComponent.prototype.setFilter = function (filter) {
                    //console.log("setFilter:", filter);
                    this.companyFilter = filter;
                };
                CorporationDetailComponent.prototype.refresh = function (tList) {
                    console.log("refresh:", tList);
                    this.resetLists();
                    if (!!tList) {
                        this.loadCorpInfo();
                        for (var _i = 0, tList_1 = tList; _i < tList_1.length; _i++) {
                            var b = tList_1[_i];
                        }
                    }
                    else {
                        this.loadCorpInfo();
                    }
                };
                CorporationDetailComponent.prototype.resetLists = function () {
                    this.tradeList = [];
                    this.transferList = [];
                    this.selectedCompanies = [];
                    this.investList = [];
                };
                CorporationDetailComponent.prototype.resetStorage = function () {
                    if (!!this.corpStorage) {
                        var sList = [];
                        for (var _i = 0, _a = this.corpStorage; _i < _a.length; _i++) {
                            var i = _a[_i];
                            i.isSell = false;
                            i.isTransfer = false;
                            sList.push(i);
                        }
                        this.corpStorage = sList;
                    }
                };
                // parses corporation storage for transfers and trades
                CorporationDetailComponent.prototype.parseStorage = function () {
                    if (!!this.corpStorage) {
                        var corp = this._corporationService.getCorporation(this.corpId);
                        // new transaction to use if no transaction found in list
                        var transfer = new transactions_1.ItemsTransaction(transactions_1.TransactionDirection.FromCorporation, corp);
                        // new lists required for change event to happen
                        var sList = [];
                        var tList = [];
                        for (var _i = 0, _a = this.corpStorage; _i < _a.length; _i++) {
                            var i = _a[_i];
                            if (i.isSell) {
                                var amount = (!!i.amountSell) ? i.amountSell : i.item[0].total_quantity;
                                var money = (!!i.priceSell) ? i.priceSell : 0;
                                var s = new transactions_1.SellItemTransaction(amount, i.item, money, transactions_1.TransactionDirection.FromCorporation, corp);
                                if (!!this.tradeList)
                                    for (var _b = 0, _c = this.tradeList; _b < _c.length; _b++) {
                                        var t = _c[_b];
                                        if (s.isEqual(t))
                                            s = t;
                                    }
                                sList.push(s);
                            }
                            if (i.isTransfer) {
                                // put all storage items into new transaction
                                var amount = (!!i.amountTransfer) ? i.amountTransfer : i.item[0].total_quantity;
                                transfer.addItem({ item: i.item, amount: amount });
                            }
                        }
                        if (transfer.items.length > 0)
                            tList.push(transfer);
                        // copy all transactions from companies
                        if (!!this.tradeList)
                            for (var _d = 0, _e = this.tradeList; _d < _e.length; _d++) {
                                var t = _e[_d];
                                if (t.direction == transactions_1.TransactionDirection.FromCompany)
                                    sList.push(t);
                            }
                        if (!!this.transferList)
                            for (var _f = 0, _g = this.transferList; _f < _g.length; _f++) {
                                var t = _g[_f];
                                if (t.direction == transactions_1.TransactionDirection.FromCompany)
                                    tList.push(t);
                            }
                        this.tradeList = sList;
                        this.transferList = tList;
                    }
                };
                CorporationDetailComponent.prototype.findInStorage = function (item) {
                    for (var i in this.corpStorage) {
                        if (this.corpStorage[i].item.ItemType.id == item.ItemType.id)
                            return +i;
                    }
                    return -1;
                };
                // corporation storage change
                CorporationDetailComponent.prototype.storageChange = function (list) {
                    //console.log("corp storage change", list);
                    this.corpStorage = list;
                    this.parseStorage();
                };
                // find transaction of given direction in given list
                CorporationDetailComponent.prototype.findItemTransaction = function (item, list, direction) {
                    for (var i in list) {
                        var t = list[i];
                        if (t.direction == direction) {
                            if ((t instanceof transactions_1.ItemsTransaction) || (t instanceof transactions_1.SellItemTransaction)) {
                                if (t.hasItem(item.item))
                                    return +i;
                            }
                        }
                    }
                    return -1;
                };
                // trade list change event handler
                CorporationDetailComponent.prototype.tradeChange = function (list) {
                    console.log("tradeChange", list);
                    // parse changed list
                    var corpList = [];
                    var compList = [];
                    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                        var t = list_1[_i];
                        if (t.direction === transactions_1.TransactionDirection.FromCorporation) {
                            corpList.push(t);
                        }
                        else {
                            compList.push(t);
                        }
                    }
                    // join with transfer
                    for (var _a = 0, _b = this.transferList; _a < _b.length; _a++) {
                        var i = _b[_a];
                        if (i.direction == transactions_1.TransactionDirection.FromCorporation) {
                            corpList.push(i);
                        }
                        else {
                            compList.push(i);
                        }
                    }
                    this.parseStorageTransactions(corpList);
                    this.parseCompaniesTransactions(compList);
                };
                CorporationDetailComponent.prototype._parseStorage = function (storage, list, direction) {
                    var result = [];
                    for (var _i = 0, storage_1 = storage; _i < storage_1.length; _i++) {
                        var t = storage_1[_i];
                        var i = this.findItemTransaction(t, list, direction);
                        // if item is not found - its neither transfer nor sale active
                        t.isTransfer = false;
                        t.isSell = false;
                        if (i !== -1) {
                            // get first transaction in list
                            var removed = list.splice(i, 1);
                            // check its type
                            if (removed[0].type == transactions_1.TransactionType.Transfer) {
                                var transaction = removed[0];
                                var item = transaction.items[transaction.findItem(t.item)];
                                t.amountTransfer = item.amount;
                                t.isTransfer = true;
                            }
                            if (removed[0].type == transactions_1.TransactionType.Trade) {
                                var transaction = removed[0];
                                t.amountSell = transaction.amount;
                                t.priceSell = transaction.money;
                                t.isSell = true;
                            }
                            // search for second transaction
                            var second = this.findItemTransaction(t, list, direction);
                            if (second !== -1) {
                                if (list[second].type == transactions_1.TransactionType.Transfer) {
                                    var transaction = list[second];
                                    var item = transaction.items[transaction.findItem(t.item)];
                                    t.amountTransfer = item.amount;
                                    t.isTransfer = true;
                                }
                                if (list[second].type == transactions_1.TransactionType.Trade) {
                                    var transaction = list[second];
                                    t.amountSell = transaction.amount;
                                    t.priceSell = transaction.money;
                                    t.isSell = true;
                                }
                            }
                            // put removed element back to original array
                            // because transaction may have more than one item in it
                            list = list.concat(removed);
                        }
                        result.push(t);
                    }
                    return result;
                };
                // actualises corporations storage with given transactions list
                CorporationDetailComponent.prototype.parseStorageTransactions = function (list) {
                    var cList = this._parseStorage(this.corpStorage, list, transactions_1.TransactionDirection.FromCorporation);
                    this.storageChange(cList);
                };
                // actualises companies storage with given transactions list
                CorporationDetailComponent.prototype.parseCompaniesTransactions = function (list) {
                    console.log("parseCompaniesTransactions", list);
                    for (var _i = 0, _a = this.corpInfo.companies; _i < _a.length; _i++) {
                        var c = _a[_i];
                        var cList = this._parseStorage(this.details[c.id].storage, list, transactions_1.TransactionDirection.FromCompany);
                        this.companyStorageChange({ cId: c.id, list: cList });
                    }
                };
                // transfer list change event handler
                CorporationDetailComponent.prototype.transferChange = function (list) {
                    console.log("transferChange:", list);
                    // split list by source business
                    var corpList = [];
                    var compList = [];
                    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                        var t = list_2[_i];
                        if (t.direction === transactions_1.TransactionDirection.FromCorporation) {
                            corpList.push(t);
                        }
                        else {
                            compList.push(t);
                        }
                    }
                    // join with trade list
                    for (var _a = 0, _b = this.tradeList; _a < _b.length; _a++) {
                        var i = _b[_a];
                        if (i.direction == transactions_1.TransactionDirection.FromCorporation) {
                            corpList.push(i);
                        }
                        else {
                            compList.push(i);
                        }
                    }
                    this.parseStorageTransactions(corpList);
                    this.parseCompaniesTransactions(compList);
                };
                CorporationDetailComponent.prototype.parseSelectedCompanies = function () {
                    var cArr = [];
                    for (var _i = 0, _a = this.corpInfo.companies; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (this.details[c.id].isSelected)
                            cArr.push(this.details[c.id].item);
                    }
                    this.selectedCompanies = cArr;
                };
                CorporationDetailComponent.prototype.selectCompany = function (d) {
                    this.details[d.item.id].isSelected = d.isSelected;
                    this.parseSelectedCompanies();
                };
                CorporationDetailComponent.prototype.companiesChange = function (list) {
                    //console.log("companies change", list);
                    var dList = new dictionary_1.map();
                    for (var _i = 0, _a = this.corpInfo.companies; _i < _a.length; _i++) {
                        var c = _a[_i];
                        var d = this.details[c.id];
                        d.isSelected = false;
                        for (var _b = 0, list_3 = list; _b < list_3.length; _b++) {
                            var i = list_3[_b];
                            if (i.id == c.id)
                                d.isSelected = true;
                        }
                        dList[c.id] = d;
                    }
                    this.details = dList;
                    this.parseSelectedCompanies();
                };
                CorporationDetailComponent.prototype.companyStorageChange = function (changeEvent) {
                    //console.log("companyStorageChange", changeEvent);
                    var company = this.details[changeEvent.cId].item;
                    var corp = this._corporationService.getCorporation(this.corpId);
                    var direction = transactions_1.TransactionDirection.FromCompany;
                    //console.log("company", company);
                    var sList = [];
                    var tList = [];
                    var tItems = [];
                    var isTotal = true;
                    for (var _i = 0, _a = changeEvent.list; _i < _a.length; _i++) {
                        var i = _a[_i];
                        var item = i.item;
                        if (i.isSell) {
                            var amount = (!!i.amountSell) ? i.amountSell : i.item[0].total_quantity;
                            var money = (!!i.priceSell) ? i.priceSell : 0;
                            var s = new transactions_1.SellItemTransaction(amount, item, money, direction, company);
                            if (!!this.tradeList)
                                for (var _b = 0, _c = this.tradeList; _b < _c.length; _b++) {
                                    var t = _c[_b];
                                    if (s.isEqual(t)) {
                                        s.money = t.money;
                                        s.amount = t.amount;
                                    }
                                }
                            sList.push(s);
                        }
                        if (i.isTransfer) {
                            var total = +i.item[0].total_quantity;
                            var amount = (!!i.amountTransfer) ? +(i.amountTransfer) : +total;
                            if (total != amount)
                                isTotal = false;
                            tItems.push({ item: i.item, amount: amount });
                        }
                    }
                    if (tItems.length > 0) {
                        var transfer = void 0;
                        // if full amount of all items must be transferred - its "clear storage"
                        if ((tItems.length == changeEvent.list.length) && isTotal) {
                            transfer = new transactions_1.ItemsTransaction(direction, company);
                        }
                        else {
                            transfer = new transactions_1.ClearStorageTransaction(direction, company);
                        }
                        transfer.addItems(tItems);
                        tList.push(transfer);
                    }
                    // copy all corporation storage items
                    // and company storage items from other companies
                    if (!!this.tradeList)
                        for (var _d = 0, _e = this.tradeList; _d < _e.length; _d++) {
                            var t = _e[_d];
                            if (t.direction == transactions_1.TransactionDirection.FromCorporation)
                                sList.push(t);
                            if ((t.direction == transactions_1.TransactionDirection.FromCompany) && (t.business.id != changeEvent.cId))
                                sList.push(t);
                        }
                    if (!!this.transferList)
                        for (var _f = 0, _g = this.transferList; _f < _g.length; _f++) {
                            var t = _g[_f];
                            if (t.direction == transactions_1.TransactionDirection.FromCorporation)
                                tList.push(t);
                            if ((t.direction == transactions_1.TransactionDirection.FromCompany) && (t.business.id !== changeEvent.cId))
                                tList.push(t);
                        }
                    //console.info("companyStorageChange end:", tList);
                    this.tradeList = sList;
                    this.transferList = tList;
                };
                CorporationDetailComponent.prototype.companyInvest = function (investEvent) {
                    //console.log("invest event:", investEvent);
                    var list = [];
                    var present = false;
                    if (!!this.investList)
                        for (var _i = 0, _a = this.investList; _i < _a.length; _i++) {
                            var i = _a[_i];
                            if (i.business.id !== investEvent.cId)
                                list.push(i);
                            else {
                                i.money = +investEvent.amount;
                                present = true;
                                list.push(i);
                            }
                        }
                    if (!present) {
                        var t = new transactions_1.InvestTransaction(+investEvent.amount, transactions_1.TransactionDirection.FromCompany, this.details[investEvent.cId].item);
                        //console.log("new invest transaction", t);
                        list.push(t);
                    }
                    this.investList = list;
                };
                CorporationDetailComponent.prototype.investmentsChange = function (list) {
                    // TODO: implement investments list change event handler
                    // will be needed if we will save the investment amount in companies list
                    console.log("not implemented investmentsChange", list);
                };
                CorporationDetailComponent.prototype.findPos = function (obj) {
                    var curtop = 0;
                    if (obj.offsetParent) {
                        do {
                            curtop += obj.offsetTop;
                        } while (obj = obj.offsetParent);
                        return curtop;
                    }
                    return obj.offsetTop;
                };
                CorporationDetailComponent.prototype.scrollTop = function () {
                    var el = document.getElementById("_top");
                    if (!!el.scrollIntoView)
                        el.scrollIntoView(true);
                    else {
                        var pos = this.findPos(el);
                        //console.log("top:", pos);
                        window.scrollTo(0, pos);
                    }
                };
                CorporationDetailComponent = __decorate([
                    core_1.Component({
                        selector: 'ap-corp-detail',
                        templateUrl: 'app/corps/corporation.detail.component.html',
                        directives: [supply_list_component_1.SupplyListComponent, companies_list_component_1.CompaniesListComponent, corporation_storage_component_1.CorporationStorageComponent]
                    }), 
                    __metadata('design:paramtypes', [core_service_1.CoreService, router_1.Router, corporation_service_1.CorporationService, router_1.RouteParams, storage_service_1.StorageService])
                ], CorporationDetailComponent);
                return CorporationDetailComponent;
            }());
            exports_1("CorporationDetailComponent", CorporationDetailComponent);
        }
    }
});
//# sourceMappingURL=corporation.detail.component.js.map