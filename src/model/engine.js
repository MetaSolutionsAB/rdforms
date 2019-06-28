import system from './system';
import PropertyGroup from '../template/PropertyGroup';
import Text from '../template/Text';
import Choice from '../template/Choice';
import Group from '../template/Group';
import PropertyGroupBinding from './PropertyGroupBinding';
import GroupBinding from './GroupBinding';
import ValueBinding from './ValueBinding';
import ChoiceBinding from './ChoiceBinding';
import utils from '../utils';

const kernel = require('dojo/_base/kernel'); // TODO replace

// See public API at the bottom of this file.

let _matchGroupItemChildren;
let _clearDibbs;
let _noDibbs;
let _dibbs;
let _createStatementsForConstraints;

const match = (graph, uri, template) => {
  const rootBinding = new GroupBinding({item: template, childrenRootUri: uri, graph});
  _matchGroupItemChildren(rootBinding);
  _clearDibbs(rootBinding);
  return rootBinding;
};

const constructTemplate = (graph, uri, itemStore, requiredItems) => {
  const props = graph.findProperties(uri);
  const items = [];
  const fixedProps = {};
  if (requiredItems != null) {
    const addProperty = (item) => {
      if (item.getProperty() != null) {
        fixedProps[item.getProperty()] = true;
      } else if (item instanceof Group) {
        item.getChildren().forEach(addProperty);
      }
    };
    const addItem = (item) => {
      if (item != null) {
        addProperty(item);
        items.push(item);
      }
    };
    requiredItems.forEach((id) => {
      let item = itemStore.getItem(id);
      if (item != null) {
        if (item instanceof Group && item.getProperty() == null) {
          item.getChildren().forEach(addItem);
        } else {
          addItem(item);
        }
      } else {
        item = itemStore.getItemByProperty(id);
        if (item) {
          addItem(item);
        } else {
          console.warn(`Warning, when autodetecting a template: Required item '${id
            }' is neither an id for a loaded item or a property for a loaded item, ignoring.`);
        }
      }
    });
  }
  props.forEach((prop) => {
    if (fixedProps[prop]) {
      return;
    }
    const item = itemStore.getItemByProperty(prop);
    if (item != null) {
      items.push(item);
    }
  }, this);
  // TODO sort according to priority.
  return itemStore.createTemplateFromChildren(items);
};

//= ==============================================
// Core creation engine
//= ==============================================
const _createTextItem = (parentBinding, item) => {
  const graph = parentBinding.getGraph();
  const nt = item.getNodetype();
  const obj = {value: '', type: 'literal'};
  if (nt === 'URI') {
    obj.type = 'uri';
  } else if (nt === 'DATATYPE_LITERAL') {
    obj.datatype = item.getDatatype();
  }
  const stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), obj, false);
  const nbinding = new ValueBinding({item, statement: stmt});
  parentBinding.addChildBinding(nbinding);
  const defaultValue = item.getValue();
  const cardTracker = nbinding.getCardinalityTracker();
  if (defaultValue != null && cardTracker.getCounter() === 1) {
    stmt.setValue(defaultValue, true);
    const dt = item.getDatatype();
    const la = item.getLanguage();
    if (dt != null) {
      stmt.setDatatype(dt, true);
    } else if (la != null) {
      stmt.setLanguage(la, true);
    }
  }
  return nbinding;
};

const _createChoiceItem = (parentBinding, item) => {
  const graph = parentBinding.getGraph();
  const nt = item.getNodetype();
  const obj = {type: 'literal', value: ''};
  if (nt === 'DATATYPE_LITERAL') {
    obj.datatype = item.getDatatype();
  } else if (nt === 'RESOURCE' || nt === 'URI') {
    obj.type = 'uri';
  }
  const stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), obj, false);
  const nbinding = new ChoiceBinding({item, statement: stmt});
  parentBinding.addChildBinding(nbinding);
  const defaultValue = item.getValue();
  const cardTracker = nbinding.getCardinalityTracker();
  if (defaultValue != null && cardTracker.getCounter() === 1) {
    nbinding.setChoice(_findChoice(item, defaultValue, graph), true);
  }
  return nbinding;
};

