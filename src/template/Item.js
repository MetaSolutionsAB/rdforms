import { namespaces as ns } from '@entryscape/rdfjson';
import utils from '../utils';

let itemCount = 0;

const setObjAttr = (obj, attr, value) => {
  if (value === null || typeof value === 'undefined' || value === '' || (Array.isArray(value) && value.length === 0)) {
    delete obj[attr];
  } else {
    obj[attr] = value;
  }
};

export default class Item {
  /**
   * Base functionality of Text, Group and Choice item classes.
   */
  constructor({ source = {}, bundle, itemStore }) {
    this._itemStore = itemStore;
    this._source = source;
    this._bundle = bundle;
    itemCount += 1;
    this._internalId = itemCount;
    this._styles = [
      'heading',
      'invisible',
      'invisibleGroup',
      'stars',
      'commentOn',
      'multiline',
      'horizontalRadioButtons',
      'verticalRadioButtons',
      'horizontalCheckBoxes',
      'verticalCheckBoxes',
      'nonEditable',
      'expandable',
      'compact',
      'nonCompact',
      'dropDown',
      'table',
      'firstcolumnfixedtable',
      'tree',
      'externalLink',
      'internalLink',
      'noLink',
      'image',
      'label',
      'tooltip',
      'strictmatch',
      'relaxedDatatypeMatch',
      'viewAllTranslations',
      'filterTranslations',
      'email',
      'atLeastOneChild',
      'atMostOneChild',
      'exactlyOneChild',
      'noLabelInPresent',
      'autoInitDate',
      'autoUpdateDate',
      'autoUUID',
      'autoValue',
      'showURI',
      'showLink',
      'showValue',
      'showDescriptionInPresent',
      'showDescriptionInEdit',
      'textAsChoice',
      'preserveOrderOfChoices',
      'linkWithLabel',
      'deprecated',
      'inline',
      'truncate',
      'noTruncate',
      'card',
      'cardInPresent',
      'cardInEdit'
    ];
    this._getLocalizedValue = utils.getLocalizedValue;
  }

  //= ==================================================
  // Public API
  //= ==================================================
  getId() {
    const s = this.getSource(true);
    return s.id || s['@id'];
  }

  setId(id) {
    setObjAttr(this.getSource(true), 'id', id);
    delete s['@id'];
  }

  getType(original) {
    const s = this.getSource(original);
    return s.type || s['@type'];
  }

  setType(typeStr) {
    setObjAttr(this.getSource(true), 'type', typeStr);
    delete s['@type'];
    this.refreshExtends();
  }

  getExtends() {
    return this.getSource(true).extends || '';
  }

  refreshExtends() {
    if (this.isExtention) {
      this.setExtends(this.getExtends());
    }
  }

  setExtends(extendsStr) {
    const s = this.getSource(true);
    const ei = this._itemStore.getItem(extendsStr);
    if (ei == null) {
      this._source = s;
    } else {
      this._source = this._itemStore.createExtendedSource(ei.getSource(), s);
    }
    if (extendsStr === '' || extendsStr == null) {
      delete s.extends;
    } else {
      s.extends = extendsStr;
    }
  }

  isExtention() {
    return this.getExtends() != null;
  }

  _getText(attr, returnDetails, original) {
    const s = this.getSource(original);
    return returnDetails ? utils.getLocalizedValue(s[attr]) : utils.getLocalizedValue(s[attr]).value;
  }
  _setText(attr, value, lang) {
    const s = this.getSource(true);
    s[attr] = this._setLangHash(s[attr], value, lang);
    this.refreshExtends();
  }
  _setTextMap(attr, map) {
    setObjAttr(this.getSource(true), attr, map);
    this.refreshExtends();
  }

  getLabel(returnDetails, original) { return this._getText('label', returnDetails, original); }
  setLabel(value, lang) { this._setText('label', value, lang); }
  getLabelMap(original) { return this.getSource(original).label; }
  setLabelMap(map) { this._setTextMap('label', map); }

  getEditLabel(returnDetails, original) { return this._getText('editlabel', returnDetails, original); }
  setEditLabel(value, lang) { this._setText('editlabel', value, lang); }
  getEditLabelMap(original) { return this.getSource(original).editlabel; }
  setEditLabelMap(map) { this._setTextMap('editlabel', map); }

  getDescription(returnDetails, original) { return this._getText('description', returnDetails, original); }
  setDescription(value, lang) { this._setText('description', value, lang); }
  getDescriptionMap(original) { return this.getSource(original).description; }
  setDescriptionMap(map) { this._setTextMap('description', map); }

