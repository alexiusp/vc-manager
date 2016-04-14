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
    var CoreService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            CoreService = (function () {
                function CoreService() {
                    this._isLoggedIn = false;
                    this._loginObservers = [];
                    this._loadingCounter = 0;
                    this._loadingObservers = [];
                }
                Object.defineProperty(CoreService.prototype, "isLoggedIn", {
                    get: function () {
                        return this._isLoggedIn;
                    },
                    set: function (val) {
                        if (!!val != this._isLoggedIn) {
                            //console.info("isLoggedIn changed to", val);
                            this._isLoggedIn = !!val;
                            for (var _i = 0, _a = this._loginObservers; _i < _a.length; _i++) {
                                var callback = _a[_i];
                                callback(this._isLoggedIn);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                CoreService.prototype.observeLogin = function (callback) {
                    if (!!callback && typeof callback === "function")
                        this._loginObservers.push(callback);
                };
                Object.defineProperty(CoreService.prototype, "isLoading", {
                    get: function () {
                        return !!this._loading;
                    },
                    set: function (val) {
                        if (!!val)
                            this._loadingCounter++;
                        else
                            this._loadingCounter--;
                        console.info("loading counter:", this._loadingCounter);
                        this._loading = this._loadingCounter > 0;
                        for (var _i = 0, _a = this._loadingObservers; _i < _a.length; _i++) {
                            var callback = _a[_i];
                            callback(this.isLoading);
                        }
                        if (this._loadingCounter < 0)
                            this._loadingCounter = 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                CoreService.prototype.observeLoading = function (callback) {
                    if (!!callback && typeof callback === "function")
                        this._loadingObservers.push(callback);
                };
                CoreService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], CoreService);
                return CoreService;
            }());
            exports_1("CoreService", CoreService);
        }
    }
});
//# sourceMappingURL=core.service.js.map