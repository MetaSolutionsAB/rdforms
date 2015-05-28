define([
    "rdforms/view/renderingContext",
    "rdforms/model/system",
    "rdforms/utils",
    "rdforms/view/bootstrap/RadioButtonsEditor",
    "jquery"
], function(renderingContext, system, utils, RadioButtonsEditor, jquery) {

    // -------------- Presenters ----------------
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

    // Presenter for image.
    presenters.itemtype("choice").style("image").register(choicify(
        function(fieldDiv, binding, choice, desc) {
            jquery('<img class="rdformsImage">')
                .attr("src", choice.value)
                .attr("title", desc || choice.value)
                .appendTo(fieldDiv);
        }));

    // Presenter for stars
    presenters.itemtype("choice").style("stars").register(choicify(
        function(fieldDiv, binding, choice, desc) {
            if (!isNaN(parseInt(choice.value))) {
                jquery('<span class="rdformsStar">').appendTo(fieldDiv);
            }
        }));

    // Presenter for choices.
    presenters.itemtype("choice").register(choicify(
        function(fieldDiv, binding, choice, desc) {
            var item = binding.getItem();
            if (item.hasStaticChoices() && !item.hasStyle("externalLink")) {
                jquery('<div>')
                    .html(utils.getLocalizedValue(choice.label).value)
                    .appendTo(fieldDiv);
            } else {
                var $a = jquery('<a class="rdformsUrl">')
                    .attr("href", choice.seeAlso || choice.value)
                    .attr("title", desc || choice.seeAlso || choice.value)
                    .html(utils.getLocalizedValue(choice.label).value)
                    .appendTo(fieldDiv);
                if (item.hasStyle("externalLink")) {
                    system.attachExternalLinkBehaviour($a[0], binding);
                } else {
                    system.attachLinkBehaviour($a[0], binding);
                }
                if (choice.load != null) {
                    choice.load(function () {
                        $a.html(utils.getLocalizedValue(choice.label).value);
                    });
                }
            }
        }));

    // -------------- Editors ----------------
    var editors = renderingContext.editorRegistry;

    var radioCheck = function(item) {
        var choices = item.getChoices(),
            hierarchy = item.getHierarchyProperty() || item.hasStyle("tree");
        return !hierarchy && item.getCardinality().max === 1
            && (!item.hasStyle("dropDown")
            && ((choices != null && choices.length < 5) || item.hasStyle("verticalRadioButtons")
            || item.hasStyle("horizontalRadioButtons")));
        return false;
    };
    editors.itemtype("choice").choices().check(radioCheck).register(function (fieldDiv, binding, context) {
        new RadioButtonsEditor({binding: binding}, fieldDiv);
    });

    editors.itemtype("choice").choices().register(function (fieldDiv, binding, context) {
        var item = binding.getItem(),
            choices = item.getChoices(),
            $select = jquery('<select>').appendTo(fieldDiv).append("<option></option>");

        for (var i=0;i<choices.length;i++) {
            var choice = choices[i];
            jquery('<option>')
                .val(choice.value)
                .text(item._getLocalizedValue(choice.label).value)
                .appendTo($select);
        }

        //new Select2($select, {placeholder: ""});
        $select.select2({
            placeholder: ""
        });

        //Sets the value if any
        if (binding.getValue()) {
            if (binding.getChoice().mismatch) {
                //fSelect.set("displayedValue", binding.getValue());
            }
            $select.val(binding.getValue()).trigger("change");
        }

        $select.change(function () {
            binding.setValue($select.val());
        });

        context.clear = function() {
            $select.val(null).trigger("change");
        };

        //TODO support for TreeOntologyChooser
        //Check if a tree-hierarchy should be created
      /*  var hierarchy = item.getHierarchyProperty() || item.hasStyle("tree");
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
        }*/
    });

    //Depends on system.getChoice and system.openChoiceSelector methods being available
    editors.itemtype("choice").choices("none").register(function (fieldDiv, binding, context) {
        var $divToUse = jquery('<div class="input-group systemChoice">').appendTo(fieldDiv);
        var $input = jquery('<input class="form-control" disabled="disabled">').appendTo($divToUse);
        var $wrap = jquery('<span class="input-group-btn">').appendTo($divToUse);
        var $search = jquery('<button class="btn btn-default" type="button">')
            .attr("title", context.view.messages.edit_browse)
            .appendTo($wrap);
        jquery('<span class="glyphicon glyphicon-search" aria-hidden="true">').appendTo($search);

        var setChoice = function(choice) {
            if (choice) {
                $input.val(utils.getLocalizedValue(choice.label).value || "")
                    .toggleClass("mismatch", choice.mismatch === true);
                if (choice.load != null) {
                    choice.load(function () {
                        $input.val(utils.getLocalizedValue(choice.label).value || "")
                            .toggleClass("mismatch", choice.mismatch === true);
                    });
                }
            }
            if (binding.getChoice() !== choice) {
                binding.setChoice(choice);
            }
        };
        $search.click(function() {
            renderingContext.openChoiceSelector(binding, setChoice);
        });
        setChoice(binding.getChoice());
        if (system.hasDnDSupport(binding)) {
            system.addDnD(binding, cNode, setChoice);
        }
        context.clear = function() {
            $input.val("");
        };
    });
});