import {getLabel, getConstrType} from './itemUtils.js';
import {createEl, addDef, renderHeader, renderSubHeader, initHeaderCounters} from './domUtils.js';
import {addVocabulary} from './vocab.js';
import {nsReg} from './namespaces.js';
import {namespaces as ns} from 'rdfjson';

const type2form = {};
let inlineFormCounter = 0;
let inline = [];
const findInlineObj = (item) => {
  const rdftype = getConstrType(item);
  return type2form[rdftype] || inline.find((obj) => {
    return item === obj.item;
  });
};
const indexForms = (items, supportive) => {
  items.forEach((item) => {
    const rdftype = getConstrType(item);
    if (rdftype) {
      type2form[rdftype] = {
        item,
        rdftype,
        label: getLabel(item),
        id: encodeURIComponent(ns.shortenKnown(rdftype)),
      };
      if (supportive) {
        inline.push(type2form[rdftype]);
      }
    }

    const perChild = (childItem) => {
      if (childItem.getType() === 'group') {
        if (childItem.getProperty()) {
          const rdftype = getConstrType(childItem);
          let id;
          if (rdftype) {
            if (findInlineObj(childItem)) {
              return;
            }
            id = rdftype;
          } else if (childItem.getId()) {
            id = childItem.getId();
          } else {
            inlineFormCounter += 1;
            id = `internal${inlineFormCounter}`;
          }
          id = encodeURIComponent(id);
          const obj = {
            id,
            label: getLabel(childItem),
            item: childItem,
            rdftype
          };
          inline.push(obj);
        } else {
          childItem.getChildren().forEach(perChild);
        }
      }
    };

    item.getChildren().forEach(perChild);
    return inline;
  });
};

let chapter;
const renderFormHeader = (item, node, toc) => {
  const obj = type2form[getConstrType(item)];
  if (obj) {
    return renderHeader(chapter, obj.label, node, toc, obj.id);
  } else {
    return renderHeader(chapter, getLabel(item), node, toc);
  }
};

const idIdx = {};

const renderFieldHeader = (item, field, node, toc) => {
  let rdfTypeItem = getConstrType(item);
  if (rdfTypeItem) {
    rdfTypeItem = ns.shortenKnown(rdfTypeItem);
  }
  let id = encodeURIComponent(`${rdfTypeItem || item.getId() || item.extends()}-${ns.shortenKnown(field.getProperty())}`.replace(/:/g, '_'));
  let nr = idIdx[id];
  if (nr !== undefined) {
    nr += 1;
    idIdx[id] = nr;
    id = `${id}-${nr}`;
  } else {
    idIdx[id] = 1;
  }
  return renderSubHeader(chapter, getLabel(item), getLabel(field), node, toc, id);
};

const getStringRange = (field) => {
  switch (field.getNodetype()) {
    case 'ONLY_LITERAL':
      return "Literal";
    case 'LITERAL':
    case 'LANGUAGE_LITERAL':
      return "Literal with a language";
    case 'DATATYPE_LITERAL':
      return `Literal in the form of a ${ns.shortenKnown(field.getDatatype())} datatype`;
    case 'URI':
      return "Web address (URI)";
  }
};

const addRange = (field, tbody) => {
  const td = addDef('Range', '', tbody);
  switch(field.getType()) {
    case 'text':
      td.innerText = getStringRange(field);
      break;
    case 'choice':
      const rdftype = getConstrType(field);
      if (field.hasChoices()) {
        addVocabulary(field, td);
      } else if (rdftype) {
        const obj = type2form[rdftype];
        if (obj) {
          createEl('span', 'Entity described by ', td);
          const a = createEl('a', obj.label, td);
          a.setAttribute('href', `#${obj.id}`);
        }
      }
      break;
    case 'group':
      const obj = findInlineObj(field);
      if (obj) {
        createEl('span', 'Entity described by ', td);
        const a = createEl('a', obj.label, td);
        a.setAttribute('href', `#${obj.id}`);
      }
      break;
  }
};

const renderFieldDetails = (field, node) => {
  const table = createEl('table', null, node);
  table.classList.add('propdef');
  table.classList.add('def');
  const tbody = createEl('tbody', null, table);
  addDef('Label', `${getLabel(field)}`, tbody);
  addDef('Description', field.getDescription(), tbody);
  addDef('Property', rdfjson.namespaces.expand(field.getProperty()), tbody);
  addRange(field, tbody);
  const card = field.getCardinality() || {};
  if (card.min > 0) {
    addDef('Cardinality', 'Mandatory', tbody);
  } else if (card.pref > 0) {
    addDef('Cardinality', 'Recommended', tbody);
  } else {
    addDef('Cardinality', 'Optional', tbody);
  }
};

const renderField = (item, node, field, tbody, tocOl) => {
  if (!field.hasStyle('deprecated')) {
    if (!field.getProperty()) {
      if (field.getType() === 'group') {
        field.getChildren().forEach((field2) => {
          renderField(item, node, field2, tbody, tocOl);
        });
      }
    } else {
      const id = renderFieldHeader(item, field, node, tocOl);
      const tr = createEl('tr', null, tbody);
      const th = createEl('th', null, tr);
      createEl('a', getLabel(field), th).setAttribute('href', `#${id}`);
      const prop = ns.expand(field.getProperty());
      nsReg(prop);
      createEl('td', ns.shortenKnown(prop), tr);
      const card = field.getCardinality() || {};
      if (card.min > 0) {
        createEl('td', 'mandatory', tr);
      } else if (card.pref > 0) {
        createEl('td', 'recommended', tr);
      } else {
        createEl('td', 'optional', tr);
      }
      renderFieldDetails(field, node);
    }
  }
};

const renderForm = (item, node, toc, id) => {
  const tocLi = renderFormHeader(item, node, toc, id);
  const tocOl = createEl('ol', null, tocLi);
  const rdftype = getConstrType(item);
  if (rdftype) {
    createEl('strong', 'Class: ', node);
    createEl('span', rdftype, node);
  }
  const desc = item.getDescription();
  if (desc) {
    createEl('p', desc, node);
  }
  const table = createEl('table', null, node);
  table.classList.add('data');
  createEl('colgroup', null, table).classList.add('header');
  createEl('colgroup', null, table).setAttribute('span', 2);
  const thead = createEl('thead', null, table);
  const htr = createEl('tr', null, thead);
  createEl('th', null, htr);
  createEl('th', 'Property', htr);
  createEl('th', 'Cardinality', htr);
  const tbody = createEl('tbody', null, table);

  item.getChildren().forEach((field) => {
    renderField(item, node, field, tbody, tocOl);
  });
};

const renderForms = (main, supportive) => {
  indexForms(supportive.items, true);
  indexForms(main.items);
  chapter = '3';
  main.items.forEach(item => renderForm(item, main.node, main.nodeToc));
  initHeaderCounters();
  chapter = '4';
  inline.forEach(obj => renderForm(obj.item, supportive.node, supportive.nodeToc, obj.id));
};

export {renderForms};