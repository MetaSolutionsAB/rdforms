define([
    "dojo/_base/lang",
    "rdforms/view/renderingContext",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/store/Memory",
    "rdforms/model/system",
    "rdforms/utils",
    "./TreeOntologyChooser",
    "dijit/form/RadioButton",
    "dijit/form/FilteringSelect"
], function(lang, renderingContext, on, domClass, domConstruct, domAttr, Memory, system, utils,
            TreeOntologyChooser, RadioButton, FilteringSelect) {
    var editors = renderingContext.editorRegistry;
    var presenters = renderingContext.presenterRegistry;

    var choicify = function(func) {
        return function(fieldDiv, binding) {
            var choice = binding.getChoice(), desc;
            if (!choice) {
                return;
            }
            if (choice.description) {
                desc = utils.getLocalizedValue(choice.description).value;
            }

            func(fieldDiv, binding, choice, desc);
        }
    };

    presenters.itemtype("choice").style("image").register(choicify(
        function(fieldDiv, binding, choice, desc) {
            domConstruct.create("img", {
                "class": "rdformsImage",
                "src": choice.value,
                "title": desc || choice.value
            }, fieldDiv);
        }));

    presenters.itemtype("choice").style("stars").register(choicify(
        function(fieldDiv, binding, choice, desc) {
            if (!isNaN(parseInt(choice.value))) {
                domConstruct.create("span", {"class": "rdformsStar"}, fieldDiv);
            }
        }));

    presenters.itemtype("choice").register(choicify(
        function(fieldDiv, binding, choice, desc) {
            var item = binding.getItem();
            if (item.hasStaticChoices() && !item.hasStyle("externalLink")) {
                domConstruct.create("div", {
                    "innerHTML": utils.getLocalizedValue(choice.label).value}, fieldDiv);
            } else {
                var a = domConstruct.create("a", {"class": "rdformsUrl",
                    "href": choice.seeAlso || choice.value,
                    "title": desc || choice.seeAlso || choice.value,
                    "innerHTML": utils.getLocalizedValue(choice.label).value}, fieldDiv);
                if (item.hasStyle("externalLink")) {
                    system.attachExternalLinkBehaviour(a, binding);
                } else {
                    system.attachLinkBehaviour(a, binding);
                }
                if (choice.load != null) {
                    choice.load(function () {
                        domAttr.set(a, "innerHTML", utils.getLocalizedValue(choice.label).value);
                    });
                }
            }
        }));

    var radioCheck = function(item) {
        var choices = item.getChoices(),
            hierarchy = item.getHierarchyProperty() || item.hasStyle("tree");
        return !hierarchy && item.getCardinality().max === 1
            && (!item.hasStyle("dropDown")
            && ((choices != null && choices.length < 5) || item.hasStyle("verticalRadioButtons")
            || item.hasStyle("horizontalRadioButtons")));
    };

    var uniqueRadioButtonNameNr = 0;
    editors.itemtype("choice").choices().check(radioCheck).register(function (fieldDiv, binding, context) {
        var item = binding.getItem(),
            choices = item.getChoices(),
            divToUse = domConstruct.create("div", null, fieldDiv);
        if (binding.getChoice() != null && binding.getChoice().mismatch) {
            choices = choices.slice(0);
            choices.push(binding.getChoice());
        }
        for (var ind = 0; ind < choices.length; ind++) {
            var c = choices[ind], inputToUse = domConstruct.create("input", null, divToUse);
            var sp = domConstruct.create("span", {
                "class": "rdformsChoiceLabel",
                innerHTML: item._getLocalizedValue(c.label).value }, divToUse);
            if (item.hasStyle("verticalRadioButtons")) {
                domConstruct.create("br", null, divToUse);
            }
            var rb = new RadioButton({
                name: "RadioButtonName" + uniqueRadioButtonNameNr,
                value: c.value,
                checked: c.value === binding.getValue()
            }, inputToUse);
            if (c.mismatch) {
                domClass.add(sp, "mismatch");
                rb.set("disabled", true);
            } else {
                on(rb, "change", lang.hitch(this, function (but) {
                    var val = but.get("value");
                    if (val !== false) {
                        binding.setValue(val);
                    }
                }, rb));
            }
        }
        uniqueRadioButtonNameNr++;
    });

    editors.itemtype("choice").choices().register(function (fieldDiv, binding, context) {
        var item = binding.getItem(),
            divToUse = domConstruct.create("div", null, fieldDiv),
            spanToUse = domConstruct.create("span", null, divToUse),
            itemsArray = utils.cloneArrayWithLabels(item.getChoices());

        if (!(item.getCardinality().min > 0)) {
            itemsArray.push({value: "", label: "", top: true});
        }
        var store = new Memory({
            data: itemsArray,
            idProperty: "value",
            fetchProperties: {sort: [{attribute: "label", descending: true}]}
        });

        var fSelect = new FilteringSelect({ //Create an ItemFileReadStore with the correct language to use
            store: store,
            query: {selectable: true},
            searchAttr: "label",
            onChange: function (newvalue) {
                binding.setValue(newvalue);
            }
        }, spanToUse);

        //Sets the value if any
        if (binding.getValue()) {
            if (binding.getChoice().mismatch) {
                fSelect.set("displayedValue", binding.getValue());
            } else {
                fSelect.set("value", binding.getValue());
            }
        } else {
            fSelect.set("value", "");
        }

        //Check if a tree-hierarchy should be created
        var hierarchy = item.getHierarchyProperty() || item.hasStyle("tree");
        if (hierarchy) {
            var oc;
            var ddButton = domConstruct.create("span", {"class": "action editSearch", "title": this.messages.edit_browse}, divToUse);
            on(ddButton, "click", lang.hitch(this, function () {
                if (oc == null) {
                    oc = new TreeOntologyChooser({binding: binding, done: lang.hitch(this, function () {
                        fSelect.set("value", binding.getValue());
                    })});
                }
                oc.show();
            }));
        }
    });

    //Depends on system.getChoice and system.openChoiceSelector methods being available
    editors.itemtype("choice").register(function (fieldDiv, binding, context) {
        var divToUse = domConstruct.create("div", null, fieldDiv);
        var cNode = domConstruct.create("div", {"class": "rdformsChoiceValue"}, divToUse);
        var setChoice = function(choice) {
            if (choice) {
                domAttr.set(cNode, "innerHTML", utils.getLocalizedValue(choice.label).value || "");
                if (choice.mismatch) {
                    domClass.add(cNode, "mismatch");
                } else {
                    domClass.remove(cNode, "mismatch");
                }
                if (choice.load != null) {
                    choice.load(function () {
                        domAttr.set(cNode, "innerHTML", utils.getLocalizedValue(choice.label).value || "");
                        if (choice.mismatch) {
                            domClass.add(cNode, "mismatch");
                        } else {
                            domClass.remove(cNode, "mismatch");
                        }
                    });
                }
            }
            if (binding.getChoice() !== choice) {
                binding.setChoice(choice);
            }
        };
        setChoice(binding.getChoice());
        if (system.hasDnDSupport(binding)) {
            system.addDnD(binding, cNode, setChoice);
        }

        var ddButton = domConstruct.create("span", {"class": "action editSearch", "title": context.view.messages.edit_browse}, divToUse);
        on(ddButton, "click", lang.hitch(this, function () {
            renderingContext.openChoiceSelector(binding, setChoice);
        }));
    });
});