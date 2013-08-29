/*global define*/
define(["dojo/_base/declare", "./ValueBinding"], function (declare, ValueBinding) {

    /**
     * A ValueBinding that only accepts uris from a controlled vocabulary encoded as choices.
     * @see rforms.template.Choice#getChoices
     */
    var ChoiceBinding = declare(ValueBinding, {
        //===================================================
        // Private attributes
        //===================================================
        _choice: null,

        //===================================================
        // Public API
        //===================================================
        setChoice: function (choice) {
            this._choice = choice;
            if (choice == null) {
                this.setValue(null);
            } else if (this.getValue() != choice.value) {
                this.setValue(choice.value, choice);
            }
        },
        getChoice: function () {
            return this._choice;
        },

        //===================================================
        // Inherited methods
        //===================================================
        constructor: function (args) {
            this._choice = args.choice;
        },
        remove: function () {
            this.setValue(null);
            //Removed line below as it is also done in superclass
            //and therefore causes an error
            //this._parent.removeChildBinding(this);
            this.inherited("remove", arguments);
        },
        setValue: function (value, choice) {
            var oldval = this.getValue();
            this.inherited("setValue", arguments);
            var graph = this._statement.getGraph();
            graph.findAndRemove(oldval, ChoiceBinding.label);
            graph.findAndRemove(oldval, ChoiceBinding.seeAlso);

            if (value != null && choice != null) {
                if (choice.seeAlso && choice.inlineSeeAlso) {
                    graph.create(value, ChoiceBinding.seeAlso, choice.seeAlso);
                }

                if (choice.inlineLabel === true) {
                    var labelMap = choice.label || {};
                    for (var lang in labelMap) if (labelMap.hasOwnProperty(lang)) {
                        graph.create(value, ChoiceBinding.label, {value: labelMap[lang], lang: lang, type: "literal"});
                    }
                }
            }
        }
    });
    ChoiceBinding.label = "http://www.w3.org/2000/01/rdf-schema#label";
    ChoiceBinding.seeAlso = "http://www.w3.org/2000/01/rdf-schema#seeAlso";

    return ChoiceBinding;
});