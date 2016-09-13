/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/kernel",
	"rdforms/view/View",
    "rdforms/view/renderingContext"
], function(declare, kernel, View, renderingContext) {

    return declare(View, {
        //===================================================
        // Public attributes
        //===================================================
        showLanguage: true,
        filterTranslations: true,
        styleCls: "rdformsPresenter",

        //===================================================
        // Public API
        //===================================================
        /**
         * Show only if any bindings exists for the given item.
         * @param {Object} item
         * @param {Object} bindings
         */
        showNow: function(item, bindings) {
            if (item.hasStyle("deprecated") && bindings.length === 0) {
                return false;
            }
            return bindings.length > 0 && !item.hasStyle("invisible");
        },

        skipBinding: function(binding) {
            return binding.getItem().getType() === "group" && binding.getChildBindings().length === 0;
        },

        /**
         * Has no effect on items that with node type different than LANGUAGE_LITERAL
         * or if filterTranslations is set to false. Otherwise a single binding is
         * returned with the best language match according to the locale.
         *
         * @param {Object} item
         * @param {Object} bindings
         * @param {Array} with a single value if the filtering has taken place,
         * otherwise same as input bindings.
         */
        prepareBindings: function(item, bindings) {
            var alts = {}, index;
            if (!this.filterTranslations || item.getNodetype() !== "LANGUAGE_LITERAL" || item.hasStyle("viewAllTranslations")) {
                return bindings;
            }
            for (index =0;index<bindings.length;index++) {
                var lang = bindings[index].getLanguage();
                if (lang === "" || lang === undefined) {
                    alts.noLanguage = bindings[index];
                } else if (lang === kernel.locale) {
                    alts.best = bindings[index];
                } else if (lang.indexOf(kernel.locale) !== -1 || kernel.locale.indexOf(lang) !== -1) {
                    alts.close = bindings[index];
                } else if (lang.indexOf(this.defaultLanguage) === 0) {
                    alts.defaultLanguage = bindings[index];
                }
            }
            var singleBinding = alts.best || alts.close || alts.defaultLanguage || alts.noLanguage;
            return  singleBinding !== undefined ? [singleBinding] : bindings;
        },

        addLabel: function (rowDiv, binding, item) {
            renderingContext.renderPresenterLabel(rowDiv, binding, item, {view: this});
        },
        addTable: function(newRow, firstBinding) {
            return renderingContext.addPresenterTable(newRow, firstBinding, {view: this});
        },
        fillTable: function(table, bindings) {
            return renderingContext.fillPresenterTable(table, bindings, {view: this});
        },
        addComponent: function(fieldDiv, binding) {
            renderingContext.renderPresenter(fieldDiv, binding, {view: this});
        }
    });
});