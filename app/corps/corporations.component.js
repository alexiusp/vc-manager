System.register(['angular2/core', 'angular2/router', './corporation.service'], function(exports_1, context_1) {
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
    var core_1, router_1, corporation_service_1;
    var CorporationsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (corporation_service_1_1) {
                corporation_service_1 = corporation_service_1_1;
            }],
        execute: function() {
            CorporationsComponent = (function () {
                function CorporationsComponent(_corporationService) {
                    this._corporationService = _corporationService;
                }
                CorporationsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._corporationService.getCorpsList().subscribe(function (res) {
                        //console.log("list finish:", res);
                        _this.corporations = res;
                    });
                };
                CorporationsComponent = __decorate([
                    core_1.Component({
                        selector: 'ap-corps',
                        templateUrl: 'app/corps/corporations.component.html',
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [corporation_service_1.CorporationService])
                ], CorporationsComponent);
                return CorporationsComponent;
            }());
            exports_1("CorporationsComponent", CorporationsComponent);
        }
    }
});
//# sourceMappingURL=corporations.component.js.map