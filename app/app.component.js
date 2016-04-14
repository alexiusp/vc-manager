System.register(['angular2/core', 'angular2/router', 'angular2/http', './http.hack', './storage/storage.service', './request/request.service', './account/account.service', './account/account.component', './account/profile.component', './core/core.service', './corps/corporation.service', './corps/corporations.component', './corps/corporation.detail.component', './corps/company.component', './messages/alert.list.component', './messages/messages.service'], function(exports_1, context_1) {
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
    var core_1, router_1, http_1, http_hack_1, storage_service_1, request_service_1, account_service_1, account_component_1, profile_component_1, core_service_1, corporation_service_1, corporations_component_1, corporation_detail_component_1, company_component_1, alert_list_component_1, messages_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (http_hack_1_1) {
                http_hack_1 = http_hack_1_1;
            },
            function (storage_service_1_1) {
                storage_service_1 = storage_service_1_1;
            },
            function (request_service_1_1) {
                request_service_1 = request_service_1_1;
            },
            function (account_service_1_1) {
                account_service_1 = account_service_1_1;
            },
            function (account_component_1_1) {
                account_component_1 = account_component_1_1;
            },
            function (profile_component_1_1) {
                profile_component_1 = profile_component_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            },
            function (corporation_service_1_1) {
                corporation_service_1 = corporation_service_1_1;
            },
            function (corporations_component_1_1) {
                corporations_component_1 = corporations_component_1_1;
            },
            function (corporation_detail_component_1_1) {
                corporation_detail_component_1 = corporation_detail_component_1_1;
            },
            function (company_component_1_1) {
                company_component_1 = company_component_1_1;
            },
            function (alert_list_component_1_1) {
                alert_list_component_1 = alert_list_component_1_1;
            },
            function (messages_service_1_1) {
                messages_service_1 = messages_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(_coreService, _router) {
                    this._coreService = _coreService;
                    this._router = _router;
                    this.title = 'VC Manager';
                    this.isLoggedIn = false;
                }
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var loggedin = this._coreService.isLoggedIn;
                    this._coreService.observeLogin(function (value) { return _this.onAuthEvent(value); });
                };
                AppComponent.prototype.onAuthEvent = function (loggedin) {
                    console.log("isLoggedIn", loggedin);
                    this.isLoggedIn = loggedin;
                    if (!loggedin) {
                        this._router.navigateByUrl('/');
                    }
                };
                AppComponent.prototype.openHelp = function () {
                    this.showHelp = true;
                    this.helpDisplay = "block";
                };
                AppComponent.prototype.closeHelp = function () {
                    this.showHelp = false;
                    this.helpDisplay = "none";
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: 'app/app.component.html',
                        directives: [router_1.ROUTER_DIRECTIVES, alert_list_component_1.AlertListComponent],
                        providers: [
                            router_1.ROUTER_PROVIDERS,
                            http_1.HTTP_PROVIDERS,
                            core_1.provide(http_1.BrowserXhr, { useClass: http_hack_1.CORSBrowserXHR }),
                            storage_service_1.StorageService,
                            request_service_1.RequestService,
                            core_service_1.CoreService,
                            account_service_1.AccountService,
                            corporation_service_1.CorporationService,
                            messages_service_1.MessagesService
                        ]
                    }),
                    router_1.RouteConfig([
                        {
                            path: '/',
                            name: 'Login',
                            component: account_component_1.AccountComponent,
                            useAsDefault: true
                        },
                        {
                            path: '/profile',
                            name: 'Profile',
                            component: profile_component_1.ProfileComponent
                        },
                        {
                            path: '/corps/:id',
                            name: 'CorpDetail',
                            component: corporation_detail_component_1.CorporationDetailComponent
                        },
                        {
                            path: '/corps',
                            name: 'Corporations',
                            component: corporations_component_1.CorporationsComponent
                        },
                        {
                            path: '/company/:id',
                            name: 'Company',
                            component: company_component_1.CompanyComponent
                        }
                    ]), 
                    __metadata('design:paramtypes', [core_service_1.CoreService, router_1.Router])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map