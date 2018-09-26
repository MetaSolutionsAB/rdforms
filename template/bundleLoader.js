/*global define*/
define([
    "dojo/_base/array",
    "dojo/json",
    "dojo/promise/all",
    "dojo/request",
    "dojo/has",
    "require",
], function (array, json, all, request, has, require) {

    var endsWith = function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    return function(itemStore, bundlePaths, callback) {
        if (bundlePaths.length === 0) {
            callback && callback([]);
            return;
        }

        var f = function (bundlesJSON) {
            var bundles = array.map(bundlesJSON, function (bundle, idx) {
                var path = bundlePaths[idx];
                if (!endsWith(path, ".json")) {
                    path += ".js";
                }
                return itemStore.registerBundle({path: path, source: bundle});
            });
            callback && callback(bundles);
        };

        if (endsWith(bundlePaths[0], ".json")) {
            if (has('host-node')) {
                var bps = array.map(bundlePaths, function (bp) {
                    return "dojo/text!" + bp;
                });
                require(bps, function () {
                    var jsonArr = array.map(Array.prototype.slice.call(arguments), function (text) {
                        return json.parse(text);
                    });
                    f(jsonArr); //Convert to regular array
                });
            } else {
                var promises = array.map(bundlePaths, function (bp) {
                    return request.get(bp, {handleAs: "json"});
                });
                all(promises).then(f);
            }
        } else {
            require(bundlePaths, function () {
                f(Array.prototype.slice.call(arguments)); //Convert to regular array
            });
        }
    }
});