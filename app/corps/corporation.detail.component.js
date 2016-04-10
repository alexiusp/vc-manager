System.register(['angular2/core', 'angular2/router', './storage/models', './storage/transactions', './corporation.service', '../core/core.service', '../core/dictionary', './storage/supply.list.component', '../messages/alert.list.component', './companies.list.component', './storage/corporation.storage.component', './models'], function(exports_1, context_1) {
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
    var core_1, router_1, models_1, transactions_1, corporation_service_1, core_service_1, dictionary_1, supply_list_component_1, alert_list_component_1, companies_list_component_1, corporation_storage_component_1, models_2;
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
            function (alert_list_component_1_1) {
                alert_list_component_1 = alert_list_component_1_1;
            },
            function (companies_list_component_1_1) {
                companies_list_component_1 = companies_list_component_1_1;
            },
            function (corporation_storage_component_1_1) {
                corporation_storage_component_1 = corporation_storage_component_1_1;
            },
            function (models_2_1) {
                models_2 = models_2_1;
            }],
        execute: function() {
            CorporationDetailComponent = (function () {
                function CorporationDetailComponent(_coreService, _router, _corporationService, _routeParams) {
                    this._coreService = _coreService;
                    this._router = _router;
                    this._corporationService = _corporationService;
                    this._routeParams = _routeParams;
                    this.companiesDetails = new dictionary_1.map();
                    this.progressValue = 0;
                    this.maxProgress = 0;
                    this.iProgress = 0;
                    this.messages = [];
                    this.resetLists();
                    this._storages = new dictionary_1.map();
                }
                CorporationDetailComponent.prototype.ngOnInit = function () {
                    if (!this._coreService.isLoggedIn)
                        this._router.navigateByUrl('/');
                    else {
                        this.corpId = +this._routeParams.get('id');
                        this.loadCorpInfo();
                    }
                };
                CorporationDetailComponent.prototype.loadCorpStorage = function () {
                    var _this = this;
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
                    });
                };
                Object.defineProperty(CorporationDetailComponent.prototype, "storages", {
                    get: function () { return this._storages; },
                    enumerable: true,
                    configurable: true
                });
                CorporationDetailComponent.prototype.loadCompanyDetail = function (id) {
                    var _this = this;
                    if (this.corpInfo.is_manager)
                        this._corporationService
                            .getCompanyDetail(id)
                            .subscribe(function (res) {
                            //console.log("company detail:", res);
                            _this.companiesDetails[id] = res;
                        });
                };
                CorporationDetailComponent.prototype.loadCorpDetail = function (callback) {
                    var _this = this;
                    this._corporationService
                        .getCorpDetail(this.corpId)
                        .subscribe(function (res) {
                        _this.corpInfo = res;
                        if (!!callback)
                            callback();
                    });
                };
                CorporationDetailComponent.prototype.loadCorpInfo = function () {
                    var _this = this;
                    this.loadCorpDetail(function () {
                        _this.loadCorpStorage();
                        _this.companiesList = [];
                        if (!!_this.corpInfo.is_manager) {
                            var _loop_1 = function(c) {
                                _this.companiesList.push(new models_2.CompanyItem(c));
                                _this.loadCompanyDetail(c.id);
                                _this._corporationService.getCompanyStorage(c.id)
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
                                    _this._storages[c.id] = list;
                                });
                            };
                            for (var _i = 0, _a = _this.corpInfo.companies; _i < _a.length; _i++) {
                                var c = _a[_i];
                                _loop_1(c);
                            }
                        }
                    });
                };
                CorporationDetailComponent.prototype.initProgress = function (maxNum) {
                    this.maxProgress = maxNum;
                    this.iProgress = 0;
                    this.progressValue = 10;
                };
                CorporationDetailComponent.prototype.incrementProgress = function () {
                    //console.log("incrementProgress")
                    this.iProgress++;
                    if (this.iProgress >= this.maxProgress) {
                        this.progressValue = 0;
                        this.loadCorpInfo();
                    }
                    else {
                        this.progressValue += 100 / this.maxProgress;
                    }
                    //console.log("progress:",this.progressValue);
                };
                /*
                backend operations functions
                */
                CorporationDetailComponent.prototype.investToCorp = function (amount) {
                    var _this = this;
                    console.log("investToCorp", amount);
                    if (this.corpInfo.is_manager) {
                        this._corporationService.addFundsToCorporation(this.corpId, amount)
                            .subscribe(function (res) {
                            //console.log("result:",res);
                            //this.messages = res;
                            _this.loadCorpDetail();
                        });
                    }
                };
                /*
                  putItemsToCompanies(list : TransferItem[]) {
                      console.log("putItemsToCompanies", list);
                      if(this.corpInfo.is_manager) {
                          let cNum = this.corpInfo.companies.length;
                          this.initProgress(cNum);
                          let counter = 0;
                          for(let c of this.corpInfo.companies) {
                              if(this.selectedCompanies[c.id]) {
                                  counter++;
                                  let compId = c.id;
                                  this._corporationService.moveItemsToCompany(compId, list)
                                      .subscribe((res:ResultMessage[]) => {
                                          console.log("result:",res);
                                          this.messages = res;
                                          this.loadCompanyDetail(compId);
                                          this.incrementProgress();
                                          this.supplyList = [];
                                      })
                              } else this.incrementProgress();
                          }
                          if(!counter) {
                              this.messages = [new ResultMessage("flash_error","No companies selected!")];
                          }
                      }
                  }
                */
                CorporationDetailComponent.prototype.refresh = function () {
                    this.resetLists();
                    this.clearMessages();
                    this.loadCorpInfo();
                };
                CorporationDetailComponent.prototype.clearMessages = function () {
                    this.messages = [];
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
                CorporationDetailComponent.prototype.parseStorage = function () {
                    if (!!this.corpStorage) {
                        var corp = this._corporationService.getCorporation(this.corpId);
                        var sList = [];
                        var tList = [];
                        for (var _i = 0, _a = this.corpStorage; _i < _a.length; _i++) {
                            var i = _a[_i];
                            if (i.isSell) {
                                var s = {
                                    owner: transactions_1.TransactionObject.Corp,
                                    amount: i.item[0].total_quantity,
                                    item: i.item,
                                    price: 0,
                                    source: corp
                                };
                                if (!!this.tradeList)
                                    for (var _b = 0, _c = this.tradeList; _b < _c.length; _b++) {
                                        var t = _c[_b];
                                        if (transactions_1.itemTransactionEqual(t, s)) {
                                            s.price = t.price;
                                            s.amount = t.amount;
                                        }
                                    }
                                sList.push(s);
                            }
                            if (i.isTransfer) {
                                var s = {
                                    owner: transactions_1.TransactionObject.Corp,
                                    amount: i.item[0].total_quantity,
                                    item: i.item,
                                    source: corp
                                };
                                if (!!this.transferList)
                                    for (var _d = 0, _e = this.transferList; _d < _e.length; _d++) {
                                        var t = _e[_d];
                                        if (transactions_1.itemTransactionEqual(t, s)) {
                                            s.amount = t.amount;
                                            s.target = t.target;
                                        }
                                    }
                                tList.push(s);
                            }
                        }
                        // copy all items from companies
                        if (!!this.tradeList)
                            for (var _f = 0, _g = this.tradeList; _f < _g.length; _f++) {
                                var t = _g[_f];
                                if (t.owner == transactions_1.TransactionObject.Company)
                                    sList.push(t);
                            }
                        if (!!this.transferList)
                            for (var _h = 0, _j = this.transferList; _h < _j.length; _h++) {
                                var t = _j[_h];
                                if (t.owner == transactions_1.TransactionObject.Company)
                                    tList.push(t);
                            }
                        this.tradeList = sList;
                        this.transferList = tList;
                    }
                };
                CorporationDetailComponent.prototype.findInStorage = function (item) {
                    var find = -1;
                    for (var i in this.corpStorage) {
                        if (this.corpStorage[i].item.ItemType.id == item.ItemType.id)
                            return +i;
                    }
                    return find;
                };
                // corporation storage change
                CorporationDetailComponent.prototype.storageChange = function (list) {
                    this.corpStorage = list;
                    this.parseStorage();
                };
                // trade list change
                CorporationDetailComponent.prototype.findItemTransaction = function (item, list) {
                    var find = -1;
                    for (var i in list) {
                        if (list[i].item.ItemType.id == item.item.ItemType.id)
                            return +i;
                    }
                    return find;
                };
                CorporationDetailComponent.prototype.tradeChange = function (list) {
                    //console.log("tradeChange", list)
                    // parse changed list
                    var corpList = [];
                    var compList = [];
                    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                        var sell = list_1[_i];
                        if (sell.owner == transactions_1.TransactionObject.Corp) {
                            corpList.push(sell);
                        }
                        else {
                            compList.push(sell);
                        }
                    }
                    // join with transfer
                    for (var _a = 0, _b = this.transferList; _a < _b.length; _a++) {
                        var i = _b[_a];
                        if (i.owner == transactions_1.TransactionObject.Corp) {
                            corpList.push(i);
                        }
                        else {
                            compList.push(i);
                        }
                    }
                    this.parseStorageTransactions(corpList);
                    this.parseCompaniesTransactions(compList);
                };
                CorporationDetailComponent.prototype.parseStorageTransactions = function (list) {
                    var cList = [];
                    for (var _i = 0, _a = this.corpStorage; _i < _a.length; _i++) {
                        var t = _a[_i];
                        if (t.isTransfer && (this.findItemTransaction(t, list) == -1)) {
                            t.isTransfer = false;
                        }
                        if (t.isSell && (this.findItemTransaction(t, list) == -1)) {
                            t.isSell = false;
                        }
                        cList.push(t);
                    }
                    this.storageChange(cList);
                };
                CorporationDetailComponent.prototype.parseCompaniesTransactions = function (list) {
                    //console.log("parseCompaniesTransactions", list);
                    for (var _i = 0, _a = this.companiesList; _i < _a.length; _i++) {
                        var c = _a[_i];
                        for (var _b = 0, _c = this.storages[c.item.id]; _b < _c.length; _b++) {
                            var s = _c[_b];
                            if (s.isTransfer && (this.findItemTransaction(s, list) == -1))
                                s.isTransfer = false;
                            if (s.isSell && (this.findItemTransaction(s, list) == -1))
                                s.isSell = false;
                        }
                        this.companyStorageChange({ cId: c.item.id, list: this.storages[c.item.id] });
                    }
                };
                CorporationDetailComponent.prototype.transferChange = function (list) {
                    //console.log("transferChange:", list);
                    var corpList = [];
                    var compList = [];
                    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                        var sell = list_2[_i];
                        if (sell.owner == transactions_1.TransactionObject.Corp) {
                            corpList.push(sell);
                        }
                        else {
                            compList.push(sell);
                        }
                    }
                    // join with trade
                    for (var _a = 0, _b = this.tradeList; _a < _b.length; _a++) {
                        var i = _b[_a];
                        if (i.owner == transactions_1.TransactionObject.Corp) {
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
                    for (var _i = 0, _a = this.companiesList; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (c.isSelected)
                            cArr.push(c.item);
                    }
                    this.selectedCompanies = cArr;
                };
                CorporationDetailComponent.prototype.selectCompany = function (c) {
                    for (var i in this.companiesList) {
                        if (c.item.id == this.companiesList[i].item.id)
                            this.companiesList[i].isSelected = c.isSelected;
                    }
                    this.parseSelectedCompanies();
                };
                CorporationDetailComponent.prototype.companiesChange = function (list) {
                    //console.log("companies change", list);
                    var cList = [];
                    for (var _i = 0, _a = this.corpInfo.companies; _i < _a.length; _i++) {
                        var c = _a[_i];
                        var ci = new models_2.CompanyItem(c);
                        for (var _b = 0, list_3 = list; _b < list_3.length; _b++) {
                            var i = list_3[_b];
                            if (i.id == c.id)
                                ci.isSelected = true;
                        }
                        for (var _c = 0, _d = this.companiesList; _c < _d.length; _c++) {
                            var oc = _d[_c];
                            if (oc.item.id == c.id)
                                ci.isOpen = oc.isOpen;
                        }
                        cList.push(ci);
                    }
                    this.companiesList = cList;
                    this.parseSelectedCompanies();
                };
                CorporationDetailComponent.prototype.companyStorageChange = function (changeEvent) {
                    //console.log("companyStorageChange", changeEvent);
                    var company = this.companiesDetails[changeEvent.cId];
                    var corp = this._corporationService.getCorporation(this.corpId);
                    //console.log("company", company);
                    var sList = [];
                    var tList = [];
                    for (var _i = 0, _a = changeEvent.list; _i < _a.length; _i++) {
                        var i = _a[_i];
                        var b = {
                            owner: transactions_1.TransactionObject.Company,
                            amount: i.item[0].total_quantity,
                            item: i.item,
                            source: company
                        };
                        if (i.isSell) {
                            var s = b;
                            s.price = 0;
                            if (!!this.tradeList)
                                for (var _b = 0, _c = this.tradeList; _b < _c.length; _b++) {
                                    var t = _c[_b];
                                    if (transactions_1.itemTransactionEqual(t, s)) {
                                        s.price = t.price;
                                        s.amount = t.amount;
                                    }
                                }
                            sList.push(s);
                        }
                        if (i.isTransfer) {
                            var s = b;
                            s.target = corp;
                            if (!!this.transferList)
                                for (var _d = 0, _e = this.transferList; _d < _e.length; _d++) {
                                    var t = _e[_d];
                                    if (transactions_1.itemTransactionEqual(t, s)) {
                                        s.amount = t.amount;
                                    }
                                }
                            tList.push(s);
                        }
                    }
                    // copy all corporation storage items and company storage from other companies
                    if (!!this.tradeList)
                        for (var _f = 0, _g = this.tradeList; _f < _g.length; _f++) {
                            var t = _g[_f];
                            if (t.owner == transactions_1.TransactionObject.Corp)
                                sList.push(t);
                            if ((t.owner == transactions_1.TransactionObject.Company) && (t.source.id != changeEvent.cId))
                                sList.push(t);
                        }
                    if (!!this.transferList)
                        for (var _h = 0, _j = this.transferList; _h < _j.length; _h++) {
                            var t = _j[_h];
                            if (t.owner == transactions_1.TransactionObject.Corp)
                                tList.push(t);
                            if ((t.owner == transactions_1.TransactionObject.Company) && (t.source.id != changeEvent.cId))
                                tList.push(t);
                        }
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
                            if (i.target.id !== investEvent.cId)
                                list.push(i);
                            else {
                                i.price = +investEvent.amount;
                                present = true;
                                list.push(i);
                            }
                        }
                    if (!present) {
                        var t = {
                            owner: transactions_1.TransactionObject.Company,
                            price: +investEvent.amount,
                            target: this.companiesDetails[investEvent.cId]
                        };
                        //console.log("new invest transaction", t);
                        list.push(t);
                    }
                    this.investList = list;
                };
                CorporationDetailComponent.prototype.investmentsChange = function (list) {
                    // TODO: implement investments list change event handler
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
                        directives: [supply_list_component_1.SupplyListComponent, alert_list_component_1.AlertListComponent, companies_list_component_1.CompaniesListComponent, corporation_storage_component_1.CorporationStorageComponent]
                    }), 
                    __metadata('design:paramtypes', [core_service_1.CoreService, router_1.Router, corporation_service_1.CorporationService, router_1.RouteParams])
                ], CorporationDetailComponent);
                return CorporationDetailComponent;
            }());
            exports_1("CorporationDetailComponent", CorporationDetailComponent);
        }
    }
});
//# sourceMappingURL=corporation.detail.component.js.map