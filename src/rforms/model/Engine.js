/*global rforms, dojo, rdfjson*/
dojo.provide("rforms.model.Engine");
dojo.require("rforms.model.CardinalityTracker");
dojo.require("rforms.model.GroupBinding");
dojo.require("rforms.model.PropertyGroupBinding");
dojo.require("rforms.model.ValueBinding");
dojo.require("rforms.model.ChoiceBinding");
dojo.require("rforms.template.Template");
dojo.require("rdfjson.Graph");


//===============================================
//Public API for matching and creation engine
//===============================================

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
rforms.model.match = function(graph, uri, template) {
	var rootBinding = new rforms.model.GroupBinding({item: template.getRoot(), childrenRootUri: uri, graph: graph});
	rforms.model._matchGroupItemChildren(rootBinding, graph);
	return rootBinding;
};

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
rforms.model.constructTemplate = function(graph, uri, itemStore, requiredItems) {
	var props = graph.findProperties(uri);
	var items = [];
	var fixedProps = {};
	if (requiredItems != null) {
		var addProperty = function(item) {
			if (item.getProperty() != null) {
				fixedProps[item.getProperty()] = true;
			} else if (item instanceof rforms.template.Group) {
				dojo.forEach(item.getChildren(), addProperty);				
			}
		};
		var addItem = function(item) {
			if (item != null) {
				addProperty(item);
				items.push(item);
			}			
		};
		dojo.forEach(requiredItems, function(id) {
			var item = itemStore.getItem(id) || itemStore.getTemplate(id);
			if (item != null) {
				if (item instanceof rforms.template.Group && item.getProperty() == null) {
					dojo.forEach(item.getChildren(), addItem);
				} else if (item instanceof rforms.template.Template) {
					dojo.forEach(item.getRoot().getChildren(), addItem);
				} else {
					addItem(item);					
				}
			} else {
				addItem(itemStore.getItemByProperty(id));
			}
		});
	}
	dojo.forEach(props, function(prop) {
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
rforms.model.create = function(parentBinding, item, parentItems) {
	if (item instanceof rforms.template.Text) {
		return rforms.model._createTextItem(parentBinding, item);
	} else if (item instanceof rforms.template.PropertyGroup) {
		return rforms.model._createPropertyGroupItem(parentBinding, item);
	} else if (item instanceof rforms.template.Group) {
		return rforms.model._createGroupItem(parentBinding, item, parentItems || {});
	} else if (item instanceof rforms.template.Choice) {
		return rforms.model._createChoiceItem(parentBinding, item);		
	}	
};


//===============================================
//Core creation engine
//===============================================
rforms.model._createTextItem = function(parentBinding, item) {
	var graph = parentBinding.getGraph();
	var nt = item.getNodetype();
	var obj = {value: "", type: "literal"};
	if (item.getNodetype() === "URI") {
		obj.type = "uri";
	} else if (item.getNodetype() === "DATATYPE_LITERAL") {
		obj.datatype = item.getDatatype();
	}
	var stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), obj, false);
	var nbinding = new rforms.model.ValueBinding({item: item, statement: stmt});
	parentBinding.addChildBinding(nbinding);
	return nbinding;
};

rforms.model._createChoiceItem = function(parentBinding, item) {
	var graph = parentBinding.getGraph();
	var nt = item.getNodetype(), obj;
	if (nt === "LITERAL") {
		obj = {type: "literal", value: ""};
	} else if (nt === "DATATYPE_LITERAL") {
		obj = {type: "literal", value: "", datatype: item.getDatatype()};
	} else {
		obj = {type: "uri", value: ""}
	}
	var stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), obj, false);
	var nbinding = new rforms.model.ChoiceBinding({item: item, statement: stmt});
	parentBinding.addChildBinding(nbinding);
	return nbinding;
};

