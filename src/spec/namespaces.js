import {namespaces as ns} from 'rdfjson';
import {createEl, addDef} from './domUtils.js';

const nses = {};
const nsReg = (prop) => {
  const ify = ns.nsify(prop);
  nses[ify.abbrev] = true;
};

const renderNamespaces = (node) => {
  const nsReg = ns.registry();
  const table = createEl('table', null, node);
  table.classList.add('propdef');
  table.classList.add('def');
  const tbody = createEl('tbody', null, table);
  Object.keys(nses).forEach((n) => {
    addDef(n, nsReg[n], tbody);
  });
};

export {
  nsReg,
  renderNamespaces,
};