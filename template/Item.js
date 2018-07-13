/*global define*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "rdfjson/namespaces",
    "rdforms/utils"
], function (declare, lang, array, namespaces, utils) {
    var itemCount = 0;

    var setObjAttr = function(obj, attr, value) {
        if (value === null || typeof value === "undefined" || value === "" || (lang.isArray(value) && value.length === 0)) {
            delete obj[attr];
        } else {
            obj[attr] = value;
        }
    };
    /**
     * Base functionality of Text, Group and Choice item classes.
     */
    return declare(null, {
        //===================================================
        // Private attributes
        //===================================================
        _source: {},
        _styles: [
            "heading",
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
            "internalLink",
            "image",
            "label",
            "strictmatch",
            "viewAllTranslations",
            "email",
            "disjoint",
            "deprecated",
            "noLabelInPresent",
            "autoInitDate",
            "autoUpdateDate",
            "autoUUID",
            "showURI",
            "showLink",
        ],

        //===================================================
        // Public API
        //===================================================
        getId: function () {
            var s = this.getSource(true);
            return s.id || s["@id"];
        },
        setId: function (id) {
            setObjAttr(this.getSource(true), "id", id);
            delete s["@id"];
        },
        getType: function (original) {
            var s = this.getSource(original);
            return s.type || s["@type"];
        },
        setType: function (typeStr) {
            setObjAttr(this.getSource(true), "type", typeStr);
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
            setObjAttr(this.getSource(true), "label", map);
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
            setObjAttr(this.getSource(true), "description", map);
            this.refreshExtends();
        },

      getPlaceholder: function (returnDetails, original) {
        var s = this.getSource(original);
        return returnDetails ? this._getLocalizedValue(s.placeholder) : this._getLocalizedValue(s.placeholder).value;
      },
      setPlaceholder: function (value, lang) {
        var s = this.getSource(true);
        s.placeholder = this._setLangHash(s.placeholder, value, lang);
        this.refreshExtends();
      },
      getPlaceholderMap: function (original) {
        return this.getSource(original).placeholder;
      },
      setPlaceholderMap: function (map) {
        setObjAttr(this.getSource(true), "placeholder", map);
        this.refreshExtends();
      },

      /**
         * @return {String} as a URI, may be undefined for Groups, never undefined for Text or choice item types.
         */
        getProperty: function (original) {
            let p = this.getSource(original).property;
            if (p != null && p !== '') {
                p = namespaces.expand(p);
            }
            return p;
        },

        setProperty: function(prop) {
            setObjAttr(this.getSource(true), "property", prop);
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
            let arr = this.getSource(original).uriValueLabelProperties;
            if (arr != null) {
                return arr.map(function(uri) {
                    return namespaces.expand(uri);
                });
            }
            return arr;
        },
        setURIValueLabelProperties: function (props) {
            setObjAttr(this.getSource(true), "uriValueLabelProperties", props);
            this.refreshExtends();
        },

        /**
         * @return {Object} never available for Text item type.
         * The property value pairs corresponds to predicate and objects in required tripples.
         */
        getConstraints: function (original) {
            const constr = this.getSource(original).constraints;
            if (constr != null) {
                const nc = {};
                Object.keys(constr).forEach(function(key) {
                    const val = constr[key];
                    if (Array.isArray(val)) {
                      nc[namespaces.expand(key)] = val.map(function(v) {
                          return namespaces.expand(v);
                      });
                    } else {
                      nc[namespaces.expand(key)] = namespaces.expand(val);
                    }
                });
                return nc;
            }
            return constr;
        },
        setConstraints: function (constr) {
            setObjAttr(this.getSource(true), "constraints", constr);
            this.refreshExtends();
        },

        /**
         * Deps is an array of strings corresponding to predicates, "*" may be used to match
         * anything. The final string in the path may correspond to the object,
         * e.g. a literal or uri.
         * By default, the dependency is given relative to the current items parent.
         * If dependency path should start higher up it can be indicated by providing one or more
         * initial strings with value "..".
         *
         * @return {Object} dependency path that must exist for this item to be visible.
         *
         */
        getDeps: function (original) {
            let deps = this.getSource(original).deps;
            if (deps != null) {
                return deps.map(function(d) {
                  if (d !== '*' && d !== '..') {
                      return namespaces.expand(d);
                  }
                  return d;
                });
            }
            return deps;
        },
        setDeps: function (deps) {
            setObjAttr(this.getSource(true), "deps", deps);
            this.refreshExtends();
        },


        /**
         * @return {String} a URI indicating the datatype, for example: "http://www.w3.org/2001/XMLSchema.xsd#date".
         */
        getDatatype: function (original) {
            const dt = this.getSource(original).datatype;
            if (dt != null && dt != '') {
                return namespaces.expand(dt);
            }
            return dt;
        },
        setDatatype: function (dt) {
            setObjAttr(this.getSource(true), "datatype", dt);
            this.refreshExtends();
        },
        getPattern: function(original) {
            return this.getSource(original).pattern;
        },
        setPattern: function(pattern) {
            setObjAttr(this.getSource(true), "pattern", pattern);
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
            setObjAttr(this.getSource(true), "language", lang);
            this.refreshExtends();
        },
        getMember: function (original) {
            return this.getSource(original).member;
        },
        setMember: function (member) {
            setObjAttr(this.getSource(true), "member", member);
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
            setObjAttr(this.getSource(true), "nodetype", nt);
            this.refreshExtends();
        },
        getValue: function (original) {
            return this.getSource(original).value;
        },
        setValue: function (value) {
            setObjAttr(this.getSource(true), "value", value);
            this.refreshExtends();
        },
        getValueTemplate: function(original) {
            return this.getSource(original).valueTemplate;
        },
        setValueTemplate: function(valueTemplate) {
            setObjAttr(this.getSource(true), "valueTemplate", valueTemplate);
            this.refreshExtends();
        },

        /**
         * @return {Object} containing max, min, and preferred properties.
         */
        getCardinality: function (original) {
            return this.getSource(original).cardinality || {};
        },
        setCardinality: function (card) {
            setObjAttr(this.getSource(true), "cardinality", card);
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
            setObjAttr(this.getSource(true), "cls", arr);
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
            return array.some(s.cls, function (c) {
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
            setObjAttr(this.getSource(true), "styles", arr);
            this.refreshExtends();
        },
        hasStyle: function (sty, original) {
            var s = this.getSource(original);
            if (s.styles === undefined) {
                return false;
            }
            return array.some(s.styles, function (s) {
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
        toStringShort: function() {
            return "'"+this.getLabel()+"'" + (this.getId() ? " (ID: '"+this.getId()+"')": "");
        },
        toString: function() {
            var detailsArr = [];
            if (this.getId()) {
                detailsArr.push("ID: '"+this.getId()+"'");
            }
            detailsArr.push("TYPE: '"+this.getType()+"'");
            if (this.getProperty()) {
                detailsArr.push("PROPERTY: '"+this.getProperty()+"'");
            }
            if (this.getExtends()) {
                detailsArr.push("EXTENDS: '"+this.getExtends()+"'");
            }
            return "'"+this.getLabel() +"' ("+detailsArr.join(", ")+")";
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
            if (lang.isString(value)) {
                if (lang.isString(lang)) {
                    hash[lang] = value;
                } else {
                    hash[""] = value;
                }
            } else if (lang.isObject(value)) {
                return value;
            }
            return hash;
        },
        _getLocalizedValue: utils.getLocalizedValue

    });
});