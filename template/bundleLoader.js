/*global define*/
define([
    "dojo/_base/array",
    "dojo/promise/all",
    "dojo/request"
], function (array, all, request) {

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
            var promises = array.map(bundlePaths, function (bp) {
                return request.get(bp, {handleAs: "json"});
            });
            all(promises).then(f);
        } else {
            require(bpaths, function () {
                f(Array.prototype.slice.call(arguments)); //Convert to regular array
            });
        }
    }
});