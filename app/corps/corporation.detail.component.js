System.register(['angular2/core', 'angular2/router', './corporation.service', '../core/core.service', '../core/dictionary', '../request/response', './storage/supply.list.component', '../messages/alert.list.component'], function(exports_1, context_1) {
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
    var core_1, router_1, corporation_service_1, core_service_1, dictionary_1, response_1, supply_list_component_1, alert_list_component_1;
    var CorporationDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
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
            function (response_1_1) {
                response_1 = response_1_1;
            },
            function (supply_list_component_1_1) {
                supply_list_component_1 = supply_list_component_1_1;
            },
            function (alert_list_component_1_1) {
                alert_list_component_1 = alert_list_component_1_1;
            }],
        execute: function() {
            CorporationDetailComponent = (function () {
                function CorporationDetailComponent(_coreService, _router, _corporationService, _routeParams) {
                    this._coreService = _coreService;
                    this._router = _router;
                    this._corporationService = _corporationService;
                    this._routeParams = _routeParams;
                    this.companyStorageMap = new dictionary_1.map();
                    this.companies = new dictionary_1.map();
                    this.progressValue = 0;
                    this.maxProgress = 0;
                    this.iProgress = 0;
                    this.messages = [];
                    this.supplyList = [];
                }
                CorporationDetailComponent.prototype.ngOnInit = function () {
                    if (!this._coreService.isLoggedIn)
                        this._router.navigateByUrl('/');
                    else {
                        this.corpId = +this._routeParams.get('id');
                        this.loadCorpInfo();
                    }
                };
                CorporationDetailComponent.prototype.loadCompanyDetail = function (id) {
                    var _this = this;
                    if (this.corpInfo.is_manager)
                        this._corporationService
                            .getCompanyDetail(id)
                            .subscribe(function (res) {
                            _this.companies[id] = res;
                        });
                };
                CorporationDetailComponent.prototype.loadCorpStorage = function () {
                    var _this = this;
                    this._corporationService.getCorpStorage(this.corpId)
                        .subscribe(function (res) {
                        //console.log("storage:",res)
                        _this.corpStorage = res;
                    });
                };
                CorporationDetailComponent.prototype.loadCompanyStorage = function (cId) {
                    var _this = this;
                    this._corporationService
                        .getCompanyStorage(cId)
                        .subscribe(function (res) {
                        _this.companyStorageMap[cId] = res;
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
                    this.allSelected = false;
                    this.isProdEdit = [];
                    this.isEmplEdit = [];
                    this.selectedCompanies = [];
                    this.isCompOpen = [];
                    this.loadCorpDetail(function () {
                        _this.loadCorpStorage();
                        if (_this.corpInfo.is_manager)
                            _this.corpInfo.companies.forEach(function (c) {
                                _this.companyStorageMap[c.id] = [];
                                _this.loadCompanyStorage(c.id);
                                _this.loadCompanyDetail(c.id);
                            });
                    });
                };
                CorporationDetailComponent.prototype.selectCompany = function (id) {
                    if (this.corpInfo.is_manager)
                        this.selectedCompanies[id] = !this.selectedCompanies[id];
                };
                CorporationDetailComponent.prototype.selectAll = function () {
                    var _this = this;
                    if (this.corpInfo.is_manager) {
                        this.allSelected = !this.allSelected;
                        if (!!this.corpInfo && !!this.corpInfo.companies)
                            this.corpInfo.companies.forEach(function (item, index) {
                                _this.selectedCompanies[item.id] = _this.allSelected;
                            });
                    }
                };
                CorporationDetailComponent.prototype.setProdEdit = function (id) {
                    if (this.corpInfo.is_manager)
                        this.isProdEdit[id] = !this.isProdEdit[id];
                };
                CorporationDetailComponent.prototype.setEmplEdit = function (id) {
                    if (this.corpInfo.is_manager) {
                        this.isEmplEdit[id] = !this.isEmplEdit[id];
                    }
                };
                CorporationDetailComponent.prototype.openCompany = function (id) {
                    if (this.corpInfo.is_manager) {
                        this.isCompOpen[id] = !this.isCompOpen[id];
                        if (!this.isCompOpen[id]) {
                            this.isEmplEdit[id] = false;
                            this.isProdEdit[id] = false;
                        }
                    }
                };
                CorporationDetailComponent.prototype.initProgress = function (maxNum) {
                    this.maxProgress = maxNum;
                    this.iProgress = 0;
                    this.progressValue = 10;
                };
                CorporationDetailComponent.prototype.incrementProgress = function () {
                    console.log("incrementProgress");
                    this.iProgress++;
                    if (this.iProgress >= this.maxProgress) {
                        this.progressValue = 0;
                        this.loadCorpInfo();
                    }
                    else {
                        this.progressValue += 100 / this.maxProgress;
                    }
                    console.log("progress:", this.progressValue);
                };
                CorporationDetailComponent.prototype.putItemToStorageWithRefresh = function (compId, itemId, amount) {
                    var _this = this;
                    this.putItemToStorage(compId, itemId, amount, function () {
                        _this.loadCorpStorage();
                        _this.loadCompanyStorage(compId);
                    });
                };
                CorporationDetailComponent.prototype.putItemToStorage = function (compId, itemId, amount, callback) {
                    var _this = this;
                    this._corporationService.moveItemToCorporation(compId, itemId, amount)
                        .subscribe(function (res) {
                        console.log("result:", res);
                        _this.messages = res;
                        if (!!callback)
                            callback();
                    });
                };
                CorporationDetailComponent.prototype.putProductionItemsToStorage = function (company, callback) {
                    if (this.corpInfo.is_manager) {
                        console.log("company:", company);
                        var compId = company.id;
                        var amount = company.current_production.quantity;
                        if (amount > 0) {
                            var itemId_1 = -1;
                            this.companyStorageMap[compId].forEach(function (item) {
                                if ((company.current_production.name == item.ItemType.name) || (company.current_production.img == item.ItemType.image))
                                    itemId_1 = item.ItemType.id;
                            });
                            if (itemId_1 < 0) {
                                this.messages.push(new response_1.ResultMessage("flash_error", "Production item '" + company.current_production.name + "' not found!"));
                                console.error("item not found", company.current_production, this.companyStorageMap[compId]);
                            }
                            else {
                                this.putItemToStorage(compId, itemId_1, amount, callback);
                            }
                        }
                        else {
                            this.messages.push(new response_1.ResultMessage("flash_error", "Current production is empty:" + JSON.stringify(company.current_production)));
                            console.log("Current production is empty", company.current_production);
                            if (!!callback)
                                callback();
                        }
                    }
                };
                CorporationDetailComponent.prototype.putAllProductionItemsToStorage = function () {
                    var _this = this;
                    if (this.corpInfo.is_manager) {
                        var cNum = this.corpInfo.companies.length;
                        this.initProgress(cNum);
                        for (var _i = 0, _a = this.corpInfo.companies; _i < _a.length; _i++) {
                            var c = _a[_i];
                            console.log("processing company ", c.name);
                            if (this.selectedCompanies[c.id])
                                this.putProductionItemsToStorage(c, function () { _this.incrementProgress(); });
                            else
                                this.incrementProgress();
                        }
                    }
                };
                CorporationDetailComponent.prototype.addFundsToCompany = function (company, amount, callback) {
                    var _this = this;
                    if (this.corpInfo.is_manager) {
                        console.log("addFundCompanyAmount", company, amount);
                        var compId_1 = company.id;
                        if (amount > 0) {
                            this._corporationService.addFundsToCompany(compId_1, amount)
                                .subscribe(function (res) {
                                console.log("result:", res);
                                _this.messages = res;
                                _this.loadCompanyDetail(compId_1);
                                if (!!callback)
                                    callback();
                            });
                        }
                    }
                };
                CorporationDetailComponent.prototype.addFundsToAll = function (amount) {
                    var _this = this;
                    if (this.corpInfo.is_manager) {
                        var cNum = this.corpInfo.companies.length;
                        this.initProgress(cNum);
                        this.corpInfo.companies.forEach(function (c, index) {
                            console.log("processing company ", c.name);
                            if (_this.selectedCompanies[c.id])
                                _this.addFundsToCompany(c, amount, function () { _this.incrementProgress(); });
                            else
                                _this.incrementProgress();
                        });
                    }
                };
                CorporationDetailComponent.prototype.investToCorp = function (amount) {
                    var _this = this;
                    console.log("investToCorp", amount);
                    if (this.corpInfo.is_manager) {
                        this._corporationService.addFundsToCorporation(this.corpId, amount)
                            .subscribe(function (res) {
                            console.log("result:", res);
                            _this.messages = res;
                            _this.loadCorpDetail();
                        });
                    }
                };
                CorporationDetailComponent.prototype.itemSelect = function (item) {
                    //console.log("itemSelect", item);
                    var list = [];
                    // we need to make a copy of an array to have the = check work
                    for (var _i = 0, _a = this.supplyList || []; _i < _a.length; _i++) {
                        var item_1 = _a[_i];
                        list.push(item_1);
                    }
                    var idx = list.indexOf(item);
                    if (idx > -1) {
                        // remove item from list
                        //console.log("remove item");
                        list.splice(idx, 1);
                    }
                    else {
                        // add item to list
                        //console.log("add item");
                        list.push(item);
                    }
                    this.supplyList = list;
                };
                CorporationDetailComponent.prototype.putItemsToCompanies = function (list) {
                    var _this = this;
                    console.log("putItemsToCompanies", list);
                    if (this.corpInfo.is_manager) {
                        var cNum = this.corpInfo.companies.length;
                        this.initProgress(cNum);
                        var counter = 0;
                        var _loop_1 = function(c) {
                            if (this_1.selectedCompanies[c.id]) {
                                counter++;
                                var compId_2 = c.id;
                                this_1._corporationService.moveItemsToCompany(compId_2, list)
                                    .subscribe(function (res) {
                                    console.log("result:", res);
                                    _this.messages = res;
                                    _this.loadCompanyDetail(compId_2);
                                    _this.incrementProgress();
                                    _this.supplyList = [];
                                });
                            }
                            else
                                this_1.incrementProgress();
                        };
                        var this_1 = this;
                        for (var _i = 0, _a = this.corpInfo.companies; _i < _a.length; _i++) {
                            var c = _a[_i];
                            _loop_1(c);
                        }
                        if (!counter) {
                            this.messages = [new response_1.ResultMessage("flash_error", "No companies selected!")];
                        }
                    }
                };
                CorporationDetailComponent = __decorate([
                    core_1.Component({
                        selector: 'ap-corp-detail',
                        templateUrl: 'app/corps/corporation.detail.component.html',
                        directives: [supply_list_component_1.SupplyListComponent, alert_list_component_1.AlertListComponent]
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