System.register(['angular2/core', '../request/response'], function(exports_1, context_1) {
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
    var core_1, response_1;
    var MessagesService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (response_1_1) {
                response_1 = response_1_1;
            }],
        execute: function() {
            MessagesService = (function () {
                function MessagesService() {
                    this.listeners = [];
                    this._messages = [];
                }
                Object.defineProperty(MessagesService.prototype, "messages", {
                    get: function () {
                        return this._messages;
                    },
                    set: function (mArr) {
                        if (!!mArr)
                            this._messages = mArr;
                    },
                    enumerable: true,
                    configurable: true
                });
                MessagesService.prototype.listen = function (callback) {
                    if (!!callback && typeof callback === "function")
                        this.listeners.push(callback);
                };
                MessagesService.prototype.addMessage = function (c, m) {
                    var message;
                    if (typeof c === "string") {
                        if (!!m) {
                            message = new response_1.ResultMessage(c, m);
                        }
                        else {
                            message = new response_1.ResultMessage("error", c);
                        }
                    }
                    else {
                        message = c;
                    }
                    if (!!message) {
                        this.messages.push(message);
                        this.callListeners();
                    }
                };
                MessagesService.prototype.addMessages = function (mArr) {
                    if (!!mArr) {
                        for (var _i = 0, mArr_1 = mArr; _i < mArr_1.length; _i++) {
                            var m = mArr_1[_i];
                            this.messages.push(m);
                        }
                        this.callListeners();
                    }
                };
                MessagesService.prototype.removeMessage = function (i) {
                    //console.log("remove message:",i);
                    var newArr = this.messages;
                    newArr.splice(i, 1);
                    this.messages = newArr;
                    this.callListeners();
                };
                MessagesService.prototype.removeMessages = function (idxArr) {
                    //console.log("remove messages", idxArr, this.messages);
                    var newArr = [];
                    for (var i in this.messages)
                        if (idxArr.indexOf(+i) == -1)
                            newArr.push(this.messages[+i]);
                    this.messages = newArr;
                    this.callListeners();
                };
                MessagesService.prototype.callListeners = function () {
                    for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                        var c = _a[_i];
                        c(this.messages);
                    }
                };
                MessagesService.prototype.clearMessages = function () {
                    this.messages = [];
                    this.callListeners();
                };
                MessagesService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], MessagesService);
                return MessagesService;
            }());
            exports_1("MessagesService", MessagesService);
        }
    }
});
//# sourceMappingURL=messages.service.js.map