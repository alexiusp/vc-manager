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
    var AlertListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AlertListComponent = (function () {
                function AlertListComponent() {
                    this._messages = [];
                }
                Object.defineProperty(AlertListComponent.prototype, "messages", {
                    get: function () { return this._messages; },
                    set: function (msgArr) {
                        console.log("messages setter", JSON.stringify(msgArr));
                        if (msgArr.length > 0)
                            for (var _i = 0, msgArr_1 = msgArr; _i < msgArr_1.length; _i++) {
                                var m = msgArr_1[_i];
                                this.addMessage(m);
                            }
                        ;
                    },
                    enumerable: true,
                    configurable: true
                });
                AlertListComponent.prototype.removeMessage = function (idx) {
                    this._messages.splice(idx, 1);
                };
                AlertListComponent.prototype.addMessage = function (message) {
                    var _this = this;
                    this._messages.push(message);
                    var timeout = (message.class == 'flash_error') ? 5000 : 1000;
                    this.messageCleanTimeout = setTimeout(function () { _this.cleanMessage(); }, timeout);
                };
                AlertListComponent.prototype.cleanMessage = function () {
                    var _this = this;
                    clearTimeout(this.messageCleanTimeout);
                    if (this._messages.length > 0) {
                        this.removeMessage(0);
                        this.messageCleanTimeout = setTimeout(function () { _this.cleanMessage(); }, 2000);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], AlertListComponent.prototype, "messages", null);
                AlertListComponent = __decorate([
                    core_1.Component({
                        selector: 'alert-list',
                        templateUrl: 'app/messages/alert.list.component.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], AlertListComponent);
                return AlertListComponent;
            }());
            exports_1("AlertListComponent", AlertListComponent);
        }
    }
});
//# sourceMappingURL=alert.list.component.js.map