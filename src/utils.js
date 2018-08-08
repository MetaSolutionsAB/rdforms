import system from 'rdforms/model/system';
import cloneDeep from 'lodash-es/cloneDeep';

define([
  'dojo/_base/kernel',
], (kernel) => {
  const getLocalizedValue = function (hash) {
    if (hash == null) {
      return {precision: 'none'};
    } else if (typeof hash === 'string') {
      return {value: hash, precision: 'nolang', lang: ''};
    } else if (hash.hasOwnProperty(kernel.locale)) {
      return {value: hash[kernel.locale], precision: 'exact', lang: kernel.locale};
    }
    const pos = kernel.locale.indexOf('_');
    if (pos > -1 && hash.hasOwnProperty(kernel.locale.substr(0, 2))) {
      return {
        value: hash[kernel.locale.substr(0, 2)],
        precision: 'coarsen',
        lang: kernel.locale.substr(0, 2),
      };
    } else if (hash.hasOwnProperty('en')) {
      return {value: hash.en, precision: 'default', lang: 'en'};
    } else if (hash.hasOwnProperty('')) {
      return {value: hash[''], precision: 'nolang', lang: ''};
    }
    for (const prop in hash) {
      return {value: hash[prop], precision: 'any', lang: prop};
    }
    return {precision: 'none'};
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
  };

  const getLocalizedMap = (graphOrBinding, subject, propArr) => {
    let graph;
    if (graphOrBinding.getItem) { // graphOrBinding is a Binding
      graph = graphOrBinding.getGraph();
      subject = graphOrBinding.getValue();
      propArr = graphOrBinding.getItem().getURIValueLabelProperties();
    } else {
      graph = graphOrBinding;
    }
    if (propArr == null || propArr.length == 0) {
      propArr = system.labelProperties;
    }
    let stmts;
    for (let i = 0; i < propArr.length; i++) {
      const props = propArr[i];
      if (Array.isArray(props)) {
        const valueArr = [];
        for (let j = 0; j < props.length; j++) {
          var value = f(graph, subject, props[j]);
          if (value) {
            valueArr.push(getLocalizedValue(value).value);
          }
        }
        if (valueArr.length > 0) {
          return {'': valueArr.join(' ')};
        }
      } else {
        var value = f(graph, subject, props);
        if (value) {
          return value;
        }
      }
    }
  };

  const cloneArrayWithLabels = (objects, noSort) => {
    const itemsArray = [];
    for (let i = 0; i < objects.length; i++) {
      const o = objects[i];
      const currentLabel = getLocalizedValue(o.label);
      const obj = {value: o.value, label: currentLabel.value || o.value || ''};
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
      itemsArray.sort((o1, o2) => o1.label > o2.label ? 1 : -1);
    }
    return itemsArray;
  };
  const extractGist = (str, template) => {
    if (template) {
      if (template.indexOf('$1') === -1) {
        template += '$1';
      }
      const r = (`${template}`).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1').replace('\\$1', '(.*)');
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
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  };

  return {
    getLocalizedValue,
    getLocalizedMap,
    cloneArrayWithLabels,
    extractGist,
    findFirstValue,
    generateUUID
  }
});
