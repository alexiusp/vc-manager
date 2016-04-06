System.register(['angular2/core', './models'], function(exports_1, context_1) {
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
    var core_1, models_1;
    var CompanyInfoComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (models_1_1) {
                models_1 = models_1_1;
            }],
        execute: function() {
            CompanyInfoComponent = (function () {
                function CompanyInfoComponent() {
                    this.onSelect = new core_1.EventEmitter();
                    this.onOpen = new core_1.EventEmitter();
                }
                CompanyInfoComponent.prototype.selectCompany = function () {
                    if (!!this.onSelect)
                        this.onSelect.emit(null);
                };
                CompanyInfoComponent.prototype.openCompany = function () {
                    if (!!this.onOpen)
                        this.onOpen.emit(null);
                };
                __decorate([
                    core_1.Output('on-select'), 
                    __metadata('design:type', Object)
                ], CompanyInfoComponent.prototype, "onSelect", void 0);
                __decorate([
                    core_1.Output('on-open'), 
                    __metadata('design:type', Object)
                ], CompanyInfoComponent.prototype, "onOpen", void 0);
                __decorate([
                    core_1.Input('company-info'), 
                    __metadata('design:type', models_1.CompanyItem)
                ], CompanyInfoComponent.prototype, "company", void 0);
                CompanyInfoComponent = __decorate([
                    core_1.Component({
                        selector: '[company-info]',
                        templateUrl: 'app/corps/company.info.component.html',
                    }), 
                    __metadata('design:paramtypes', [])
                ], CompanyInfoComponent);
                return CompanyInfoComponent;
            }());
            exports_1("CompanyInfoComponent", CompanyInfoComponent);
        }
    }
});
//# sourceMappingURL=company.info.component.js.map