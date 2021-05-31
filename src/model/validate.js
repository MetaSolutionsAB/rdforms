import { namespaces as ns } from '@entryscape/rdfjson';
import * as engine from './engine';

const _clearMatchingCodes = (binding) => {
  binding.setMatchingCode(engine.CODES.OK);
  if (binding.getItem().getType() === 'group') {
    binding.getChildBindings().forEach(childBinding => _clearMatchingCodes(childBinding));
  }
};

/**
 * Generates a report for the given binding. Below is an example of a report:
 * {
 *   errors: [{
 *      parentBinding: parent_group_binding_instance
 *      item: item_instance_where_error_is,
 *      code: "many"
 *   }, ...],
 *   warnings: [{
 *      parentBinding: parent_group_binding_instance
 *      item: item_instance_where_warning_is,
 *      code: "few"
 *   }, ...],
 *   deprecated: [binding_instance_of_deprecated_value, ...]
 * }
 *
 * @type {Object}
 */
const bindingReport = (groupbinding, reportObj) => {
  let _reportObj = reportObj;
  if (_reportObj == null) {
    _reportObj = { errors: [], warnings: [], deprecated: [] };
  } else {
    _reportObj.errors = _reportObj.errors || [];
    _reportObj.warnings = _reportObj.warnings || [];
    _reportObj.deprecated = _reportObj.deprecated || [];
  }
//  _clearMatchingCodes(groupbinding);
  // eslint-disable-next-line no-use-before-define
  return _createReport(groupbinding, _reportObj, true);
};

const _countValidBindings = (bindings) => {
  let counter = 0;
  for (let i = 0; i < bindings.length; i++) {
    if (bindings[i].isValid()) {
      counter += 1;
    }
  }
  return counter;
};

const updateViaCardinalityTracker = (bindings, code) => {
  if (bindings.length > 0) {
    const cardTr = bindings[0].getCardinalityTracker();
    cardTr.setCode(code);
  }
};

const doNotProceedFurther = (groupBinding, childItem) => {
  // Don't check further if the childItem is deprecated
  if (childItem.hasStyle('deprecated')) {
    return true;
  }

  // Don't check further if the binding is hidden due to missing dependencies
  const childPath = childItem.getDeps();
  if (childPath) {
    const fromBinding = engine.findBindingRelativeToParentBinding(groupBinding, childPath);
    if (!engine.matchPathBelowBinding(fromBinding, childPath)) {
      return true;
    }
  }
  return false;
};

