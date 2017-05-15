/*global define*/
define([
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/kernel",
    "../template/Text",
    "../template/Group",
    "../template/Choice",
    "../template/PropertyGroup",
    "./GroupBinding",
    "./PropertyGroupBinding",
    "./ValueBinding",
    "./ChoiceBinding",
    "./system",
    "../utils"
], function (array, lang, kernel, Text, Group, Choice, PropertyGroup, GroupBinding, PropertyGroupBinding, ValueBinding, ChoiceBinding, system, utils) {

    //See public API at the bottom of this file.

    var match = function (graph, uri, template) {
        var rootBinding = new GroupBinding({item: template, childrenRootUri: uri, graph: graph});
        _matchGroupItemChildren(rootBinding);
        _clearDibbs(rootBinding);
        return rootBinding;
    };

    var constructTemplate = function (graph, uri, itemStore, requiredItems) {
        var props = graph.findProperties(uri);
        var items = [];
        var fixedProps = {};
        if (requiredItems != null) {
            var addProperty = function (item) {
                if (item.getProperty() != null) {
                    fixedProps[item.getProperty()] = true;
                } else if (item instanceof Group) {
                    array.forEach(item.getChildren(), addProperty);
                }
            };
            var addItem = function (item) {
                if (item != null) {
                    addProperty(item);
                    items.push(item);
                }
            };
            array.forEach(requiredItems, function (id) {
                var item = itemStore.getItem(id);
                if (item != null) {
                    if (item instanceof Group && item.getProperty() == null) {
                        array.forEach(item.getChildren(), addItem);
                    } else {
                        addItem(item);
                    }
                } else {
                    item = itemStore.getItemByProperty(id);
                    if (item) {
                        addItem(item);
                    } else {
                        console.warn("Warning, when autodetecting a template: Required item '"+id+
                            "' is neither an id for a loaded item or a property for a loaded item, ignoring.");
                    }
                }
            });
        }
        array.forEach(props, function (prop) {
            if (fixedProps[prop]) {
                return;
            }
            var item = itemStore.getItemByProperty(prop);
            if (item != null) {
                items.push(item);
            }
        }, this);
        //TODO sort according to priority.
        return itemStore.createTemplateFromChildren(items);
    };


    var create = function (parentBinding, item, parentItems) {
        if (item instanceof Text) {
            return _createTextItem(parentBinding, item);
        } else if (item instanceof PropertyGroup) {
            return _createPropertyGroupItem(parentBinding, item);
        } else if (item instanceof Group) {
            return _createGroupItem(parentBinding, item, parentItems || {});
        } else if (item instanceof Choice) {
            return _createChoiceItem(parentBinding, item);
        }
    };


    //===============================================
    //Core creation engine
    //===============================================
    var _createTextItem = function (parentBinding, item) {
        var graph = parentBinding.getGraph();
        var nt = item.getNodetype();
        var obj = {value: "", type: "literal"};
        if (item.getNodetype() === "URI") {
            obj.type = "uri";
        } else if (item.getNodetype() === "DATATYPE_LITERAL") {
            obj.datatype = item.getDatatype();
        }
        var stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), obj, false);
        var nbinding = new ValueBinding({item: item, statement: stmt});
        parentBinding.addChildBinding(nbinding);
        return nbinding;
    };

    var _createChoiceItem = function (parentBinding, item) {
        var graph = parentBinding.getGraph();
        var nt = item.getNodetype();
        var obj = {type: "literal", value: ""};
        if (nt === "DATATYPE_LITERAL") {
            obj.datatype = item.getDatatype();
        } else if (nt === "RESOURCE" || nt === "URI") {
            obj.type = "uri";
        }
        var stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), obj, false);
        var nbinding = new ChoiceBinding({item: item, statement: stmt});
        parentBinding.addChildBinding(nbinding);
        return nbinding;
    };

    var _createGroupItem = function (parentBinding, item, parentItems) {
        var stmt, constr;
        if (item.getProperty() !== undefined) {
            var graph = parentBinding.getGraph();
            if (item.getNodetype() === "URI") {
                stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), {type: "uri", value: system.createURI(item, parentBinding)}, false);
            } else {
                stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), null, false);
            }
            constr = _createStatementsForConstraints(graph, stmt.getValue(), item);
        }

        var nBinding = new GroupBinding({item: item, statement: stmt, constraints: constr});
        parentBinding.addChildBinding(nBinding);

        //Only do loop detection for items that are stored in the itemStore and hence are used in more than one place.
        var itemId = item._source["@id"];
        if (itemId) {
            //If loop stop.
            if (parentItems[itemId]) {
                return nBinding;
            } else {
                parentItems[itemId] = true;
            }
        }
        //Do not create substructures directly, let the view model and user interaction decide when to create children.
        /*
         array.forEach(item.getChildren(), function(childItem) {
         create(nBinding, childItem, parentItems);
         });*/
        return nBinding;
    };

    var _createPropertyGroupItem = function (parentBinding, item) {
        var stmt, constr;
        var oItem = item.getChildren()[1];
        var graph = parentBinding.getGraph();
        if (oItem instanceof Group) {
            stmt = graph.create(parentBinding.getChildrenRootUri(), "", null, false);
            constr = _createStatementsForConstraints(graph, stmt.getSubject(), oItem);
        } else if (oItem instanceof Choice) {
            stmt = graph.create(parentBinding.getChildrenRootUri(), "", {type: "uri", value: ""}, false);
        } else {
            stmt = graph.create(parentBinding.getChildrenRootUri(), "", {type: "literal", value: ""}, false);
        }

        var nBinding = new PropertyGroupBinding({item: item, statement: stmt, constraints: constr});
        parentBinding.addChildBinding(nBinding);
        if (oItem instanceof Group) {
            array.forEach(oItem.getChildren(), function (childItem) {
                create(nBinding.getObjectBinding(), childItem);
            });
        }
        return nBinding;
    };

    //===============================================
    //Core matching engine
    //===============================================


    var _matchGroupItemChildren = function (pb) {
        array.forEach(pb.getItem().getChildren(), function (item) {
            _matchItem(pb, item);
        });
    };

    var _matchItem = function (pb, item) {
        if (item instanceof Text) {
            _matchTextItem(pb, item);
        } else if (item instanceof PropertyGroup) {
            _matchPropertyGroupItem(pb, item);
        } else if (item instanceof Group) {
            _matchGroupItem(pb, item);
        } else if (item instanceof Choice) {
            _matchChoiceItem(pb, item);
        }
    };

    var _matchGroupItem = function (pb, item) {
        var stmts, bindings, constStmts, groupBinding;
        var graph = pb.getGraph();
        //Case 1: there is a property in the item
        if (item.getProperty() !== undefined) {
            stmts = graph.find(pb.getChildrenRootUri(), item.getProperty());
            if (stmts.length > 0) {
                bindings = [];
                array.forEach(stmts, function (stmt) {
                    if (_noDibbs(stmt) && _isNodeTypeMatch(item, stmt) && _isPatternMatch(item, stmt)) {
                        constStmts = _findStatementsForConstraints(graph, stmt.getValue(), item);
                        if (constStmts !== undefined) {
                            _dibbs(stmt);
                            groupBinding = new GroupBinding({item: item, statement: stmt, constraints: constStmts});
                            bindings.push(groupBinding);
                            _matchGroupItemChildren(groupBinding); //Recursive call
                        }
                    }
                });
                pb.addChildBindings(bindings);
            }
            //Case 2: there is no property in the item, i.e. a layout item.
        } else {
            groupBinding = new GroupBinding({item: item});
            pb.addChildBindings([groupBinding]);
            _matchGroupItemChildren(groupBinding); //Recursive call
        }
    };

    var _matchPropertyGroupItem = function (pb, item) {
        var stmts, constStmts;
        var bindings, binding, pChoice, oChoice;
        var pItem = item.getPropertyItem(), oItem = item.getObjectItem();
        var graph = pb.getGraph();

        stmts = graph.find(pb.getChildrenRootUri());
        if (stmts.length > 0) {
            bindings = [];
            array.forEach(stmts, function (stmt) {
                if (_noDibbs(stmt) && _isNodeTypeMatch(oItem, stmt) && _isPatternMatch(oItem, stmt)) {
                    pChoice = _findChoice(pItem, stmt.getPredicate(), stmt.getGraph());
                    if (pChoice !== undefined) {
                        binding = null;
                        if (oItem instanceof Group) {
                            constStmts = _findStatementsForConstraints(graph, stmt.getValue(), oItem);
                            if (constStmts !== undefined) {
                                _dibbs(stmt);
                                binding = new PropertyGroupBinding({item: item, statement: stmt, constraints: constStmts});
                                _matchGroupItemChildren(binding.getObjectBinding()); //Recursive call
                            }
                        } else if (oItem instanceof Choice) {
                            oChoice = _findChoice(oItem, stmt.getValue(), stmt.getGraph());
                            if (oChoice !== undefined) {
                                _dibbs(stmt);
                                binding = new PropertyGroupBinding({item: item, statement: stmt});
                                binding.getObjectBinding().setChoice(oChoice);
                            }
                        } else {
                            _dibbs(stmt);
                            binding = new PropertyGroupBinding({item: item, statement: stmt});
                        }

                        if (binding !== null) {
                            binding.getPredicateBinding().setChoice(pChoice);
                            bindings.push(binding);
                        }
                    }
                }
            });
            pb.addChildBindings(bindings);
        }
    };

    var _matchTextItem = function (pb, item) {
        var stmts, bindings, constStmts;
        if (item.getProperty() == null) {
            return;
        }
        stmts = pb.getGraph().find(pb.getChildrenRootUri(), item.getProperty());
        if (stmts.length > 0) {
            bindings = [];
            array.forEach(stmts, function (stmt) {
                if (_noDibbs(stmt) && _isNodeTypeMatch(item, stmt) && _isPatternMatch(item, stmt)) {
                    _dibbs(stmt);
                    bindings.push(new ValueBinding({item: item, statement: stmt}));
                }
            });
            pb.addChildBindings(bindings);
        }
    };

    var _matchChoiceItem = function (pb, item) {
        var stmts, bindings, choice;
        if (item.getProperty() == null) {
            return;
        }
        stmts = pb.getGraph().find(pb.getChildrenRootUri(), item.getProperty());
        if (stmts.length > 0) {
            bindings = [];
            array.forEach(stmts, function (stmt) {
                if (_noDibbs(stmt) && _isNodeTypeMatch(item, stmt) && _isPatternMatch(item, stmt)) {
                    choice = _findChoice(item, stmt.getValue(), stmt.getGraph());
                    if (choice !== undefined) {
                        _dibbs(stmt);
                        bindings.push(new ChoiceBinding({item: item, statement: stmt, choice: choice}));
                    }
                }
            });
            pb.addChildBindings(bindings);
        }
    };

    //===============================================
    // Utility functions used for matching purposes
    //===============================================

    /**
     * Compares the the type specified in the item and the type of the statements object.
     * @param {rforms.template.Item} item
     * @param {jsonrdf.Statement} stmt
     */
    var _isNodeTypeMatch = function (item, stmt) {
        var objectType = stmt.getType();
        switch (item.getNodetype()) {
            case "LITERAL":      //Any form of literal
            case "ONLY_LITERAL":  //No language, no datatype
            case "PLAIN_LITERAL":  //No datatype, perhaps a language
            case "LANGUAGE_LITERAL":  //Definitely a language
                return objectType === "literal";
            case "DATATYPE_LITERAL":     //Definitiely a datatype
                return objectType === "literal" && stmt.getDatatype() === item.getDatatype();
            case "RESOURCE":
                return objectType === "uri" || objectType === "bnode";
            case "URI":
                return objectType === "uri";
            case "BLANK":
                return objectType === "bnode";
        }
        return false;
    };

    var _isPatternMatch = function (item, stmt) {
        var pattern = item.getPattern();
        var value = utils.extractGist(stmt.getValue(), item.getValueTemplate())
        if (typeof pattern !== "undefined") {
            try {
                return (new RegExp("^"+pattern+"$")).test(value);
            } catch (e) {
                return true;
            }
        }
        return true;
    };

    /**
     * Matches constraints in the item to statements in the graph with the given uri as subject.
     *
     * @param {rdfjson.Graph} graph containing all available statements to match against.
     * @param {String} uri the subject to start matching from
     * @param {rforms.template.Item} item containing the constraints.
     * @return an array of statements on success, undefined on failure.
     *  If there are no constraints to match in the item an empty array is returned.
     */
    var _findStatementsForConstraints = function (graph, uri, item) {
        var stmts, constr = item.getConstraints(), results = [];
        var f = function(predicate, object) {
            stmts = graph.find(uri, predicate, {type: "uri", value: object});
            if (stmts.length == 1) {
                results.push(stmts[0]);
            } else {
                return false;
            }
        }
        if (lang.isObject(constr)) {
            for (var key in constr) {
                if (constr.hasOwnProperty(key)) {
                    var obj = constr[key];
                    if (obj instanceof Array) {
                        var noMatch = true;
                        array.forEach(obj, function(o) {
                            if (f(key, o) !== false) {
                                noMatch = false;
                            }
                        });
                        if (noMatch) {
                            return;
                        }
                    } else {
                        if (f(key, obj) === false) {
                            return;
                        }
                    }
                }
            }
            return results;
        } else {
            return [];
        }
    };

    var _createStatementsForConstraints = function (graph, uri, item) {
        var stmts, constr, results = [];
        if (lang.isObject(item.getConstraints())) {
            constr = item.getConstraints();
            for (var key in constr) {
                if (constr.hasOwnProperty(key)) {
                    var obj = constr[key];
                    if (lang.isArray(obj)) {
                        results.push(graph.create(uri, key, {type: "uri", value: obj[0]}, false));
                    } else {
                        results.push(graph.create(uri, key, {type: "uri", value: obj}, false));
                    }
                }
            }
            return results;
        } else {
            return [];
        }
    };

    var _findChoice = function (item, obj, graph) {
        var index, choices;
        if (item.hasChoices()) {
            choices = item.getChoices();
            for (index = 0; index < choices.length; index++) {
                if (choices[index].value === obj) {
                    return choices[index];
                }
            }
            if (!item.hasStyle("strictmatch")) {
                return {value: obj, label: {"": obj}, mismatch: true};
            }
        } else {
            var label = utils.getLocalizedMap(graph, obj, item.getLabelProperties());
            var sa = graph.findFirstValue(obj, ChoiceBinding.seeAlso);
            if (label != null) {
                var choice = {label: label, value: obj};
                if (sa) {
                    choice.seeAlso = sa;
                }
                return choice;
            } else if (system.getChoice != null) {
                return system.getChoice(item, obj, sa, graph);
            }
        }
    };

    var _dibbs = function(stmt) {
        stmt._dibbs = true;
    };

    var _noDibbs = function(stmt) {
        return stmt._dibbs !== true;
    };

    var _clearDibbs = function(groupBinding) {
        var i, j, arr, arrarr = groupBinding.getItemGroupedChildBindings() || [];
        for (i=0;i<arrarr.length;i++) {
            arr = arrarr[i];
            for (j=0;j<arr.length;j++) {
                var binding = arr[j];
                if (binding._statement) {
                    delete binding._statement._dibbs;
                }
                if (binding instanceof GroupBinding || binding instanceof PropertyGroupBinding) {
                    _clearDibbs(binding);
                }
            }
        }
    };

    var findFirstValueBinding = function (binding, createIfMissing) {
        if (binding instanceof ValueBinding) {
            return binding;
        }
        var cbs = binding.getItemGroupedChildBindings();
        if (cbs.length > 0) {
            var childItem = binding.getItem().getChildren()[0];
            var vbs = cbs[0];
            if (vbs.length !== 0) {
                if (!childItem instanceof Text) {
                    return findFirstValueBinding(vbs[0]);
                } else if (childItem.getNodetype() === "LANGUAGE_LITERAL") {
                    var result = {firstValue: vbs[0]};
                    for (var i = 0; i < vbs.length; i++) {
                        var lang = vbs[i].getLanguage();
                        if (lang == null) {
                            result.emptyLanguageValue = vbs[i];
                        } else {
                            if (lang === kernel.locale) {
                                result.perfectLocaleLanguageValue = vbs[i];
                            } else if (lang.substring(0, 1) === kernel.locale.substring(0, 1)) {
                                result.localeLanguageValue = vbs[i];
                            } else if (lang.indexOf("en") !== -1) {
                                result.defaultLanguageValue = vbs[i];
                            } else {
                                result.anyLanguageValue = vbs[i];
                            }
                        }
                    }
                    return result.perfectLocaleLanguageValue ||
                        result.localeLanguageValue ||
                        result.defaultLanguageValue ||
                        result.anyLanguageValue ||
                        result.firstValue;
                } else {
                    return vbs[0];
                }
            } else if (createIfMissing) {
                var b = create(binding, childItem, {});
                if (b instanceof ValueBinding) {
                    b.setLanguage(kernel.locale);
                    return b;
                }
                return findFirstValueBinding(b, true);
            }
        }
    };

    var matchPathBelowBinding = function(bindingTree, path) {
        var gb = bindingTree.getItemGroupedChildBindings();
        var pred = path[0];
        for (var i=0;i<gb.length;i++) {
            var bindings = gb[i], res;
            for (var j=0;j<bindings.length; j++) {
                var b = bindings[j];
                if (!b.isValid()) {
                    continue;
                }
                var item = b.getItem();
                if (item.getType() === "propertygroup") {
                    b = b.getObjectBinding();
                    item = b.getItem();
                } else if (typeof item.getProperty() === "undefined") {
                    res = exports.matchPathInBindingTree(b, path);
                    if (res) {
                        return res;
                    }
                }
                if (pred === "*" || pred === b.getPredicate()) {
                    if (item.getType() === "group") {
                        res = exports.matchPathInBindingTree(b, path.slice(1));
                        if (res) {
                            return res;
                        }
                    } else {
                        if (path.length === 1 || path[1] === "*"
                            || path[1] === b.getValue()) {
                            return b;
                        }
                    }
                }
            }
        }
    };

    var findBindingRelativeToParentBinding = function(parentBinding, path) {
        var first = path[0], b = parentBinding;
        if (first === "/") {
            while (b.getParent()) {
                b = b.getParent();
            }
            return b;
        } else if (first === "..") {
            for (var i=0;i<path.length;i++) {
                if (path[i] === ".." && b.getParent()) {
                    b = b.getParent();
                } else {
                    return b;
                }
            }
            return b;
        } else {
            return parentBinding;
        }
    };

    var createReport = function(groupbinding, report) {
        if (report == null) {
            report = {errors: [], warnings: [], deprecated: []};
        } else {
            report.errors = report.errors || [];
            report.warnings = report.warnings || [];
            report.deprecated = report.deprecated || [];
        }
        return _createReport(groupbinding, report, true);
    };

    var _createReport = function(groupbinding, report, firstLevel) {
        var groupitem = groupbinding.getItem();
        var path = groupitem.getDeps();
        if (path && groupbinding.getParent() != null) {
            var fromBinding = findBindingRelativeToParentBinding(groupbinding.getParent(), path);
            if (!matchPathBelowBinding(fromBinding, path)) {
                return;
            }
        }

        if (firstLevel === true || groupbinding.isValid() || groupitem.getProperty() == null) {
            var childrenItems = groupitem.getChildren();
            var countValidBindings = function (bindings) {
                var counter = 0;
                for (var i = 0; i < bindings.length; i++) {
                    if (bindings[i].isValid()) {
                        counter++;
                    }
                }
                return counter;
            };

            if (groupitem.hasStyle("disjoint")) {
                var bindings = groupbinding.getChildBindings();
                var nrOfValid = countValidBindings(bindings);
                if (nrOfValid > 1) {
                    groupbinding.error = engine.CODES.TOO_MANY_VALUES;
                    report.errors.push({
                        parentBinding: groupbinding,
                        item: bindings[0].getItem(),
                        code: engine.CODES.TOO_MANY_VALUES_DISJOINT
                    });
                    var counter = 0;
                    array.forEach(bindings, function(binding, idx) {
                        if (binding.isValid()) {
                            if (counter > 0) {
                                binding.error = engine.CODES.TOO_MANY_VALUES_DISJOINT;
                            }
                            counter++;
                        }
                    });
                }
                array.forEach(bindings, function(binding) {
                    var item = binding.getItem();
                    if (item.hasStyle("deprecated")) {
                        report.deprecated.push(binding);
                    }
                });
            } else {
                array.forEach(groupbinding.getItemGroupedChildBindings(), function (bindings, index) {
                    var item = childrenItems[index];
                    if (item.hasStyle("deprecated")) {
                        array.forEach(bindings, function(binding) {
                            report.deprecated.push(binding);
                        });
                        return;
                    }
                    var path = item.getDeps();
                    if (path) {
                        var fromBinding = findBindingRelativeToParentBinding(groupbinding, path);
                        if (!matchPathBelowBinding(fromBinding, path)) {
                            return;
                        }
                    }

                    if (item.getProperty() != null) {
                        var nrOfValid = countValidBindings(bindings);
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

    var _levelProfile = function(profile, item, ignoreTopLevelGroup) {
       var card = item.getCardinality();
       if (!ignoreTopLevelGroup || item.getType() !== "group") {
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
      if (item.getType() === "group") {
        array.forEach(item.getChildren(), lang.hitch(this, _levelProfile, profile));
      }
      return profile;
    }

    var levelProfile = function(item) {
      var profile = _levelProfile({mandatory: 0, recommended: 0, optional: -1}, item, true);
      profile.itemCount = profile.mandatory + profile.recommended + profile.optional;
      return profile;
    }

    var detectLevel = function(profile) {
        if (profile.mandatory > 0) {
            if  (profile.recommended === 0 && profile.optional === 0) {
              return "mandatory";
            } else if (profile.optional === 0) {
                return "mixed_mandatory_recommended";
            } else if (profile.recommended === 0) {
                return "mixed_mandatory_optional";
            }
        } else if (profile.recommended > 0) {
          if (profile.optional === 0) {
            return "recommended";
          } else {
              return "mixed_recommended_optional";
          }
        } else if (profile.recommended === 0 && profile.recommended > 0 && profile.optional === 0) {
            return "optional";
        }
      return "mixed_all";
    }

    //===============================================
    //Public API for matching and creation engine
    //===============================================
    var engine = {
        /**
         * Matches a tree of statements with the uri as root
         * according to the constraints of the given template.
         * All the statements matched are found in the graph.
         * All statements in the graph that could be matched into the tree
         * are matched into the tree.
         * The tree is represented as a binding tree.
         *
         * @param {rdfjson.Graph} graph
         * @param {String} uri
         * @param {rforms.template.Template} template
         * @return an rforms.model.GroupBinding which is the root of binding tree.
         */
        match: match,

        matchPathBelowBinding: matchPathBelowBinding,
        findBindingRelativeToParentBinding: findBindingRelativeToParentBinding,

        /**
         * Constructs a template by finding an item per outgoing property for provided graph and resource starting point.
         *
         * @param {Object} graph
         * @param {Object} uri
         * @param {Object} itemStore
         * @param {Array} requiredItems an array of required items specified by id or property that will be
         * enforced independent of corresponding property exists in the graph or not.
         * @return {rforms.template.Template} the constructed template.
         */
        constructTemplate: constructTemplate,

        /**
         * Creates a new binding below the given parentBinding according to what the item specifies.
         * New triples are created in the provided graph although not expressed if they have an
         * empty predicate or object. The item must be a direct child of the item
         * of the parentBinding.
         *
         * @param {rforms.model.Binding} parentBinding
         * @param {rforms.template.Item} item
         * @param {Object} parentItems is a hash of parent Items to use for loop detection.
         */
        create: create,

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
         * @return {ValueBinding}
         */
        findFirstValueBinding: findFirstValueBinding,

        report: createReport,

        /**
         * Calculates the level profile, i.e. the amount of items on mandatory, recommended and optional level in a given template.
         *
         * @param {rdforms/template/Item} item
         * @return {Object} with keys mandatory, recommended and optional, each pointing to an integer.
         */
        levelProfile: levelProfile,

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
      detectLevel: detectLevel,

        CODES: {
            TOO_FEW_VALUES: "few",
            TOO_MANY_VALUES: "many",
            TOO_MANY_VALUES_DISJOINT: "disjoint"
        }
    };

    return engine;
});