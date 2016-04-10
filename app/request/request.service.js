System.register(['angular2/core', 'angular2/http', 'rxjs/Observable', 'angular2/router', '../core/core.service'], function(exports_1, context_1) {
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
    var core_1, http_1, Observable_1, router_1, core_service_1;
    var RequestType, RequestService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (core_service_1_1) {
                core_service_1 = core_service_1_1;
            }],
        execute: function() {
            (function (RequestType) {
                RequestType[RequestType["GET"] = 0] = "GET";
                RequestType[RequestType["POST"] = 1] = "POST";
                RequestType[RequestType["PUT"] = 2] = "PUT";
            })(RequestType || (RequestType = {}));
            RequestService = (function () {
                function RequestService(http, _router, _coreService) {
                    this.http = http;
                    this._router = _router;
                    this._coreService = _coreService;
                }
                RequestService.prototype.doRequest = function (type, url, body, options) {
                    var _this = this;
                    var _url = '/' + url;
                    var reqObserable;
                    switch (type) {
                        case RequestType.PUT:
                            reqObserable = this.http.put(_url, body, options);
                            break;
                        case RequestType.POST:
                            reqObserable = this.http.post(_url, body, options);
                            break;
                        case RequestType.GET:
                        default:
                            reqObserable = this.http.get(_url);
                            break;
                    }
                    return reqObserable.map(function (res) { return res.json(); })
                        .do(function (res) {
                        //console.log("Request to [" + url + "] result:", res);
                        if (res.error == -1) {
                            console.error("Auth error:", res.message);
                            _this._coreService.isLoggedIn = false;
                            _this._router.navigateByUrl('/');
                        }
                    }).catch(this.handleError);
                };
                RequestService.prototype.login = function (user) {
                    var body = JSON.stringify(user);
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.doRequest(RequestType.POST, 'api/login', body, options);
                };
                RequestService.prototype.getCorpsList = function () {
                    return this.doRequest(RequestType.GET, 'api/corps');
                };
                RequestService.prototype.getCorpDetail = function (id) {
                    return this.doRequest(RequestType.GET, 'api/corp/' + id);
                };
                RequestService.prototype.getCorpStorage = function (id) {
                    return this.doRequest(RequestType.GET, 'api/corp/storage/' + id);
                };
                RequestService.prototype.getCompanyDetail = function (id) {
                    return this.doRequest(RequestType.GET, 'api/company/' + id);
                };
                RequestService.prototype.getCompanyStorage = function (id) {
                    return this.doRequest(RequestType.GET, 'api/company/' + id + '/storage');
                };
                RequestService.prototype.moveItemToCorporation = function (compId, itemId, amount) {
                    var body = JSON.stringify({
                        item: itemId,
                        amount: amount
                    });
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.doRequest(RequestType.POST, 'api/company/' + compId + '/storage', body, options);
                };
                RequestService.prototype.addFundsToCompany = function (compId, amount) {
                    var body = JSON.stringify({
                        amount: amount
                    });
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.doRequest(RequestType.POST, 'api/company/' + compId + '/funds', body, options);
                };
                RequestService.prototype.addFundsToCorporation = function (corpId, amount) {
                    var body = JSON.stringify({
                        amount: amount
                    });
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.doRequest(RequestType.POST, 'api/corp/' + corpId + '/funds', body, options);
                };
                RequestService.prototype.moveItemsToCompany = function (compId, items) {
                    var body = JSON.stringify({
                        items: items
                    });
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.doRequest(RequestType.PUT, 'api/company/' + compId + '/storage', body, options);
                };
                RequestService.prototype.sellItemFromCorporation = function (corpId, itemId, amount, price) {
                    var body = JSON.stringify({
                        itemId: itemId,
                        amount: amount,
                        price: price
                    });
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.doRequest(RequestType.POST, 'api/corp/' + corpId + '/exchange', body, options);
                };
                RequestService.prototype.sellItemFromCompany = function (compId, itemId, amount, price) {
                    var body = JSON.stringify({
                        itemId: itemId,
                        amount: amount,
                        price: price
                    });
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.doRequest(RequestType.POST, 'api/company/' + compId + '/exchange', body, options);
                };
                RequestService.prototype.getCompanyWorkers = function (compId) {
                    return this.doRequest(RequestType.GET, 'api/company/' + compId + '/workers');
                };
                RequestService.prototype.handleError = function (error) {
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().message || 'Server error');
                };
                RequestService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, router_1.Router, core_service_1.CoreService])
                ], RequestService);
                return RequestService;
            }());
            exports_1("RequestService", RequestService);
        }
    }
});
//# sourceMappingURL=request.service.js.map