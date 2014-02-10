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
        }
    });
});