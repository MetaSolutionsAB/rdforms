/*global define*/
define(["dojo/_base/declare" , "rdforms/utils"], function (declare, utils) {
    var itemCount = 0;

    /**
     * Base functionality of Text, Group and Choice item classes.
     */
    return declare(null, {
        //===================================================
        // Private attributes
        //===================================================
        _source: {},
        _styles: [
            "invisible",
            "invisibleGroup",
            "stars",
            "commentOn",
            "multiline",
            "horizontalRadioButtons",
            "verticalRadioButtons",
            "nonEditable",
            "expandable",
            "compact",
            "nonCompact",
            "dropDown",
            "table",
            "firstcolumnfixedtable",
            "tree",
            "externalLink",
            "image"
        ],

        //===================================================
        // Public API
        //===================================================
        getId: function () {
            var s = this.getSource(true);
            return s.id || s["@id"];
        },
        setId: function (id) {
            var s = this.getSource(true);
            s.id = id;
            delete s["@id"];
        },
        getType: function (original) {
            var s = this.getSource(original);
            return s.type || s["@type"];
        },
        setType: function (typeStr) {
            var s = this.getSource(true);
            s.type = typeStr;
            delete s["@type"];
            this.refreshExtends();
        },
        getExtends: function () {
            return this.getSource(true)["extends"] || "";
        },
        refreshExtends: function() {
            if (this.isExtention) {
                this.setExtends(this.getExtends());
            }
        },
        setExtends: function(extendsStr) {
            var s = this.getSource(true);
            var ei = this._itemStore.getItem(extendsStr);
            if (ei == null) {
                this._source = s;
            } else {
                this._source = this._itemStore.createExtendedSource(ei.getSource(), s);
            }
            if (extendsStr == "" || extendsStr == null) {
                delete s["extends"];
            } else {
                s["extends"] = extendsStr;
            }
        },
        isExtention: function() {
            return this.getExtends() != null;
        },
        getLabel: function (returnDetails, original) {
            var s = this.getSource(original);
            return returnDetails ? this._getLocalizedValue(s.label) : this._getLocalizedValue(s.label).value;
        },
        setLabel: function (value, lang) {
            var s = this.getSource(true);
            s.label = this._setLangHash(s.label, value, lang);
            this.refreshExtends();
        },
        getLabelMap: function (original) {
            return this.getSource(original).label;
        },
        setLabelMap: function (map) {
            this.getSource(true).label = map;
            this.refreshExtends();
        },
        getDescription: function (returnDetails, original) {
            var s = this.getSource(original);
            return returnDetails ? this._getLocalizedValue(s.description) : this._getLocalizedValue(s.description).value;
        },
        setDescription: function (value, lang) {
            var s = this.getSource(true);
            s.description = this._setLangHash(s.description, value, lang);
            this.refreshExtends();
        },
        getDescriptionMap: function (original) {
            return this.getSource(original).description;
        },
        setDescriptionMap: function(map) {
            this.getSource(true).description = map;
            this.refreshExtends();
        },

        /**
         * @return {String} as a URI, may be undefined for Groups, never undefined for Text or choice item types.
         */
        getProperty: function (original) {
            return this.getSource(original).property;
        },

        setProperty: function(prop) {
            var s = this.getSource(true);
            if (prop && prop !== "") {
                s.property = prop;
            } else {
                delete s.property;
            }
            this.refreshExtends();
        },

        /**
         * If the value is a uri, it is not nice to show it directly.
         * Hence, we need to discover (or provide if we are in edit mode)
         * a suitable label for the URI. Labels are typically provided by
         * having triples with the URI as subject, but which predicates do we use?
         *
         * URIValueLabelProperties is an array of properties to be used in this scenario,
         * were each should be tried in turn. In editing mode the first property should be used,
         * alternatively a dropdown can be used to select among the properties.
         *
         * @return {Array} array of properties
         * The property value pairs corresponds to predicate and objects in required tripples.
         */
        getURIValueLabelProperties: function (original) {
            return this.getSource(original).uriValueLabelProperties;
        },
        setURIValueLabelProperties: function (props) {
            var s = this.getSource(true);
            if (props) {
                s.uriValueLabelProperties = props;
            } else {
                delete s.uriValueLabelProperties;
            }
            this.refreshExtends();
        },

        /**
         * @return {Object} never available for Text item type.
         * The property value pairs corresponds to predicate and objects in required tripples.
         */
        getConstraints: function (original) {
            return this.getSource(original).constraints;
        },
        setConstraints: function (constr) {
            var s = this.getSource(true);
            if (constr) {
                s.constraints = constr;
            } else {
                delete s.constraints;
            }
            this.refreshExtends();
        },

        /**
         * @return {Object} never available for Text item type.
         * The property value pairs corresponds to predicate and objects in required tripples.
         */
        getConstraints: function (original) {
            return this.getSource(original).constraints;
        },
        setConstraints: function (constr) {
            var s = this.getSource(true);
            if (constr) {
                s.constraints = constr;
            } else {
                delete s.constraints;
            }
            this.refreshExtends();
        },

        /**
         * @return {String} a URI indicating the datatype, for example: "http://www.w3.org/2001/XMLSchema.xsd#date".
         */
        getDatatype: function (original) {
            return this.getSource(original).datatype;
        },
        setDatatype: function (dt) {
            var s = this.getSource(true);
            if (dt && dt !== "") {
                s.datatype = dt;
            } else {
                delete s.datatype;
            }
            this.refreshExtends();
        },
        getPattern: function(original) {
            return this.getSource(original).pattern;
        },
        setPattern: function(pattern) {
            var s = this.getSource(true);
            if (pattern && pattern !== "") {
                s.pattern = pattern;
            } else {
                delete s.pattern;
            }
            this.refreshExtends();
        },
        /**
         * @return {String} a two character language code, only relevant if the item type is Text and the nodetype is
         * a LANGUAGE_LITERAL, indicating that all matching bindings should be set with this language.
         */
        getLanguage: function (original) {
            return this.getSource(original).language;
        },
        setLanguage: function (lang) {
            var s = this.getSource(true);
            if (lang && lang !== "") {
                s.language = lang;
            } else {
                delete s.language;
            }
            this.refreshExtends();
        },
        getMember: function (original) {
            return this.getSource(original).member;
        },
        setMember: function (member) {
            var s = this.getSource(true);
            if (member != null) {
                s.member = member;
            } else {
                delete s.member;
            }
            this.refreshExtends();
        },
        /**
         * Allowed values are:
         * LITERAL, RESOURCE, URI, BLANK, PLAIN_LITERAL, ONLY_LITERAL, LANGUAGE_LITERAL, DATATYPE_LITERAL
         */
        getNodetype: function (original) {
            var s = this.getSource(original);
            return s.nodetype || s.nodeType; //Ugly fix because it is often wrong written in SIRFF.
        },
        setNodetype: function (nt) {
            var s = this.getSource(true);
            if (nt) {
                s.nodetype = nt;
            } else {
                delete s.nodetype;
            }
            s.nodetype = nt;
            this.refreshExtends();
        },
        getValue: function (original) {
            return this.getSource(original).value;
        },
        setValue: function (value) {
            var s = this.getSource(true);
            if (value && value != "") {
                s.value = value;
            } else {
                delete s.value;
            }
            this.refreshExtends();
        },
        /**
         * @return {Object} containing max, min, and preferred properties.
         */
        getCardinality: function (original) {
            return this.getSource(original).cardinality || {};
        },
        setCardinality: function (card) {
            var s = this.getSource(true);
            if (card) {
                s.cardinality = card;
            } else {
                delete s.cardinality;
            }
            this.refreshExtends();
        },
        isEnabled: function (original) {
            var s = this.getSource(original);
            return s.enabled === undefined ? true : s.enabled;
        },
        setEnabled: function(en) {
            var s = this.getSource(true);
            if (en) {
                delete s.enabled;
            } else {
                s.enabled = en;
            }
            this.refreshExtends();
        },

        /**
         * Classes are exposed in CSS, allows external stylesheets to act on the form.
         * @returns {Array}
         */
        getClasses: function (original) {
            return this.getSource(original).cls || [];
        },
        setClasses: function(arr) {
            var s = this.getSource(true);
            if (arr) {
                s.cls = arr;
            } else {
                delete s.cls;
            }
            this.refreshExtends();
        },

        /**
         * @deprecated only provided for backward compatability, use styles, classes
         * @param cls
         * @returns {boolean}
         */
        hasClass: function (cls, original) {
            var s = this.getSource(original)
            if (this.hasStyle(cls, original)) {
                return true;
            }
            if (s.cls === undefined) {
                return false;
            }
            return dojo.some(s.cls, function (c) {
                return c.toLowerCase() === cls.toLowerCase();
            });
        },

        /**
         * The available styles, see the _styles variable.
         *
         * @return {Array} that contains strings with all available styles.
         */
        getAvailableStyles: function() {
            return this._styles;
        },
        /**
         * @return {Array} that contains strings with the style, if no style is defined an empty array is returned
         */
        getStyles: function (original) {
            return this.getSource(original).styles || [];
        },
        setStyles: function(arr) {
            this.getSource(true).styles = arr;
            this.refreshExtends();
        },
        hasStyle: function (sty, original) {
            var s = this.getSource(original);
            if (s.styles === undefined) {
                return false;
            }
            return dojo.some(s.styles, function (s) {
                return s.toLowerCase() === sty.toLowerCase();
            });
        },
        getSource: function(original) {
            if (original === true) {  // Get the original source
                return this._source._extendedSource || this._source;
            } else if (original === false) {  // Get the extended source
                var ei = this._itemStore.getItem(this.getExtends());
                if (ei == null) {
                    return this._source;
                } else {
                    return ei.getSource();
                }
            } else {  //Get the merged source.
                return this._source;
            }
        },
        getBundle: function() {
            return this._bundle;
        },
        //===================================================
        // Inherited methods
        //===================================================
        constructor: function (params) {
            this._itemStore = params.itemStore;
            this._source = params.source;
            this._bundle = params.bundle;
            this._internalId = itemCount++;
        },

        //===================================================
        // Private methods
        //===================================================

        _setLangHash: function (hash, value, lang) {
            hash = hash || {};
            if (dojo.isString(value)) {
                if (dojo.isString(lang)) {
                    hash[lang] = value;
                } else {
                    hash[""] = value;
                }
            } else if (dojo.isObject(value)) {
                return value;
            }
            return hash;
        },
        _getLocalizedValue: utils.getLocalizedValue

    });
});