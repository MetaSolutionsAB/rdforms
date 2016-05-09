/*global define*/
define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-attr",
    "dijit/Dialog", //In template
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./AboutTemplate.html"
], function(declare, lang, on, domAttr, Dialog, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        //===================================================
        // Inherited attributes
        //===================================================
        templateString: template,

        //===================================================
        // Inherited methods
        //===================================================
        postCreate: function () {
            this.inherited("postCreate", arguments);

            on(this.aboutButton, "click", lang.hitch(this, function() {
                this.aboutDialog.show();
            }));
        },
        localize: function(message) {
            domAttr.set(this.aboutText, "innerHTML", message.aboutText);
            domAttr.set(this.aboutButton, "innerHTML", message.aboutButton);
            this.aboutDialog.set("title", message.aboutTitle);

            //domAttr.set(this._validateNode, "innerHTML", validator.validate);
        }
    });
});