const _createGroupItem = (parentBinding, item, parentItems) => {
  let stmt;
  let constr;
  if (item.getProperty() !== undefined) {
    const graph = parentBinding.getGraph();
    if (item.getNodetype() === 'URI') {
      stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), {
        type: 'uri',
        value: system.createURI(item, parentBinding)
      }, false);
    } else {
      stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), null, false);
    }
    constr = _createStatementsForConstraints(graph, stmt.getValue(), item);
  }

  const nBinding = new GroupBinding({item, statement: stmt, constraints: constr});
  parentBinding.addChildBinding(nBinding);

  // Only do loop detection for items that are stored in the itemStore and hence are
  // used in more than one place.
  const itemId = item._source['@id'];
  if (itemId) {
    // If loop stop.
    if (parentItems[itemId]) {
      return nBinding;
    }
    parentItems[itemId] = true;
  }
  // Do not create substructures directly, let the view model and user interaction decide
  // when to create children.
  /*
  array.forEach(item.getChildren(), function(childItem) {
       create(nBinding, childItem, parentItems);
  });*/
  return nBinding;
};

const _createPropertyGroupItem = (parentBinding, item) => {
  let stmt;
  let constr;
  const oItem = item.getChildren()[1];
  const graph = parentBinding.getGraph();
  if (oItem instanceof Group) {
    stmt = graph.create(parentBinding.getChildrenRootUri(), '', null, false);
    constr = _createStatementsForConstraints(graph, stmt.getSubject(), oItem);
  } else if (oItem instanceof Choice) {
    stmt = graph.create(parentBinding.getChildrenRootUri(), '', {type: 'uri', value: ''}, false);
  } else {
    stmt = graph.create(parentBinding.getChildrenRootUri(), '', {
      type: 'literal',
      value: ''
    }, false);
  }

  const nBinding = new PropertyGroupBinding({item, statement: stmt, constraints: constr});
  parentBinding.addChildBinding(nBinding);
  if (oItem instanceof Group) {
    oItem.getChildren().forEach((childItem) => {
      create(nBinding.getObjectBinding(), childItem);
    });
  }
  return nBinding;
};
const create = (parentBinding, item, parentItems) => {
  if (item instanceof Text) {
    return _createTextItem(parentBinding, item);
  } else if (item instanceof PropertyGroup) {
    return _createPropertyGroupItem(parentBinding, item);
  } else if (item instanceof Group) {
    return _createGroupItem(parentBinding, item, parentItems || {});
  } else if (item instanceof Choice) {
    return _createChoiceItem(parentBinding, item);
  }
  return undefined;
};

// ===============================================
// Core matching engine
// ===============================================

let _matchItem;
let _isNodeTypeMatch;
let _isPatternMatch;
let _findChoice;
let _findStatementsForConstraints;

_matchGroupItemChildren = (pb) => {
  pb.getItem().getChildren().forEach((item) => {
    _matchItem(pb, item);
  });
};

const _matchGroupItem = (pb, item) => {
  let stmts;
  let bindings;
  let constStmts;
  let groupBinding;
  const graph = pb.getGraph();
  // Case 1: there is a property in the item
  if (item.getProperty() !== undefined) {
    stmts = graph.find(pb.getChildrenRootUri(), item.getProperty());
    if (stmts.length > 0) {
      bindings = [];
      stmts.forEach((stmt) => {
        if (_noDibbs(stmt) && _isNodeTypeMatch(item, stmt) && _isPatternMatch(item, stmt)) {
          constStmts = _findStatementsForConstraints(graph, stmt.getValue(), item);
          if (constStmts !== undefined) {
            _dibbs(stmt);
            groupBinding = new GroupBinding({item, statement: stmt, constraints: constStmts});
            bindings.push(groupBinding);
            _matchGroupItemChildren(groupBinding); // Recursive call
          }
        }
      });
      pb.addChildBindings(bindings);
    }
    // Case 2: there is no property in the item, i.e. a layout item.
  } else {
    groupBinding = new GroupBinding({item});
    pb.addChildBindings([groupBinding]);
    _matchGroupItemChildren(groupBinding); // Recursive call
  }
};

