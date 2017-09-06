/*global define*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "di18n/localize",
    "rdforms/model/engine",
    "rdforms/model/validate",
    "rdforms/view/Presenter",
    "rdforms/view/renderingContext"
], function(declare, lang, localize, engine, validate, Presenter, renderingContext) {

    return declare(Presenter, {
        //===================================================
        // Public attributes
        //===================================================
        showLanguage: true,
        filterTranslations: false,
        styleCls: "rdformsPresenter",

        //===================================================
        // Public API
        //===================================================
        showNow: function (item, bindings) {
            if (item.hasStyle("invisible")) {
                return false;
            }
            if (bindings.length > 0) {
                return true;
            }
            if (item.hasStyle("deprecated")) {
                return false;
            }
            var card = item.getCardinality();
            switch (this.includeLevel) {
                case "mandatory":
                    return card && card.min >= 1;
                case "recommended":
                    return card && (card.min >= 1 || card.pref >= 1);
                default:
                    return true;
            }
        },

        showAsTable: function () {
            return false;
        },

        /**
         * Has no effect on items that with node type different than LANGUAGE_LITERAL or if filterTranslations is set to false.
         * Otherwise a single binding is returned with the best language match according to the locale.
         *
         * @param {Object} item
         * @param {Object} bindings
         * @param {Array} with a single value if the filtering has taken place, otherwise same as input bindings.
         */
        prepareBindings: function (item, bindings) {
            var card = item.getCardinality();
            var target, min = card.min != null ? card.min : 0, pref = card.pref != null ? card.pref : 0;
            if (card.pref > 0) {
                target = card.pref;
            } else if (card.min > 0) {
                target = card.min;
            } else if (item.getType() === "propertygroup") {
                target = 0;
            } else if (item.getType() === "group") {
                if (item.getProperty() == null) {
                    target = 1;
                } else {
                    target = 0;
                }
            } else {
                target = 0;
            }
            var noDisjointHinder = !this.binding.getItem().hasStyle("disjoint") ||
                this.binding.error === engine.CODES.TOO_FEW_VALUES ||
                this.binding.warning === engine.CODES.TOO_FEW_VALUES;
            if (target > bindings.length && noDisjointHinder) {
                bindings = bindings.concat([]);
                while (target > bindings.length) {
                    var binding = engine.create(this.binding, item);
                    if (bindings.length < min) {
                        binding.error = engine.CODES.TOO_FEW_VALUES;
                    } else if (bindings.length < pref) {
                        binding.warning = engine.CODES.TOO_FEW_VALUES;
                    }
                    bindings.push(binding);
                }
            }
            return bindings;
        },

        skipBinding: function (binding) {
            return false;
        },

        _handleParams: function (params) {
            this.inherited(arguments);
            if (this.binding) {
                validate.bindingReport(this.binding);
            }
        },

        addValidationMarker: function (fieldDiv, binding) {
            var item = binding.getItem(), card = item.getCardinality();
            var min = card.min != null ? card.min : 0, pref = card.pref != null ? card.pref : 0;
            if (binding.error) {
                renderingContext.domClassToggle(fieldDiv, "error", true);
                var tmpl;
                if (binding.error === engine.CODES.TOO_FEW_VALUES) {
                    tmpl = localize(this.messages, "validation_min_required", min);
                } else if (binding.error === engine.CODES.TOO_MANY_VALUES) {
                    tmpl = localize(this.messages, "validation_max", card.max || 1);
                } else if (binding.error === engine.CODES.TOO_MANY_VALUES_DISJOINT) {
                    tmpl = this.messages.validation_disjoint;
                }
                var n = renderingContext.domCreate("div", fieldDiv);
                renderingContext.domText(n, ">> "+tmpl+" <<");
                return true;
            } else if (binding.warning) {
                renderingContext.domClassToggle(fieldDiv, "warning", true);
                var tmpl = localize(this.messages, "validation_min_recommended", pref);
                var n = renderingContext.domCreate("div", fieldDiv);
                renderingContext.domText(n, ">> "+tmpl+" <<");
                return true;
            } else if (item.hasStyle("deprecated")) {
                renderingContext.domClassToggle(fieldDiv, "deprecated", true);
                var n = renderingContext.domCreate("div", fieldDiv);
                renderingContext.domText(n, ">> "+this.messages.validation_deprecated+" <<");
                return true;
            } else {
                return false;
            }
        },
        addComponent: function(fieldDiv, binding) {
            this.inherited("addComponent", arguments);
            this.addValidationMarker(fieldDiv, binding);
        }

    });
});