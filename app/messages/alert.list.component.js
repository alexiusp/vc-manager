System.register(['angular2/core', './messages.service'], function(exports_1, context_1) {
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
    var core_1, messages_service_1;
    var AlertListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (messages_service_1_1) {
                messages_service_1 = messages_service_1_1;
            }],
        execute: function() {
            AlertListComponent = (function () {
                function AlertListComponent(_messageService) {
                    this._messageService = _messageService;
                }
                AlertListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._messageService.listen(function (messages) {
                        //console.log("listen callback");
                        var s = [];
                        var si = [];
                        var e = [];
                        var ei = [];
                        var counter = 0;
                        for (var i in messages) {
                            if (messages[i].class == "flash_success" || messages[i].class == "success") {
                                var idx = s.indexOf(messages[i].msg);
                                if (idx == -1)
                                    s.push(messages[i].msg);
                                si.push(+i);
                                counter++;
                            }
                            else {
                                e.push(messages[i]);
                                ei.push(+i);
                            }
                        }
                        _this.successMessages = s;
                        _this.successIndexes = si;
                        _this.successCounter = counter;
                        _this.errorMessages = e;
                        _this.errorIndexes = ei;
                    });
                };
                AlertListComponent.prototype.removeErrorMessage = function (idx) {
                    //console.log("removeErrorMessage",idx);
                    this._messageService.removeMessage(this.errorIndexes[idx]);
                };
                AlertListComponent.prototype.removeSuccesMessages = function () {
                    //console.log("removeSuccesMessages");
                    this._messageService.removeMessages(this.successIndexes);
                };
                AlertListComponent = __decorate([
                    core_1.Component({
                        selector: 'alert-list',
                        templateUrl: 'app/messages/alert.list.component.html'
                    }), 
                    __metadata('design:paramtypes', [messages_service_1.MessagesService])
                ], AlertListComponent);
                return AlertListComponent;
            }());
            exports_1("AlertListComponent", AlertListComponent);
        }
    }
});
//# sourceMappingURL=alert.list.component.js.map