  getEditDescription(returnDetails, original) { return this._getText('editdescription', returnDetails, original); }
  setEditDescription(value, lang) { this._setText('editdescription', value, lang); }
  getEditDescriptionMap(original) { return this.getSource(original).editdescription; }
  setEditDescriptionMap(map) { this._setTextMap('editdescription', map); }

  getHelp(returnDetails, original) { return this._getText('help', returnDetails, original); }
  setHelp(value, lang) { this._setText('help', value, lang); }
  getHelpMap(original) { return this.getSource(original).help; }
  setHelpMap(map) { this._setTextMap('help', map); }

  getPlaceholder(returnDetails, original) { return this._getText('placeholder', returnDetails, original); }
  setPlaceholder(value, lang) { this._setText('placeholder', value, lang); }
  getPlaceholderMap(original) { return this.getSource(original).placeholder; }
  setPlaceholderMap(map) { this._setTextMap('placeholder', map); }

  getPurpose(returnDetails, original) { return this._getText('purpose', returnDetails, original); }
  setPurpose(value, lang) { this._setText('purpose', value, lang); }
  getPurposeMap(original) { return this.getSource(original).purpose; }
  setPurposeMap(map) { this._setTextMap('purpose', map); }

  getSpecification(returnDetails, original) { return this._getText('specification', returnDetails, original); }
  setSpecification(value, lang) { this._setText('specification', value, lang); }
  getSpecificationMap(original) { return this.getSource(original).specification; }
  setSpecificationMap(map) { this._setTextMap('specification', map); }

  getText(attr, returnDetails, original) {
    const s = this.getSource(original);
    const t = s.text || {};
    return returnDetails ? utils.getLocalizedValue(t[attr]) : utils.getLocalizedValue(t[attr]).value;
  }
  setText(attr, value, lang) {
    const s = this.getSource(true);
    const t = s.text = s.text || {};
    t[attr] = this._setLangHash(t[attr], value, lang);
    this.refreshExtends();
  }
  setTextMap(attr, map) {
    const s = this.getSource(true);
    const t = s.text = s.text || {};
    setObjAttr(t, attr, map);
    this.refreshExtends();
  }

  getEnhanced(attribute) {
    const s = this.getSource(true);
    if (typeof s.enhanced === 'boolean') {
      return s.enhanced;
    }
    return (s.enhanced && s.enhanced[attribute]) || false;
  }

  setEnhanced(attribute, enhanced) {
    const s = this.getSource(true);
    if (typeof attribute === 'boolean') {
      if (attribute === true) {
        s.enhanced = true;
      } else {
        delete s.enhanced;
      }
    } else {
      s.enhanced = typeof s.enhanced === 'boolean' ? {} : s.enhanced || {};
      if (enhanced) {
        s.enhanced[attribute] = true;
      } else {
        delete s.enhanced[attribute];
        if (Object.keys(s).length === 0) {
          delete s.enhanced;
        }
      }
    }
    // Simple way to refresh this._source which is a cache including potential enhancements
    this.setExtends(this.getExtends());
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
    setObjAttr(this.getSource(true), 'property', prop);
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
    const arr = this.getSource(original).uriValueLabelProperties;
    if (arr != null) {
      return arr.map(uri => ns.expand(uri));
    }
    return arr;
  }

