define([
    "rdforms/view/renderingContext",
    "rdforms/utils",
    "dojo/_base/array",
    "rdforms/model/system",
    "rdforms/view/bootstrap/DurationEditor",
    "rdforms/view/bootstrap/DurationPresenter",
    "jquery"
], function(renderingContext, utils, array, system, DurationEditor, DurationPresenter, jquery) {

    // -------------- Presenters ----------------
    var presenters = renderingContext.presenterRegistry;

    // Presenter for URIs.
    presenters.itemtype("text").nodetype("URI").register(function(fieldDiv, binding, context) {
        var vmap = utils.getLocalizedMap(binding),
            $a = jquery('<a class="rdformsUrl">')
                .attr("title", binding.getValue())
                .attr("href", binding.getValue())
                .appendTo(fieldDiv);
        if (vmap) {
            $a.text(utils.getLocalizedValue(vmap).value);
        } else {
            $a.text(binding.getGist());
        }
        if (binding.getItem().hasStyle("externalLink")) {
            system.attachExternalLinkBehaviour($a[0], binding);
        } else {
            system.attachLinkBehaviour($a[0], binding);
        }
    });

    // Presenter for images.
    presenters.itemtype("text").nodetype("URI").style("image").register(function(fieldDiv, binding, context) {
        jquery('<img class="rdformsImage">').attr("src", binding.getGist()).appendTo(fieldDiv);
    });

    // Presenter for text.
    presenters.itemtype("text").register(function(fieldDiv, binding, context) {
        if (context.view.showLanguage && binding.getLanguage()) {
            var lang = jquery('<div class="rdformsLanguage">').text(binding.getLanguage()).appendTo(fieldDiv);
        }
        var text = binding.getGist().replace("<", "&lt;").replace(">", "&gt;").replace(/(\r\n|\r|\n)/g, "<br/>");

        // The text is shown as a link to the parents bindings URI if:
        // 1) The current item is indicated to be a label.
        // 2) The presenter is not at topLevel.
        // 3) The current item is first in the parents list of children.
        // 4) The parent binding corresponds to a URI.
        var parentBinding = binding.getParent();
        if (binding.getItem().hasStyle("label")
            && this.topLevel !== true
            && parentBinding != null && parentBinding.getItem().getChildren()[0] === binding.getItem()
            && parentBinding.getStatement() != null && parentBinding.getStatement().getType() === "uri") {
            var $a = jquery('<a class="rdformsUrl">')
                .attr("href", parentBinding.getStatement().getValue())
                .html(text)
                .appendTo(fieldDiv);
            system.attachLinkBehaviour($a[0], parentBinding);
        } else {
            jquery('<div>').html(text).appendTo(fieldDiv);
        }
    });

    // Presenter for duration
    presenters.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#duration").register(function(fieldDiv, binding) {
        var tb = new DurationPresenter({
            value: binding.getValue()
        }, jquery("<div>").appendTo(fieldDiv)[0]);
    });


    // -------------- Editors ----------------
    var editors = renderingContext.editorRegistry;

    // Editor for duration
    editors.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#duration").register(function(fieldDiv, binding) {
        var tb = new DurationEditor({
            disabled: !binding.getItem().isEnabled(),
            value: binding.getValue(),
            onChange: function(value) {
                binding.setValue(value);
            }
        }, jquery("<div>").appendTo(fieldDiv)[0]);
        context.clear = function() {
            tb.set("value", "");
        }
    });

    // Editor for integers
    var intPattern = "^\d+$";
    var intRegex = new RegExp(intPattern);
    editors.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#integer")
        .register(function(fieldDiv, binding) {
            var $input = jquery('<input type="text" class="form-control rdformsFieldInput">');
            $input.val(binding.getGist())
                .attr("pattern", intPattern)
                .appendTo(fieldDiv)
                .change(function() {
                    var val = $input.val();
                    if (intRegex.test(val)) {
                        binding.setGist($input.val());
                    }
                });
            if (!binding.getItem.isEnabled()) {
                $input.prop("disabled", true);
            }
        });

    // Editor for decimals
    var decPattern = "^(\d+\.?\d{0,9}|\.\d{1,9})$";
    var decRegex = new RegExp(decPattern);
    editors.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#decimal").register(function(fieldDiv, binding) {
        var $input = jquery('<input type="text" class="form-control rdformsFieldInput">');
        $input.val(binding.getGist())
            .attr("pattern", decPattern)
            .appendTo(fieldDiv)
            .change(function() {
                var val = $input.val();
                if (decRegex.test(val)) {
                    binding.setGist($input.val());
                }
            });
        if (!binding.getItem().isEnabled()) {
            $input.prop("disabled", true);
        }
    });

    //Editor for text, possibly multiline, possibly with a pattern
    // (supports non-specific datatypes as well).
    editors.itemtype("text").register(function(fieldDiv, binding, context) {
        var item = binding.getItem(), $input;
        if (item.hasStyle("multiline")) {
            $input = jquery('<textarea class="form-control rdformsFieldInput">');
        } else {
            $input = jquery('<input type="text" class="form-control rdformsFieldInput">');
        }
        $input.val(binding.getGist())
            .appendTo(fieldDiv)
            .change(function() {
                binding.setGist($input.val());
            });

        if (item.getPattern() != null) {
            $input.attr("pattern", item.getPattern());
        }

        //If language control should be present
        var nodeType = item.getNodetype();
        if (nodeType === "LANGUAGE_LITERAL" || nodeType === "PLAIN_LITERAL") {
            jquery(fieldDiv).addClass("rdformsLangcontrolledfield");
            jquery(context.controlDiv).addClass("rdformsLangFieldControl");
            var $lselect = jquery('<select class="form-control rdformsLanguage">')
                .appendTo(context.controlDiv);
            var langList = renderingContext.getLanguageList();
            langList = utils.cloneArrayWithLabels(langList);
            array.forEach(langList, function(lang) {
                jquery("<option>").html(lang.label).val(lang.value).appendTo($lselect);
            });
            $lselect.val(binding.getLanguage()).change(function(ev) {
                binding.setLanguage($lselect.val());
            });
            context.clear = function() {
                $lselect.val("");
                $input.val("");
            };
        } else {
            context.clear = function() {
                $input.val("");
            };
        }
    });
});