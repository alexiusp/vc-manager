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
    var VMoneyPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            VMoneyPipe = (function () {
                function VMoneyPipe() {
                }
                VMoneyPipe.prototype.transform = function (value) {
                    //console.log("VMoneyPipe", value);
                    if (value === null)
                        return "";
                    var result = +value;
                    var answer = "" + value;
                    var kr = result % 1000;
                    if (kr != result) {
                        result = (result - kr) / 1000;
                        answer = result + "K";
                        var mr = result % 1000;
                        if (mr != result) {
                            result = (result - mr) / 1000;
                            answer = result + "M";
                            var br = result % 1000;
                            if (br != result) {
                                result = (result - br) / 1000;
                                answer = result + "B";
                            }
                        }
                    }
                    return answer;
                };
                VMoneyPipe = __decorate([
                    core_1.Pipe({ name: 'vMoney' }), 
                    __metadata('design:paramtypes', [])
                ], VMoneyPipe);
                return VMoneyPipe;
            }());
            exports_1("VMoneyPipe", VMoneyPipe);
        }
    }
});
//# sourceMappingURL=vmoney.pipe.js.map