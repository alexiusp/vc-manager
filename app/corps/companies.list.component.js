System.register(['angular2/core', './corporation.service', '../core/dictionary', './company.panel.component', '../core/core.service', '../storage/storage.service'], function(exports_1, context_1) {
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
    var core_1, corporation_service_1, dictionary_1, company_panel_component_1, core_service_1, storage_service_1;
    var CompaniesListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (corporation_service_1_1) {
                corporation_service_1 = corporation_service_1_1;
            },
            function (dictionary_1_1) {
                dictionary_1 = dictionary_1_1;
            },
            function (company_panel_component_1_1) {
                company_panel_component_1 = company_panel_component_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            },
            function (storage_service_1_1) {
                storage_service_1 = storage_service_1_1;
            }],
        execute: function() {
            CompaniesListComponent = (function () {
                function CompaniesListComponent(_corporationService, _coreService, _storageService) {
                    var _this = this;
                    this._corporationService = _corporationService;
                    this._coreService = _coreService;
                    this._storageService = _storageService;
                    this.onChange = new core_1.EventEmitter();
                    this.onFilter = new core_1.EventEmitter();
                    this.onSelect = new core_1.EventEmitter();
                    this.onOpen = new core_1.EventEmitter();
                    this.onInvest = new core_1.EventEmitter();
                    this.onScroll = new core_1.EventEmitter();
                    this.isListOpen = true;
                    this.allSelected = false;
                    this._details = new dictionary_1.map();
                    this.filterDropdownOpen = false;
                    this.loading = true;
                    this._coreService.observeLoading(function (value) {
                        _this.loading = !!value;
                    });
                    var f = this._storageService.loadData("c_filter");
                    if (!!f) {
                        this.currentFilter = f;
                        this.filterTitle = (f == "all") ? "Filter" : f;
                    }
                    else {
                        this.currentFilter = "all";
                        this.filterTitle = "Filter";
                    }
                }
                CompaniesListComponent.prototype.companyStorageChange = function (cId, list) {
                    if (!!this.details[cId])
                        this.details[cId].storage = list;
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
                    get: function () {
                        if (this.currentFilter != "all") {
                            var cArr = [];
                            for (var _i = 0, _a = this._companies; _i < _a.length; _i++) {
                                var c = _a[_i];
                                if (c.type == this.currentFilter)
                                    cArr.push(c);
                            }
                            return cArr;
                        }
                        else
                            return this._companies;
                    },
                    set: function (cArr) {
                        var types = [];
                        for (var _i = 0, cArr_1 = cArr; _i < cArr_1.length; _i++) {
                            var c = cArr_1[_i];
                            if (types.indexOf(c.type) == -1)
                                types.push(c.type);
                        }
                        //console.log("types:", types);
                        types.unshift("all");
                        this.types = types;
                        this._companies = cArr;
                    },
                    enumerable: true,
                    configurable: true
                });
                CompaniesListComponent.prototype.toggleFilter = function () {
                    if (!this.loading)
                        this.filterDropdownOpen = !this.filterDropdownOpen;
                };
                CompaniesListComponent.prototype.filterList = function (type) {
                    //console.log("filter:", type);
                    this.currentFilter = type;
                    this._storageService.saveData("c_filter", type);
                    this.filterTitle = (type == "all") ? "Filter" : type;
                    this.toggleFilter();
                    if (!!this.onFilter)
                        this.onFilter.emit(type);
                };
                CompaniesListComponent.prototype.checkAllSelected = function () {
                    var isAllSelected = true;
                    for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (!this.details[c.id].isSelected)
                            isAllSelected = false;
                    }
                    this.allSelected = isAllSelected;
                };
                Object.defineProperty(CompaniesListComponent.prototype, "details", {
                    get: function () { return this._details; },
                    set: function (d) {
                        //console.log("companies details list setter", d);
                        this._details = d;
                        this.checkAllSelected();
                    },
                    enumerable: true,
                    configurable: true
                });
                CompaniesListComponent.prototype.selectAll = function () {
                    var s = !this.allSelected;
                    if (!this.loading)
                        for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                            var c = _a[_i];
                            var d = this.details[c.id];
                            if (d.isSelected != s) {
                                this.selectOne(d);
                            }
                        }
                };
                CompaniesListComponent.prototype.selectOne = function (c) {
                    if (!this.loading) {
                        var s = !c.isSelected;
                        c.isSelected = s;
                        this.checkAllSelected();
                        if (!!this.onSelect)
                            this.onSelect.emit(c);
                    }
                };
                CompaniesListComponent.prototype.openList = function () {
                    this.isListOpen = !this.isListOpen;
                    if (!!this.onOpen)
                        this.onOpen.emit(this.isListOpen);
                };
                CompaniesListComponent.prototype.invest = function (c, amount) {
                    //console.log("invest to selected", +amount);
                    if (!!this.onInvest)
                        this.onInvest.emit({ cId: c.id, amount: +amount });
                };
                CompaniesListComponent.prototype.unload = function (c, unloadAll) {
                    if (unloadAll)
                        this.putCompStorageToCorp(c);
                    else
                        this.unloadProduction(c);
                };
                CompaniesListComponent.prototype.unloadProduction = function (c) {
                    var current = (!this.details[c.id].isLoading) ? this.details[c.id].item.current_production : c.current_production;
                    var current2 = c.current_production;
                    var cStorage = this.details[c.id].storage;
                    //console.log("unloadProduction", current, cStorage);
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
                    if (!this.loading)
                        for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                            var c = _a[_i];
                            if (this.details[c.id].isSelected)
                                this.unloadProduction(c);
                        }
                };
                CompaniesListComponent.prototype.putCompStorageToCorp = function (c) {
                    var sList = [];
                    var cStorage = this.details[c.id].storage;
                    for (var _i = 0, cStorage_3 = cStorage; _i < cStorage_3.length; _i++) {
                        var item = cStorage_3[_i];
                        item.isTransfer = true;
                        sList.push(item);
                    }
                    this.companyStorageChange(c.id, sList);
                };
                CompaniesListComponent.prototype.putAllStorageToCorp = function () {
                    if (!this.loading)
                        for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                            var c = _a[_i];
                            if (this.details[c.id].isSelected)
                                this.putCompStorageToCorp(c);
                        }
                };
                CompaniesListComponent.prototype.addFundsToAll = function (amount) {
                    //console.log("addFundsToAll", amount);
                    if (!this.loading)
                        for (var _i = 0, _a = this.companies; _i < _a.length; _i++) {
                            var c = _a[_i];
                            if (this.details[c.id].isSelected)
                                this.invest(c, +amount);
                        }
                };
                CompaniesListComponent.prototype.scroll = function () {
                    if (!!this.onScroll)
                        this.onScroll.emit(null);
                };
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
                    core_1.Output('on-filter'), 
                    __metadata('design:type', Object)
                ], CompaniesListComponent.prototype, "onFilter", void 0);
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
                    core_1.Output('on-open'), 
                    __metadata('design:type', Object)
                ], CompaniesListComponent.prototype, "onOpen", void 0);
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
                        directives: [company_panel_component_1.CompanyPanelComponent]
                    }), 
                    __metadata('design:paramtypes', [corporation_service_1.CorporationService, core_service_1.CoreService, storage_service_1.StorageService])
                ], CompaniesListComponent);
                return CompaniesListComponent;
            }());
            exports_1("CompaniesListComponent", CompaniesListComponent);
        }
    }
});
//# sourceMappingURL=companies.list.component.js.map