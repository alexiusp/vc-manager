System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TransactionObject;
    /* comparison function */
    function itemTransactionEqual(a, b) {
        return ((a.source.id == b.source.id) && (a.item.ItemType.id == b.item.ItemType.id) && (a.owner == b.owner));
    }
    exports_1("itemTransactionEqual", itemTransactionEqual);
    return {
        setters:[],
        execute: function() {
            /* Direction from/to Corporation/Company */
            (function (TransactionObject) {
                TransactionObject[TransactionObject["Company"] = 0] = "Company";
                TransactionObject[TransactionObject["Corp"] = 1] = "Corp"; //=1
            })(TransactionObject || (TransactionObject = {}));
            exports_1("TransactionObject", TransactionObject);
        }
    }
});
//# sourceMappingURL=transactions.js.map