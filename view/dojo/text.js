define([
    "rdforms/view/renderingContext",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/store/Memory",
    "rdforms/model/system",
    "rdforms/utils",
    "rdforms/view/dojo/DateTime",
    "rdforms/view/dojo/Duration",
    "dijit/form/TextBox",
    "dijit/form/ValidationTextBox",
    "dijit/form/Textarea",
    "dijit/form/FilteringSelect"
], function(renderingContext, on, domClass, domConstruct, Memory, system, utils,
            DateTime, Duration, TextBox, ValidationTextBox, Textarea, FilteringSelect) {
    var editors = renderingContext.editorRegistry;
    var presenters = renderingContext.presenterRegistry;

    var presenterTextURI = function(fieldDiv, binding, context) {
        var a, vmap = utils.getLocalizedMap(binding);
        if (vmap) {
            a = domConstruct.create("a", {
                "class": "rdformsUrl", title: binding.getValue(),
                href: binding.getValue(), innerHTML: utils.getLocalizedValue(vmap).value
            }, fieldDiv);
        } else {
            a = domConstruct.create("a", {
                "class": "rdformsUrl",
                href: binding.getValue(), innerHTML: binding.getGist()
            }, fieldDiv);
        }
        if (binding.getItem().hasStyle("externalLink")) {
            system.attachExternalLinkBehaviour(a, binding);
        } else {
            system.attachLinkBehaviour(a, binding);
        }
    };

    presenters.itemtype("text").nodetype("URI").register(presenterTextURI);
    editors.itemtype("text").nodetype("URI").style("nonEditable").register(presenterTextURI);
    presenters.itemtype("text").nodetype("URI").style("image").register(function(fieldDiv, binding, context) {
        domConstruct.create("img", {"class": "rdformsImage", "src": binding.getGist()}, fieldDiv);
    });

    var presenterText = function(fieldDiv, binding, context) {
        if (context.view.showLanguage && binding.getLanguage()) {
            var lang = domConstruct.create("div", {"innerHTML": binding.getLanguage()}, fieldDiv);
            domClass.add(lang, "rdformsLanguage");
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
            a = domConstruct.create("a", {
                "class": "rdformsUrl",
                href: parentBinding.getStatement().getValue(), innerHTML: text
            }, fieldDiv);
            system.attachLinkBehaviour(a, parentBinding);
        } else {
            domConstruct.create("div", {"innerHTML": text}, fieldDiv);
        }
    };
    presenters.itemtype("text").register(presenterText);
    editors.itemtype("text").style("nonEditable").register(presenterText);

    //====START Editors for Datatypes=======

    //Any datatype, possibly with a pattern. Explicitly registered datatypes will have higher priority.
    editors.itemtype("text").nodetype("DATATYPE_LITERAL").register(function(fieldDiv, binding, context) {
        var tb, item = binding.getItem();
        if (item.getPattern() != null) {
            tb = new ValidationTextBox({
                value: binding.getGist(),
                pattern: item.getPattern(),
                invalidMessage: item.getDescription(),
                onChange: function () {
                    if (this.isValid()) {
                        binding.setGist(this.get("value"));
                    }
                }
            }, domConstruct.create("div", null, fieldDiv));
        } else {
            tb = new TextBox({
                value: binding.getGist(),
                onChange: function () {
                    binding.setGist(this.get("value"));
                }
            }, domConstruct.create("div", null, fieldDiv));
        }
        domClass.add(tb.domNode, "rdformsFieldInput");
    });

    var dateEditor = function(fieldDiv, binding, context) {
        var tb = new DateTime({
            messages: context.view.messages,
            binding: binding,
            item: binding.getItem()
        }, domConstruct.create("div", null, fieldDiv));
        domClass.add(tb.domNode, "rdformsFieldInput");
    };
    editors.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#date").register(dateEditor);
    editors.itemtype("text").datatype("http://purl.org/dc/terms/W3CDTF").register(dateEditor);

    editors.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#duration").register(function(fieldDiv, binding) {
        var tb = new Duration({
            disabled: !binding.getItem().isEnabled(),
            binding: binding
        }, domConstruct.create("div", null, fieldDiv));
        domClass.add(tb.domNode, "rdformsFieldInput");
    });

    presenters.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#duration").register(function(fieldDiv, binding) {
        var tb = new DurationPresentation({
            value: binding.getValue()
        }, domConstruct.create("div", null, fieldDiv));
    });

    editors.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#integer").register(function(fieldDiv, binding) {
        var tb = new ValidationTextBox({
            value: binding.getValue(),
            disabled: !binding.getItem().isEnabled(),
            invalidMessage: "Only an integer value is allowed, value will not be saved",
            regExp: "[0-9]*",
            onChange: function () {
                if (tb.isValid()) {
                    binding.setValue(this.get("value"));
                }
            }
        }, domConstruct.create("div", null, fieldDiv));
        domClass.add(tb.domNode, "rdformsFieldInput");
    });

    editors.itemtype("text").datatype("http://www.w3.org/2001/XMLSchema#decimal").register(function(fieldDiv, binding) {
        var tb = new ValidationTextBox({
            value: binding.getValue(),
            disabled: !binding.getItem().isEnabled(),
            invalidMessage: "Only a decimal value is allowed, value will not be saved",
            regExp: "[0-9]*.?[0-9]*",
            onChange: function () {
                if (tb.isValid()) {
                    binding.setValue(this.get("value"));
                }
            }
        }, domConstruct.create("div", null, fieldDiv));
        domClass.add(tb.domNode, "rdformsFieldInput");
    });

    //====END Editors for Datatypes=======

    //Editor for text, possibly multiline and possibly with a pattern.
    editors.itemtype("text").register(function(fieldDiv, binding, context) {
        var item = binding.getItem(), tb;
        if (item.hasStyle("multiline")) {
            tb = new Textarea({
                value: binding.getGist(),
                onChange: function () {
                    binding.setGist(this.get("value"));
                }
            }, domConstruct.create("div", null, fieldDiv));
            tb.resize(); // To size the area to the value.
        } else if (item.getPattern() != null) {
            tb = new ValidationTextBox({
                value: binding.getGist(),
                pattern: item.getPattern(),
                invalidMessage: item.getDescription(),
                onChange: function () {
                    if (this.isValid()) {
                        binding.setGist(this.get("value"));
                    }
                }
            }, domConstruct.create("div", null, fieldDiv));
        } else {
            tb = new TextBox({
                value: binding.getGist(),
                onChange: function () {
                    binding.setGist(this.get("value"));
                }
            }, domConstruct.create("div", null, fieldDiv));
        }
        domClass.add(tb.domNode, "rdformsFieldInput");

        //If the language can be set
        var nodeType = item.getNodetype();
        if (nodeType === "LANGUAGE_LITERAL" || nodeType === "PLAIN_LITERAL") {
            var langSpan = domConstruct.create("span", null, context.controlDiv);
            var langList = renderingContext.getLanguageList();
            var langStore = new Memory({
                data: utils.cloneArrayWithLabels(langList),
                idProperty: "value",
                fetchProperties: {sort: [{attribute: "label", descending: true}]}
            });
            var languageSelector = new FilteringSelect({
                store: langStore,
                searchAttr: "label"
            }, langSpan);
            languageSelector.set("value", binding.getLanguage() || "");
            on(languageSelector, "change", function () {
                binding.setLanguage(languageSelector.getValue());
            });
            domClass.add(langSpan, "rdformsLanguage");
            domClass.add(fieldDiv, "rdformsLangcontrolledfield");
            domClass.add(context.controlDiv, "rdformsLangFieldControl");
        }
    });
});