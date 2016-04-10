System.register(['angular2/core', 'angular2/router'], function(exports_1, context_1) {
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
    var core_1, router_1;
    var CompanyOptions, CompanyDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            CompanyOptions = (function () {
                function CompanyOptions() {
                    this.isOpen = false;
                    this.isSelected = false;
                }
                return CompanyOptions;
            }());
            exports_1("CompanyOptions", CompanyOptions);
            CompanyDetailComponent = (function () {
                function CompanyDetailComponent(_router) {
                    this._router = _router;
                    this.onInvest = new core_1.EventEmitter();
                    this.onUnload = new core_1.EventEmitter();
                }
                Object.defineProperty(CompanyDetailComponent.prototype, "company", {
                    get: function () { return this._company; },
                    set: function (c) {
                        this._company = c;
                    },
                    enumerable: true,
                    configurable: true
                });
                CompanyDetailComponent.prototype.addFundsToCompany = function (amount) {
                    if (!!this.onInvest)
                        this.onInvest.emit(amount);
                };
                CompanyDetailComponent.prototype.unloadProduction = function () {
                    //console.log("company-detail unloadProduction click");
                    if (!!this.onUnload)
                        this.onUnload.emit(null);
                };
                CompanyDetailComponent.prototype.openProduction = function () {
                    this._router.navigate(['Company', { id: this.company.id }]);
                };
                __decorate([
                    core_1.Input('company-detail'), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], CompanyDetailComponent.prototype, "company", null);
                __decorate([
                    core_1.Input('is-manager'), 
                    __metadata('design:type', Boolean)
                ], CompanyDetailComponent.prototype, "is_manager", void 0);
                __decorate([
                    core_1.Output('on-invest'), 
                    __metadata('design:type', Object)
                ], CompanyDetailComponent.prototype, "onInvest", void 0);
                __decorate([
                    core_1.Output('on-unload'), 
                    __metadata('design:type', Object)
                ], CompanyDetailComponent.prototype, "onUnload", void 0);
                CompanyDetailComponent = __decorate([
                    core_1.Component({
                        selector: '[company-detail]',
                        templateUrl: 'app/corps/company.detail.component.html',
                    }), 
                    __metadata('design:paramtypes', [router_1.Router])
                ], CompanyDetailComponent);
                return CompanyDetailComponent;
            }());
            exports_1("CompanyDetailComponent", CompanyDetailComponent);
        }
    }
});
//# sourceMappingURL=company.detail.component.js.map