const _matchPropertyGroupItem = (pb, item) => {
  const pItem = item.getPropertyItem();
  const oItem = item.getObjectItem();
  const graph = pb.getGraph();
  let constStmts;
  let binding;
  let pChoice;
  let oChoice;
  const bindings = [];
  graph.find(pb.getChildrenRootUri()).forEach((stmt) => {
    if (_noDibbs(stmt) && _isNodeTypeMatch(oItem, stmt) && _isPatternMatch(oItem, stmt)) {
      pChoice = _findChoice(pItem, stmt.getPredicate(), stmt.getGraph());
      if (pChoice !== undefined) {
        binding = null;
        if (oItem instanceof Group) {
          constStmts = _findStatementsForConstraints(graph, stmt.getValue(), oItem);
          if (constStmts !== undefined) {
            _dibbs(stmt);
            binding = new PropertyGroupBinding({
              item,
              statement: stmt,
              constraints: constStmts,
            });
            _matchGroupItemChildren(binding.getObjectBinding()); // Recursive call
          }
        } else if (oItem instanceof Choice) {
          oChoice = _findChoice(oItem, stmt.getValue(), stmt.getGraph());
          if (oChoice !== undefined) {
            _dibbs(stmt);
            binding = new PropertyGroupBinding({item, statement: stmt});
            binding.getObjectBinding().setChoice(oChoice);
          }
        } else {
          _dibbs(stmt);
          binding = new PropertyGroupBinding({item, statement: stmt});
        }

        if (binding !== null) {
          binding.getPredicateBinding().setChoice(pChoice);
          bindings.push(binding);
        }
      }
    }
  });
  if (bindings.length > 0) {
    pb.addChildBindings(bindings);
  }
};

const _matchTextItem = (pb, item) => {
  if (item.getProperty() == null) {
    return;
  }
  const bindings = [];
  pb.getGraph().find(pb.getChildrenRootUri(), item.getProperty()).forEach((stmt) => {
    if (_noDibbs(stmt) && _isNodeTypeMatch(item, stmt) && _isPatternMatch(item, stmt)) {
      _dibbs(stmt);
      bindings.push(new ValueBinding({item, statement: stmt}));
    }
  });
  if (bindings.length > 0) {
    pb.addChildBindings(bindings);
  }
};

const _matchChoiceItem = (pb, item) => {
  if (item.getProperty() == null) {
    return;
  }
  const bindings = [];
  pb.getGraph().find(pb.getChildrenRootUri(), item.getProperty()).forEach((stmt) => {
    if (_noDibbs(stmt) && _isNodeTypeMatch(item, stmt) && _isPatternMatch(item, stmt)) {
      const choice = _findChoice(item, stmt.getValue(), stmt.getGraph());
      if (choice !== undefined) {
        _dibbs(stmt);
        bindings.push(new ChoiceBinding({item, statement: stmt, choice}));
      }
    }
  });
  if (bindings.length > 0) {
    pb.addChildBindings(bindings);
  }
};

_matchItem = (pb, item) => {
  if (item instanceof Choice) {
    _matchChoiceItem(pb, item);
  } else if (item instanceof PropertyGroup) {
    _matchPropertyGroupItem(pb, item);
  } else if (item instanceof Group) {
    _matchGroupItem(pb, item);
  } else if (item instanceof Text) {
    _matchTextItem(pb, item);
  }
};

// ===============================================
// Utility functions used for matching purposes
// ===============================================

/**
 * Compares the the type specified in the item and the type of the statements object.
 * @param {rdforms/template/Item} item
 * @param {jsonrdf/Statement} stmt
 */
_isNodeTypeMatch = (item, stmt) => {
  const objectType = stmt.getType();
// eslint-disable-next-line default-case
  switch (item.getNodetype()) {
    case 'LITERAL':      // Any form of literal
    case 'ONLY_LITERAL':  // No language, no datatype
    case 'PLAIN_LITERAL':  // No datatype, perhaps a language
    case 'LANGUAGE_LITERAL':  // Definitely a language
      return objectType === 'literal';
    case 'DATATYPE_LITERAL':     // Definitiely a datatype
      return objectType === 'literal' && stmt.getDatatype() === item.getDatatype();
    case 'RESOURCE':
      return objectType === 'uri' || objectType === 'bnode';
    case 'URI':
      return objectType === 'uri';
    case 'BLANK':
      return objectType === 'bnode';
  }
  return false;
};

_isPatternMatch = (item, stmt) => {
  const pattern = item.getPattern();
  const value = utils.extractGist(stmt.getValue(), item.getValueTemplate());
  if (typeof pattern !== 'undefined') {
    try {
      return (new RegExp(`^${pattern}$`)).test(value);
    } catch (e) {
      return true;
    }
  }
  return true;
};

