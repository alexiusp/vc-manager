System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var StorageItemComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            StorageItemComponent = (function () {
                function StorageItemComponent() {
                    this.onDelete = new core_1.EventEmitter();
                    this.onChange = new core_1.EventEmitter();
                }
                StorageItemComponent.prototype.removeItem = function () {
                    if (!!this.onDelete)
                        this.onDelete.emit(null);
                };
                StorageItemComponent.prototype.setAmount = function (value) {
                    //console.log("setAmount",value);
                    this._amount = value;
                    if (!!this.onChange)
                        this.onChange.emit(value);
                };
                __decorate([
                    core_1.Input('corp-storage-item'), 
                    __metadata('design:type', Object)
                ], StorageItemComponent.prototype, "item", void 0);
                __decorate([
                    core_1.Output('on-delete'), 
                    __metadata('design:type', Object)
                ], StorageItemComponent.prototype, "onDelete", void 0);
                __decorate([
                    core_1.Output('on-change'), 
                    __metadata('design:type', Object)
                ], StorageItemComponent.prototype, "onChange", void 0);
                StorageItemComponent = __decorate([
                    core_1.Component({
                        selector: '[corp-storage-item]',
                        templateUrl: 'app/corps/storage/storage.item.component.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], StorageItemComponent);
                return StorageItemComponent;
            }());
            exports_1("StorageItemComponent", StorageItemComponent);
        }
    }
});
//# sourceMappingURL=storage.item.component.js.map