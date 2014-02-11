/*global define*/
define(["dojo/_base/declare", "../utils"], function (declare, utils) {
    var itemCount = 0;

    /**
     * Common functionality of subclasses Item and Template.
     * (If it where not for the Template class, this functionality would be merged with Item.)
     */
    return declare(null, {
        //===================================================
        // Private attributes
        //===================================================
        _source: {},

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
        },
        getExtends: function () {
            return this.getSource(true)["extends"] || "";
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
        },
        getLabelMap: function (original) {
            return this.getSource(original).label;
        },
        setLabelMap: function (map) {
            this.getSource(true).label = map;
        },
        getDescription: function (returnDetails, original) {
            var s = this.getSource(original);
            return returnDetails ? this._getLocalizedValue(s.description) : this._getLocalizedValue(s.description).value;
        },
        setDescription: function (value, lang) {
            var s = this.getSource(true);
            s.description = this._setLangHash(s.description, value, lang);
        },
        getDescriptionMap: function (original) {
            return this.getSource(original).description;
        },
        setDescriptionMap: function(map) {
            this.getSource(true).description = map;
        },
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
            "tree"
        ],
        /**
         * Supported styles at this point:
         * invisible
         * stars
         * commentOn
         * horizontalRadioButtons
         * verticalRadioButtons
         * nonEditable
         * expandable
         * dropDown
         * firstcolumnfixedtable
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
        //===================================================
        // Inherited methods
        //===================================================
        constructor: function (params) {
            this._itemStore = params.itemStore;
            this._source = params.source;
            this._internalId = itemCount++;
        },

        //===================================================
        // Private methods
        //===================================================

        _getLocalizedValue: utils.getLocalizedValue
    });
});