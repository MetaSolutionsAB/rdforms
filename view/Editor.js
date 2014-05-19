define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/_base/array",
    "../utils",
    "./Presenter",
    "./TreeOntologyChooser",
    "dojo/store/Memory",
    "./DateTime",
    "./Duration",
    "../model/system",
    "../template/Group",
    "../template/PropertyGroup",
    "../template/Choice",
    "../model/Engine",
    "dijit/TitlePane",
    "dijit/form/TextBox",
    "dijit/form/ValidationTextBox",
    "dijit/form/Textarea",
    "dijit/form/FilteringSelect",
    "dijit/form/RadioButton"
], function (declare, lang, aspect, on, domClass, construct, attr, array, utils, Presenter, TreeOntologyChooser, Memory, DateTime, Duration,
             system, Group, PropertyGroup, Choice, Engine, TitlePane, TextBox, ValidationTextBox, Textarea, FilteringSelect, RadioButton) {

    var uniqueRadioButtonNameNr = 0;

    var showNow = function (item, bindings, includeLevel) {
        if (item.hasStyle("invisible")) {
            return false;
        }
        if (bindings.length > 0) {
            if (item.getProperty()) {
                return true;
            }

            //Take care of layout grouping by checking recursively.
            if (item instanceof Group) {
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
        styleCls: "rformsEditor",
        ontologyPopupWidget: null,
        includeLevel: "recommended",


        //===================================================
        // Public methods
        //===================================================
        report: function (report) {
            if (!report) {
                report = this.binding.report();
            }
            for (var key in this._binding2node) {
                domClass.remove(this._binding2node[key], "errorReport");
            }
            for (var j = 0; j < report.errors.length; j++) {
                if (report.errors[j].parentBinding === this.binding) {
                    var item = report.errors[j].item;
                    var bindings = this.binding.getChildBindingsFor(item);
                    var counter = item.getCardinality().min;
                    for (var k = 0; k < bindings.length && counter > 0; k++) {
                        counter--;
                        if (!bindings[k].isValid()) {
                            domClass.add(this._binding2node[bindings[k].getHash()], "errorReport");
                        }
                    }
                }
            }

            for (var i = 0; i < this._subEditors.length; i++) {
                this._subEditors[i].report(report);
            }
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
            } else if (item instanceof PropertyGroup) {
                target = 0;
            } else if (item instanceof Group) {
                if (item.getProperty() == null) {
                    target = 1;
                } else {
                    target = 0;
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
        skipBinding: function (binding) {
            return false;
        },

        addLabel: function (rowDiv, labelDiv, binding, item) {
            if (item.hasStyle("nonEditable")) {
                domClass.add(labelDiv, "rformsLabelRow");
                return this.inherited("addLabel", arguments);
            }
            var isGroup = item instanceof Group;
            var l = item.getLabel();
            if (l != null && l != "") {
                l = l.charAt(0).toUpperCase() + l.slice(1);
            } else {
                l = "";
            }

            var label = construct.create("span", {"innerHTML": l}, labelDiv);
            domClass.add(labelDiv, "rformsLabelRow");
            domClass.add(label, "rformsLabel");
            this.showInfo(item, label);

            if (binding == null) {
                this._addExpandButton(rowDiv, labelDiv, item);
                return;
            }
            //If table, no add or remove buttons.
            if (this.showAsTable(item)) {
                return;
            }
            var card = item.getCardinality();
            if (card.max != null && (card.max == card.min || card.max === 1)) {
                return;
            }
            if (isGroup) {
                this._addGroupButtons(rowDiv, labelDiv, binding);
            } else {
                this._addCreateChildButton(rowDiv, labelDiv, binding);
            }
        },

        addGroup: function (fieldDiv, binding) {
            if (binding.getItem().hasStyle("nonEditable")) {
                return this.inherited("addGroup", arguments);
            }
            var subView;
            if (binding.getItem().hasStyle("expandable")) { //Backwardscompatible.
                var titlePane = new TitlePane({open: false}, fieldDiv);
                var node = construct.create("div");
                titlePane.set("content", node);
                subView = new Editor({languages: this.languages, binding: binding, topLevel: false, includeLevel: this.includeLevel}, node);
            } else {
                subView = new Editor({languages: this.languages, binding: binding, topLevel: false, includeLevel: this.includeLevel}, fieldDiv);
            }
            this._subEditors.push(subView);
        },
        addText: function (fieldDiv, binding, noCardinalityButtons) {
            if (binding.getItem().hasStyle("nonEditable")) {
                return this.inherited("addText", arguments);
            }
            var controlDiv = construct.create("div", {"class": "rformsFieldControl"}, fieldDiv);
            var item = binding.getItem();
            var nodeType = item.getNodetype();
            var datatype = item.getDatatype();
            var tb;

            //If certain datatype
            if (nodeType == "DATATYPE_LITERAL" || datatype) {

                //Special editing support implemented for integer, data and duration

                if (datatype === "http://www.w3.org/2001/XMLSchema#date" || datatype === "http://purl.org/dc/terms/W3CDTF") {
                    tb = new DateTime({binding: binding, item: item}, construct.create("div", null, fieldDiv));
                } else if (datatype === "http://www.w3.org/2001/XMLSchema#duration") {
                    tb = new Duration({disabled: !item.isEnabled(), binding: binding}, construct.create("div", null, fieldDiv));
                } else if (datatype === "http://www.w3.org/2001/XMLSchema#integer") {
                    tb = new ValidationTextBox({
                        value: binding.getValue(),
                        disabled: !item.isEnabled(),
                        invalidMessage: "Only an integer value is allowed, value will not be saved",
                        regExp: "[0-9]*",
                        onChange: function () {
                            if (tb.isValid()) {
                                binding.setValue(this.get("value"));
                            } else {
                                binding.setValue("");
                            }
                        }
                    }, construct.create("div", null, fieldDiv));
                } else if (datatype === "http://www.w3.org/2001/XMLSchema#decimal") {
                    tb = new ValidationTextBox({
                        value: binding.getValue(),
                        disabled: !item.isEnabled(),
                        invalidMessage: "Only a decimal value is allowed, value will not be saved",
                        regExp: "[0-9]*.?[0-9]*",
                        onChange: function () {
                            if (tb.isValid()) {
                                binding.setValue(this.get("value"));
                            } else {
                                binding.setValue("");
                            }
                        }
                    }, construct.create("div", null, fieldDiv));
                } else {
                    tb = new TextBox({
                        value: binding.getValue(),
                        onChange: function () {
                            binding.setValue(this.get("value"));
                        }
                    }, construct.create("div", null, fieldDiv));
                    domClass.add(tb.domNode, "rformsFieldInput");
                }
            }
            else {
                var itemToUse = binding.getItem();
                //TODO: Sort out if the textarea should be multiline using style or class...
                if (itemToUse.getNodetype() === "ONLY_LITERAL" && itemToUse.getPattern() != null) {
                    tb = new ValidationTextBox({
                        value: binding.getValue(),
                        pattern: itemToUse.getPattern(),
                        invalidMessage: itemToUse.getDescription(),
                        onChange: function () {
                            binding.setValue(this.get("value"));
                        }
                    }, construct.create("div", null, fieldDiv));
                } else if (itemToUse.hasStyle("multiline")) {
                    tb = new Textarea({
                        value: binding.getValue(),
                        onChange: function () {
                            binding.setValue(this.get("value"));
                        }
                    }, construct.create("div", null, fieldDiv));
                    tb.resize(); // To size the area to the value.
                } else {
                    tb = new TextBox({
                        value: binding.getValue(),
                        onChange: function () {
                            binding.setValue(this.get("value"));
                        }
                    }, construct.create("div", null, fieldDiv));
                }
                domClass.add(tb.domNode, "rformsFieldInput");
            }

            //If the language can be set
            if (nodeType === "LANGUAGE_LITERAL" || nodeType === "PLAIN_LITERAL") {
                var langSpan = construct.create("span", null, controlDiv);
                var langList = this._getLanguagesList();
                var langStore = this._getStoreFromArray(langList, binding.getItem(), true);
                var languageSelector = new FilteringSelect({
                    store: langStore,
                    searchAttr: "label"
                }, langSpan);
                languageSelector.set("value", binding.getLanguage() || "");
                on(languageSelector, "change", lang.hitch(this, function () {
                    binding.setLanguage(languageSelector.getValue());
                }));
                domClass.add(langSpan, "rformsLanguage");
                domClass.add(fieldDiv, "rformsLangcontrolledfield");
                domClass.add(controlDiv, "rformsLangFieldControl");
            }
            if (noCardinalityButtons !== true) {
                this._addRemoveButton(fieldDiv, binding, controlDiv, function () {
                    tb.set("value", "");
                    if (nodeType === "LANGUAGE_LITERAL" || nodeType === "PLAIN_LITERAL") {
                        languageSelector.set("value", "");
                    }
                });
            }
        },
        addChoice: function (fieldDiv, binding, noCardinalityButtons) {
            if (binding.getItem().hasStyle("nonEditable")) {
                return this.inherited("addChoice", arguments);
            }

            var controlDiv = construct.create("div", {"class": "rformsFieldControl"}, fieldDiv);
            var item = binding.getItem();
            if (item.hasChoices()) {
                var choices = item.getChoices();
                //			var controlDiv = construct.create("div", null, fieldDiv);
                //			domClass.add(controlDiv, "rformsFieldControl");
                var divToUse = construct.create("div", null, fieldDiv);

                var hierarchy = item.getHierarchyProperty() || item.hasStyle("tree");
                //Check if radiobuttons can be created, i.e. when few choices and max-cardinality == 1
                if (!hierarchy && (!item.hasStyle("dropDown") && (choices.length < 5 || item.hasStyle("verticalRadioButtons") || item.hasStyle("horizontalRadioButtons"))) && item.getCardinality().max === 1) {
                    var buts = [];
                    for (var ind = 0; ind < choices.length; ind++) {
                        var inputToUse = construct.create("input", null, divToUse);
                        construct.create("span", { "class": "rformsChoiceLabel", innerHTML: item._getLocalizedValue(choices[ind].label).value }, divToUse);
                        if (item.hasStyle("verticalRadioButtons")) {
                            construct.create("br", null, divToUse);
                        }
                        var rb = new RadioButton({
                            name: "RadioButtonName" + uniqueRadioButtonNameNr,
                            value: choices[ind].value,
                            checked: choices[ind].value === binding.getValue()
                        }, inputToUse);
                        on(rb, "change", lang.hitch(this, function (but) {
                            var val = but.get("value");
                            if (val !== false) {
                                binding.setValue(val);
                            }
                        }, rb));
                        buts.push(rb);
                    }
                    uniqueRadioButtonNameNr++;

                    /*Code below is to correctly remove items in the form and their
                     * values
                     */
                    if (noCardinalityButtons !== true) {
                        this._addRemoveButton(fieldDiv, binding, controlDiv, function () {
                            array.forEach(buts, function (but) {
                                but.set("value", false);
                            });
                        });
                    }
                } else {
                    var fSelect, dialog;
                    //Create an ItemFileReadStore with the correct language to use
                    var store = this._createChoiceStore(item);
                    var spanToUse = construct.create("span", null, divToUse);
                    fSelect = new FilteringSelect({
                        store: store,
                        query: {selectable: true},
                        searchAttr: "label"
                    }, spanToUse);

                    //Sets the value if any
                    if (binding.getValue()) {
                        fSelect.set("value", binding.getValue());
                    } else {
                        fSelect.set("value", "");
                    }
                    //Callback when the user edits the value
                    fSelect.onChange = lang.hitch(this, function (newvalue) {
                        binding.setValue(newvalue);
                    });
                    //Check if a tree-hierarchy should be created
                    if (hierarchy) {
                        var oc;
                        var ddButton = construct.create("span", {"class": "action editSearch", "title": "Browse"}, divToUse);
                        on(ddButton, "click", lang.hitch(this, function () {
                            if (oc == null) {
                                oc = new TreeOntologyChooser({binding: binding, done: lang.hitch(this, function () {
                                    fSelect.set("value", binding.getValue());
                                })});
                            }
                            oc.show();
                        }));
                    }
                    //}

                    /*Code below is to correctly remove items in the form and their
                     * values
                     */
                    if (noCardinalityButtons !== true) {
                        this._addRemoveButton(fieldDiv, binding, controlDiv, function () {
                            fSelect && fSelect.set("value", "");
                        });
                    }
                }
            } else if (system.getChoice != null) {   //Depends on system.getChoice and system.openChoiceSelector methods being available
                var divToUse = construct.create("div", null, fieldDiv);
                var cNode = construct.create("div", {"class": "rformsChoiceValue"}, divToUse);
                var choice = binding.getChoice();//system.getChoice(item, binding.getValue());
                if (choice) {
                    attr.set(cNode, "innerHTML", utils.getLocalizedValue(choice.label).value || "");
                    if (choice.load != null) {
                        choice.load(function () {
                            attr.set(cNode, "innerHTML", utils.getLocalizedValue(choice.label).value || "");
                        });
                    }
                }

                var ddButton = construct.create("span", {"class": "action editSearch", "title": "Browse"}, divToUse);
                on(ddButton, "click", lang.hitch(this, function () {
                    system.openChoiceSelector(binding, function (choice) {
                        binding.setChoice(choice);
                        if (choice) {
                            attr.set(cNode, "innerHTML", utils.getLocalizedValue(choice.label).value || "&nbsp;");
                        }
                    });
                }));
                /*Code below is to correctly remove items in the form and their
                 * values
                 */
                if (noCardinalityButtons !== true) {
                    this._addRemoveButton(fieldDiv, binding, controlDiv, function () {
                        binding.setValue("");
                        cNode && attr.set(cNode, "innerHTML", "");
                    });
                }
            }
        },

        addTable: function (newRow, firstBinding) {
            if (firstBinding.getItem().hasStyle("nonEditable")) {
                return this.inherited("addGroup", arguments);
            }

            var item = firstBinding.getItem(), childItems = item.getChildren();
            var table = construct.create("table", null, newRow);
            domClass.add(table, "rformsGroup");

            tHead = construct.create("thead", null, table);
            tHeadRow = construct.create("tr", null, table);
            for (colInd = 0; colInd < childItems.length; colInd++) {
                var th = construct.create("th", null, tHeadRow);
                domClass.add(th, "rformsColumnHeader" + colInd);
                this.showInfo(item, construct.create("span", {innerHTML: childItems[colInd].getLabel()}, th));
            }
            if (!firstBinding.getItem().hasStyle("firstcolumnfixedtable")) {
                var addTh = construct.create("th", {"class": "rformsTableControl"}, tHeadRow);
                var parentBinding = firstBinding.getParent();

                var add = construct.create("span", {"class": "action editAdd", "title": "Add"}, addTh);
                var cardTr = firstBinding.getCardinalityTracker();
                on(add, "click", lang.hitch(this, function () {
                    if (!cardTr.isMax()) {
                        var nBinding = Engine.create(parentBinding, item);
                        this._addTableRow(table, nBinding);
                    }
                }));
                aspect.after(cardTr, "cardinalityChanged", function () {
                    domClass.toggle(add, "disabled", cardTr.isMax());
                });
            }
            return table;
        },
        fillTable: function (table, bindings) {
            if (bindings.length === 0) {
                return;
            }
            var item = bindings[0].getItem();
            if (item.hasStyle("nonEditable")) {
                return this.inherited("addGroup", arguments);
            }

            if (item.hasStyle("firstcolumnfixedtable")) {
                bindings = this._createChildBindingsForFirstFixedColumn(bindings);
            }

            array.forEach(bindings, lang.hitch(this, this._addTableRow, table));
        },
        //===================================================
        // Private methods
        //===================================================
        _createChildBindingsForFirstFixedColumn: function (bindings) {
            //Find choice column
            //flesh out bindings from choices
            //mark each fleshed out binding via .setExcludeFromTreeValidityCheck(true);
            var nb = [];
            var item = bindings[0].getItem();
            var firstColumnItem = item.getChildren()[0]; //Must be a choice.
            var choices = firstColumnItem.getChoices();
            //Sort the choices goddamit!
            choices = this._getCopiedLabeledChoices(choices, item);
            choices.sort(function (a, b) {
                //This assumes that there is always an "n" to be found (which is correct)
                if (a.label > b.label) {
                    return 1;
                } else if (a.label < b.label) {
                    return -1;
                } else {
                    return 0;
                }
            });


            //index the existing bindings
            var ebi = {};
            array.forEach(bindings, function (binding) {
                var igcb = binding.getItemGroupedChildBindings();
                if (igcb.length > 0 && igcb[0].length > 0) {
                    var rowXcol1 = igcb[0][0];
                    ebi[rowXcol1.getValue()] = binding;
                }
            });

            //Create one row for each choice
            var parentBinding = bindings[0].getParent();
            array.forEach(choices, function (choice) {
                if (ebi[choice.value] != null) {
                    nb.push(ebi[choice.value]);
                } else {
                    var newRowBinding = Engine.create(parentBinding, item);
                    var firstColumnBinding = Engine.create(newRowBinding, firstColumnItem);
                    firstColumnBinding.setExcludeFromTreeValidityCheck(true);
                    firstColumnBinding.setAncestorValid(false);
                    firstColumnBinding.setChoice(choice);
                    nb.push(newRowBinding);
                }
            });

            return nb;
        },
        _addCreateChildButton: function (rowDiv, labelDiv, binding) {
            var parentBinding = binding.getParent(), item = binding.getItem(), cardTr = binding.getCardinalityTracker();
            var add = construct.create("span", {"class": "action editAdd", "title": "add"}, labelDiv);
            on(add, "click", lang.hitch(this, function () {
                if (!cardTr.isMax()) {
                    var nBinding = Engine.create(parentBinding, item);
                    this.addRow(rowDiv, nBinding); //not the first binding...
                }
            }));
            var cardMaxCon = aspect.after(cardTr, "cardinalityChanged", function () {
                domClass.toggle(add, "disabled", cardTr.isMax());
            });
        },
        _addGroupButtons: function (rowDiv, labelDiv, binding) {
            var parentBinding = binding.getParent(), item = binding.getItem();
            var add = construct.create("span", {"class": "action editAdd", "title": "add"}, labelDiv);
            var remove = construct.create("span", {"class": "action editDelete", "title": "remove"}, labelDiv);

            var cardTr = binding.getCardinalityTracker();
            var con = aspect.after(cardTr, "cardinalityChanged", function () {
                domClass.toggle(add, "disabled", cardTr.isMax());
                domClass.toggle(remove, "disabled", cardTr.isMin());
            });

            var addCon = on(add, "click", lang.hitch(this, function () {
                if (!cardTr.isMax()) {
                    var nBinding = Engine.create(parentBinding, item);
                    this.addRow(rowDiv, nBinding); //not the first binding...
                }
            }));

            var removeCon = on(remove, "click", lang.hitch(this, function () {
                if (!cardTr.isMin()) {
                    if (cardTr.getCardinality() === 1) {
                        var parentBinding = binding.getParent(), item = binding.getItem();
                        con.remove();
                        addCon.remove();
                        removeCon.remove();
                        binding.remove();
                        var card = item.getCardinality();
                        if (card.pref > 0 || card.min > 0) {
                            var nBinding = Engine.create(parentBinding, item);
                            this.addRow(rowDiv, nBinding); //not the first binding...
                        } else {
                            this.addLabelClean(rowDiv, null, item);
                        }
                        construct.destroy(rowDiv);
                    } else {
                        con.remove();
                        addCon.remove();
                        removeCon.remove();
                        //Remove somehow.
                        binding.remove();
                        construct.destroy(rowDiv);
                    }
                }
            }));
        },
        _addRemoveButton: function (fieldDiv, binding, containerDiv, onReset) {
            var remove = construct.create("span", {"class": "action editDelete", "title": "remove"}, containerDiv);
            var cardTr = binding.getCardinalityTracker();
            var con = aspect.after(cardTr, "cardinalityChanged", function () {
                domClass.toggle(remove, "disabled", cardTr.isMin());
            });

            var removeConnect = on(remove, "click", function () {
                if (!cardTr.isMin()) {
                    if (cardTr.getCardinality() === 1) {
                        if (binding.getItem() instanceof Choice) {
                            binding.setChoice(null);
                        } else {
                            binding.setValue(null);
                        }
                        onReset();
                    } else {
                        con.remove();
                        removeConnect.remove();
                        binding.remove();
                        construct.destroy(fieldDiv);
                    }
                }
            });
        },

        _addExpandButton: function (rowDiv, labelDiv, item) {
            var expand = construct.create("span", {"class": "action editExpand", "title": "Expand"}, labelDiv);
            var expandCon = on(expand, "click", lang.hitch(this, function () {
                var nBinding = Engine.create(this.binding, item);
                if (this.showAsTable(item)) {
                    var table = this.addTable(rowDiv, nBinding, item);
                    this.fillTable(table, [nBinding]);
                } else {
                    this.addRow(rowDiv, nBinding, false); //Label is already added.
                    this._addGroupButtons(rowDiv, labelDiv, nBinding);
                }

                construct.destroy(expand);

                expandCon.remove();
            }));
        },

        _addTableRow: function (table, binding) {
            var childItems = binding.getItem().getChildren();
            var groupedBindings = binding.getItemGroupedChildBindings();
            var trEl = construct.create("tr", null, table);

            array.forEach(groupedBindings, function (bindings, index) {
                //Create those columns that are missing:
                if (bindings.length === 0 && !childItems[index].hasStyle("nonEditable")) {
                    Engine.create(binding, childItems[index]);
                }
            });
            array.forEach(groupedBindings, function (bindings, index) {
                this.addComponent(construct.create("td", null, trEl), bindings[0], true);
            }, this);

            if (!binding.getItem().hasStyle("firstcolumnfixedtable")) {
                var lastTd = construct.create("td", {"class": "rformsTableControl"}, trEl);
                var remove = construct.create("span", {"class": "action editDelete", "title": "Remove"}, lastTd);
                var cardTr = binding.getCardinalityTracker();
                var cardConnect1 = aspect.after(cardTr, "cardinalityChanged", function () {
                    domClass.toggle(remove, "disabled", cardTr.isMin());
                });
                var removeConnect = on(remove, "click", lang.hitch(this, function () {
                    if (!cardTr.isMin()) {
                        if (cardTr.getCardinality() === 1) {
                            var parentBinding = binding.getParent(), item = binding.getItem();
                            var nBinding = Engine.create(parentBinding, item);
                            this._addTableRow(table, nBinding);
                        }
                        cardConnect1.remove();
                        removeConnect.remove();
                        binding.remove();
                        construct.destroy(trEl);
                    }
                }));
            }
        },

        _getLabelForChoice: function (binding) {
            var choice = binding.getChoice();
            if (choice) {
                return utils.getLocalizedValue(choice.label).value;
            }
        },
        /*
         * From a Choice Item the possible values are extracted and added into
         * a ItemFileReadStore that is returned
         */
        _createChoiceStore: function (/*Choice*/ item) {
            return this._getStoreFromArray(item.getChoices(), item);
        },
        /*
         * From an array of choices that contains value and labels an
         * DataStore is created and returned. The object inside
         * the array should have the following structure:
         *  {"value": "Value",
         *  "label": {"en": "English-label", "sv": "Svensk label"}
         * }
         */
        _getStoreFromArray: function (/*Array of objects*/objects, /*The item*/ item, noEmptyValue) {

            //Adds an empty choice when min cardinality > 0
            var itemsArray = this._getCopiedLabeledChoices(objects, item);
            if (noEmptyValue !== true && !(item.getCardinality().min > 0)) {
                itemsArray.push({value: "", label: "", top: true});
            }

            var store = new Memory({
                data: itemsArray,
                idProperty: "value",
                fetchProperties: {sort: [{attribute: "label", descending: true}]}
            });
            /*var store = new SortedStore({
                sortBy: "label",
                idProperty: "value",
                data: {
                    identifier: "value",
                    label: "label",
                    items: itemsArray
                }
            });*/
            return store;
        },
        _getCopiedLabeledChoices: function (objects, item) {
            var itemsArray = [];
            for (var i = 0; i < objects.length; i++) {
                var o = objects[i];
                var currentLabel = item._getLocalizedValue(o.label);
                var obj = {value: o.value, label: currentLabel.value || o.value || ""};
                if (o.top === true) {
                    obj.top = true;
                }
                if (o.children != null) {
                    obj.children = lang.clone(o.children);
                }
                if (o.selectable === false) {
                    obj.selectable = false;
                } else {
                    obj.selectable = true;
                }
                itemsArray.push(obj);
            }
            return itemsArray;
        },
        /*
         *
         * This method returns a list of language-codes and their label (in several translations)
         * An example for English looks like this:
         * {"value": "en",
         *  "label": {"en": "English", "sv": "Engelska"}
         * }
         *
         * @return {Array} of languages.
         */
        _getLanguagesList: function () { //TODO: Take this list from some kind of configuration
            if (this.languages == null) {
                this.languages = [
                    {"value": "", label: {"en": "", "sv": ""}},
                    {"value": "en", label: {"en": "English", "sv": "Engelska"}},
                    {"value": "de", label: {"en": "German", "sv": "Tyska"}},
                    {"value": "sv", label: {"en": "Swedish", "sv": "Svenska"}}
                ];
            }
            return this.languages;
        }
    });
    return Editor;
});