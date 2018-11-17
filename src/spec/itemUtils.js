import {namespaces as ns} from 'rdfjson';

const getConstrType = (item) => {
  const constr = item.getConstraints();
  if (constr) {
    const rdftype = constr['rdf:type'] || constr[ns.expand('rdf:type')];
    if (Array.isArray(rdftype)) {
      return ns.expand(rdftype[0]);
    }
    if (rdftype) {
      return ns.expand(rdftype);
    }
  }
  return undefined;
};

const getLabel = (item) => {
  let label = item.getLabel();
  if (!label) {
    label = getConstrType(item);
    if (label) {
      label = ns.shortenKnown(label);
    }
  }
  if (!label) {
    label = item.getId();
  }
  return label;
};

export {getConstrType, getLabel};