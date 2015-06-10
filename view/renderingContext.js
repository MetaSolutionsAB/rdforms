define([
    "rdforms/view/Registry",
    "rdforms/model/system",
    "di18n/i18n"
], function(Registry, system, i18n) {

    system.getChoice = function(item, value) {
        var chooser = rc.chooserRegistry.getComponent(item);
        if (chooser == null) {
            throw("Error, no chooser available to retrieve a choice for item: "+item.getId());
        }
        return chooser.getChoice(item, value);
    };
    var messages, languages, defaultLanguages = [
        {"value": "", label: {"en": ""}},
        {"value": "bg", label: {"en": "Bulgarian", "bg": "български"}},
        {"value": "es", label: {"en": "Spanish", "es": "Español"}},
        {"value": "cs", label: {"en": "Czech", "cs": "čeština"}},
        {"value": "da", label: {"en": "Danish", "da": "Dansk"}},
        {"value": "de", label: {"en": "German", "de": "Deutsch"}},
        {"value": "et", label: {"en": "Estonian", "et": "Eesti keel"}},
        {"value": "el", label: {"en": "Greek", "el": "ελληνικά"}},
        {"value": "en", label: {"en": "English"}},
        {"value": "fr", label: {"en": "French", "fr": "Français"}},
        {"value": "ga", label: {"en": "Irish", "ga": "Gaeilge"}},
        {"value": "hr", label: {"en": "Croatian", "hr": "Hrvatski"}},
        {"value": "it", label: {"en": "Italian", "it": "Italiano"}},
        {"value": "lv", label: {"en": "Latvian", "lv": "Latviešu valoda"}},
        {"value": "lt", label: {"en": "Lithuanian", "lt": "Lietuvių kalba"}},
        {"value": "hu", label: {"en": "Hungarian", "hu": "Magyar"}},
        {"value": "mt", label: {"en": "Maltese", "mt": "Malti"}},
        {"value": "nl", label: {"en": "Dutch", "nl": "Nederlands"}},
        {"value": "pl", label: {"en": "Polish", "pl": "Polski"}},
        {"value": "pt", label: {"en": "Portuguese", "pt": "Português"}},
        {"value": "ro", label: {"en": "Romanian", "ro": "Română"}},
        {"value": "sk", label: {"en": "Slovak", "sk": "Slovenčina"}},
        {"value": "sl", label: {"en": "Slovenian", "sl": "Slovenščina"}},
        {"value": "fi", label: {"en": "Finnish", "fi": "Suomi"}},
        {"value": "sv", label: {"en": "Swedish", "sv": "Svenska"}}
    ];

    var rc = {
        domQuery: function(selector, node) {},
        domCreate: function(domStr, node) {},
        domCreateAfter: function(domStr, node) {},
        domClassToggle: function(node, classStr, addOrRemove) {},
        domSetAttr: function(node, attr, value) {},
        domText: function(node, text) {},
        presenterRegistry: new Registry(),
        editorRegistry: new Registry(),
        /**
         * Provides a registry of choosers. Each chooser have with the following attributes:
         * getChoice - function(item, value) -> choice
         *  (i.e. a function that takes the arguments item and value and returns a choice.
         *   If the choice cannot be provided in full directly it is possible to include a
         *   load method in the object with a onSuccess and onError methods as parameters.)
         * show - function(binding, onSelect)
         *   (I.e. a function that given a binding launches the chooser dialog, when the user is finished
         *   and has made his selection the onSelect method will be called with the selected choice.)
         */
        chooserRegistry: new Registry(),
        renderPresenter: function (node, binding, context) {
            var renderer = rc.presenterRegistry.getComponent(binding.getItem());
            if (renderer) {
                rc.prePresenterRenderer(node, binding, context);
                renderer(node, binding, context);
                rc.postPresenterRenderer(node, binding, context);
            }
        },
        renderEditor: function (node, binding, context) {
            var renderer = rc.editorRegistry.getComponent(binding.getItem());
            if (renderer) {
                rc.preEditorRenderer(node, binding, context);
                renderer(node, binding, context);
                rc.postEditorRenderer(node, binding, context);
            }
        },
        getChoice: system.getChoice,
        openChoiceSelector: function(binding, callback) {
            var chooser = rc.chooserRegistry.getComponent(binding.getItem());
            if (chooser == null) {
                var item = binding.getItem();
                alert("Error, no chooser available to open a choice selector for: "+item);
                return;
            }
            chooser.show(binding, callback);
        },

        setMessages: function(msgs) {
            messages = msgs;
        },
        getMessages: function(callback) {
            if (messages) {
                callback(messages);
            } else {
                i18n.getLocalization("rdforms/view", "rdforms", null, callback);
            }
        },
        /**
         * This method returns a list of language-codes and their labels (in several translations)
         * An example for English looks like this:
         * {
         *   "value": "en",
         *   "label": {"en": "English", "sv": "Engelska"}
         * }
         *
         * @return {Array} of languages.
         */
        getLanguageList: function () { //TODO: Take this list from some kind of configuration
            return languages || defaultLanguages;
        },
        setLanguageList: function(langs) {
            languages = langs;
        },

    //Override the following methods
        preEditorRenderer: function() {},
        postEditorRenderer: function() {},
        prePresenterRenderer: function() {},
        postPresenterRenderer: function() {},
        renderEditorLabel: function (rowNode, binding, item, context) {},
        renderPresenterLabel: function (rowNode, binding, item, context) {},
        attachItemInfo: function (item, aroundNode, context) {},
        addCreateChildButton: function (rowDiv, labelDiv, binding, context) {},
        addGroupButtons: function (rowDiv, labelDiv, binding, context) {},
        addExpandButton: function (rowDiv, labelDiv, item, context) {},
        addRemoveButton: function (fieldDiv, binding, context, onReset) {},
        addPresenterTable: function (lastRow, firstBinding, context) {},
        fillPresenterTable: function (table, bindings, context) {},
        addEditorTable: function (lastRow, firstBinding, context) {},
        fillEditorTable: function (table, bindings, context) {}
    };


    rc.presenterRegistry.itemtype("group").register(function(fieldDiv, binding, context) {
        var cls = context.view.constructor;
        new cls({
            messages: context.view.messages,
            binding: binding,
            topLevel: false,
            includeLevel: this.includeLevel}, fieldDiv);
    });

    rc.editorRegistry.itemtype("group").register(function(fieldDiv, binding, context) {
        var cls = context.view.constructor;
        var subView = new cls({messages: context.view.messages,
            languages: context.view.languages,
            binding: binding,
            topLevel: false,
            includeLevel: context.view.includeLevel}, fieldDiv);
        context.view._subEditors.push(subView);
    });

    return rc;
});