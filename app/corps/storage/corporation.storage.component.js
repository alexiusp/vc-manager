System.register(['angular2/core', '../corporation.service', './storage.item.component', '../../storage/storage.service'], function(exports_1, context_1) {
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
    var core_1, corporation_service_1, storage_item_component_1, storage_service_1;
    var CorporationStorageComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (corporation_service_1_1) {
                corporation_service_1 = corporation_service_1_1;
            },
            function (storage_item_component_1_1) {
                storage_item_component_1 = storage_item_component_1_1;
            },
            function (storage_service_1_1) {
                storage_service_1 = storage_service_1_1;
            }],
        execute: function() {
            CorporationStorageComponent = (function () {
                function CorporationStorageComponent(_corporationService, _storageService) {
                    this._corporationService = _corporationService;
                    this._storageService = _storageService;
                    this.onChange = new core_1.EventEmitter();
                    this.onScroll = new core_1.EventEmitter();
                    this.isListOpen = true;
                }
                CorporationStorageComponent.prototype.ngOnInit = function () {
                    this.filterDropdownOpen = false;
                    var f = this._storageService.loadData("s_filter");
                    if (!!f) {
                        this.currentFilter = f;
                        this.filterTitle = (f == "all") ? "Filter" : f;
                    }
                    else {
                        this.currentFilter = "all";
                        this.filterTitle = "Filter";
                    }
                };
                Object.defineProperty(CorporationStorageComponent.prototype, "items", {
                    get: function () {
                        if (this.currentFilter != "all") {
                            var iArr = [];
                            for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                                var i = _a[_i];
                                if (i.item.ItemType.type == this.currentFilter)
                                    iArr.push(i);
                            }
                            return iArr;
                        }
                        else
                            return this._items;
                    },
                    set: function (itemArr) {
                        //console.log("corp storage list setter", JSON.stringify(itemArr));
                        var types = [];
                        if (!!itemArr)
                            for (var _i = 0, itemArr_1 = itemArr; _i < itemArr_1.length; _i++) {
                                var i = itemArr_1[_i];
                                if (types.indexOf(i.item.ItemType.type) == -1)
                                    types.push(i.item.ItemType.type);
                            }
                        //console.log("item types:", types);
                        types.unshift("all");
                        this.types = types;
                        this._items = itemArr;
                    },
                    enumerable: true,
                    configurable: true
                });
                CorporationStorageComponent.prototype.findItemIndex = function (item) {
                    for (var i in this._items) {
                        if (this._items[i].item.ItemType.id == item.item.ItemType.id)
                            return +i;
                    }
                    return -1;
                };
                CorporationStorageComponent.prototype.toggleFilter = function () {
                    this.filterDropdownOpen = !this.filterDropdownOpen;
                };
                CorporationStorageComponent.prototype.filterList = function (type) {
                    //console.log("filter:", type);
                    this.currentFilter = type;
                    this._storageService.saveData("s_filter", type);
                    this.filterTitle = (type == "all") ? "Filter" : type;
                    this.toggleFilter();
                };
                CorporationStorageComponent.prototype.openList = function () {
                    this.isListOpen = !this.isListOpen;
                };
                CorporationStorageComponent.prototype.change = function (item) {
                    var i = this.findItemIndex(item);
                    this._items[i] = item;
                    if (!!this.onChange)
                        this.onChange.emit(this._items);
                };
                CorporationStorageComponent.prototype.scroll = function () {
                    if (!!this.onScroll)
                        this.onScroll.emit(null);
                };
                __decorate([
                    core_1.Input('items'), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], CorporationStorageComponent.prototype, "items", null);
                __decorate([
                    core_1.Output('on-change'), 
                    __metadata('design:type', Object)
                ], CorporationStorageComponent.prototype, "onChange", void 0);
                __decorate([
                    core_1.Output('on-scroll'), 
                    __metadata('design:type', Object)
                ], CorporationStorageComponent.prototype, "onScroll", void 0);
                CorporationStorageComponent = __decorate([
                    core_1.Component({
                        selector: 'corporation-storage',
                        templateUrl: 'app/corps/storage/corporation.storage.component.html',
                        directives: [storage_item_component_1.StorageItemComponent]
                    }), 
                    __metadata('design:paramtypes', [corporation_service_1.CorporationService, storage_service_1.StorageService])
                ], CorporationStorageComponent);
                return CorporationStorageComponent;
            }());
            exports_1("CorporationStorageComponent", CorporationStorageComponent);
        }
    }
});
//# sourceMappingURL=corporation.storage.component.js.map