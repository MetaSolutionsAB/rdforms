/*global define*/
define(["dojo/_base/declare", "../utils", "./Item"], function (declare, utils, Item) {

    var sortChoices = function (choices) {
        if (choices == null) {
            return;
        }
        choices.sort(function (c1, c2) {
            var lab1 = utils.getLocalizedValue(c1.label).value || c1.value;
            var lab2 = utils.getLocalizedValue(c2.label).value || c2.value;
            if (lab1 > lab2) {
                return 1;
            } else if (lab1 < lab2) {
                return -1;
            } else {
                return 0;
            }
        });
    };


    /**
     * A choice item type indicates that the value should be one of a range of predefined choices,
     * these predefined choices can be defined manually in the template or extracted from an external
     * ontology (indicated by the ontologyUrl) by means of a query that can be constructed from the constraints.
     *
     * TODO:
     * The choices can also be organized into a hierarchy using the parent and hierarchy properties.
     */
    return declare(Item, {
        //===================================================
        // Private attributes
        //===================================================
        _source: null,
        _ontologyStore: null,
        _choices: {},

        //===================================================
        // Public API
        //===================================================
        /**
         *  A choice is an object which looks like:
         * {"value": "http://example.com/choice1",
	 *  "label": {"en": "First choice", "sv": "Första valet"}
	 * }
         *
         * @return {Array} of choices.
         */
        getChoices: function (original) {
            return this.getStaticChoices(original) || this.getDynamicChoices(original) || [];
        },

        /**
         * @return {Boolean} true if there is an ontology or static choices.
         */
        hasChoices: function (original) {
            var s = this.getSource(original);
            return s.ontologyUrl != null || s.choices != null;
        },

        /**
         * @return {Array} of choices defined manually in the Template.
         */
        getStaticChoices: function (original) {
            var s = this.getSource(original);
            if (s.choices) {
                if (original && this.isExtention()) {
                    if (!this._origStaticIsSorted) {
                        sortChoices(s.choices);
                        this._origStaticIsSorted = true;
                    }
                } else {
                    if (!this._staticIsSorted) {
                        sortChoices(s.choices);
                        this._staticIsSorted = true;
                    }
                }
            }
            return s.choices;
        },
        setStaticChoices: function(choices) {
            var s = this.getSource(true);
            if (s.choices === choices) {
                return;
            }
            if (choices != null) {
                sortChoices(choices);
                this._origStaticIsSorted = true;
            }
            s.choices = choices;
            this.refreshExtends();
        },

        setExtends: function(extendsStr) {
            this.inherited("setExtends", arguments);
            delete this._staticIsSorted;
            delete this._origStaticIsSorted;
        },

        /**
         * Fetches choices from an external ontology.
         *
         * @param {Object} callback will be called asynchronously, if undefined the call is made synchronously.
         * @return {Array} of choice objects, only provided if method called without callback.
         */
        getDynamicChoices: function (callback) {
            if (this._dynamicChoices == null) {
                if (callback == null) {
                    this._dynamicChoices = this._ontologyStore.getChoices(this);
                    sortChoices(this._dynamicChoices);
                    return this._dynamicChoices;
                } else {
                    this._ontologyStore.getChoices(this, dojo.hitch(this, function (choices) {
                        sortChoices(choices);
                        if (this._dynamicChoices == null) {
                            console.log("Failed lookup of choices for " + this.getLabel());
                            console.log("  OntologyUrl is: " + this._source.ontologyUrl);
                        }
                        callback(this._dynamicChoices);
                    }));
                    return;
                }
            } else {
                if (callback == null) {
                    return this._dynamicChoices;
                } else {
                    callback(this._dynamicChoices);
                }
            }
        },
        getOntologyUrl: function (original) {
            return this.getSource(original).ontologyUrl;
        },
        setOntologyUrl: function (url) {
            var s = this.getSource(true);
            if (url == null || url == "") {
                delete s.ontologyUrl;
            } else {
                s.ontologyUrl = url;
            }
            this.refreshExtends();
        },
        getParentProperty: function (original) {
            return this.getSource(original).parentProperty;
        },
        setParentProperty: function (prop) {
            var s = this.getSource(true);
            if (prop == null || prop == "") {
                delete s.parentProperty;
            } else {
                s.parentProperty = prop;
            }
            this.refreshExtends();
        },
        getHierarchyProperty: function (original) {
            return this.getSource(original).hierarchyProperty;
        },
        setHierarchyProperty: function (prop) {
            var s = this.getSource(true);
            if (prop == null || prop == "") {
                delete s.hierarchyProperty;
            } else {
                s.hierarchyProperty = prop;
            }
            this.refreshExtends();
        },
        isParentPropertyInverted: function (original) {
            return this.getSource(original).isParentPropertyInverted === true;
        },
        setParentPropertyInverted: function (inverted) {
            var s = this.getSource(true);
            if (inverted === true) {
                s.isParentPropertyInverted = true;
            } else {
                delete s.isParentPropertyInverted;
            }
            this.refreshExtends();
        },
        isHierarchyPropertyInverted: function (original) {
            return this.getSource(original).isHierarchyPropertyInverted === true;
        },
        setHierarchyPropertyInverted: function (inverted) {
            var s = this.getSource(true);
            if (inverted) {
                s.isHierarchyPropertyInverted = true;
            } else {
                delete s.isHierarchyPropertyInverted;
            }
            this.refreshExtends();
        },

        //===================================================
        // Inherited methods
        //===================================================
        constructor: function (params) {
            this._ontologyStore = params.ontologyStore;
        }
    });
});