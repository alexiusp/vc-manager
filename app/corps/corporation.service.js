System.register(['angular2/core', '../request/request.service', '../core/dictionary'], function(exports_1, context_1) {
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
    var core_1, request_service_1, dictionary_1;
    var CorporationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (request_service_1_1) {
                request_service_1 = request_service_1_1;
            },
            function (dictionary_1_1) {
                dictionary_1 = dictionary_1_1;
            }],
        execute: function() {
            CorporationService = (function () {
                function CorporationService(_requestService) {
                    this._requestService = _requestService;
                    this._corps = new dictionary_1.map();
                    this._corpStorage = new dictionary_1.map();
                }
                CorporationService.prototype.getCorpsList = function () {
                    var _this = this;
                    return this._requestService.getCorpsList().map(function (corpList) {
                        if (corpList.error == 0) {
                            _this._corpList = corpList.data;
                            return _this._corpList;
                        }
                        else
                            return _this.handleError(corpList);
                    });
                };
                CorporationService.prototype.getCorpDetail = function (id) {
                    var _this = this;
                    return this._requestService.getCorpDetail(id)
                        .map(function (corpInfo) {
                        if (corpInfo.error == 0) {
                            _this._corps[("" + id)] = corpInfo.data;
                            return _this._corps[("" + id)];
                        }
                        else
                            return _this.handleError(corpInfo);
                    });
                };
                CorporationService.prototype.getCorpStorage = function (id) {
                    var _this = this;
                    return this._requestService.getCorpStorage(id)
                        .map(function (cStorage) {
                        if (cStorage.error == 0) {
                            var _resStorage = cStorage.data;
                            _this._corpStorage[("" + id)] = _resStorage;
                            return _resStorage;
                        }
                        else
                            return _this.handleError(cStorage);
                    });
                };
                CorporationService.prototype.getCompanyStorage = function (id) {
                    var _this = this;
                    return this._requestService.getCompanyStorage(id)
                        .map(function (cStorage) {
                        if (cStorage.error == 0)
                            return cStorage.data;
                        else
                            return _this.handleError(cStorage);
                    });
                };
                CorporationService.prototype.getCompanyDetail = function (id) {
                    var _this = this;
                    return this._requestService.getCompanyDetail(id)
                        .map(function (cDetail) {
                        if (cDetail.error == 0)
                            return cDetail.data;
                        else
                            return _this.handleError(cDetail);
                    });
                };
                CorporationService.prototype.moveItemToCorporation = function (compId, itemId, amount) {
                    var _this = this;
                    return this._requestService.moveItemToCorporation(compId, itemId, amount)
                        .map(function (result) {
                        if (result.error == 0)
                            return result.data;
                        else
                            return _this.handleError(result);
                    });
                };
                CorporationService.prototype.addFundsToCompany = function (compId, amount) {
                    var _this = this;
                    return this._requestService.addFundsToCompany(compId, amount)
                        .map(function (result) {
                        if (result.error == 0)
                            return result.data;
                        else
                            return _this.handleError(result);
                    });
                };
                CorporationService.prototype.addFundsToCorporation = function (corpId, amount) {
                    var _this = this;
                    return this._requestService.addFundsToCorporation(corpId, amount)
                        .map(function (result) {
                        if (result.error == 0)
                            return result.data;
                        else
                            return _this.handleError(result);
                    });
                };
                CorporationService.prototype.handleError = function (error) {
                    //console.error("Error:",error.message);
                    return error.data;
                };
                CorporationService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [request_service_1.RequestService])
                ], CorporationService);
                return CorporationService;
            }());
            exports_1("CorporationService", CorporationService);
        }
    }
});
//# sourceMappingURL=corporation.service.js.map