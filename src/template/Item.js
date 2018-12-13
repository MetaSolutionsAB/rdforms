import {namespaces as ns} from 'rdfjson';
import utils from '../utils';

let itemCount = 0;

const setObjAttr = (obj, attr, value) => {
  if (value === null || typeof value === "undefined" || value === "" || (Array.isArray(value) && value.length === 0)) {
    delete obj[attr];
  } else {
    obj[attr] = value;
  }
};

export default class Item {
  /**
   * Base functionality of Text, Group and Choice item classes.
   */
  constructor({source = {}, bundle, itemStore}) {
    this._itemStore = itemStore;
    this._source = source;
    this._bundle = bundle;
    this._internalId = itemCount++;
    this._styles = [
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
      "noLink",
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
      "autoValue",
      "showURI",
      "showLink",
    ];
    this._getLocalizedValue = utils.getLocalizedValue;
  }

  //===================================================
  // Public API
  //===================================================
  getId() {
    var s = this.getSource(true);
    return s.id || s["@id"];
  }

  setId(id) {
    setObjAttr(this.getSource(true), "id", id);
    delete s["@id"];
  }

  getType(original) {
    var s = this.getSource(original);
    return s.type || s["@type"];
  }

  setType(typeStr) {
    setObjAttr(this.getSource(true), "type", typeStr);
    delete s["@type"];
    this.refreshExtends();
  }

  getExtends() {
    return this.getSource(true)["extends"] || "";
  }

  refreshExtends() {
    if (this.isExtention) {
      this.setExtends(this.getExtends());
    }
  }

  setExtends(extendsStr) {
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
  }

  isExtention() {
    return this.getExtends() != null;
  }

  getLabel(returnDetails, original) {
    var s = this.getSource(original);
    return returnDetails ? utils.getLocalizedValue(s.label) : utils.getLocalizedValue(s.label).value;
  }

  setLabel(value, lang) {
    var s = this.getSource(true);
    s.label = this._setLangHash(s.label, value, lang);
    this.refreshExtends();
  }

  getLabelMap(original) {
    return this.getSource(original).label;
  }

  setLabelMap(map) {
    setObjAttr(this.getSource(true), "label", map);
    this.refreshExtends();
  }

  getDescription(returnDetails, original) {
    var s = this.getSource(original);
    return returnDetails ? utils.getLocalizedValue(s.description) : utils.getLocalizedValue(s.description).value;
  }

  setDescription(value, lang) {
    var s = this.getSource(true);
    s.description = this._setLangHash(s.description, value, lang);
    this.refreshExtends();
  }

  getDescriptionMap(original) {
    return this.getSource(original).description;
  }

  setDescriptionMap(map) {
    setObjAttr(this.getSource(true), "description", map);
    this.refreshExtends();
  }

  getPlaceholder(returnDetails, original) {
    var s = this.getSource(original);
    return returnDetails ? utils.getLocalizedValue(s.placeholder) : utils.getLocalizedValue(s.placeholder).value;
  }

  setPlaceholder(value, lang) {
    var s = this.getSource(true);
    s.placeholder = this._setLangHash(s.placeholder, value, lang);
    this.refreshExtends();
  }

  getPlaceholderMap(original) {
    return this.getSource(original).placeholder;
  }

  setPlaceholderMap(map) {
    setObjAttr(this.getSource(true), "placeholder", map);
    this.refreshExtends();
  }

  /**
   * @return {String|null} as a URI, may be null for Groups, never null for Text or choice
   * item types.
   */
  getProperty(original) {
    let p = null;
    const source = this.getSource(original);
    if (source) {
      p = source.property;
      if (p != null && p !== '') {
        p = ns.expand(p);
      }
    }

    return p;
  }

  setProperty(prop) {
    setObjAttr(this.getSource(true), "property", prop);
    this.refreshExtends();
  }

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
  getURIValueLabelProperties(original) {
    let arr = this.getSource(original).uriValueLabelProperties;
    if (arr != null) {
      return arr.map(function (uri) {
        return ns.expand(uri);
      });
    }
    return arr;
  }

  setURIValueLabelProperties(props) {
    setObjAttr(this.getSource(true), "uriValueLabelProperties", props);
    this.refreshExtends();
  }

  /**
   * @return {Object} never available for Text item type.
   * The property value pairs corresponds to predicate and objects in required tripples.
   */
  getConstraints(original) {
    const constr = this.getSource(original).constraints;
    if (constr != null) {
      const nc = {};
      Object.keys(constr).forEach(function (key) {
        const val = constr[key];
        if (Array.isArray(val)) {
          nc[ns.expand(key)] = val.map(function (v) {
            return ns.expand(v);
          });
        } else {
          nc[ns.expand(key)] = ns.expand(val);
        }
      });
      return nc;
    }
    return constr;
  }

  setConstraints(constr) {
    setObjAttr(this.getSource(true), "constraints", constr);
    this.refreshExtends();
  }

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
  getDeps(original) {
    let deps = this.getSource(original).deps;
    if (deps != null) {
      return deps.map(function (d) {
        if (d !== '*' && d !== '..') {
          return ns.expand(d);
        }
        return d;
      });
    }
    return deps;
  }

  setDeps(deps) {
    setObjAttr(this.getSource(true), "deps", deps);
    this.refreshExtends();
  }

  /**
   * @return {String} a URI indicating the datatype, for example: "http://www.w3.org/2001/XMLSchema.xsd#date".
   */
  getDatatype(original) {
    const dt = this.getSource(original).datatype;
    if (dt != null && dt != '') {
      return ns.expand(dt);
    }
    return dt;
  }

