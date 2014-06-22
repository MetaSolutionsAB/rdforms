/*global define*/
define(["dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/request",
    "./Bundle",
    "./Group",
    "./PropertyGroup",
    "./Text",
    "./Choice",
    "./OntologyStore",
    "./Converter",
    "../model/Engine"
], function (declare, lang, array, request, Bundle, Group, PropertyGroup, Text, Choice, OntologyStore, Converter, Engine) {

    /**
     * Keeps a registry of templates and reusable items.
     * Use the createTemplate method to create templates from a source
     * json structure, if the structure contains reusable items they are
     * created and stored separately as well.
     */
    return declare(null, {
        automaticSortAllowed: true,
        ignoreMissingItems: true,
        //===================================================
        // Private Attributes
        //===================================================
        _bundles: null,
        _registry: null,
        _registryByProperty: null,
        _ontologyStore: null,

        //===================================================
        // Public API
        //===================================================
        getTemplate: function (id) {
            return this.getItem(id);
        },
        getChildren: function (group, original) {
            if (group == null) {
                return [];
            }
            var origSource = group.getSource(true);
            var origSourceContent = origSource.content || origSource.items || [];
            if (original) {
                return this._createItems(origSourceContent, group._forceChildrenClones, group.getBundle());
            } else {
                var ext = this.getItem(origSource["extends"]);
                if (ext) {
                    return ext.getChildren().concat(group.getChildren(true));
                } else {
                    return group.getChildren(true);
                }
            }
        },
        getItem: function (id) {
            if (id != null) {
                return this._registry[id];
            }
        },
        getItems: function () {
            var arr = [];
            for (var key in this._registry) {
                if (this._registry.hasOwnProperty(key)) {
                    arr.push(this._registry[key]);
                }
            }
          /*  for (var key in this._registryByProperty) {
                if (this._registryByProperty.hasOwnProperty(key)) {
                    var item = this._registryByProperty[key]
                    if (item.getId() == null) {
                        arr.push(item);
                    }
                }
            }*/
            return arr;
        },
        renameItem: function(from, to) {
            if (this._registry[to]) {
                throw "Cannot rename to "+ to + " since an item with that id already exists.";
            }
            if (to === "" || to === null) {
                throw "Cannot give an item an empty string or null as id.";
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
         * Bundle is an object containing:
         * path - can be a relative or absolute path to where the templates are/will be loaded from, optional.
         * source - a RDForms template object, mandatory.
         *
         * @param {Object} bundleSrc
         * @return {Bundle} the created bundle.
         */
        registerBundle: function(bundle) {
            bundle.itemStore = this;
            var b = new Bundle(bundle);
            this._bundles.push(b);

            var templates = bundle.source.templates || bundle.source.auxilliary;
            if (templates instanceof Array) {
                this._createItems(templates, false, b);
            }
            if (typeof bundle.source.cachedChoices === "object") {
                this._ontologyStore.importRegistry(bundle.source.cachedChoices);
            }

            return b;
        },
        getBundles: function() {
            return this._bundles;
        },

        //Backward compatability
        createTemplate: function (source) {
            var b = this.registerBundle({source: source});
            return b.getRoot();
        },
        createTemplateFromChildren: function (children) {
            var childrenObj = array.map(children || [], function (child) {
                return typeof child === "string" ? this.getItem(child) : child;
            }, this);
            return new Group({source: {}, children: childrenObj, itemStore: this});
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
                if(lang.isString(config) || config.type === "sirff") {
                    var url = lang.isString(config) ? config : config.url;
                    request.get(url, {
                        handleAs: "json"
                    }).then(lang.hitch(this, function (data) {
                            this.createTemplate(data);
                            down();
                        }), down);
                } else if (config.type === "exhibit") {
                    var converter;
                    if (converter == null) {
                        converter = new Converter(this);
                    }
                    converter.convertExhibit(config.url, down);
                }
            }, this);
        },

        createExtendedSource: function(origSource, extSource) {
            var newSource = lang.mixin(lang.clone(origSource), extSource);
            newSource["_extendedSource"] = extSource;
            newSource["extends"] = null; //Avoid infinite recursion when creating the fleshed out item.
            delete newSource["children"];
            return newSource;
        },

        /**
         * At a minimum the source must contain a type, the rest can be changed later.
         *
         * @param source
         * @returns {*}
         */
        createItem: function (source, forceClone, skipRegistration, bundle) {
            var item, id = source.id || source["@id"], type = source["type"] || source["@type"];
            if (source["extends"]) {
                //Explicit extends given
                var extItem = this._registry[source["extends"]];
                if (extItem == null && !this.ignoreMissingItems) {
                    throw "Cannot find item to extend with id: " + source["extends"];
                }
                if (extItem) {
                    var newSource = this.createExtendedSource(extItem.getSource(), source);
                    return this.createItem(newSource, false, false, bundle);
                }
            }

            if (type != null) {
                //If there is a type in the source then it means that the object is a new item.
                switch (type) {
                    case "text":
                        item = new Text({source: source, itemStore: this, bundle: bundle});
                        break;
                    case "choice":
                        item = new Choice({source: source, itemStore: this, ontologyStore: this._ontologyStore, bundle: bundle});
                        break;
                    case "group":
                        item = new Group({source: source, children: null, itemStore: this, bundle: bundle}); //Lazy loading of children.
                        break;
                    case "propertygroup":
                        item = new PropertyGroup({source: source, children: null, itemStore: this, bundle: bundle}); //Lazy loading of children.
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
                        if (bundle != null) {
                            bundle.addItem(item);
                        }
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
        removeItem: function(item, removereferences) {
            var b = item.getBundle();
            if (b != null) {
                b.removeItem(item);
            }
            if (item.getId() != null) {
                delete this._registry[item.getId()];
            }
            var prop = item.getProperty();
            if (prop != null && this._registryByProperty[prop] === item) {
                delete this._registryByProperty[prop];
            }
            if (removereferences) {
                //TODO

            }
        },

        //===================================================
        // Inherited methods
        //===================================================
        constructor: function (ontologyStore) {
            this._bundles = [];
            this._registry = {};
            this._registryByProperty = {};
            this._ontologyStore = ontologyStore || new OntologyStore();
        },

        //===================================================
        // Private methods
        //===================================================
        _createItems: function (sourceArray, forceClone, bundle) {
            return array.map(sourceArray, function (child, index) {
                if (lang.isString(child)) {  //If child is not a object but a direct string reference, create a object.
                    child = sourceArray[index] = {id: child};
                }
                return this.createItem(child, forceClone, false, bundle);
            }, this);
        }
    });
});