System.register(['angular2/core', 'angular2/router', '../storage/storage.service', './account.service', './credentials'], function(exports_1, context_1) {
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
    var core_1, router_1, storage_service_1, account_service_1, credentials_1;
    var AccountComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (storage_service_1_1) {
                storage_service_1 = storage_service_1_1;
            },
            function (account_service_1_1) {
                account_service_1 = account_service_1_1;
            },
            function (credentials_1_1) {
                credentials_1 = credentials_1_1;
            }],
        execute: function() {
            AccountComponent = (function () {
                function AccountComponent(_router, _accountService, _storageService) {
                    this._router = _router;
                    this._accountService = _accountService;
                    this._storageService = _storageService;
                }
                AccountComponent.prototype.ngOnInit = function () {
                    this.remember = true;
                    var user = this._storageService.loadData('user');
                    if (!!user) {
                        this.accountSaved = true;
                        this.user = user;
                        console.log("user loaded:", this.user);
                        this.account = this._storageService.loadData("acc");
                    }
                    else {
                        this.accountSaved = false;
                        this.user = new credentials_1.Credentials();
                    }
                };
                AccountComponent.prototype.recall = function () {
                    this.user = this._storageService.loadData('user');
                    this.login();
                };
                AccountComponent.prototype.login = function () {
                    var _this = this;
                    if (!!this.user.username)
                        this._accountService.login(this.user)
                            .subscribe(function (res) {
                            if (_this.remember) {
                                _this._storageService.saveData("user", _this.user);
                                var userData = {
                                    name: res.data.username,
                                    avatar: res.data.avatar_img
                                };
                                _this._storageService.saveData("acc", userData);
                            }
                            if (res.error == 0)
                                _this._router.navigateByUrl('/corps');
                        });
                };
                AccountComponent = __decorate([
                    core_1.Component({
                        selector: 'ap-account',
                        templateUrl: 'app/account/account.component.html',
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, account_service_1.AccountService, storage_service_1.StorageService])
                ], AccountComponent);
                return AccountComponent;
            }());
            exports_1("AccountComponent", AccountComponent);
        }
    }
});
//# sourceMappingURL=account.component.js.map