  setURIValueLabelProperties(props) {
    setObjAttr(this.getSource(true), 'uriValueLabelProperties', props);
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
      Object.keys(constr).forEach((key) => {
        const val = constr[key];
        if (Array.isArray(val)) {
          nc[ns.expand(key)] = val.map(v => ns.expand(v));
        } else {
          nc[ns.expand(key)] = ns.expand(val);
        }
      });
      return nc;
    }
    return constr;
  }

  setConstraints(constr) {
    setObjAttr(this.getSource(true), 'constraints', constr);
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
    const deps = this.getSource(original).deps;
    if (deps != null) {
      return deps.map((d) => {
        if (d !== '*' && d !== '..') {
          return ns.expand(d);
        }
        return d;
      });
    }
    return deps;
  }

  setDeps(deps) {
    setObjAttr(this.getSource(true), 'deps', deps);
    this.refreshExtends();
  }

  /**
   * @return {String} a URI indicating the datatype, for example: "http://www.w3.org/2001/XMLSchema.xsd#date".
   */
  getDatatype(original) {
    const dt = this.getSource(original).datatype;
    if (dt != null && dt !== '') {
      return Array.isArray(dt) ? dt.map(d => ns.expand(d)) : ns.expand(dt);
    }
    return dt;
  }

  setDatatype(dt) {
    setObjAttr(this.getSource(true), 'datatype', dt);
    this.refreshExtends();
  }

  getPattern(original) {
    return this.getSource(original).pattern;
  }

  setPattern(pattern) {
    setObjAttr(this.getSource(true), 'pattern', pattern);
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
    setObjAttr(this.getSource(true), 'language', lang);
    this.refreshExtends();
  }

  getMember(original) {
    return this.getSource(original).member;
  }

  setMember(member) {
    setObjAttr(this.getSource(true), 'member', member);
    this.refreshExtends();
  }

  /**
   * Allowed values are:
   * LITERAL, RESOURCE, URI, BLANK, PLAIN_LITERAL, ONLY_LITERAL, LANGUAGE_LITERAL, DATATYPE_LITERAL
   */
  getNodetype(original) {
    const s = this.getSource(original);
    return s.nodetype || s.nodeType; // Ugly fix because it is often wrong written in SIRFF.
  }

  setNodetype(nt) {
    setObjAttr(this.getSource(true), 'nodetype', nt);
    this.refreshExtends();
  }

  getValue(original) {
    return this.getSource(original).value;
  }

  setValue(value) {
    setObjAttr(this.getSource(true), 'value', value);
    this.refreshExtends();
  }

  getValueTemplate(original) {
    return this.getSource(original).valueTemplate;
  }

  setValueTemplate(valueTemplate) {
    setObjAttr(this.getSource(true), 'valueTemplate', valueTemplate);
    this.refreshExtends();
  }

  /**
   * @return {Object} containing max, min, and preferred properties.
   */
  getCardinality(original) {
    if (!this.getProperty() && this.getType() === 'text') {
      return { min: 1, max: 1 };
    }

    const source = this.getSource(original);
    if (source && ('cardinality' in source)) {
      return source.cardinality;
    }

    if (!this.getProperty()) {
      return { max: 1 };
    }

    return {};
  }

  setCardinality(card) {
    setObjAttr(this.getSource(true), 'cardinality', card);
    this.refreshExtends();
  }

  isEnabled(original) {
    const s = this.getSource(original);
    return s.enabled == null ? true : s.enabled;
  }

  setEnabled(en) {
    const s = this.getSource(true);
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
    const s = this.getSource(original);
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
    setObjAttr(this.getSource(true), 'styles', arr);
    this.refreshExtends();
  }

  hasStyle(sty, original) {
    const source = this.getSource(original);
    if (!source || !('styles' in source)) {
      return false;
    }
    return source.styles.some(s => s.toLowerCase() === sty.toLowerCase());
  }

  getSource(original, attribute) {
    if (original === true) {  // Get the original source
      return this._source._extendedSource || this._source;
    } else if (original === false) {  // Get the extended source
      const entryItem = this._itemStore.getItem(this.getExtends());
      if (entryItem == null) {
        return this._source;
      }
      return entryItem.getSource();
    }   // Get the merged source.
    return this._source;
  }

  getBundle() {
    return this._bundle;
  }

  toStringShort() {
    return `'${this.getLabel()}'${this.getId() ? ` (ID: '${this.getId()}')` : ''}`;
  }

  toString() {
    const detailsArr = [];
    if (this.getId()) {
      detailsArr.push(`ID: '${this.getId()}'`);
    }
    detailsArr.push(`TYPE: '${this.getType()}'`);
    if (this.getProperty()) {
      detailsArr.push(`PROPERTY: '${this.getProperty()}'`);
    }
    if (this.getExtends()) {
      detailsArr.push(`EXTENDS: '${this.getExtends()}'`);
    }
    return `'${this.getLabel()}' (${detailsArr.join(', ')})`;
  }

  //= ==================================================
  // Inherited methods
  //= ==================================================

  //= ==================================================
  // Private methods
  //= ==================================================

  // eslint-disable-next-line class-methods-use-this
  _setLangHash(hash, value, lang) {
    const _hash = hash || {};
    if (typeof value === 'string') {
      if (typeof lang === 'string') {
        _hash[lang] = value;
      } else {
        _hash[''] = value;
      }
    } else if (typeof value === 'object' && value !== null) {
      return value;
    }
    return _hash;
  }
}