  setDatatype(dt) {
    setObjAttr(this.getSource(true), "datatype", dt);
    this.refreshExtends();
  }

  getPattern(original) {
    return this.getSource(original).pattern;
  }

  setPattern(pattern) {
    setObjAttr(this.getSource(true), "pattern", pattern);
    this.refreshExtends();
  }

  /**
   * @return {String} a two character language code, only relevant if the item type is Text and the nodetype is
   * a LANGUAGE_LITERAL, indicating that all matching bindings should be set with this language.
   */
  getLanguage(original) {
    return this.getSource(original).language;
  }

  setLanguage(lang) {
    setObjAttr(this.getSource(true), "language", lang);
    this.refreshExtends();
  }

  getMember(original) {
    return this.getSource(original).member;
  }

  setMember(member) {
    setObjAttr(this.getSource(true), "member", member);
    this.refreshExtends();
  }

  /**
   * Allowed values are:
   * LITERAL, RESOURCE, URI, BLANK, PLAIN_LITERAL, ONLY_LITERAL, LANGUAGE_LITERAL, DATATYPE_LITERAL
   */
  getNodetype(original) {
    var s = this.getSource(original);
    return s.nodetype || s.nodeType; //Ugly fix because it is often wrong written in SIRFF.
  }

  setNodetype(nt) {
    setObjAttr(this.getSource(true), "nodetype", nt);
    this.refreshExtends();
  }

  getValue(original) {
    return this.getSource(original).value;
  }

  setValue(value) {
    setObjAttr(this.getSource(true), "value", value);
    this.refreshExtends();
  }

  getValueTemplate(original) {
    return this.getSource(original).valueTemplate;
  }

  setValueTemplate(valueTemplate) {
    setObjAttr(this.getSource(true), "valueTemplate", valueTemplate);
    this.refreshExtends();
  }

  /**
   * @return {Object} containing max, min, and preferred properties.
   */
  getCardinality(original) {
    const source = this.getSource(original);

    if (source && ('cardinality' in source)) {
      return source.cardinality;
    }

    return {};
  }

  setCardinality(card) {
    setObjAttr(this.getSource(true), "cardinality", card);
    this.refreshExtends();
  }

  isEnabled(original) {
    var s = this.getSource(original);
    return s.enabled == null ? true : s.enabled;
  }

  setEnabled(en) {
    var s = this.getSource(true);
    if (en) {
      delete s.enabled;
    } else {
      s.enabled = en;
    }
    this.refreshExtends();
  }

  /**
   * Classes are exposed in CSS, allows external stylesheets to act on the form.
   * @returns {Array}
   */
  getClasses(original) {
    const source = this.getSource(original);
    if (source && 'cls' in source) {
      return source.cls;
    }
    return [];
  }

  setClasses(arr) {
    setObjAttr(this.getSource(true), 'cls', arr);
    this.refreshExtends();
  }

  /**
   * @deprecated only provided for backward compatability, use styles, classes
   * @param cls
   * @returns {boolean}
   */
  hasClass(cls, original) {
    var s = this.getSource(original)
    if (this.hasStyle(cls, original)) {
      return true;
    }
    if (s.cls == null) {
      return false;
    }
    return s.cls.some(c => c.toLowerCase() === cls.toLowerCase());
  }

  /**
   * The available styles, see the _styles variable.
   *
   * @return {Array} that contains strings with all available styles.
   */
  getAvailableStyles() {
    return this._styles;
  }

  /**
   * @return {Array} that contains strings with the style, if no style is defined an empty array is returned
   */
  getStyles(original) {
    return this.getSource(original).styles || [];
  }

  setStyles(arr) {
    setObjAttr(this.getSource(true), "styles", arr);
    this.refreshExtends();
  }

  hasStyle(sty, original) {
    const source = this.getSource(original);
    if (!source || !('styles' in source)) {
      return false;
    }
    return source.styles.some(s => s.toLowerCase() === sty.toLowerCase());
  }

  getSource(original) {
    if (original === true) {  // Get the original source
      return this._source._extendedSource || this._source;
    } else if (original === false) {  // Get the extended source
      var entryItem = this._itemStore.getItem(this.getExtends());
      if (entryItem == null) {
        return this._source;
      } else {
        return entryItem.getSource();
      }
    } else {  //Get the merged source.
      return this._source;
    }
  }

  getBundle() {
    return this._bundle;
  }

  toStringShort() {
    return "'" + this.getLabel() + "'" + (this.getId() ? " (ID: '" + this.getId() + "')" : "");
  }

  toString() {
    var detailsArr = [];
    if (this.getId()) {
      detailsArr.push("ID: '" + this.getId() + "'");
    }
    detailsArr.push("TYPE: '" + this.getType() + "'");
    if (this.getProperty()) {
      detailsArr.push("PROPERTY: '" + this.getProperty() + "'");
    }
    if (this.getExtends()) {
      detailsArr.push("EXTENDS: '" + this.getExtends() + "'");
    }
    return "'" + this.getLabel() + "' (" + detailsArr.join(", ") + ")";
  }

  //===================================================
  // Inherited methods
  //===================================================

  //===================================================
  // Private methods
  //===================================================

  _setLangHash(hash, value, lang) {
    hash = hash || {};
    if (typeof value == 'string') {
      if (typeof lang == 'string') {
        hash[lang] = value;
      } else {
        hash[""] = value;
      }
    } else if (typeof value === 'object' && value !== null) {
      return value;
    }
    return hash;
  }
};