/**
 * Matches constraints in the item to statements in the graph with the given uri as subject.
 *
 * @param {rdfjson/Graph} graph containing all available statements to match against.
 * @param {String} uri the subject to start matching from
 * @param {rdforms/template/Item} item containing the constraints.
 * @return an array of statements on success, undefined on failure.
 *  If there are no constraints to match in the item an empty array is returned.
 */
_findStatementsForConstraints = (graph, uri, item) => {
  let stmts;
  const constr = item.getConstraints();
  const results = [];
  const f = (predicate, object) => {
    stmts = graph.find(uri, predicate, {type: 'uri', value: object});
    if (stmts.length === 1) {
      results.push(stmts[0]);
      return undefined;
    }
    return false;
  };
  if ((typeof constr === 'object') && (constr !== null)) {
    const keys = Object.keys(constr);
    for (let idx = 0; idx < keys.length; idx++) {
      const key = keys[idx];
      const obj = constr[key];
      if (obj instanceof Array) {
        let noMatch = true;
        obj.forEach((o) => {
          if (f(key, o) !== false) {
            noMatch = false;
          }
        });
        if (noMatch) {
          return undefined;
        }
      } else if (f(key, obj) === false) {
        return undefined;
      }
    }
    return results;
  }
  return [];
};

_createStatementsForConstraints = (graph, uri, item) => {
  const results = [];
  const constr = item.getConstraints()
  if ((typeof constr === 'object') && (constr !== null)) {
    Object.keys(constr).forEach((key) => {
      const obj = constr[key];
      if (Array.isArray(obj)) {
        results.push(graph.create(uri, key, {type: 'uri', value: obj[0]}, false));
      } else {
        results.push(graph.create(uri, key, {type: 'uri', value: obj}, false));
      }
    });
  }
  return results;
};

_findChoice = (item, obj, graph) => {
  let index;
  let choices;
  if (item.hasChoices()) {
    choices = item.getChoices();
    for (index = 0; index < choices.length; index++) {
      if (choices[index].value === obj) {
        return choices[index];
      }
    }
    if (!item.hasStyle('strictmatch')) {
      return {value: obj, label: {'': obj}, mismatch: true};
    }
  } else {
    const label = utils.getLocalizedMap(graph, obj, item.getLabelProperties());
    const sa = graph.findFirstValue(obj, ChoiceBinding.seeAlso);
    if (label != null) {
      const choice = {label, value: obj};
      if (sa) {
        choice.seeAlso = sa;
      }
      return choice;
    } else if (system.getChoice != null) {
      return system.getChoice(item, obj, sa, graph);
    }
  }
  return undefined;
};

_dibbs = (stmt) => {
  stmt._dibbs = true;
};

_noDibbs = stmt => stmt._dibbs !== true;

_clearDibbs = (groupBinding) => {
  let i;
  let j;
  let arr;
  const arrarr = groupBinding.getItemGroupedChildBindings() || [];
  for (i = 0; i < arrarr.length; i++) {
    arr = arrarr[i];
    for (j = 0; j < arr.length; j++) {
      const binding = arr[j];
      if (binding._statement) {
        delete binding._statement._dibbs;
      }
      if (binding instanceof GroupBinding || binding instanceof PropertyGroupBinding) {
        _clearDibbs(binding);
      }
    }
  }
};

const findFirstValueBinding = (binding, createIfMissing) => {
  if (binding instanceof ValueBinding) {
    return binding;
  }
  const cbs = binding.getItemGroupedChildBindings();
  for (let idx = 0; idx < cbs.length; idx++) {
    const vbs = cbs[idx];
    const childItem = binding.getItem().getChildren()[idx];
    if (vbs.length !== 0) {
      if (!(childItem instanceof Text)) {
        return findFirstValueBinding(vbs[0]);
      } else if (childItem.getNodetype() === 'LANGUAGE_LITERAL') {
        const result = {firstValue: vbs[0]};
        for (let i = 0; i < vbs.length; i++) {
          const l = vbs[i].getLanguage();
          if (l == null) {
            result.emptyLanguageValue = vbs[i];
          } else if (l === kernel.locale) {
            result.perfectLocaleLanguageValue = vbs[i];
          } else if (l.substring(0, 1) === kernel.locale.substring(0, 1)) {
            result.localeLanguageValue = vbs[i];
          } else if (l.indexOf('en') !== -1) {
            result.defaultLanguageValue = vbs[i];
          } else {
            result.anyLanguageValue = vbs[i];
          }
        }
        return result.perfectLocaleLanguageValue ||
          result.localeLanguageValue ||
          result.defaultLanguageValue ||
          result.anyLanguageValue ||
          result.firstValue;
      }
      return vbs[0];
    } else if (createIfMissing) {
      const b = create(binding, childItem, {});
      if (b instanceof ValueBinding) {
        b.setLanguage(kernel.locale);
        return b;
      }
      return findFirstValueBinding(b, true);
    }
  }
  return undefined;
};

