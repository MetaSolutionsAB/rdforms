import moment from 'moment';
import { cloneDeep } from 'lodash';
import system from './model/system';

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
  if (graphOrBinding.getItem) { // graphOrBinding is a Binding
    graph = graphOrBinding.getGraph();
    _subject = graphOrBinding.getValue();
    _propArr = graphOrBinding.getItem().getURIValueLabelProperties();
  } else {
    graph = graphOrBinding;
  }
  if (_propArr == null || _propArr.length === 0) {
    _propArr = system.labelProperties;
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
    const r = (`${_template}`).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1').replace('\\$1', '(.*)');
    const e = new RegExp(r).exec(str);
    if (e != null) {
      return e[1];
    }
  }
  return str;
};

const findFirstValue = (engine, graph, uri, template) => {
  const fvb = engine.findFirstValueBinding(engine.match(graph, uri, template), false);
  if (!fvb) {
    return undefined;
  }
  if (fvb.getChoice) {
    return getLocalizedValue(fvb.getChoice().label).value;
  }
  return fvb.getGist();
};

const generateUUID = () => { // Public Domain/MIT
  let d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-mixed-operators,no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // eslint-disable-next-line no-bitwise,no-mixed-operators
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

export default {
  getLocalizedValue,
  getLocalizedMap,
  cloneArrayWithLabels,
  extractGist,
  findFirstValue,
  generateUUID,
};
