/*global define*/
define(["dojo/_base/declare", "./_BaseItem"], function (declare, _BaseItem) {

    /**
     * Base functionality of Text, Group and Choice item classes.
     */
    return declare(_BaseItem, {
        //===================================================
        // Public API
        //===================================================
        /**
         * @return {String} as a URI, may be undefined for Groups, never undefined for Text or choice item types.
         */
        getProperty: function () {
            return this._source.property;
        },

        setProperty: function(prop) {
            if (prop && prop !== "") {
                this._source.property = prop;
            } else {
                delete this._source.property;
            }
        },
        /**
         * @return {Object} never available for Text item type.
         * The property value pairs corresponds to predicate and objects in required tripples.
         */
        getConstraints: function () {
            return this._source.constraints;
        },
        setConstraints: function (constr) {
            if (constr) {
                this._source.constraints = constr;
            } else {
                delete this._source.constraints;
            }
        },
        /**
         * @return {String} a URI indicating the datatype, for example: "http://www.w3.org/2001/XMLSchema.xsd#date".
         */
        getDatatype: function () {
            return this._source.datatype;
        },
        setDatatype: function (dt) {
            if (dt && dt !== "") {
                this._source.datatype = dt;
            } else {
                delete this._source.datatype;
            }
        },
        getPattern: function() {
            return this._source.pattern;
        },
        setPattern: function(pattern) {
            if (pattern && pattern !== "") {
                this._source.pattern = pattern;
            } else {
                delete this._source.pattern;
            }
        },
        /**
         * @return {String} a two character language code, only relevant if the item type is Text and the nodetype is
         * a LANGUAGE_LITERAL, indicating that all matching bindings should be set with this language.
         */
        getLanguage: function () {
            return this._source.language;
        },
        setLanguage: function (lang) {
            if (lang && lang !== "") {
                this._source.language = lang;
            } else {
                delete this._source.language;
            }
        },
        getMember: function () {
            return this._source.member;
        },
        setMember: function (member) {
            if (member != null) {
                this._source.member = member;
            } else {
                delete this._source.member;
            }
        },
        /**
         * Allowed values are:
         * LITERAL, RESOURCE, URI, BLANK, PLAIN_LITERAL, ONLY_LITERAL, LANGUAGE_LITERAL, DATATYPE_LITERAL
         */
        getNodetype: function () {
            return this._source.nodetype || this._source.nodeType; //Ugly fix because it is often wrong written in SIRFF.
        },
        setNodetype: function (nt) {
            if (nt) {
                this._source.nodetype = nt;
            } else {
                delete this._source.nodetype;
            }
            this._source.nodetype = nt;
        },
        getValue: function () {
            return this._source.value;
        },
        setValue: function (value) {
            if (value && value != "") {
                this._source.value = value;
            } else {
                delete this._source.value;
            }
        },
        /**
         * @return {Object} containing max, min, and preferred properties.
         */
        getCardinality: function () {
            return this._source.cardinality || {};
        },
        setCardinality: function (card) {
            if (card) {
                this._source.cardinality = card;
            } else {
                delete this._source.cardinality;
            }
        },
        isEnabled: function () {
            return this._source.enabled === undefined ? true : this._source.enabled;
        },
        setEnabled: function(en) {
            if (en) {
                delete this._source.enabled;
            } else {
                this._source.enabled = en;
            }
        }
    });
});