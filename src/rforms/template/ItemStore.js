/*global dojo, rforms*/
dojo.provide("rforms.template.ItemStore");
dojo.require("rforms.template.Item");
dojo.require("rforms.template.Template");
dojo.require("rforms.template.Group");
dojo.require("rforms.template.PropertyGroup");
dojo.require("rforms.template.Text");
dojo.require("rforms.template.Choice");
dojo.require("rforms.template.OntologyStore");

/**
 * Keeps a registry of templates and reusable items.
 * Use the createTemplate method to create templates from a source
 * json structure, if the structure contains reusable items they are
 * created and stored separately as well. 
 */
dojo.declare("rforms.template.ItemStore", null, {
	//===================================================
	// Private Attributes
	//===================================================
	_registry: null,
	_registryByProperty: null,
	_tRegistry: null,
	_ontologyStore: null,
	
	//===================================================
	// Public API
	//===================================================
	getTemplate: function(id) {
		return this._tRegistry[id];
	},
	getChildren: function(group) {
		var children = [];
		var ext = group._source["extends"];
		if (ext) {
			ext = this.getItem(ext);
			children = children.concat(this.getChildren(ext));
		}
		children = children.concat(this._createItems(group._source.content || group._source.items || [], group._forceChildrenClones));
		return children;
	},
	getItem: function(id) {
		return this._registry[id];
	},
	getItems: function() {
		var arr = [];
		for (var key in this._registry) {
			if (this._registry.hasOwnProperty(key)) {
				arr.push(this._registry[key]);
			}
		}
		for (var key in this._registryByProperty) {
			if (this._registryByProperty.hasOwnProperty(key)) {
				var item = this._registryByProperty[key]
				if (item.getId() == null) {
					arr.push(item);
				}
			}
		}
		return arr;
	},
	getItemIds: function() {
		var arr = [];
		for (var key in this._registry) {
			if (this._registry.hasOwnProperty(key)) {
				arr.push(key);
			}
		}
		return arr;
	},
	getItemByProperty: function(property) {
		return this._registryByProperty[property];
	},
	detectTemplate: function(graph, uri, requiredItems) {
		return rforms.model.constructTemplate(graph, uri, this, requiredItems);
	},
	createTemplate: function(source) {
		if (dojo.isArray(source.auxilliary)) {
			this._createItems(source.auxilliary);
		}
		if (dojo.isObject(source.cachedChoices)) {
			this._ontologyStore.importRegistry(source.cachedChoices);
		}
		if (dojo.isObject(source.root)) {
			var t = new rforms.template.Template(source, this._createItem(source.root), this);
			if (source.id || source["@id"]) {
				this._tRegistry[source.id || source["@id"]] = t;
			}
			return t;			
		}
	},
	createTemplateFromChildren: function(children) {
		var childrenObj = dojo.map(children || [], function(child) {
			return dojo.isString(child) ? this.getItem(child) : child;
		}, this);
		var root = new rforms.template.Group({}, childrenObj);
		return new rforms.template.Template({}, root, this);
	},
	setPriorities: function(priorities) {
		this.priorities = priorities;
	},
	populate: function(configArr, callback) {
		var countdown = configArr.length;
		var down = function() {
			countdown--;
			if (countdown === 0) {
				callback();
			}
		}
		dojo.forEach(configArr, function(config) {
			var converter;
			switch(config.type) {
				case "exhibit":
					if (converter == null) {
						converter = new rforms.template.Converter(this);						
					}
					converter.convertExhibit(config.url, down);
					break;
				case "sirff":
					var xhrArgs = {
						url: config.url,
						handleAs: "json-comment-optional",
						load: dojo.hitch(this, function(data) {
							this.createTemplate(data);
							down();
						}),
						error: down
					};
					dojo.xhrGet(xhrArgs);
					break;
			}
		}, this);
	},

	//===================================================
	// Inherited methods
	//===================================================
	constructor: function(ontologyStore) {
		this._registry = {};
		this._registryByProperty = {};
		this._tRegistry = {};
		this._ontologyStore = ontologyStore || new rforms.template.OntologyStore();
	},
	
	//===================================================
	// Private methods
	//===================================================
	_createItems: function(sourceArray, forceClone) {
		return dojo.map(sourceArray, function(child) {
			return this._createItem(child, forceClone);
		}, this);
	},
	_createItem: function(source, forceClone, skipRegistration) {
		var item, id = source.id || source["@id"], type = source["type"] || source["@type"];
		if (source["extends"]) { //Explicit extends
			if (this._registry[source["extends"]] === undefined) {
				throw "Cannot find item to extend with id: "+source["extends"];
			}
			var newSource = dojo.mixin(dojo.clone(this._registry[source["extends"]]._source), source);
			newSource["extends"] = null; //Ugly hackt to avoid infinite recursion.
			return this._createItem(newSource, false, false);
		} else if (type != null && source["extends"] == null) {
			switch(type) {
			case "text":
				item = new rforms.template.Text(source);
				break;
			case "choice":
				item = new rforms.template.Choice(source, this._ontologyStore);
				break;
			case "group":
				item = new rforms.template.Group(source, null, this); //Lazy loading of children.
				break;
			case "propertygroup":
				item = new rforms.template.PropertyGroup(source, null, this); //Lazy loading of children.
				break;
			}
			if (skipRegistration !== true) {
				if (source.property != null) {
					this._registryByProperty[source.property] = item;
					if (this.priorities && this.priorities[source.property] != null) {
						item.priority = this.priorities[source.property];
					}
				}
				if (id != null && this._registry[id] == null) {
					this._registry[id] = item;
				}
			}
			return item;
		} else {
			if (id === undefined) {
				throw "Cannot create subitem, '@type' for creating new or '@id' for referencing external are required.";
			}
			if (this._registry[id] === undefined) {
				throw "Cannot find referenced subitem using identifier: "+id;
			}
			//Check if there are any overlay properties, if so force clone mode.
			for (var key in source) {
				if (source.hasOwnProperty(key) && (key !== "id" || key !== "@id")) {
					forceClone = true;
					break;
				}
			}
			
			if (forceClone === true) {
				var newSource = dojo.mixin(dojo.clone(this._registry[id]._source), source);
				return this._createItem(newSource, false, true);
			} else {
				return this._registry[id];
			}
		}
	}
});