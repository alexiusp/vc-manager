System.register(['angular2/core', 'rxjs/Observable', '../request/request.service', '../core/core.service', '../messages/messages.service'], function(exports_1, context_1) {
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
    var core_1, Observable_1, request_service_1, core_service_1, messages_service_1;
    var AccountService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (request_service_1_1) {
                request_service_1 = request_service_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            },
            function (messages_service_1_1) {
                messages_service_1 = messages_service_1_1;
            }],
        execute: function() {
            AccountService = (function () {
                function AccountService(_core, _requestService, _messages) {
                    this._core = _core;
                    this._requestService = _requestService;
                    this._messages = _messages;
                }
                Object.defineProperty(AccountService.prototype, "User", {
                    get: function () {
                        return this._user;
                    },
                    enumerable: true,
                    configurable: true
                });
                AccountService.prototype.login = function (user) {
                    var _this = this;
                    this._messages.clearMessages();
                    //console.log("user login:", user);
                    return this._requestService.login(user)
                        .do(function (res) {
                        _this.onLogin(user, res);
                    }).catch(this.handleError);
                };
                AccountService.prototype.onLogin = function (user, userData) {
                    console.log("login request finished:", userData);
                    if (userData.error > 0)
                        this.onError(userData.message);
                    else {
                        this._user = userData.data;
                        this._core.isLoggedIn = true;
                    }
                };
                AccountService.prototype.onError = function (error) {
                    console.error(error);
                    this._messages.addMessage("error", error);
                };
                AccountService.prototype.handleError = function (error) {
                    var errString = error.json().message || 'Server error';
                    this.onError(errString);
                    return Observable_1.Observable.throw(errString);
                };
                AccountService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_service_1.CoreService, request_service_1.RequestService, messages_service_1.MessagesService])
                ], AccountService);
                return AccountService;
            }());
            exports_1("AccountService", AccountService);
        }
    }
});
//# sourceMappingURL=account.service.js.map