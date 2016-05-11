define(["dojo/_base/declare",
    "rdforms/view/Presenter",
    "rdforms/model/Engine",
    "rdforms/view/renderingContext"
], function (declare, Presenter, Engine, renderingContext) {

    var showNow = function (item, bindings, includeLevel) {
        if (item.hasStyle("invisible")) {
            return false;
        }
        if (item.hasStyle("deprecated") && bindings.length === 0) {
            return false;
        }
        if (bindings.length > 0) {
            if (item.getProperty()) {
                return true;
            }

            //Take care of layout grouping by checking recursively.
            if (item.getType() === "group") {
                var groupedItemsArr = item.getChildren(),
                    groupedBindingsArr = bindings[0].getItemGroupedChildBindings(),
                    groupIndex, bindings, item;
                for (groupIndex = 0; groupIndex < groupedBindingsArr.length; groupIndex++) {
                    bindings = groupedBindingsArr[groupIndex];
                    item = groupedItemsArr[groupIndex];
                    if (showNow(item, bindings, includeLevel)) {       //Recursive call
                        return true;
                    }
                }
            } else {
                return true;
            }
        }
        var card = item.getCardinality();
        switch (includeLevel) {
            case "mandatory":
                return card && card.min >= 1;
            case "recommended":
                return card && (card.min >= 1 || card.pref >= 1);
            default:
                return true;
        }
    };


    var Editor = declare(Presenter, {
        //===================================================
        // Public attributes
        //===================================================
        filterTranslations: false,
        styleCls: "rdformsEditor",
        includeLevel: "recommended",


        //===================================================
        // Public methods
        //===================================================
        report: function (report) {
            if (!report) {
                report = Engine.report(this.binding);
            }
            for (var key in this._binding2node) {
                renderingContext.domClassToggle(this._binding2node[key], "errorReport", false);
            }
            for (var j = 0; j < report.errors.length; j++) {
                if (report.errors[j].parentBinding === this.binding) {
                    var item = report.errors[j].item;
                    var bindings = this.binding.getChildBindingsFor(item);
                    var counter = item.getCardinality().min;
                    for (var k = 0; k < bindings.length && counter > 0; k++) {
                        counter--;
                        if (!bindings[k].isValid()) {
                            renderingContext.domClassToggle(this._binding2node[bindings[k].getHash()], "errorReport", true);
                        }
                    }
                }
            }

            for (var i = 0; i < this._subEditors.length; i++) {
                this._subEditors[i].report(report);
            }
        },
        getIncludeLevel: function() {
            return this.includeLevel;
        },
        setIncludeLevel: function(includeLevel) {
            this.includeLevel = includeLevel;
            if (this.graph == null || this.resource == null || this.template == null) {
                return;
            }
            this.binding = Engine.match(this.graph, this.resource, this.template);
            this.render();
        },
        //===================================================
        // Inherited methods
        //===================================================
        buildRendering: function () {
            this._subEditors = [];
            this.inherited("buildRendering", arguments);
        },

        show: function(params) {
            this._subEditors = [];
            this.inherited("show", arguments);
        },

        /**
         * Will only show something for the given item if there is anything to show, or if the includeLevel indicates
         * to show it anyhow (for example min cardinality > 0 or includeLevel is optional or recommended at the same
         * time the preferred cardinality is bigger than zero.
         * @param {Object} item
         * @param {Object} bindings
         */
        showNow: function (item, bindings) {
            return showNow(item, bindings, this.includeLevel);
        },
        skipBinding: function (binding) {
            return false;
        },
        /**
         * Will add bindings until the min cardinality is reached.
         * @param {Object} item
         * @param {Object} bindings
         */
        prepareBindings: function (item, bindings) {
            var card = item.getCardinality();
            var target;
            if (card.pref > 0) {
                target = card.pref;
            } else if (card.min > 0) {
                target = card.min;
            } else if (item.getType() === "propertygroup") {
                target = 1; // Was 0 before, old way. Now regulated via includeLevel and expand style instead.
            } else if (item.getType() === "group") {
                if (item.getProperty() == null) {
                    target = 1;
                } else {
                    target = 1; // Was 0 before, old way. Now regulated via includeLevel and expand style instead.
                }
            } else {
                target = 1;
            }
            if (target > bindings.length) {
                bindings = bindings.concat([]);
                while (target > bindings.length) {
                    bindings.push(Engine.create(this.binding, item));
                }
            }
            return bindings;
        },

        addLabel: function (rowDiv, binding, item) {
            renderingContext.renderEditorLabel(rowDiv, binding, item, {view: this});
        },

        addTable: function (newRow, firstBinding) {
            if (firstBinding.getItem().hasStyle("nonEditable")) {
                return this.addComponent(newRow, firstBinding);
            }
            return renderingContext.addEditorTable(newRow, firstBinding, {view: this});
        },

        fillTable: function (table, bindings) {
            renderingContext.fillEditorTable(table, bindings, {view: this});
        },

        addComponent: function(fieldDiv, binding) {
            if (binding.getItem().hasStyle("nonEditable")) {
                renderingContext.renderPresenter(fieldDiv, binding, {view: this});
            } else {
                renderingContext.renderEditor(fieldDiv, binding, {view: this});
            }
        },
        createRowNode: function (lastRowNode, binding, item) {
            var newNode = this.inherited(arguments);
            var path = item.getDeps();
            if (path) {
                var f = function(match) {
                    if (!match) {
                        if (binding.isValid()) {
                            renderingContext.domClassToggle(newNode, "missingDepsWithValue", true);
                        } else {
                            renderingContext.domClassToggle(newNode, "missingDeps", true);
                        }
                    } else {
                        renderingContext.domClassToggle(newNode, "missingDepsWithValue", false);
                        renderingContext.domClassToggle(newNode, "missingDeps", false);
                    }
                };
                var fromBinding = Engine.findBindingRelativeToParentBinding(binding.getParent(), path);
                if (!Engine.matchPathBelowBinding(fromBinding, path)) {
                    f(false);
                }
                fromBinding.addListener(function(changedBinding) {
                    f(Engine.matchPathBelowBinding(fromBinding, path));
                });
            }
            return newNode;
        }
    });
    return Editor;
});