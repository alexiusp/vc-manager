System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var map, Dictionary;
    return {
        setters:[],
        execute: function() {
            map = (function () {
                function map() {
                }
                return map;
            }());
            exports_1("map", map);
            Dictionary = (function () {
                function Dictionary() {
                    this.keys = [];
                    this.values = [];
                }
                Dictionary.prototype.getKeys = function () {
                    return this.keys;
                };
                Dictionary.prototype.hasKey = function (key) {
                    return (this.keys.indexOf(key) > -1);
                };
                Dictionary.prototype.getValues = function () {
                    return this.values;
                };
                Dictionary.prototype.setValue = function (key, value) {
                    this.removeValue(key);
                    this.keys.push(key);
                    this.values.push(value);
                };
                Dictionary.prototype.removeValue = function (key) {
                    var i = this.keys.indexOf(key);
                    if (i > -1) {
                        this.keys.splice(i, 1);
                        this.values.splice(i, 1);
                    }
                };
                Dictionary.prototype.get = function (key) {
                    var i = this.keys.indexOf(key);
                    if (i >= 0)
                        return this.values[i];
                    else
                        return null;
                };
                return Dictionary;
            }());
            exports_1("Dictionary", Dictionary);
        }
    }
});
//# sourceMappingURL=dictionary.js.map