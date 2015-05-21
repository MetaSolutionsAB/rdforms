/*global define*/
define(["dojo/_base/declare", 
	"dojo/_base/lang",
    "dojo/_base/array",
	"dijit/_Widget",
    "rdforms/model/Engine",
	"rdforms/model/GroupBinding",
    "rdforms/model/system",
    "rdforms/view/renderingContext"
], function(declare, lang, array, _Widget,
            Engine, GroupBinding, system, renderingContext) {
    

    return declare(_Widget, {
        //===================================================
        // Public attributes
        //===================================================
        binding: null,
        template: null,
        graph: null,
        resource: "",
        topLevel: true,
        compact: false,
        styleCls: "",

        //===================================================
        // Public API
        //===================================================

        /**
         * Tells wether something should be shown for the provided bindings and belonging item.
         * @param {Object} item
         * @param {Object} bindings
         * @return {Boolean} true if something should be shown.
         */
        showNow: function (item, bindings) {
            return true;
        },

        skipBinding: function (binding) {
            return false;
        },

        /**
         * This function may change the array of bindings, for instance remove all but
         * the best language or complement the existing bindings
         * until the min cardinality is reached.
         *
         * @param {Object} item
         * @param {Array} bindings
         * @return {Array} of bindings
         */
        prepareBindings: function (item, bindings) {
        },

        /**
         * Adds a table with headers for the given firstBinding.
         * @param {Node} lastRow if provided it is the last row as a DOM element.
         * @param {Object} firstBinding the first binding to show in this table.
         */
        addTable: function (lastRow, firstBinding) {
        },

        /**
         * Fills the table with one row for each binding in bindings.
         *
         * @param {Object} table a table DOM element
         * @param {Array} bindings an array of bindings
         */
        fillTable: function (table, bindings) {
        },

        addLabel: function (rowDiv, labelDiv, binding) {
        },

        addComponent: function (fieldDiv, binding, noCardinalityButtons) {
        },
        showAsTable: function (item) {
            return item.getType() === "group" && (item.hasStyle("table") || item.hasClass("rdformsTable"));
        },
        //===================================================
        // Inherited methods
        //===================================================
        constructor: function (params) {
            this._handleParams(params);
        },

        _handleParams: function (params) {
            if (params.binding) {
                this.binding = params.binding;
            } else {
                this.template = params.template || this.template;
                this.graph = params.graph || this.graph;
                this.resource = params.resource || this.resource;
                if (this.graph == null || this.resource == null || this.template == null) {
                    return;
                }
                this.binding = Engine.match(this.graph, this.resource, this.template);
            }
        },

        /**
         * Builds the user interface by iterating over the child bindings of the current binding and recursively
         * creates new views for all groupbindings.
         */
        buildRendering: function () {
            this.domNode = this.srcNodeRef;
            renderingContext.domClassToggle(this.domNode, "rdforms", true);
            renderingContext.domClassToggle(this.domNode, this.styleCls, true);
            this.render();
        },

        show: function (params) {
            this._handleParams(params);
            this.render();
        },

        render: function () {
            renderingContext.domText(this.domNode, "");
            if (this.binding == null) {
                return;
            }

            renderingContext.getMessages(lang.hitch(this, function (messages) {
                this.messages = messages;
                var groupIndex, table, lastRow, table,
                    groupedItemsArr = this.binding.getItem().getChildren(),
                    groupedBindingsArr = this.binding.getItemGroupedChildBindings(),
                    bindings, item;
                this._binding2node = {};

                if ((this.compact || this.binding.getItem().hasStyle("compact")) && !this.binding.getItem().hasStyle("nonCompact")) {
                    renderingContext.domClassToggle(this.domNode, "compact", true);
                } else {
                    renderingContext.domClassToggle(this.domNode, "compact", false);
                }

                for (groupIndex = 0; groupIndex < groupedBindingsArr.length; groupIndex++) {
                    bindings = groupedBindingsArr[groupIndex];
                    item = groupedItemsArr[groupIndex];

                    if (!this.showNow(item, bindings)) {
                        continue;
                    }

                    bindings = this.prepareBindings(item, bindings);

                    //Table case
                    if (this.showAsTable(item)) {
                        lastRow = this.createRowNode(lastRow, bindings[0], item);
                        if (bindings.length > 0) {
                            table = this.addTable(lastRow, bindings[0], item);
                            this.fillTable(table, bindings);
                        }

                        //Non table case
                    } else {
                        if (bindings.length > 0) {
                            for (var i = 0; i < bindings.length; i++) {
                                //Add row with label if first row of same item or the binding is a group.
                                lastRow = this.addRow(lastRow, bindings[i], i === 0 || bindings[i] instanceof GroupBinding);
                            }
                        } else {
                            lastRow = this.createRowNode(lastRow, null, item);
                        }
                    }

                    //Activates/deactivates buttons at startup if needed
                    if (bindings.length > 0) {
                        bindings[0].getCardinalityTracker().checkCardinality();
                    }
                }
            }));
        },

        /**
         * Adds a single row corresponding to a binding.
         *
         * @param {Object} lastRow last row that was added
         * @param {Object} binding the binding to add a row for
         * @param {Boolean} includeLabel, tells if a label should be added, if undefined a label is added only when the binding is a GroupBinding.
         */
        addRow: function (lastRow, binding, includeLabel) {
            var fieldDiv, newRow, item = binding.getItem();

            if (this.skipBinding(binding)) {
                return;
            }

            if (includeLabel == null) {
                includeLabel = binding instanceof GroupBinding;
            }

            //Taking care of dom node structure plus label.
            if (includeLabel === true) {
                newRow = this.createRowNode(lastRow, binding, item);
                var n = renderingContext.domCreate("div", newRow);
                renderingContext.domClassToggle(n, "rdformsFields", true);
                fieldDiv = renderingContext.domCreate("div", n);
            } else {
                //No new rowDiv since we have a repeated value under the same label.
                var rdformsFields = renderingContext.domQuery(".rdformsFields", lastRow);
                if (rdformsFields != null) {
                    fieldDiv = renderingContext.domCreate("div", rdformsFields);
                    renderingContext.domClassToggle(fieldDiv, "rdformsRepeatedValue", true);
                } else { //Unless we have an non-expanded row.
                    var n = renderingContext.domCreate("div", lastRow);
                    renderingContext.domClassToggle(n, "rdformsFields", true);
                    fieldDiv = renderingContext.domCreate("div", n);
                }
            }
            this._binding2node[binding.getHash()] = fieldDiv;
            this.addComponent(fieldDiv, binding);
            return newRow || lastRow;
        },
        createRowNode: function (lastRowNode, binding, item) {
            var rowNode;

            //New rowDiv since we have a label
            if (lastRowNode === undefined) {
                rowNode = renderingContext.domCreate("div", this.domNode);
            } else {
                rowNode = renderingContext.domCreateAfter("div", lastRowNode);
            }

            array.forEach(item.getClasses(), function(cls) {
                renderingContext.domClassToggle(rowNode, cls, true);
            });
            renderingContext.domClassToggle(rowNode, "rdformsRow", true);
            renderingContext.domClassToggle(rowNode, "rdformsTopLevel", this.topLevel);
            renderingContext.domClassToggle(rowNode, "rdformsInvisibleGroup", item.hasStyle("invisibleGroup"));
            renderingContext.domClassToggle(rowNode, "rdformsHeading", item.hasStyle("heading"));
            renderingContext.domClassToggle(rowNode, "notCompact", item.getType() === "group");

            this.addLabel(rowNode, binding, item);
            return rowNode;
        }
    });
});