System.register(['angular2/core', 'angular2/router', './corporation.service', '../core/core.service', '../core/dictionary'], function(exports_1, context_1) {
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
    var core_1, router_1, corporation_service_1, core_service_1, dictionary_1;
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
                }
                CorporationDetailComponent.prototype.ngOnInit = function () {
                    this.messages = [];
                    if (!this._coreService.isLoggedIn)
                        this._router.navigateByUrl('/');
                    else {
                        this.corpId = +this._routeParams.get('id');
                        this.loadCorpInfo();
                    }
                };
                CorporationDetailComponent.prototype.loadCompanyDetail = function (id) {
                    var _this = this;
                    this._corporationService
                        .getCompanyDetail(id)
                        .subscribe(function (res) {
                        _this.companies[id] = res;
                    });
                };
                CorporationDetailComponent.prototype.loadCorpInfo = function () {
                    var _this = this;
                    this.isProdEdit = [];
                    this.isEmplEdit = [];
                    this.selectedCompanies = [];
                    this.isCompOpen = [];
                    this._corporationService
                        .getCorpDetail(this.corpId)
                        .subscribe(function (res) {
                        _this.corpInfo = res;
                        _this._corporationService.getCorpStorage(_this.corpId)
                            .subscribe(function (res) {
                            //console.log("storage:",res)
                            _this.corpStorage = res;
                        });
                        res.companies.forEach(function (c) {
                            _this.companyStorageMap[c.id] = [];
                            _this._corporationService
                                .getCompanyStorage(c.id)
                                .subscribe(function (res) {
                                _this.companyStorageMap[c.id] = res;
                            });
                            _this.loadCompanyDetail(c.id);
                        });
                    });
                };
                CorporationDetailComponent.prototype.addMessage = function (message) {
                    this.messages.push(message);
                };
                CorporationDetailComponent.prototype.removeMessage = function (index) {
                    this.messages.splice(index, 1);
                };
                CorporationDetailComponent.prototype.selectCompany = function (id) {
                    this.selectedCompanies[id] = !this.selectedCompanies[id];
                };
                CorporationDetailComponent.prototype.selectAll = function () {
                    var _this = this;
                    this.allSelected = !this.allSelected;
                    if (!!this.corpInfo && !!this.corpInfo.companies)
                        this.corpInfo.companies.forEach(function (item, index) {
                            _this.selectedCompanies[item.id] = _this.allSelected;
                        });
                };
                CorporationDetailComponent.prototype.setProdEdit = function (id) {
                    this.isProdEdit[id] = !this.isProdEdit[id];
                };
                CorporationDetailComponent.prototype.setEmplEdit = function (id) {
                    this.isEmplEdit[id] = !this.isEmplEdit[id];
                };
                CorporationDetailComponent.prototype.openCompany = function (id) {
                    this.isCompOpen[id] = !this.isCompOpen[id];
                    if (!this.isCompOpen[id]) {
                        this.isEmplEdit[id] = false;
                        this.isProdEdit[id] = false;
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
                CorporationDetailComponent.prototype.putProductionItemsToStorage = function (company, callback) {
                    var _this = this;
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
                            this.addMessage({
                                msg: "Production item '" + company.current_production.name + "' not found!",
                                class: "flash_error"
                            });
                            console.error("item not found", company.current_production, this.companyStorageMap[compId]);
                        }
                        else {
                            this._corporationService.moveItemToCorporation(compId, itemId_1, amount)
                                .subscribe(function (res) {
                                console.log("result:", res);
                                res.forEach(function (m) { return _this.addMessage(m); });
                                if (!!callback)
                                    callback();
                            });
                        }
                    }
                    else {
                        this.addMessage({
                            msg: "Current production is empty",
                            class: "flash_error"
                        });
                        console.log("Current production is empty");
                        if (!!callback)
                            callback();
                    }
                };
                CorporationDetailComponent.prototype.putAllProductionItemsToStorage = function () {
                    var _this = this;
                    var cNum = this.corpInfo.companies.length;
                    this.initProgress(cNum);
                    this.corpInfo.companies.forEach(function (c, index) {
                        console.log("processing company ", c.name);
                        _this.putProductionItemsToStorage(c, function () { _this.incrementProgress(); });
                    });
                };
                CorporationDetailComponent.prototype.addFundsToCompany = function (company, amount, callback) {
                    var _this = this;
                    console.log("addFundCompanyAmount", company, amount);
                    var compId = company.id;
                    if (amount > 0) {
                        this._corporationService.addFundsToCompany(compId, amount)
                            .subscribe(function (res) {
                            console.log("result:", res);
                            res.forEach(function (m) { return _this.addMessage(m); });
                            _this.loadCompanyDetail(compId);
                            if (!!callback)
                                callback();
                        });
                    }
                };
                CorporationDetailComponent.prototype.addFundsToAll = function (amount) {
                    var _this = this;
                    var cNum = this.corpInfo.companies.length;
                    this.initProgress(cNum);
                    this.corpInfo.companies.forEach(function (c, index) {
                        console.log("processing company ", c.name);
                        _this.addFundsToCompany(c, amount, function () { _this.incrementProgress(); });
                    });
                };
                CorporationDetailComponent = __decorate([
                    core_1.Component({
                        selector: 'ap-corp-detail',
                        templateUrl: 'app/corps/corporation.detail.component.html'
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