const matchPathBelowBinding = (bindingTree, path) => {
  const _path = path[0] === '/' ? path.slice(1) : path;
  const gb = bindingTree.getItemGroupedChildBindings();
  const pred = _path[0];
  for (let i = 0; i < gb.length; i++) {
    const bindings = gb[i];
    let res;
    for (let j = 0; j < bindings.length; j++) {
      let b = bindings[j];
      let item = b.getItem();
      // Empty property choices.
      if (item instanceof Choice
        && typeof item.getProperty() === 'undefined'
        && pred === item.getId()
        && (_path.length === 2 && _path[1] === b.getValue())) {
        return b;
      }
      if (!b.isValid()) {
// eslint-disable-next-line no-continue
        continue;
      }
      if (item.getType() === 'propertygroup') {
        b = b.getObjectBinding();
        item = b.getItem();
      } else if (typeof item.getProperty() === 'undefined') {
        res = matchPathBelowBinding(b, _path);
        if (res) {
          return res;
        }
      }
      if (pred === '*' || pred === b.getPredicate()) {
        if (item.getType() === 'group') {
          res = matchPathBelowBinding(b, _path.slice(1));
          if (res) {
            return res;
          }
        } else if (_path.length === 1 || _path[1] === '*'
          || _path[1] === b.getValue()) {
          return b;
        }
      }
    }
  }
  return undefined;
};

const findBindingRelativeToParentBinding = (parentBinding, path) => {
  const first = path[0];
  let b = parentBinding;
  if (first === '/') {
    while (b.getParent()) {
      b = b.getParent();
    }
    return b;
  } else if (first === '..') {
    for (let i = 0; i < path.length; i++) {
      if (path[i] === '..' && b.getParent()) {
        b = b.getParent();
      } else {
        return b;
      }
    }
    return b;
  }
  return parentBinding;
};

const findPopularChoice = (choiceItem, rootBinding) => {
  const id = choiceItem.getId();
  const values = {};
  const val2choice = {};
  choiceItem.getChoices().forEach((choice) => {
    values[choice.value] = 0;
    val2choice[choice.value] = choice;
  });
  const recurse = (groupB) => {
    groupB.getChildBindings().forEach((cb) => {
      const deps = cb.getItem().getDeps();
      if (deps && (deps[0] === id || (deps[0] === '/' && deps[1] === id))) {
        const val = deps[0] === '/' ? deps[2] : deps[1];
        const counter = values[val];
        if (typeof counter !== 'undefined') {
          values[val] = counter + 1;
        }
      }
    });
  };
  recurse(rootBinding);

  let popularCount = 0;
  let value;
  Object.keys(values).forEach((val) => {
    if (!value || values[val] > popularCount) {
      value = val;
      popularCount = values[val];
    }
  });
  return val2choice[value];
};

const _levelProfile = (profile, item, ignoreTopLevelGroup) => {
  const card = item.getCardinality();
  if (!ignoreTopLevelGroup || item.getType() !== 'group') {
    if (card != null) {
      if (card.min > 0) {
        profile.mandatory += 1;
      } else if (card.pref > 0) {
        profile.recommended += 1;
      } else {
        profile.optional += 1;
      }
    } else {
      profile.optional += 1;
    }
  }
  if (item.getType() === 'group') {
    item.getChildren().forEach(i => _levelProfile(profile, i));
  }
  return profile;
};

const levelProfile = (item) => {
  const profile = _levelProfile({mandatory: 0, recommended: 0, optional: 0}, item, true);
  profile.itemCount = profile.mandatory + profile.recommended + profile.optional;
  return profile;
};

