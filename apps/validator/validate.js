/*global define*/
define([
    "exports",
    "dojo/_base/array",
    "rdforms/model/Engine",
    "rdfjson/formats/converters"
], function(exports, array, Engine, converters) {


    var includeIssue = function(issue, resource, otherResources) {
        var pb = issue.parentBinding;
        while(true) {
            var uri = pb.getChildrenRootUri();
            if (uri == resource) {
                return true;
            } else if (otherResources[uri]) {
                return false;
            }
            pb = pb.getParent();
        }
    };

    var nsify = function (prop) {
        var nss = converters.namespaces();
        for (var ns in nss) {
            if (nss.hasOwnProperty(ns) && prop.indexOf(nss[ns]) === 0) {
                return ns + ":" + prop.substring(nss[ns].length);
            }
        }
        return prop;
    };


    var filterReport = function(report, resource, otherResources) {
        report.errors = array.filter(report.errors, function(err) {
            return includeIssue(err, resource, otherResources) });
        report.warnings = array.filter(report.warnings, function(warn) {
            return includeIssue(warn, resource, otherResources) });
    };

    var createPath = function(binding, item) {
        var path = [];
        if (item != null && item.getProperty() != null) {
            path.push(nsify(item.getProperty()));
        }
        while(true) {
            if (binding.getItem().getProperty() != null) {
                path.push(nsify(binding.getItem().getProperty()));
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

    var createDepPath = function(dep) {
        return createPath(dep.getParent(), dep.getItem()) + " > " + dep.getValue();
    };

    var simplifyReport = function(report) {
        report.errors = array.map(report.errors, function(err) {
            return {path: createPath(err.parentBinding, err.item), code: err.code}});
        report.warnings = array.map(report.warnings, function(warn) {
            return {path: createPath(warn.parentBinding, warn.item), code: warn.code}});
        report.deprecated = array.map(report.deprecated, function(dep) {
            return createDepPath(dep)});
    };

    var findResources = function(graph, cls) {
        return array.map(
            graph.find(null, "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", cls),
            function(stmt) {return stmt.getSubject()});
    };

    var getResourceReport = function(resource, graph, template, ignoreResources) {
        var binding = Engine.match(graph, resource, template);
        var report = Engine.report(binding);
        filterReport(report, resource, ignoreResources || {});
        simplifyReport(report);
        return report;
    };

    /**
     *
     * @param {rdfjson/Graph} graph an rdf graph against which all validation is done
     * @param {Object} type2template a map between each type to check for and the template to use
     * @param {Array} mandatoryTypes an array of types to check that there are instances for
     * @return {Object} a report of the validity of the graph
     */
    exports.generateReport = function(graph, type2template, mandatoryTypes) {
        var resources, type2resources = {}, allResources = {}, cls, template, resourceReport,
            report = {errors: 0, warnings: 0, deprecated: 0, resources: []};
        for (cls in type2template) if (type2template.hasOwnProperty(cls)) {
            resources = type2resources[cls] = findResources(graph, cls);
            array.forEach(resources, function(resource) {allResources[resource] = true});
        }

        for (cls in type2resources) if (type2resources.hasOwnProperty(cls)) {
            template = type2template[cls];
            array.forEach(type2resources[cls], function(resource) {
                resourceReport = getResourceReport(resource, graph, template, allResources);
                resourceReport.uri = resource;
                resourceReport.type = cls;
                resourceReport.template = template.getId();
                report.resources.push(resourceReport);
                report.errors += resourceReport.errors.length;
                report.warnings += resourceReport.warnings.length;
                report.deprecated += resourceReport.deprecated.length;
            });
        }

        var mandatoryError = [];
        array.forEach(mandatoryTypes || [], function(mt) {
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
    exports.sortResourceReportsByType = function(resourceReports) {
        var type2resourceReport = {};
        array.forEach(resourceReports, function(resourceReport) {
            if (type2resourceReport[resourceReport.type] == null) {
                type2resourceReport[resourceReport.type] = [];
            }
            type2resourceReport[resourceReport.type].push(resourceReport);
        });
        return type2resourceReport;
    };
});