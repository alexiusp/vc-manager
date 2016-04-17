System.register(['angular2/core', 'angular2/router', './models', '../vmoney.pipe', './storage/storage.item.component'], function(exports_1, context_1) {
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
    var core_1, router_1, models_1, vmoney_pipe_1, storage_item_component_1;
    var CompanyPanelComponent;
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
            function (vmoney_pipe_1_1) {
                vmoney_pipe_1 = vmoney_pipe_1_1;
            },
            function (storage_item_component_1_1) {
                storage_item_component_1 = storage_item_component_1_1;
            }],
        execute: function() {
            CompanyPanelComponent = (function () {
                function CompanyPanelComponent(_router) {
                    this._router = _router;
                    this.onSelect = new core_1.EventEmitter();
                    this.onInvest = new core_1.EventEmitter();
                    this.onUnload = new core_1.EventEmitter();
                    this.onChange = new core_1.EventEmitter();
                }
                CompanyPanelComponent.prototype.selectCompany = function () {
                    if (!this.detail.isLoading && !!this.onSelect)
                        this.onSelect.emit(null);
                };
                CompanyPanelComponent.prototype.openCompany = function () {
                    if (!this.detail.isLoading)
                        this.detail.isOpen = !this.detail.isOpen;
                };
                CompanyPanelComponent.prototype.addFunds = function (amount) {
                    if (!!this.onInvest && !!amount)
                        this.onInvest.emit(amount);
                };
                CompanyPanelComponent.prototype.removeFunds = function (amount) {
                    if (!!this.onInvest && !!amount)
                        this.onInvest.emit(-amount);
                };
                CompanyPanelComponent.prototype.openProduction = function () {
                    this._router.navigate(['Company', { id: this.company.id }]);
                };
                CompanyPanelComponent.prototype.unloadProduction = function () {
                    if (!!this.onUnload)
                        this.onUnload.emit(false);
                };
                CompanyPanelComponent.prototype.unloadStorage = function () {
                    if (!!this.onUnload)
                        this.onUnload.emit(true);
                };
                CompanyPanelComponent.prototype.findItemIndex = function (item) {
                    for (var i in this.detail.storage) {
                        if (this.detail.storage[i].item.ItemType.id == item.item.ItemType.id)
                            return +i;
                    }
                    return -1;
                };
                CompanyPanelComponent.prototype.change = function (item) {
                    var i = this.findItemIndex(item);
                    this.detail.storage[i] = item;
                    if (!!this.onChange)
                        this.onChange.emit(this.detail.storage);
                };
                __decorate([
                    core_1.Output('on-select'), 
                    __metadata('design:type', Object)
                ], CompanyPanelComponent.prototype, "onSelect", void 0);
                __decorate([
                    core_1.Input('company-panel'), 
                    __metadata('design:type', models_1.CompanyDetailItem)
                ], CompanyPanelComponent.prototype, "detail", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CompanyPanelComponent.prototype, "company", void 0);
                __decorate([
                    core_1.Output('on-invest'), 
                    __metadata('design:type', Object)
                ], CompanyPanelComponent.prototype, "onInvest", void 0);
                __decorate([
                    core_1.Output('on-unload'), 
                    __metadata('design:type', Object)
                ], CompanyPanelComponent.prototype, "onUnload", void 0);
                __decorate([
                    core_1.Output('on-change'), 
                    __metadata('design:type', Object)
                ], CompanyPanelComponent.prototype, "onChange", void 0);
                CompanyPanelComponent = __decorate([
                    core_1.Component({
                        selector: '[company-panel]',
                        templateUrl: 'app/corps/company.panel.component.html',
                        pipes: [vmoney_pipe_1.VMoneyPipe],
                        directives: [storage_item_component_1.StorageItemComponent]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router])
                ], CompanyPanelComponent);
                return CompanyPanelComponent;
            }());
            exports_1("CompanyPanelComponent", CompanyPanelComponent);
        }
    }
});
//# sourceMappingURL=company.panel.component.js.map