rforms.model._createGroupItem = function(parentBinding, item, parentItems) {
	var stmt, constr;
	if (item.getProperty() !== undefined) {
		var graph = parentBinding.getGraph();
		stmt = graph.create(parentBinding.getChildrenRootUri(), item.getProperty(), null, false);		
		constr = rforms.model._createStatementsForConstraints(graph, stmt.getValue(), item);
	}

	var nBinding = new rforms.model.GroupBinding({item: item, statement: stmt, constraints: constr});
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
	dojo.forEach(item.getChildren(), function(childItem) {
		rforms.model.create(nBinding, childItem, parentItems);
	});*/
	return nBinding;
};

rforms.model._createPropertyGroupItem = function(parentBinding, item) {
	var stmt, constr;
	var oItem = item.getChildren()[1];
	var graph = parentBinding.getGraph();
	if (oItem instanceof rforms.template.Group) {
		stmt = graph.create(parentBinding.getChildrenRootUri(), "", null, false);		
		constr = rforms.model._createStatementsForConstraints(graph, stmt.getSubject(), oItem);
	} else if (oItem instanceof rforms.template.Choice) {
		stmt = graph.create(parentBinding.getChildrenRootUri(), "", {type: "uri", value: ""}, false);
	} else {
		stmt = graph.create(parentBinding.getChildrenRootUri(), "", {type: "literal", value: ""}, false);
	}

	var nBinding = new rforms.model.PropertyGroupBinding({item: item, statement: stmt, constraints: constr});
	parentBinding.addChildBinding(nBinding);
	if (oItem instanceof rforms.template.Group) {
		dojo.forEach(oItem.getChildren(), function(childItem) {
			rforms.model.create(nBinding.getObjectBinding(), childItem);
		});
	}
	return nBinding;
};

//===============================================
//Core matching engine
//===============================================


rforms.model._matchGroupItemChildren = function(pb) {
	dojo.forEach(pb.getItem().getChildren(), function(item) {
		rforms.model._matchItem(pb, item);
	});
};

rforms.model._matchItem = function(pb, item) {
	if (item instanceof rforms.template.Text) {
		rforms.model._matchTextItem(pb, item);
	} else if (item instanceof rforms.template.PropertyGroup) {
		rforms.model._matchPropertyGroupItem(pb, item);
	} else if (item instanceof rforms.template.Group) {
		rforms.model._matchGroupItem(pb, item);
	} else if (item instanceof rforms.template.Choice) {
		rforms.model._matchChoiceItem(pb, item);		
	}
};

rforms.model._matchGroupItem = function(pb, item) {
	var stmts, bindings, constStmts, groupBinding;
	var graph = pb.getGraph();
	//Case 1: there is a property in the item
	if (item.getProperty() !== undefined) {
		stmts = graph.find(pb.getChildrenRootUri(), item.getProperty());
		if (stmts.length > 0) {
			bindings = [];
			dojo.forEach(stmts, function(stmt) {
				if (rforms.model._isNodeTypeMatch(item, stmt)) {
					constStmts = rforms.model._findStatementsForConstraints(graph, stmt.getValue(), item);
					if (constStmts !== undefined) {
						groupBinding =new rforms.model.GroupBinding({item:item, statement: stmt, constraints: constStmts}); 
						bindings.push(groupBinding);
						rforms.model._matchGroupItemChildren(groupBinding); //Recursive call
					}
				}
			});
			pb.addChildBindings(bindings);
		}
	//Case 2: there is no property in the item, i.e. a layout item.
	} else {
		groupBinding = new rforms.model.GroupBinding({item: item});
		pb.addChildBindings([groupBinding]);
		rforms.model._matchGroupItemChildren(groupBinding); //Recursive call
	}
};

