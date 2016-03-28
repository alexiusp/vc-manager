System.register(['angular2/core', './storage.item.component'], function(exports_1, context_1) {
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
    var core_1, storage_item_component_1;
    var SupplyListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (storage_item_component_1_1) {
                storage_item_component_1 = storage_item_component_1_1;
            }],
        execute: function() {
            SupplyListComponent = (function () {
                function SupplyListComponent() {
                    this.onTransfer = new core_1.EventEmitter();
                    this._items = [];
                    this._amounts = [];
                }
                Object.defineProperty(SupplyListComponent.prototype, "items", {
                    get: function () { return this._items; },
                    set: function (itemArr) {
                        //console.log("supply list setter", JSON.stringify(itemArr));
                        this._items = [];
                        if (!!itemArr && itemArr.length > 0) {
                            for (var _i = 0, itemArr_1 = itemArr; _i < itemArr_1.length; _i++) {
                                var i = itemArr_1[_i];
                                this.addItem(i);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                SupplyListComponent.prototype.addItem = function (item) {
                    this._items.push(item);
                    this._amounts[item.ItemType.id] = item[0].total_quantity;
                };
                SupplyListComponent.prototype.removeItem = function (index) {
                    console.log("removeItem", index);
                    this._amounts.splice(this._items[index].ItemType.id, 1);
                    this._items.splice(index, 1);
                };
                SupplyListComponent.prototype.changeAmount = function (item, value) {
                    console.log("changeAmount", item, value);
                    this._amounts[item.ItemType.id] = +value;
                };
                SupplyListComponent.prototype.transfer = function () {
                    var supplyList = [];
                    for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        var itemId = item.ItemType.id;
                        var t = {
                            id: itemId,
                            amount: +this._amounts[itemId]
                        };
                        supplyList.push(t);
                    }
                    if (!!this.onTransfer)
                        this.onTransfer.emit(supplyList);
                };
                SupplyListComponent.prototype.sale = function () {
                };
                SupplyListComponent.prototype.save = function () {
                };
                __decorate([
                    core_1.Input('items'), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], SupplyListComponent.prototype, "items", null);
                __decorate([
                    core_1.Output('on-transfer'), 
                    __metadata('design:type', Object)
                ], SupplyListComponent.prototype, "onTransfer", void 0);
                SupplyListComponent = __decorate([
                    core_1.Component({
                        selector: 'supply-list',
                        templateUrl: 'app/corps/storage/supply.list.component.html',
                        directives: [storage_item_component_1.StorageItemComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], SupplyListComponent);
                return SupplyListComponent;
            }());
            exports_1("SupplyListComponent", SupplyListComponent);
        }
    }
});
//# sourceMappingURL=supply.list.component.js.map