const _createReport = (groupbinding, report, firstLevel) => {
  if (groupbinding.getMatchingCode() !== engine.CODES.OK) {
    return undefined;
  }
  const groupitem = groupbinding.getItem();

  // Abort check if the groupbinding is hidden due to a missing dependency.
  // Check disabled since it is done for each child before recursive call
 /* const path = groupitem.getDeps();
  if (path && groupbinding.getParent() != null) {
    const fromBinding = engine.findBindingRelativeToParentBinding(groupbinding.getParent(), path);
    if (!engine.matchPathBelowBinding(fromBinding, path)) {
      return undefined;
    }
  } */

  if (firstLevel === true || groupbinding.isValid() || groupitem.getProperty() == null
  || groupitem.hasStyle('atLeastOneChild') || groupitem.hasStyle('exactlyOneChild')) {
    const childrenItems = groupitem.getChildren();

    // disjoint is deprecated in favour of atMostOneChild
    if (groupitem.hasStyle('disjoint') || groupitem.hasStyle('atMostOneChild')
      || groupitem.hasStyle('atLeastOneChild') || groupitem.hasStyle('exactlyOneChild')) {
      const bindings = groupbinding.getChildBindings();
      const nrOfValid = _countValidBindings(bindings);
      let code;
      if (nrOfValid > 1 && (groupitem.hasStyle('disjoint') || groupitem.hasStyle('atMostOneChild'))) {
        code = engine.CODES.AT_MOST_ONE_CHILD;
      } else if (nrOfValid !== 1 && groupitem.hasStyle('exactlyOneChild')) {
        code = engine.CODES.EXACTLY_ONE_CHILD;
      } else if (nrOfValid === 0 && groupitem.hasStyle('atLeastOneChild')) {
        code = engine.CODES.AT_LEAST_ONE_CHILD;
      }
      if (code) {
        updateViaCardinalityTracker([groupbinding], code);
//        groupbinding.setMatchingCode(code);
        // Correct to set only on first child?
        if (childrenItems.length > 0) {
          report.errors.push({ parentBinding: groupbinding, item: childrenItems[0], code });
        }
      }
    } else {
      groupbinding.getItemGroupedChildBindings().forEach((bindings, index) => {
        const childItem = childrenItems[index];
        if (doNotProceedFurther(groupbinding, childItem)) {
          return;
        }

        if (childItem.getProperty() != null) {
          const nrOfValid = _countValidBindings(bindings);
          const card = childItem.getCardinality();
          if (card.min != null && card.min > nrOfValid) {
            report.errors.push({
              parentBinding: groupbinding,
              item: childItem,
              code: engine.CODES.TOO_FEW_VALUES_MIN,
            });
            updateViaCardinalityTracker(bindings, engine.CODES.TOO_FEW_VALUES_MIN);
/*            let counter = 0;
            bindings.forEach((binding) => {
              if (!binding.isValid()) {
                if (counter < card.min) {
                  counter += 1;
                  binding.setMatchingCode(engine.CODES.TOO_FEW_VALUES_MIN);
                }
              }
            }); */
          } else if (card.pref != null && card.pref > nrOfValid) {
            report.warnings.push({
              parentBinding: groupbinding,
              item: childItem,
              code: engine.CODES.TOO_FEW_VALUES_PREF,
            });
//            updateViaCardinalityTracker(bindings, engine.CODES.TOO_FEW_VALUES_PREF);
          }
          if (card.max != null && card.max < nrOfValid) {
            report.errors.push({
              parentBinding: groupbinding,
              item: childItem,
              code: engine.CODES.TOO_MANY_VALUES,
            });
            updateViaCardinalityTracker(bindings, engine.CODES.TOO_MANY_VALUES);
/*            let counter = 0;
            bindings.forEach((binding) => {
              if (binding.isValid()) {
                counter += 1;
                if (counter > card.max) {
                  binding.setMatchingCode(engine.CODES.TOO_MANY_VALUES);
                }
              }
            }); */
          }
        }
      }, this);
    }

    groupbinding.getChildBindings().forEach((binding) => {
      const item = binding.getItem();
      if (binding.getMatchingCode() !== engine.CODES.OK) {
        report.errors.push({
          parentBinding: binding,
          item,
          code: binding.getMatchingCode(),
        });
      }

      if (item.hasStyle('deprecated')) {
        report.deprecated.push(binding);
      }

      if (!doNotProceedFurther(groupbinding, item)) {
        // Recursive step
        if (item.getType() === 'group') {
          _createReport(binding, report);
        }
      }
    });
  }
  return report;
};

/**
 * Generates a report for all resources identified. Resources are identified
 * according to their type. If a resource is present in the graph but its type is not
 * in the type2template map it will not be in the report.
 * Each resource will be validated according to the template for its type.
 * Below is an example of a report:
 * {
 *    errors: 5,
 *    warnings: 10,
 *    deprecated: 1,
 *    mandatoryError: ["dcat:Dataset"]
 *    resources: [
 *       {
 *         uri: "http://example.com",
 *         type: "vcard:Kind",
 *         template: "vc:Kind",
 *         errors: [{
 *           path: "vcard:hasAddress > vcard:hasStreetAddress",
 *           code: "few"
 *         }],
 *         warnings: [{
 *           path: "vcard:hasFN",
 *           code: "few"
 *         }],
 *         deprecated: [https://challengesgov.se/challenge-sthlm/
 *           "vcard:fn"
 *         ]
 *       },
 *       ...
 *    ]
 * }
 *
 * @param {rdfjson/Graph} graph an rdf graph against which all validation is done
 * @param {Object} type2template a map between each type to check for and the template to use for validation
 * (the type may be given with namespace abbreviations)
 * @param {Array} mandatoryTypes an array of types to check that there are instances for
 * @return {Object} a report of the validity of the graph
 */
