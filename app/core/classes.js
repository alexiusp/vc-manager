System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SelectableItem;
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
                        this._isSelected = val;
                    },
                    enumerable: true,
                    configurable: true
                });
                return SelectableItem;
            }());
            exports_1("SelectableItem", SelectableItem);
        }
    }
});
//# sourceMappingURL=classes.js.map