System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SelectableItem, LoadableItem;
    return {
        setters:[],
        execute: function() {
            SelectableItem = (function () {
                function SelectableItem() {
                    this._isSelected = false;
                }
                Object.defineProperty(SelectableItem.prototype, "isSelected", {
                    get: function () {
                        return !!this._isSelected;
                    },
                    set: function (val) {
                        this._isSelected = !!val;
                    },
                    enumerable: true,
                    configurable: true
                });
                return SelectableItem;
            }());
            exports_1("SelectableItem", SelectableItem);
            LoadableItem = (function (_super) {
                __extends(LoadableItem, _super);
                function LoadableItem() {
                    _super.call(this);
                    this._loading = true;
                }
                Object.defineProperty(LoadableItem.prototype, "isLoading", {
                    get: function () {
                        return !!this._loading;
                    },
                    set: function (val) {
                        this._loading = !!val;
                    },
                    enumerable: true,
                    configurable: true
                });
                return LoadableItem;
            }(SelectableItem));
            exports_1("LoadableItem", LoadableItem);
        }
    }
});
//# sourceMappingURL=classes.js.map