System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TransactionObject, TransactionAction;
    /*
    export interface MassItemTransaction extends BaseTransaction {
      action  : TransactionAction;// if it is a multy item transaction
    }
    */
    /* comparison function */
    function itemTransactionEqual(a, b) {
        var checkSource = (a.source.id == b.source.id);
        var checkItem = (!!a.item && !!b.item) ? (a.item.ItemType.id == b.item.ItemType.id) : true;
        //let checkAction = (!!a.action && !!b.action) ? (a.action == b.action) : true;
        var checkOwner = (a.owner == b.owner);
        return (checkSource && checkItem && checkOwner); // && checkAction
    }
    exports_1("itemTransactionEqual", itemTransactionEqual);
    function isInvestTransaction(t) {
        return (!!t.target && !t.item);
    }
    exports_1("isInvestTransaction", isInvestTransaction);
    return {
        setters:[],
        execute: function() {
            /* Direction from/to Corporation/Company */
            (function (TransactionObject) {
                TransactionObject[TransactionObject["Company"] = 0] = "Company";
                TransactionObject[TransactionObject["Corp"] = 1] = "Corp"; //=1
            })(TransactionObject || (TransactionObject = {}));
            exports_1("TransactionObject", TransactionObject);
            (function (TransactionAction) {
                TransactionAction[TransactionAction["moveProduction"] = 0] = "moveProduction";
                TransactionAction[TransactionAction["clearStorage"] = 1] = "clearStorage";
            })(TransactionAction || (TransactionAction = {}));
            exports_1("TransactionAction", TransactionAction);
        }
    }
});
//# sourceMappingURL=transactions.js.map