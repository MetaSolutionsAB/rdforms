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
            return this._source.id || this._source["@id"];
        },
        setId: function (id) {
            this._source.id = id;
            delete this._source["@id"];
        },
        getType: function () {
            return this._source.type || this._source["@type"];
        },
        setType: function (typeStr) {
            this._source.type = typeStr;
            delete this._source["@type"];
        },
        getExtends: function () {
            return this._source["extends"] || "";
        },
        setExtends: function(extendsStr) {
            if (extendsStr == "" || extendsStr == null) {
                delete this._source["extends"];
            } else {
                this._source["extends"] = extendsStr;
            }
        },
        getLabel: function (returnDetails) {
            return returnDetails ? this._getLocalizedValue(this._source.label) : this._getLocalizedValue(this._source.label).value;
        },
        setLabel: function (value, lang) {
            this._source.label = this._setLangHash(this._source.label, value, lang);
        },
        getLabelMap: function () {
            return this._source.label;
        },
        setLabelMap: function (map) {
            this._source.label = map;
        },
        getDescription: function (returnDetails) {
            return returnDetails ? this._getLocalizedValue(this._source.description) : this._getLocalizedValue(this._source.description).value;
        },
        setDescription: function (value, lang) {
            this._source.label = this._setLangHash(this._source.description, value, lang);
        },
        getDescriptionMap: function () {
            return this._source.description;
        },
        setDescriptionMap: function(map) {
            this._source.description = map;
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
        getClasses: function () {
            return this._source.cls || [];
        },
        setClasses: function(arr) {
            if (arr) {
                this._source.cls = arr;
            } else {
                delete this._source.cls;
            }
        },

        /**
         * @deprecated only provided for backward compatability, use styles, classes
         * @param cls
         * @returns {boolean}
         */
        hasClass: function (cls) {
            if (this.hasStyle(cls)) {
                return true;
            }
            if (this._source.cls === undefined) {
                return false;
            }
            return dojo.some(this._source.cls, function (c) {
                return c.toLowerCase() === cls.toLowerCase();
            });
        },

        _styles: [
            "invisible",
            "stars",
            "commentOn",
            "multiline",
            "horizontalRadioButtons",
            "verticalRadioButtons",
            "nonEditable",
            "expandable",
            "dropDown",
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
        getStyles: function () {
            return this._source.styles || [];
        },
        setStyles: function(arr) {
          this._source.styles = arr;
        },
        hasStyle: function (sty) {
            if (this._source.styles === undefined) {
                return false;
            }
            return dojo.some(this._source.styles, function (s) {
                return s.toLowerCase() === sty.toLowerCase();
            });
        },
        //===================================================
        // Inherited methods
        //===================================================
        constructor: function (source) {
            this._source = source;
            this._internalId = itemCount++;
        },

        //===================================================
        // Private methods
        //===================================================
        _getLocalizedValue: utils.getLocalizedValue
    });
});
