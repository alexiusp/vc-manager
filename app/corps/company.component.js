System.register(['angular2/core', 'angular2/router', './storage/models', './corporation.service', '../core/core.service', './storage/company.storage.component'], function(exports_1, context_1) {
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
    var core_1, router_1, models_1, corporation_service_1, core_service_1, company_storage_component_1;
    var CompanyComponent;
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
            function (corporation_service_1_1) {
                corporation_service_1 = corporation_service_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            },
            function (company_storage_component_1_1) {
                company_storage_component_1 = company_storage_component_1_1;
            }],
        execute: function() {
            CompanyComponent = (function () {
                function CompanyComponent(_coreService, _router, _corporationService, _routeParams, _location) {
                    this._coreService = _coreService;
                    this._router = _router;
                    this._corporationService = _corporationService;
                    this._routeParams = _routeParams;
                    this._location = _location;
                    this.storage = [];
                    this.activePage = 0;
                }
                CompanyComponent.prototype.goBack = function () {
                    this._location.back();
                };
                CompanyComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    if (!this._coreService.isLoggedIn)
                        this._router.navigateByUrl('/');
                    else {
                        this.cId = +this._routeParams.get('id');
                        this._corporationService.getCompanyDetail(this.cId)
                            .subscribe(function (res) {
                            //console.log(res);
                            _this.company = res;
                        });
                        this._corporationService.getCompanyStorage(this.cId)
                            .subscribe(function (res) {
                            var list = [];
                            for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                                var i = res_1[_i];
                                list.push(new models_1.StorageItem(i));
                            }
                            _this.storage = list;
                        });
                        this._corporationService.getCompanyWorkers(this.cId)
                            .subscribe(function (res) {
                            _this.workers = res;
                        });
                    }
                };
                CompanyComponent.prototype.setPage = function (page) {
                    this.activePage = page;
                };
                CompanyComponent.prototype.addFundsToCompany = function (amount) {
                    console.log("addFundsToCompany", amount);
                };
                CompanyComponent.prototype.storageChange = function (list) {
                    console.log("storage change:", list);
                };
                CompanyComponent = __decorate([
                    core_1.Component({
                        selector: 'ap-company',
                        templateUrl: 'app/corps/company.component.html',
                        directives: [company_storage_component_1.CompanyStorageComponent]
                    }), 
                    __metadata('design:paramtypes', [core_service_1.CoreService, router_1.Router, corporation_service_1.CorporationService, router_1.RouteParams, router_1.Location])
                ], CompanyComponent);
                return CompanyComponent;
            }());
            exports_1("CompanyComponent", CompanyComponent);
        }
    }
});
//# sourceMappingURL=company.component.js.map