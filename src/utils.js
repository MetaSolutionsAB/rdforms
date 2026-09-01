import moment from 'moment';
import { cloneDeep } from 'lodash-es';
import labelProperties from './model/labelProperties';

const getLocalizedValue = (hash, locale) => {
  const _locale = locale || moment.locale();
  if (hash == null) {
    return { precision: 'none' };
  } else if (typeof hash === 'string') {
    return { value: hash, precision: 'nolang', lang: '' };
  } else if (hash.hasOwnProperty(_locale)) {
    return { value: hash[_locale], precision: 'exact', lang: _locale };
  }
  const pos = _locale.indexOf('_');
  if (pos > -1 && hash.hasOwnProperty(_locale.substr(0, 2))) {
    return {
      value: hash[_locale.substr(0, 2)],
      precision: 'coarsen',
      lang: _locale.substr(0, 2),
    };
  } else if (hash.hasOwnProperty('en')) {
    return { value: hash.en, precision: 'default', lang: 'en' };
  } else if (hash.hasOwnProperty('')) {
    return { value: hash[''], precision: 'nolang', lang: '' };
  }
  const allLangs = Object.keys(hash);
  if (allLangs.length > 0) {
    return { value: hash[allLangs[0]], precision: 'any', lang: allLangs[0] };
  }
  return { precision: 'none' };
};

// Given the language a value resolved to (getLocalizedValue(...).lang) and the
// active page locale, returns the language to tag on the rendered node — or
// undefined when there is nothing to tag: the value resolved in the page locale,
// or it is language-less (nolang / precision 'none' → falsy lang). Tagging only
// the fallback case keeps the DOM free of redundant lang attributes while
// letting screen readers pronounce foreign-language fallbacks correctly
// (WCAG 2.1 SC 3.1.2 Language of Parts).
const baseLanguage = (tag) => (tag || '').toLowerCase().split(/[-_]/)[0];
const foreignLang = (language, pageLocale) =>
  language && baseLanguage(language) !== baseLanguage(pageLocale)
    ? language
    : undefined;

const f = (graph, subject, prop) => {
  const stmts = graph.find(subject, prop);
  if (stmts.length > 0) {
    const obj = {};
    for (let s = 0; s < stmts.length; s++) {
      obj[stmts[s].getLanguage() || ''] = stmts[s].getValue();
    }
    return obj;
  }
  return undefined;
};

const getLocalizedMap = (graphOrBinding, subject, propArr) => {
  let graph;
  let _subject = subject;
  let _propArr = propArr;
  if (graphOrBinding.getItem) {
    // graphOrBinding is a Binding
    graph = graphOrBinding.getGraph();
    _subject = graphOrBinding.getValue();
    _propArr = graphOrBinding.getItem().getURIValueLabelProperties();
  } else {
    graph = graphOrBinding;
  }
  if (_propArr == null || _propArr.length === 0) {
    _propArr = labelProperties;
  }
  for (let i = 0; i < _propArr.length; i++) {
    const props = _propArr[i];
    if (Array.isArray(props)) {
      const valueArr = [];
      for (let j = 0; j < props.length; j++) {
        const value = f(graph, _subject, props[j]);
        if (value) {
          valueArr.push(getLocalizedValue(value).value);
        }
      }
      if (valueArr.length > 0) {
        return { '': valueArr.join(' ') };
      }
    } else {
      const value = f(graph, _subject, props);
      if (value) {
        return value;
      }
    }
  }
  return undefined;
};

const cloneArrayWithLabels = (objects, noSort) => {
  const itemsArray = [];
  for (let i = 0; i < objects.length; i++) {
    const o = objects[i];
    const currentLabel = getLocalizedValue(o.label);
    const obj = { value: o.value, label: currentLabel.value || o.value || '' };
    if (o.top === true) {
      obj.top = true;
    }
    if (o.children != null) {
      obj.children = cloneDeep(o.children);
    }
    if (o.selectable === false) {
      obj.selectable = false;
    } else {
      obj.selectable = true;
    }
    itemsArray.push(obj);
  }
  if (noSort !== true) {
    itemsArray.sort((o1, o2) => (o1.label > o2.label ? 1 : -1));
  }
  return itemsArray;
};
const extractGist = (str, template) => {
  let _template = template;
  if (_template) {
    if (_template.indexOf('$1') === -1) {
      _template += '$1';
    }
    const r = `${_template}`
      .replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
      .replace('\\$1', '(.*)');
    const e = new RegExp(r).exec(str);
    if (e != null) {
      return e[1];
    }
  }
  return str;
};

const findFirstValue = (engine, graph, uri, template) => {
  const fvb = engine.findFirstValueBinding(
    engine.match(graph, uri, template),
    false
  );
  if (!fvb) {
    return undefined;
  }
  if (fvb.getChoice) {
    return getLocalizedValue(fvb.getChoice().label).value;
  }
  return fvb.getGist();
};

const generateUUID = () => {
  // Public Domain/MIT
  let d = new Date().getTime();
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);

    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const ALLOWED_URL_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'];

/**
 * Neutralize an untrusted URL before it is written into an href/src attribute.
 * RDF graph values reach these attribute sinks directly, so a value such as
 * `javascript:alert(document.cookie)` would otherwise become a script-executing
 * link. Schemeless values (relative, protocol-relative `//`, root `/`, fragment
 * `#`) and the allow-listed schemes pass through unchanged; anything else
 * (javascript:, data:, vbscript:, blob:, file:, …) is replaced with `#`.
 *
 * The scheme is detected on a copy with control characters/whitespace stripped,
 * because browsers ignore those when resolving a scheme (so `java\tscript:` must
 * not slip through).
 *
 * @param {string} url the untrusted URL value.
 * @returns {string} the original url if safe, otherwise `#`.
 */
const sanitizeUrl = (url) => {
  if (typeof url !== 'string' || url === '') {
    return '#';
  }
  const scheme = url
    // Control chars/whitespace are stripped for scheme detection because browsers
    // ignore them when resolving a scheme; matching them requires this range.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0020]+/g, '')
    .match(/^([a-z][a-z0-9+.-]*):/i);
  if (!scheme) {
    return url;
  }
  return ALLOWED_URL_SCHEMES.includes(`${scheme[1].toLowerCase()}:`)
    ? url
    : '#';
};

export default {
  getLocalizedValue,
  foreignLang,
  getLocalizedMap,
  cloneArrayWithLabels,
  extractGist,
  findFirstValue,
  generateUUID,
  sanitizeUrl,
};
