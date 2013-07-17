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
          this._source.property = prop;
        },
        /**
         * @return {Object} never available for Text item type.
         * The property value pairs corresponds to predicate and objects in required tripples.
         */
        getConstraints: function () {
            return this._source.constraints;
        },
        setConstraints: function (constr) {
            this._source.constraints = constr;
        },
        /**
         * @return {String} a URI indicating the datatype, for example: "http://www.w3.org/2001/XMLSchema.xsd#date".
         */
        getDatatype: function () {
            return this._source.datatype;
        },
        setDatatype: function (dt) {
            this._source.datatype = dt;
        },
        /**
         * @return {String} a two character language code, only relevant if the item type is Text and the nodetype is
         * a LANGUAGE_LITERAL, indicating that all matching bindings should be set with this language.
         */
        getLanguage: function () {
            return this._source.language;
        },
        setLanguage: function (lang) {
            this._source.language = lang;
        },
        getMember: function () {
            return this._source.member;
        },
        setMember: function (member) {
            this._source.member = member;
        },
        /**
         * Allowed values are:
         * LITERAL, RESOURCE, URI, BLANK, PLAIN_LITERAL, ONLY_LITERAL, LANGUAGE_LITERAL, DATATYPE_LITERAL
         */
        getNodetype: function () {
            return this._source.nodetype || this._source.nodeType; //Ugly fix because it is often wrong written in SIRFF.
        },
        setNodetype: function (nt) {
            this._source.nodetype = nt;
            delete this._source.nodeType;
        },
        getValue: function () {
            return this._source.value;
        },
        setValue: function (value) {
            this._source.value = value;
        },
        /**
         * @return {Object} containing max, min, and preferred properties.
         */
        getCardinality: function () {
            return this._source.cardinality || {};
        },
        setCardinality: function (card) {
            this._source.cardinality = card;
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