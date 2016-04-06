System.register(['angular2/core', './company.detail.component', './company.info.component', './storage/company.storage.component', './corporation.service', '../core/dictionary'], function(exports_1, context_1) {
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
    var core_1, company_detail_component_1, company_info_component_1, company_storage_component_1, corporation_service_1, dictionary_1;
    var CompaniesListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (company_detail_component_1_1) {
                company_detail_component_1 = company_detail_component_1_1;
            },
            function (company_info_component_1_1) {
                company_info_component_1 = company_info_component_1_1;
            },
            function (company_storage_component_1_1) {
                company_storage_component_1 = company_storage_component_1_1;
            },
            function (corporation_service_1_1) {
                corporation_service_1 = corporation_service_1_1;
            },
            function (dictionary_1_1) {
                dictionary_1 = dictionary_1_1;
            }],
        execute: function() {
            CompaniesListComponent = (function () {
                function CompaniesListComponent(_corporationService) {
                    this._corporationService = _corporationService;
                    this.onChange = new core_1.EventEmitter();
                    this.onSelect = new core_1.EventEmitter();
                    this.onInvest = new core_1.EventEmitter();
                    this.onScroll = new core_1.EventEmitter();
                    this.isListOpen = true;
                    this.allSelected = false;
                    this._storages = new dictionary_1.map();
                    this._details = new dictionary_1.map();
                }
                Object.defineProperty(CompaniesListComponent.prototype, "storages", {
                    get: function () { return this._storages; },
                    set: function (list) {
                        this._storages = list;
                    },
                    enumerable: true,
                    configurable: true
                });
                CompaniesListComponent.prototype.companyStorageChange = function (cId, list) {
                    if (!!this._storages)
                        this._storages[cId] = list;
                    /*
                    let selected = false;
                    for(let i of list) {
                      if(i.isSelected) selected = true;
                    }
                    if(this.options[cId].isSelected != selected) this.selectOne(this.findCompanyById(cId));
                    */
                    if (!!this.onChange)
                        this.onChange.emit({ cId: cId, list: list });
                };
                Object.defineProperty(CompaniesListComponent.prototype, "companies", {
                    get: function () { return this._companies; },
                    set: function (cArr) {
                        //console.log("companies list setter", cArr);
                        this._companies = cArr;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CompaniesListComponent.prototype, "details", {
                    get: function () { return this._details; },
                    set: function (d) {
                        console.log("companies details list setter", d);
                        this._details = d;
                    },
                    enumerable: true,
                    configurable: true
                });
                CompaniesListComponent.prototype.selectAll = function () {
                    var s = !this.allSelected;
                    for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (c.isSelected != s) {
                            this.selectOne(c);
                        }
                    }
                };
                CompaniesListComponent.prototype.selectOne = function (c) {
                    var s = !c.isSelected;
                    c.isSelected = s;
                    var isAllSelected = true;
                    for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                        var ci = _a[_i];
                        if (!ci.isSelected)
                            isAllSelected = false;
                    }
                    this.allSelected = isAllSelected;
                    if (!!this.onSelect)
                        this.onSelect.emit(c);
                };
                CompaniesListComponent.prototype.openList = function () {
                    this.isListOpen = !this.isListOpen;
                };
                CompaniesListComponent.prototype.openOne = function (c) {
                    c.isOpen = !c.isOpen;
                };
                CompaniesListComponent.prototype.invest = function (c, amount) {
                    if (!!this.onInvest)
                        this.onInvest.emit({ cId: c.item.id, amount: amount });
                };
                CompaniesListComponent.prototype.uloadProduction = function (c) {
                    var current = this.details[c.id].current_production;
                    var current2 = c.current_production;
                    var cStorage = this.storages[c.id];
                    console.log("uloadProduction", current, cStorage);
                    if (current.quantity > 0) {
                        // look for production item in storage
                        var prodItem = void 0;
                        for (var _i = 0, cStorage_1 = cStorage; _i < cStorage_1.length; _i++) {
                            var item = cStorage_1[_i];
                            if ((item.item.ItemType.name == current.name) || (item.item.ItemType.name == current2.name))
                                prodItem = item;
                            else {
                                if (item.item.ItemType.image == current.img)
                                    prodItem = item;
                                else {
                                    if (item.item[0].total_quantity == current.quantity)
                                        prodItem = item;
                                }
                            }
                        }
                        if (!!prodItem) {
                            prodItem.isTransfer = !prodItem.isTransfer;
                            var sList = [];
                            for (var _a = 0, cStorage_2 = cStorage; _a < cStorage_2.length; _a++) {
                                var item = cStorage_2[_a];
                                if (item.item.ItemType.id == prodItem.item.ItemType.id)
                                    item.isTransfer = prodItem.isTransfer;
                                sList.push(item);
                            }
                            this.companyStorageChange(c.id, sList);
                        }
                        else
                            console.error("Production item (%s) not found in storage:", current.name);
                    }
                };
                CompaniesListComponent.prototype.putAllProductionToStorage = function () {
                    for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (c.isSelected)
                            this.uloadProduction(c.item);
                    }
                };
                CompaniesListComponent.prototype.addFundsToAll = function (amount) {
                    for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (c.isSelected)
                            this.invest(c, amount);
                    }
                };
                CompaniesListComponent.prototype.scroll = function () {
                    if (!!this.onScroll)
                        this.onScroll.emit(null);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CompaniesListComponent.prototype, "storages", null);
                __decorate([
                    core_1.Output('on-change'), 
                    __metadata('design:type', Object)
                ], CompaniesListComponent.prototype, "onChange", void 0);
                __decorate([
                    core_1.Input('companies'), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], CompaniesListComponent.prototype, "companies", null);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', dictionary_1.map), 
                    __metadata('design:paramtypes', [dictionary_1.map])
                ], CompaniesListComponent.prototype, "details", null);
                __decorate([
                    core_1.Input('is-manager'), 
                    __metadata('design:type', Boolean)
                ], CompaniesListComponent.prototype, "is_manager", void 0);
                __decorate([
                    core_1.Output('on-select'), 
                    __metadata('design:type', Object)
                ], CompaniesListComponent.prototype, "onSelect", void 0);
                __decorate([
                    core_1.Output('on-invest'), 
                    __metadata('design:type', Object)
                ], CompaniesListComponent.prototype, "onInvest", void 0);
                __decorate([
                    core_1.Output('on-scroll'), 
                    __metadata('design:type', Object)
                ], CompaniesListComponent.prototype, "onScroll", void 0);
                CompaniesListComponent = __decorate([
                    core_1.Component({
                        selector: 'companies-list',
                        templateUrl: 'app/corps/companies.list.component.html',
                        directives: [company_detail_component_1.CompanyDetailComponent, company_info_component_1.CompanyInfoComponent, company_storage_component_1.CompanyStorageComponent]
                    }), 
                    __metadata('design:paramtypes', [corporation_service_1.CorporationService])
                ], CompaniesListComponent);
                return CompaniesListComponent;
            }());
            exports_1("CompaniesListComponent", CompaniesListComponent);
        }
    }
});
//# sourceMappingURL=companies.list.component.js.map