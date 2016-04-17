System.register(['../core/classes'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var classes_1;
    var CompanyItem, CompanyDetailItem;
    return {
        setters:[
            function (classes_1_1) {
                classes_1 = classes_1_1;
            }],
        execute: function() {
            CompanyItem = (function (_super) {
                __extends(CompanyItem, _super);
                function CompanyItem(i) {
                    _super.call(this);
                    this._item = i;
                    this.isOpen = false;
                }
                Object.defineProperty(CompanyItem.prototype, "item", {
                    get: function () {
                        return this._item;
                    },
                    set: function (i) {
                        this._item = i;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CompanyItem.prototype, "isOpen", {
                    get: function () {
                        return !!this._isOpen;
                    },
                    set: function (val) {
                        this._isOpen = val;
                    },
                    enumerable: true,
                    configurable: true
                });
                return CompanyItem;
            }(classes_1.SelectableItem));
            exports_1("CompanyItem", CompanyItem);
            CompanyDetailItem = (function (_super) {
                __extends(CompanyDetailItem, _super);
                function CompanyDetailItem(i) {
                    _super.call(this);
                    if (!!i) {
                        this._item = i;
                        this.checkLoading();
                    }
                    this.isOpen = false;
                }
                CompanyDetailItem.prototype.checkLoading = function () {
                    if (!!this._item && !!this._storage)
                        this.isLoading = false;
                    else
                        this.isLoading = true;
                };
                Object.defineProperty(CompanyDetailItem.prototype, "item", {
                    get: function () {
                        return this._item;
                    },
                    set: function (i) {
                        this._item = i;
                        this.checkLoading();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CompanyDetailItem.prototype, "storage", {
                    get: function () {
                        return this._storage;
                    },
                    set: function (list) {
                        this._storage = list;
                        this.checkLoading();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CompanyDetailItem.prototype, "isOpen", {
                    get: function () {
                        return !!this._isOpen;
                    },
                    set: function (val) {
                        this._isOpen = val;
                    },
                    enumerable: true,
                    configurable: true
                });
                return CompanyDetailItem;
            }(classes_1.LoadableItem));
            exports_1("CompanyDetailItem", CompanyDetailItem);
        }
    }
});
//# sourceMappingURL=models.js.map