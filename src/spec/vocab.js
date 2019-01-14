import {namespaces as ns} from 'rdfjson';
import {getLabel} from './itemUtils.js';
import {createEl, addDef, addURIDef, safeFragment, initHeaderCounters, renderHeader, renderSubHeader} from './domUtils.js';
import specNLS from "./nls/spec.nls";
import { i18n } from 'esi18n';

let vocs = [];
const init = () => {
  vocs = [];
};

const getVocab = (item) => {
  const choices = item.getChoices();
  let voc = vocs.find(v => choices.find(c => v.vals[ns.expand(c.value)]));
  if (!voc) {
    voc = {vals: {}, item};
    vocs.push(voc);
  }
  choices.forEach((c) => {
    let obj = voc.vals[ns.expand(c.value)];
    if (!obj) {
      voc.vals[ns.expand(c.value)] = {
        id: safeFragment(item, c.value),
        label: rdforms.utils.getLocalizedValue(c.label).value || ns.shortenKnown(c.value),
        choice: c,
        value: c.value,
        description: rdforms.utils.getLocalizedValue(c.description || {}).value
      };
    }
  });
  return voc;
};

const addVocabulary = (field, td) => {
  const vocab = getVocab(field);
  Object.values(vocab.vals).forEach((obj, idx) => {
    if (idx !== 0) {
      createEl('span', ' | ', td);
    }
    createEl('a', obj.label, td).setAttribute('href', `#${obj.id}`);
  });
};

const renderTermDetails = (nodetype, obj, node) => {
  const table = createEl('table', null, node);
  table.classList.add('propdef');
  table.classList.add('def');
  const tbody = createEl('tbody', null, table);
  addDef(i18n.localize(specNLS, 'vocabLabel', {}), obj.label, tbody);
  if (nodetype.indexOf('LITERAL') >= 0) {
    addDef(i18n.localize(specNLS, 'vocabLiteralValue', {}), obj.value, tbody);
  } else {
    addURIDef(i18n.localize(specNLS, 'vocabURIValue', {}), obj.value, tbody);
  }
  if (obj.description) {
    addDef(i18n.localize(specNLS, 'vocabDescrioption', {}), obj.description, tbody);
  }
  if (obj.choice.seeAlso) {
    addURIDef(i18n.localize(specNLS, 'vocabSeeAlso', {}), obj.choice.seeAlso, tbody);
  }
};


const renderVocabularies = (node, toc) => {
  initHeaderCounters();
  vocs.forEach((vocab) => {
    const tocLi = renderHeader('5', getLabel(vocab.item), node, toc);
    const tocOl = createEl('ol', null, tocLi);
    const table = createEl('table', null, node);
    table.classList.add('data');
    createEl('colgroup', null, table).classList.add('header');
    createEl('colgroup', null, table).setAttribute('span', 1);
    const thead = createEl('thead', null, table);
    const htr = createEl('tr', null, thead);
    createEl('th', i18n.localize(specNLS, 'vocabTableHeadingLabel', {}), htr);
    createEl('th', i18n.localize(specNLS, 'vocabTableHeadingValue', {}), htr);
    const tbody = createEl('tbody', null, table);

    Object.keys(vocab.vals).forEach((val) => {
      const obj = vocab.vals[val];
      const tr = createEl('tr', null, tbody);
      const th = createEl('th', null, tr);
      createEl('a', obj.label, th).setAttribute('href', `#${obj.id}`);
      createEl('td', ns.shortenKnown(val), tr);
      renderSubHeader('5', getLabel(vocab.item), obj.label, node, tocOl, obj.id);
      renderTermDetails(vocab.item.getNodetype(), obj, node);
    });
  });
};

export {
  init,
  addVocabulary,
  renderVocabularies,
};