/*global define*/
define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/request",
    "./Template",
    "./Group",
    "./PropertyGroup",
    "./Text",
    "./Choice",
    "./OntologyStore",
    "./Converter",
    "rforms/model/Engine"
], function (declare, lang, array, request, Template, Group, PropertyGroup, Text, Choice, OntologyStore, Converter, Engine) {

    /**
     * Keeps a registry of templates and reusable items.
     * Use the createTemplate method to create templates from a source
     * json structure, if the structure contains reusable items they are
     * created and stored separately as well.
     */
    return declare(null, {
        //===================================================
        // Private Attributes
        //===================================================
        _bundles: null,
        _registry: null,
        _registryByProperty: null,
        _tRegistry: null,
        _ontologyStore: null,

        //===================================================
        // Public API
        //===================================================
        getTemplate: function (id) {
            return this._tRegistry[id];
        },
        getChildren: function (group) {
            var children = [];
            var ext = group._source["extends"];
            if (ext) {
                ext = this.getItem(ext);
                children = children.concat(this.getChildren(ext));
            }
            children = children.concat(this._createItems(group._source.content || group._source.items || [], group._forceChildrenClones));
            return children;
        },
        getItem: function (id) {
            return this._registry[id];
        },
        getItems: function () {
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
        renameItem: function(from, to) {
            if (this._registry[to]) {
                throw "Cannot rename to "+ to + " since an item with that id already exists.";
            }
            var item = this._registry[from];
            if (item) {
                delete this._registry[from];
                this._registry[to] = item;
                item.setId(to);
            }
            var renameInGroup = function(source) {
                var children = source.content;
                if (children) {
                    for (var j=0;j<children.length;j++) {
                        var child = children[j];
                        if (child.id === from || child["@id"] === from) {
                            child.id = to;
                            delete child["@id"]; //Clean up backward compatability.
                        }
                        if (child.content) {
                            renameInGroup(child);
                        }
                    }
                }
            }

            var items = this.getItems();
            for (var i=0;i<items.length;i++) {
                var childItem = items[i];
                if (childItem instanceof Group) {
                    renameInGroup(childItem._source);
                }
            }
        },
        getItemIds: function () {
            var arr = [];
            for (var key in this._registry) {
                if (this._registry.hasOwnProperty(key)) {
                    arr.push(key);
                }
            }
            return arr;
        },
        getItemByProperty: function (property) {
            return this._registryByProperty[property];
        },
        detectTemplate: function (graph, uri, requiredItems) {
            return Engine.constructTemplate(graph, uri, this, requiredItems);
        },
        /**
         * Templates is a object containing:
         * path - can be a relative or absolute path to where the templates are/will be loaded from.
         * source - a SIRFF object.
         *
         * @param templates
         */
        registerBundle: function(bundle) {
            this._bundles.push(bundle)
            this.createTemplate(bundle.source);
        },
        getBundles: function() {
            return this._bundles;
        },
        createTemplate: function (source) {
            var templates = source.templates || source.auxilliary;
            if (templates instanceof Array) {
                this._createItems(templates);
            }
            if (typeof source.cachedChoices === "object") {
                this._ontologyStore.importRegistry(source.cachedChoices);
            }
            if (typeof source.root === "object") {
                var t = new Template(source, this.createItem(source.root), this);
                if (source.id || source["@id"]) {
                    this._tRegistry[source.id || source["@id"]] = t;
                }
                return t;
            }
        },
        createTemplateFromChildren: function (children) {
            var childrenObj = array.map(children || [], function (child) {
                return typeof child === "string" ? this.getItem(child) : child;
            }, this);
            var root = new Group({}, childrenObj);
            return new Template({}, root, this);
        },
        setPriorities: function (priorities) {
            this.priorities = priorities;
        },
        populate: function (configArr, callback) {
            var countdown = configArr.length;
            var down = function () {
                countdown--;
                if (countdown === 0) {
                    callback();
                }
            }
            array.forEach(configArr, function (config) {
                var converter;
                switch (config.type) {
                    case "exhibit":
                        if (converter == null) {
                            converter = new Converter(this);
                        }
                        converter.convertExhibit(config.url, down);
                        break;
                    case "sirff":
                        request.get(config.url, {
                            handleAs: "json"
                        }).then(lang.hitch(this, function (data) {
                                this.createTemplate(data);
                                down();
                            }), down);
                        break;
                }
            }, this);
        },

        /**
         * At a minimum the source must contain a type, the rest can be changed later.
         *
         * @param source
         * @returns {*}
         */
        createItem: function (source, forceClone, skipRegistration) {
            var item, id = source.id || source["@id"], type = source["type"] || source["@type"];
            if (source["extends"]) {
                //Explicit extends given
                if (this._registry[source["extends"]] === undefined) {
                    throw "Cannot find item to extend with id: " + source["extends"];
                }
                var newSource = lang.mixin(lang.clone(this._registry[source["extends"]]._source), source);
                newSource["_extendedSource"] = source;
                newSource["extends"] = null; //Avoid infinite recursion when creating the fleshed out item.
                return this.createItem(newSource, false, false);
            } else if (type != null && source["extends"] == null) {
                //If there is a type in the source then it means that the object is a new item.
                switch (type) {
                    case "text":
                        item = new Text(source);
                        break;
                    case "choice":
                        item = new Choice(source, this._ontologyStore);
                        break;
                    case "group":
                        item = new Group(source, null, this); //Lazy loading of children.
                        break;
                    case "propertygroup":
                        item = new PropertyGroup(source, null, this); //Lazy loading of children.
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
                //No type means it is a reference, check that the referred item (via id) exists
                if (id === undefined) {
                    throw "Cannot create subitem, 'type' for creating new or 'id' for referencing external are required.";
                }
                if (this._registry[id] === undefined) {
                    throw "Cannot find referenced subitem using identifier: " + id;
                }
                //Check if there are any overlay properties, if so force clone mode.
                for (var key in source) {
                    if (source.hasOwnProperty(key) && (key !== "id" && key !== "@id")) {
                        forceClone = true;
                        break;
                    }
                }

                if (forceClone === true) {
                    var newSource = lang.mixin(lang.clone(this._registry[id]._source), source);
                    return this.createItem(newSource, false, true);
                } else {
                    return this._registry[id];
                }
            }
        },
        removeItem: function(item) {
            if (item.getId() != null) {
                delete this._registry[item.getId()];
            }
            var prop = item.getProperty();
            if (prop != null && this._registryByProperty[prop] === item) {
                delete this._registryByProperty[prop];
            }
        },

        //===================================================
        // Inherited methods
        //===================================================
        constructor: function (ontologyStore) {
            this._bundles = [];
            this._registry = {};
            this._registryByProperty = {};
            this._tRegistry = {};
            this._ontologyStore = ontologyStore || new OntologyStore();
        },

        //===================================================
        // Private methods
        //===================================================
        _createItems: function (sourceArray, forceClone) {
            return array.map(sourceArray, function (child) {
                return this.createItem(child, forceClone);
            }, this);
        }
    });
});