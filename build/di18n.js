define(["i18n", "dojo/_base/kernel"], function(i18n, kernel) {
    i18n.getLocalization = function(moduleName, bundleName, locale) {
        if (eval("typeof "+moduleName.replace(/(\.|\/)/g, "_")+"_nls_"+bundleName+" !== \"undefined\"")) {
            return eval(moduleName.replace(/(\.|\/)/g, "_")+"_nls_"+bundleName).root;
        }

        var bundle = require(moduleName.replace(/\./g, "/")+"/nls/"+bundleName);
        return bundle != null ? bundle.root || bundle.ROOT : null;
    };
    i18n.normalizeLocale = function(locale) {
        var result = locale ? locale.toLowerCase() : kernel.locale;
        return result == "root" ? "ROOT" : result;
    };
    return i18n
});