const graphReport = (graph, type2template, mandatoryTypes = []) => {
  const type2resources = {};
  const allResources = {};
  let template;
  let rr;
  const report = { errors: 0, warnings: 0, deprecated: 0, resources: [] };
  Object.keys(type2template).forEach((type) => {
    // eslint-disable-next-line no-use-before-define
    const resources = _findResources(graph, type);
    type2resources[type] = resources;
    resources.forEach((resource) => {
      allResources[resource] = true;
    });
  });

  Object.keys(type2resources).forEach((type) => {
    template = type2template[type];
    type2resources[type].forEach((resource) => {
      // eslint-disable-next-line no-use-before-define
      rr = _resourceReport(resource, graph, template, allResources);
      rr.uri = resource;
      rr.type = type;
      rr.template = template.getId();
      report.resources.push(rr);
      report.errors += rr.errors.length;
      report.warnings += rr.warnings.length;
      report.deprecated += rr.deprecated.length;
    });
  });

  const mandatoryError = [];
  mandatoryTypes.forEach((mt) => {
    if (type2resources[mt].length === 0) {
      mandatoryError.push(mt);
    }
  });
  if (mandatoryError.length > 0) {
    report.mandatoryError = mandatoryError;
    report.errors += mandatoryError.length;
  }
  return report;
};

const _findResources = (graph, cls) => graph.find(null, 'rdf:type', cls)
  .map(stmt => stmt.getSubject());

const _includeIssue = (binding, resource, otherResources) => {
  let pb = binding;
  while (true) {
    const uri = pb.getChildrenRootUri ? pb.getChildrenRootUri() : pb.getParent().getChildrenRootUri();
    if (uri === resource) {
      return true;
    } else if (otherResources[uri]) {
      return false;
    }
    pb = pb.getParent();
  }
};

const _createPath = (binding, item) => {
  let _binding = binding;
  const path = [];
  if (item.getProperty() != null && _binding.getItem() !== item) {
    path.push(ns.shorten(item.getProperty()));
  }
  while (true) {
    if (_binding.getItem().getProperty() != null) {
      path.push(ns.shorten(_binding.getItem().getProperty()));
    }

    if (_binding.getParent() == null) {
      break;
    } else {
      _binding = _binding.getParent();
    }
  }
  path.reverse();
  return path.join(' > ');
};

const _filterReport = (report, resource, otherResources) => {
  const { errors, warnings, deprecated } = report;
  report.errors = errors.filter(err => _includeIssue(err.parentBinding, resource, otherResources));
  report.warnings = warnings.filter(warn => _includeIssue(warn.parentBinding, resource, otherResources));
  report.deprecated = deprecated.filter(depr => _includeIssue(depr, resource, otherResources));
};

const _createDepPath = dep => `${_createPath(dep.getParent(), dep.getItem())} > ${dep.getValue()}`;

const _simplifyReport = (report) => {
  const { errors, warnings, deprecated } = report;
  report.errors = errors.map(err => ({ path: _createPath(err.parentBinding, err.item), code: err.code }));
  report.warnings = warnings.map(warn => ({ path: _createPath(warn.parentBinding, warn.item), code: warn.code }));
  report.deprecated = deprecated.map(dep => _createDepPath(dep));
};

const _resourceReport = (resource, graph, template, ignoreResources) => {
  const binding = engine.fuzzyMatch(graph, resource, template);
  const report = bindingReport(binding);
  _filterReport(report, resource, ignoreResources || {});
  _simplifyReport(report);
  return report;
};

export {
  graphReport,
  bindingReport,
};

export default { // TODO @valentino don't export default. Used in EntryScape
  graphReport,
  bindingReport,
};