rforms.model._matchPropertyGroupItem = function(pb, item) {
	var stmts, constStmts;
	var bindings, binding, pChoice, oChoice;
	var pItem = item.getPropertyItem(), oItem = item.getObjectItem();
	var graph = pb.getGraph();
	
	stmts = graph.find(pb.getChildrenRootUri());
	if (stmts.length > 0) {
		bindings = [];
		dojo.forEach(stmts, function(stmt) {
			if (rforms.model._isNodeTypeMatch(oItem, stmt)) {
				pChoice = rforms.model._findChoice(pItem, stmt.getPredicate());
				
				if (pChoice !== undefined) {
					binding = null;
					if (oItem instanceof rforms.template.Group) {
						constStmts = rforms.model._findStatementsForConstraints(graph, stmt.getValue(), oItem);
						if (constStmts !== undefined) {
							binding = new rforms.model.PropertyGroupBinding({item: item, statement: stmt, constraints: constStmts});
							rforms.model._matchGroupItemChildren(binding.getObjectBinding()); //Recursive call
						}
					} else if (oItem instanceof rforms.model.Choice) {
						oChoice = rforms.model._findChoice(oItem, stmt.getValue());
						if (oChoice !== undefined) {
							binding = new rforms.model.PropertyGroupBinding({item: item, statement: stmt});
							binding.getObjectBinding.setChoice(oChoice);
						}
					} else {
						binding = new rforms.model.PropertyGroupBinding({item: item, statement: stmt});
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

rforms.model._matchTextItem = function(pb, item) {
	var stmts, bindings, constStmts;
	stmts = pb.getGraph().find(pb.getChildrenRootUri(), item.getProperty());
	if (stmts.length > 0) {
		bindings = [];
		dojo.forEach(stmts, function(stmt) {
			if (rforms.model._isNodeTypeMatch(item, stmt)) {
				bindings.push(new rforms.model.ValueBinding({item: item, statement: stmt}));
			}
		});
		pb.addChildBindings(bindings);
	}
};

rforms.model._matchChoiceItem = function(pb, item) {
	var stmts, bindings, choice;
	stmts = pb.getGraph().find(pb.getChildrenRootUri(), item.getProperty());
	if (stmts.length > 0) {
		bindings = [];
		dojo.forEach(stmts, function(stmt) {
			if (rforms.model._isNodeTypeMatch(item, stmt)) {
				choice = rforms.model._findChoice(item, stmt.getValue());
				if (choice !== undefined) {
					bindings.push(new rforms.model.ChoiceBinding({item: item, statement: stmt, choice: choice}));
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
rforms.model._isNodeTypeMatch = function(item, stmt) {
	var objectType = stmt.getType();
	switch (item.getNodetype()) {
		case "LITERAL":
		case "ONLY_LITERAL":
		case "LANGUAGE_LITERAL":
			return objectType === "literal";
		case "DATATYPE_LITERAL":
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

/**
 * Matches constraints in the item to statements in the graph with the given uri as subject. 
 * 
 * @param {rdfjson.Graph} graph containing all available statements to match against.
 * @param {String} uri the subject to start matching from
 * @param {rforms.template.Item} item containing the constraints.
 * @return an array of statements on success, undefined on failure. 
 *  If there are no constraints to match in the item an empty array is returned.
 */
rforms.model._findStatementsForConstraints = function(graph, uri, item) {
	var stmts, constr, results = [];
	if (dojo.isObject(item.getConstraints())) {
		constr = item.getConstraints();
		for (var key in constr) {
			if (constr.hasOwnProperty(key)) {
				stmts = graph.find(uri, key, {type: "uri", value: constr[key]});
				if (stmts.length == 1) {
					results.push(stmts[0]);
				} else {
					return; //did not find any match for the current constraint == failure.
				}				
			}
		}
		return results;
	} else {
		return [];
	}
};

rforms.model._createStatementsForConstraints = function(graph, uri, item) {
	var stmts, constr, results = [];
	if (dojo.isObject(item.getConstraints())) {
		constr = item.getConstraints();
		for (var key in constr) {
			if (constr.hasOwnProperty(key)) {
				results.push(graph.create(uri, key, {type: "uri", value: constr[key]}, false));
			}
		}
		return results;
	} else {
		return [];
	}
};

rforms.model._findChoice = function(item, obj) {
	var index, choices;
	if (item.hasChoices()) {
		choices = item.getChoices();
		for (index = 0;index < choices.length;index++) {
			if (choices[index].value === obj) {
				return choices[index];
			}
		}
	} else if (rforms.getSystemChoice != null) {
		return rforms.getSystemChoice(item, obj);
	}
};