import * as engine from './engine';
import {namespaces as ns} from 'rdfjson';

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
  if (reportObj == null) {
    reportObj = { errors: [], warnings: [], deprecated: [] };
  } else {
    reportObj.errors = reportObj.errors || [];
    reportObj.warnings = reportObj.warnings || [];
    reportObj.deprecated = reportObj.deprecated || [];
  }
  return _createReport(groupbinding, reportObj, true);
};

const _countValidBindings = (bindings) => {
  let counter = 0;
  for (let i = 0; i < bindings.length; i++) {
    if (bindings[i].isValid()) {
      counter++;
    }
  }
  return counter;
};

const _createReport = (groupbinding, report, firstLevel) => {
  let groupitem = groupbinding.getItem();
  let path = groupitem.getDeps();
  if (path && groupbinding.getParent() != null) {
    let fromBinding = engine.findBindingRelativeToParentBinding(groupbinding.getParent(), path);
    if (!engine.matchPathBelowBinding(fromBinding, path)) {
      return;
    }
  }

  if (firstLevel === true || groupbinding.isValid() || groupitem.getProperty() == null) {
    let childrenItems = groupitem.getChildren();

    if (groupitem.hasStyle("disjoint")) {
      let bindings = groupbinding.getChildBindings();
      let nrOfValid = _countValidBindings(bindings);
      if (nrOfValid > 1) {
        groupbinding.error = engine.CODES.TOO_MANY_VALUES;
        report.errors.push({
          parentBinding: groupbinding,
          item: bindings[0].getItem(),
          code: engine.CODES.TOO_MANY_VALUES_DISJOINT
        });
        let counter = 0;
        bindings.forEach((binding, idx) => {
          if (binding.isValid()) {
            if (counter > 0) {
              binding.error = engine.CODES.TOO_MANY_VALUES_DISJOINT;
            }
            counter++;
          }
        });
      }
      bindings.forEach((binding) => {
        let item = binding.getItem();
        if (item.hasStyle("deprecated")) {
          report.deprecated.push(binding);
        }
      });
    } else {
      groupbinding.getItemGroupedChildBindings().forEach((bindings, index) => {
        let item = childrenItems[index];
        if (item.hasStyle("deprecated")) {
          bindings.forEach((binding) => report.deprecated.push(binding));
          return;
        }
        let path = item.getDeps();
        if (path) {
          let fromBinding = engine.findBindingRelativeToParentBinding(groupbinding, path);
          if (!engine.matchPathBelowBinding(fromBinding, path)) {
            return;
          }
        }

        if (item.getProperty() != null) {
          let nrOfValid = _countValidBindings(bindings);
          let card = item.getCardinality();
          if (card.min != null && card.min > nrOfValid) {
            report.errors.push({
              parentBinding: groupbinding,
              item: item,
              code: engine.CODES.TOO_FEW_VALUES
            });
          } else if (card.pref != null && card.pref > nrOfValid) {
            report.warnings.push({
              parentBinding: groupbinding,
              item: item,
              code: engine.CODES.TOO_FEW_VALUES
            });
          }
          if (card.max != null && card.max < nrOfValid) {
            report.errors.push({
              parentBinding: groupbinding,
              item: item,
              code: engine.CODES.TOO_MANY_VALUES
            });
            let counter = 0;
            bindings.forEach((binding) => {
              if (binding.isValid()) {
                counter++;
                if (counter > card.max) {
                  binding.error = engine.CODES.TOO_MANY_VALUES;
                }
              }
            });
          }
        }
        // if (item instanceof GroupBinding){
        if (item.getType() === "group") {
          bindings.forEach(binding => _createReport(binding, report));
        }
      }, this);
    }
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
 *         deprecated: [
 *           "vcard:fn"
 *         ]
 *       },
 *       ...
 *    ]
 * }
 *
 * @param {rdfjson/Graph} graph an rdf graph against which all validation is done
 * @param {Object} type2template a map between each type to check for and the template to use for validation (the type may be given with namespace abbreviations)
 * @param {Array} mandatoryTypes an array of types to check that there are instances for
 * @return {Object} a report of the validity of the graph
 */
const graphReport = (graph, type2template, mandatoryTypes=[]) => {
  let resources, type2resources = {}, allResources = {}, cls, template, rr,
    report = { errors: 0, warnings: 0, deprecated: 0, resources: [] };
  for (cls in type2template) if (type2template.hasOwnProperty(cls)) {
    resources = type2resources[cls] = _findResources(graph, cls);
    resources.forEach((resource) => {
      allResources[resource] = true
    });
  }

  for (cls in type2resources) if (type2resources.hasOwnProperty(cls)) {
    template = type2template[cls];
    type2resources[cls].forEach((resource) => {
      rr = _resourceReport(resource, graph, template, allResources);
      rr.uri = resource;
      rr.type = cls;
      rr.template = template.getId();
      report.resources.push(rr);
      report.errors += rr.errors.length;
      report.warnings += rr.warnings.length;
      report.deprecated += rr.deprecated.length;
    });
  }

  let mandatoryError = [];
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

const _findResources = (graph, cls) => graph.find(null, "rdf:type", cls)
  .map(stmt => stmt.getSubject());

const _resourceReport = (resource, graph, template, ignoreResources) => {
  let binding = engine.match(graph, resource, template);
  let report = bindingReport(binding);
  _filterReport(report, resource, ignoreResources || {});
  _simplifyReport(report);
  return report;
};

const _filterReport = (report, resource, otherResources) => {
  const { errors, warnings, deprecated } = report;
  report.errors = errors.filter((err) => _includeIssue(err.parentBinding, resource, otherResources));
  report.warnings = warnings.filter((warn) => _includeIssue(warn.parentBinding, resource, otherResources));
  report.deprecated = deprecated.filter((depr) => _includeIssue(depr, resource, otherResources));
};

const _includeIssue = (binding, resource, otherResources) => {
  let pb = binding;
  while (true) {
    let uri = pb.getChildrenRootUri ? pb.getChildrenRootUri() : pb.getParent().getChildrenRootUri();
    if (uri == resource) {
      return true;
    } else if (otherResources[uri]) {
      return false;
    }
    pb = pb.getParent();
  }
};

const _simplifyReport = (report) => {
  const { errors, warnings, deprecated } = report;
  report.errors = errors.map((err) => {
    return { path: _createPath(err.parentBinding, err.item), code: err.code }
  });
  report.warnings = warnings.map((warn) => {
    return { path: _createPath(warn.parentBinding, warn.item), code: warn.code }
  });
  report.deprecated = deprecated.map((dep) => {
    return _createDepPath(dep)
  });
};

const _createPath = (binding, item) => {
  let path = [];
  if (item.getProperty() != null) {
    path.push(ns.shorten(item.getProperty()));
  }
  while (true) {
    if (binding.getItem().getProperty() != null) {
      path.push(ns.shorten(binding.getItem().getProperty()));
    }

    if (binding.getParent() == null) {
      break;
    } else {
      binding = binding.getParent();
    }
  }
  path.reverse();
  return path.join(" > ");
};

const _createDepPath = dep => _createPath(dep.getParent(), dep.getItem()) + " > " + dep.getValue();

export {
  graphReport,
  bindingReport,
}

export default { // TODO @valentino don't export default. Used in EntryScape
  graphReport,
  bindingReport,
}
