import {namespaces as ns} from 'rdfjson';

const matchRdfType = (item, type) => {
  const constr = item.getConstraints();
  return constr != null && constr[rdfType] === type;
};
const matchConstraint = (item, constraints) => {
  if (constraints == null) {
    return true;
  }
  const constr = item.getConstraints();
  let match = true;
  if (constr == null) {
    return false;
  }
  Object.keys(constr).find((key) => {
    const c = constraints[key];
    if (c !== '' && c !== '*' && c !== constr[key]) {
      match = false;
      return true;
    }
    return false;
  });
  return match;
};

const filterMethods = [
  'itemtype',
  'choices',
  'nodetype',
  'datatype',
  'rdftype',
  'constraint',
  'predicate',
  'style',
  'item',
  'check'];
const Filter = function (registry) {
  this.filterObj = {};
  this.registry = registry;
};

Filter.prototype.register = function (component) {
  this.registry.register(this.filterObj, component);
};

filterMethods.forEach((meth) => {
  Filter.prototype[meth] = function (value) {
    const cstr = {};
    switch (meth) {
      case 'constraint':
        Object.keys(value).forEach((key) => {
          const vv = value[key];
          if (Array.isArray(vv)) {
            cstr[ns.expand(key)] = vv.map(v => ns.expand(v));
          } else {
            cstr[ns.expand(key)] = ns.expand(vv);
          }
        });
        this.filterObj[meth] = cstr;
        break;
      case 'predicate':
      case 'rdftype':
      case 'datatype':
        this.filterObj[meth] = ns.expand(value);
        break;
      default:
        this.filterObj[meth] = value || true;
    }
    return this;
  };
});

export default class Registry {
  constructor() {
    this.components = [];
    this.priorities = {
      CHECK: 1,
      ITEMTYPE: 2,
      CHOICES: 4,
      NODETYPE: 8,
      DATATYPE: 16,
      RDFTYPE: 32,
      CONSTRAINT: 64,
      PREDICATE: 128,
      STYLE: 256,
      ITEM: 512,
    };
  }

  calculatePriority(item, filter) {
    let prio = 0;
    if (filter.itemtype) {
      prio += this.priorities.ITEMTYPE;
      if (item.getType() !== filter.itemtype) {
        return -1;
      }
    }

    if (filter.choices) {
      prio += this.priorities.CHOICES;
      switch (filter.choices) {
        case 'static':
          if (!item.hasStaticChoices()) {
            return -1;
          }
          break;
        case 'dynamic':
          if (!item.hasChoices() || item.hasStaticChoices()) {
            return -1;
          }
          break;
        case 'none':
          if (item.hasChoices()) {
            return -1;
          }
          break;
        case 'any':
        default:
          if (!item.hasChoices()) {
            return -1;
          }
      }
    }

    if (filter.nodetype) {
      prio += this.priorities.NODETYPE;
      if (item.getNodetype() !== filter.nodetype) {
        return -1;
      }
    }

    if (filter.datatype) {
      prio += this.priorities.DATATYPE;
      if (item.getDatatype() !== filter.datatype) {
        return -1;
      }
    }

    if (filter.rdftype) {
      prio += this.priorities.RDFTYPE;
      if (!matchRdfType(item, filter.rdftype)) {
        return -1;
      }
    }

    if (filter.constraint) {
      prio += this.priorities.CONSTRAINT;
      if (!matchConstraint(item, filter.constraint)) {
        return -1;
      }
    }

    if (filter.predicate) {
      prio += this.priorities.PREDICATE;
      if (item.getProperty() !== filter.predicate) {
        return -1;
      }
    }

    if (filter.style) {
      prio += this.priorities.STYLE;
      if (!item.hasStyle(filter.style)) {
        return -1;
      }
    }

    if (filter.item) {
      prio += this.priorities.ITEM;
      if (item !== filter.item && (!filter.item.getId || item.getId() !== filter.item.getId())) {
        return -1;
      }
    }

    if (filter.check) {
      if (!filter.check(item)) {
        return -1;
      }
    }

    return prio;
  }

  getPriority(item, component) {
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i].component === component) {
        const prio = this.calculatePriority(item, this.components[i].filter);
        if (prio >= 0) {
          return prio;
        }
      }
    }
    return 0;
  }

  getComponentBefore(item, component) {
    const limitprio = this.getPriority(item, component);
    return this.getComponent(item, limitprio);
  }

  getComponent(item, limitPrio) {
    let bestComponent;
    let bestPrio = -1;
    let prio;
    let component;
    for (let i = 0; i < this.components.length; i++) {
      component = this.components[i];
      prio = this.calculatePriority(item, component.filter);
      if (prio > bestPrio && (typeof limitPrio === 'undefined' || prio < limitPrio)) {
        bestComponent = component;
        bestPrio = prio;
      }
    }
    if (bestComponent) {
      return bestComponent.component;
    }
    return undefined;
  }

  register(filter, component) {
    this.components.push({component, filter});
  }

  itemtype(itemtype) {
    return (new Filter(this)).itemtype(itemtype);
  }

  choices(kindOfChoicesRequired) { // 'none', 'static', 'dynamic' or 'any', 'any' is default.
    return (new Filter(this)).choices(kindOfChoicesRequired);
  }

  nodetype(nodetype) {
    return (new Filter(this)).nodetype(nodetype);
  }

  datatype(datatype) {
    return (new Filter(this)).datatype(datatype);
  }

  rdftype(rdftype) {
    return (new Filter(this)).rdftype(rdftype);
  }

  constraint(constraint) {
    return (new Filter(this)).constraint(constraint);
  }

  predicate(predicate) {
    return (new Filter(this)).predicate(predicate);
  }

  style(style) {
    return (new Filter(this)).style(style);
  }

  item(item) {
    return (new Filter(this)).item(item);
  }

  check(func) {
    return (new Filter(this)).check(func);
  }
};
