/*global define*/
define([
  "exports",
  "dojo/_base/array",
  "./engine",
  "rdfjson/namespaces",
], function (exports, array, engine, namespaces) {

  var bindingReport = function (groupbinding, reportObj) {
    if (reportObj == null) {
      reportObj = { errors: [], warnings: [], deprecated: [] };
    } else {
      reportObj.errors = reportObj.errors || [];
      reportObj.warnings = reportObj.warnings || [];
      reportObj.deprecated = reportObj.deprecated || [];
    }
    return _createReport(groupbinding, reportObj, true);
  };

  var _countValidBindings = function (bindings) {
    var counter = 0;
    for (var i = 0; i < bindings.length; i++) {
      if (bindings[i].isValid()) {
        counter++;
      }
    }
    return counter;
  };

  var _createReport = function (groupbinding, report, firstLevel) {
    var groupitem = groupbinding.getItem();
    var path = groupitem.getDeps();
    if (path && groupbinding.getParent() != null) {
      var fromBinding = engine.findBindingRelativeToParentBinding(groupbinding.getParent(), path);
      if (!engine.matchPathBelowBinding(fromBinding, path)) {
        return;
      }
    }

    if (firstLevel === true || groupbinding.isValid() || groupitem.getProperty() == null) {
      var childrenItems = groupitem.getChildren();

      if (groupitem.hasStyle("disjoint")) {
        var bindings = groupbinding.getChildBindings();
        var nrOfValid = _countValidBindings(bindings);
        if (nrOfValid > 1) {
          groupbinding.error = engine.CODES.TOO_MANY_VALUES;
          report.errors.push({
            parentBinding: groupbinding,
            item: bindings[0].getItem(),
            code: engine.CODES.TOO_MANY_VALUES_DISJOINT
          });
          var counter = 0;
          array.forEach(bindings, function (binding, idx) {
            if (binding.isValid()) {
              if (counter > 0) {
                binding.error = engine.CODES.TOO_MANY_VALUES_DISJOINT;
              }
              counter++;
            }
          });
        }
        array.forEach(bindings, function (binding) {
          var item = binding.getItem();
          if (item.hasStyle("deprecated")) {
            report.deprecated.push(binding);
          }
        });
      } else {
        array.forEach(groupbinding.getItemGroupedChildBindings(), function (bindings, index) {
          var item = childrenItems[index];
          if (item.hasStyle("deprecated")) {
            array.forEach(bindings, function (binding) {
              report.deprecated.push(binding);
            });
            return;
          }
          var path = item.getDeps();
          if (path) {
            var fromBinding = engine.findBindingRelativeToParentBinding(groupbinding, path);
            if (!engine.matchPathBelowBinding(fromBinding, path)) {
              return;
            }
          }

          if (item.getProperty() != null) {
            var nrOfValid = _countValidBindings(bindings);
            var card = item.getCardinality();
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
              var counter = 0;
              array.forEach(bindings, function (binding) {
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
            array.forEach(bindings, function (binding) {
              _createReport(binding, report);
            });
          }
        }, this);
      }
    }
    return report;
  };

  var graphReport = function (graph, type2template, mandatoryTypes) {
    var resources, type2resources = {}, allResources = {}, cls, template, rr,
      report = { errors: 0, warnings: 0, deprecated: 0, resources: [] };
    for (cls in type2template) if (type2template.hasOwnProperty(cls)) {
      resources = type2resources[cls] = _findResources(graph, cls);
      array.forEach(resources, function (resource) {
        allResources[resource] = true
      });
    }

    for (cls in type2resources) if (type2resources.hasOwnProperty(cls)) {
      template = type2template[cls];
      array.forEach(type2resources[cls], function (resource) {
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

    var mandatoryError = [];
    array.forEach(mandatoryTypes || [], function (mt) {
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

  var _findResources = function (graph, cls) {
    return array.map(
      graph.find(null, "rdf:type", cls),
      function (stmt) {
        return stmt.getSubject()
      });
  };

  var _resourceReport = function (resource, graph, template, ignoreResources) {
    var binding = engine.match(graph, resource, template);
    var report = bindingReport(binding);
    _filterReport(report, resource, ignoreResources || {});
    _simplifyReport(report);
    return report;
  };

  var _filterReport = function (report, resource, otherResources) {
    report.errors = array.filter(report.errors, function (err) {
      return _includeIssue(err.parentBinding, resource, otherResources)
    });
    report.warnings = array.filter(report.warnings, function (warn) {
      return _includeIssue(warn.parentBinding, resource, otherResources)
    });
    report.deprecated = array.filter(report.deprecated, function (depr) {
      return _includeIssue(depr, resource, otherResources)
    });
  };

  var _includeIssue = function (binding, resource, otherResources) {
    var pb = binding;
    while (true) {
      var uri = pb.getChildrenRootUri ? pb.getChildrenRootUri() : pb.getParent().getChildrenRootUri();
      if (uri == resource) {
        return true;
      } else if (otherResources[uri]) {
        return false;
      }
      pb = pb.getParent();
    }
  };

  var _simplifyReport = function (report) {
    report.errors = array.map(report.errors, function (err) {
      return { path: _createPath(err.parentBinding, err.item), code: err.code }
    });
    report.warnings = array.map(report.warnings, function (warn) {
      return { path: _createPath(warn.parentBinding, warn.item), code: warn.code }
    });
    report.deprecated = array.map(report.deprecated, function (dep) {
      return _createDepPath(dep)
    });
  };

  var _createPath = function (binding, item) {
    var path = [];
    if (item.getProperty() != null) {
      path.push(namespaces.shorten(item.getProperty()));
    }
    while (true) {
      if (binding.getItem().getProperty() != null) {
        path.push(namespaces.shorten(binding.getItem().getProperty()));
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

  var _createDepPath = function (dep) {
    return _createPath(dep.getParent(), dep.getItem()) + " > " + dep.getValue();
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
  exports.bindingReport = bindingReport;

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
  exports.graphReport = graphReport;
});