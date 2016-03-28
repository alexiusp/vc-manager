System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ResultMessage;
    return {
        setters:[],
        execute: function() {
            ResultMessage = (function () {
                function ResultMessage(c, m) {
                    this.msg = m;
                    this.class = c;
                }
                return ResultMessage;
            }());
            exports_1("ResultMessage", ResultMessage);
        }
    }
});
//# sourceMappingURL=response.js.map