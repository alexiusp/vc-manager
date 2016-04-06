System.register(['../../core/classes'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var classes_1;
    var StorageItem;
    return {
        setters:[
            function (classes_1_1) {
                classes_1 = classes_1_1;
            }],
        execute: function() {
            StorageItem = (function (_super) {
                __extends(StorageItem, _super);
                function StorageItem(i) {
                    _super.call(this);
                    this._item = i;
                }
                Object.defineProperty(StorageItem.prototype, "item", {
                    get: function () {
                        return this._item;
                    },
                    set: function (i) {
                        this._item = i;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StorageItem.prototype, "isTransfer", {
                    get: function () {
                        return !!this._isTransfer;
                    },
                    set: function (val) {
                        this._isTransfer = val;
                        var s = this.isSell || val;
                        //console.log("set Transfer", val, s);
                        this.isSelected = s;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StorageItem.prototype, "isSell", {
                    get: function () {
                        return !!this._isSell;
                    },
                    set: function (val) {
                        this._isSell = val;
                        var s = this.isTransfer || val;
                        //console.log("set Sell", val, s);
                        this.isSelected = s;
                    },
                    enumerable: true,
                    configurable: true
                });
                return StorageItem;
            }(classes_1.SelectableItem));
            exports_1("StorageItem", StorageItem);
        }
    }
});
//# sourceMappingURL=models.js.map