const detectLevel = (profile) => {
  if (profile.mandatory > 0) {
    if (profile.recommended === 0 && profile.optional === 0) {
      return 'mandatory';
    } else if (profile.optional === 0) {
      return 'mixed_mandatory_recommended';
    } else if (profile.recommended === 0) {
      return 'mixed_mandatory_optional';
    }
  } else if (profile.recommended > 0) {
    if (profile.optional === 0) {
      return 'recommended';
    }
    return 'mixed_recommended_optional';
  } else if (profile.recommended === 0 && profile.recommended > 0 && profile.optional === 0) {
    return 'optional';
  }
  return 'mixed_all';
};

//= ==============================================
// Public API for matching and creation engine
//= ==============================================
/**
 * Matches a tree of statements with the uri as root
 * according to the constraints of the given template.
 * All the statements matched are found in the graph.
 * All statements in the graph that could be matched into the tree
 * are matched into the tree.
 * The tree is represented as a binding tree.
 *
 * @param {rdfjson/Graph} graph
 * @param {String} uri
 * @param {rdforms/template/Item} template
 * @return {rdforms/model/GroupBinding} which is the root of binding tree.
 */
export {match};

export {matchPathBelowBinding};
export {findBindingRelativeToParentBinding}

/**
 * Finds the choice in a choice item that are the most popular, i.e. the choice that most
 * valid bindings hava a dependency to.
 * @param {rdforms/template/Choice} choiceItem
 * @param {rdforms/model/GroupBinding} rootBinding
 */
export {findPopularChoice}

/**
 * Constructs a template by finding an item per outgoing property for provided graph and
 * resource starting point.
 *
 * @param {Object} graph
 * @param {Object} uri
 * @param {Object} itemStore
 * @param {Array} requiredItems an array of required items specified by id or property that
 * will be enforced independent of corresponding property exists in the graph or not.
 * @return {rdforms/template/Item} the constructed template.
 */
export {constructTemplate};

/**
 * Creates a new binding below the given parentBinding according to what the item specifies.
 * New triples are created in the provided graph although not expressed if they have an
 * empty predicate or object. The item must be a direct child of the item
 * of the parentBinding.
 *
 * @param {rdforms/model/Binding} parentBinding
 * @param {rdforms/template/Item} item
 * @param {Object} parentItems is a hash of parent Items to use for loop detection.
 */
export {create};

/**
 * Finds the first value binding in a binding tree, depth first.
 * If multiple value bindings are found with nodeType LANGUAGE_LITERAL
 * on the same level, the binding with the most appropriate language is chosen.
 * Most appropriate means checking for:
 * 1) exact current language (e.g. en_US),
 * 2) current language (e.g. matches en even if locale is en_US)
 * 3) default language (currently set to en)
 * 4) any literal with a language set found
 * 5) the first literal found
 *
 * @return {rdforms/model/ValueBinding}
 */
export {findFirstValueBinding};

/**
 * Calculates the level profile, i.e. the amount of items on mandatory, recommended
 * and optional level in a given template.
 *
 * @param {rdforms/template/Item} item
 * @return {Object} with keys mandatory, recommended and optional, each pointing to an integer.
 */
export {levelProfile};

/**
 * Investigates a level profile and provides the following responses:
 * * mandatory   - only mandatory items
 * * recommended - only recommended items
 * * optional    - only optional items
 * * mixed_all   - a mix of all items
 * * mixed_mandatory_recommended - only mandatory and recommended items
 * * mixed_mandatory_optional    - only mandatory and optional items
 * * mixed_recommended_optional  - only recommended and optional items
 * @param {object} profile as provided by the levelProfile function.
 * @return {string} one of the responses outlined
 */
export {detectLevel};

const CODES = {
  TOO_FEW_VALUES: 'few',
  TOO_MANY_VALUES: 'many',
  TOO_MANY_VALUES_DISJOINT: 'disjoint',
};

export {CODES}


export default { // TODO @valentino anti-pattern. This is done because engine is used in EntryScape. It shouldn't really...
  detectLevel,
  levelProfile,
  findFirstValueBinding,
  create,
  constructTemplate,
  findPopularChoice,
  match,
  matchPathBelowBinding,
  findBindingRelativeToParentBinding,
  CODES,
}
