import {namespaces as ns} from 'rdfjson';

const createEl = (el, inner, parent) => {
  const element = document.createElement(el);
  if (inner != null) {
    element.innerText = inner;
  }
  parent.appendChild(element);
  return element;
};

const safeFragment = (field, str) => {
  if (field.getNodetype().indexOf('LITERAL') !== -1) {
    return encodeURIComponent(str);
  }
  return encodeURIComponent(ns.shortenKnown(str));
};

const addDef = (label, def = '', tbody) => {
  const tr = createEl('tr', null, tbody);
  createEl('th', label, tr);
  return createEl('td', def, tr);
};

const addURIDef = (label, def, tbody) => {
  const tr = createEl('tr', null, tbody);
  createEl('th', label, tr);
  const td = createEl('td', null, tr);
  const a = createEl('a', def, td);
  a.setAttribute('href', def);
  a.setAttribute('target', 'blank');
  return td;
};

let headerCounter = 0;
let subHeaderCounter = 0;
const initHeaderCounters = () => {
  headerCounter = 0;
  subHeaderCounter = 0;
};

let appendixCounter = 0;
const renderAppendixHeader = (name, node, toc) => {
  const id = String.fromCharCode('A'.charCodeAt(0)+appendixCounter);
  createEl('h2', `Appendix ${id} - ${name}`, node).setAttribute('id', `appendix-${id}`);
  const li = createEl('li', null, toc);
  const a = createEl('a', null, li);
  a.setAttribute('href', `#appendix-${id}`);
  createEl('span', id, a).classList.add('secno');
  createEl('span', name, a);
  return li;
};

const renderHeader = (chapter, header, node, toc, explicitId) => {
  headerCounter += 1;
  subHeaderCounter = 0;
  const id = `${chapter}.${headerCounter}`;
  createEl('h2', `${id} ${header}`, node).setAttribute('id', explicitId || id);
  const li = createEl('li', null, toc);
  const a = createEl('a', null, li);
  a.setAttribute('href', `#${explicitId || id}`);
  createEl('span', id, a).classList.add('secno');
  createEl('span', header, a);
  return li;
};

const renderSubHeader = (chapter, header, subHeader, node, toc, explicitId) => {
  subHeaderCounter += 1;
  const id = `${chapter}.${headerCounter}.${subHeaderCounter}`;
  const label = `${header} - ${subHeader}`;
  createEl('h3', `${id} ${label}`, node)
    .setAttribute('id', explicitId || id);
/*  if (!explicitId) {

    const li = createEl('li', null, toc);
    const a = createEl('a', null, li);
    a.setAttribute('href', `#${explicitId || id}`);
    createEl('span', id, a).classList.add('secno');
    createEl('span', subHeader, a);
  }*/
  return explicitId || id;
};

export {
  createEl,
  safeFragment,
  addDef,
  addURIDef,
  initHeaderCounters,
  renderHeader,
  renderSubHeader,
  renderAppendixHeader
};