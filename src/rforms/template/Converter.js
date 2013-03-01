/*global define*/
define(["dojo/_base/declare"], function(declare) {

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
	
	//===================================================
	// Public API
	//===================================================
	/**
	 * Converts an exhibit and loads properties and classes as 
	 * items into the ItemStore.
	 * The result, as returned in the callback function, will be
	 * an object with two arrays of items, one corresponding to 
	 * found properties and one corresponding to found classes:
	 * {
	 * 	   properties: [item1, item2],
	 *     classes: [item3, item4]
	 * } 
	 * 
	 * @param {String} url from where the exhibit will be loaded 
	 * @param {Function} callback will be called with the converted exhibit.
	 */
	convertExhibit: function(url, callback) {
		this._load(url, dojo.hitch(this, function(data) {
			callback(this._convertExhibit(data));
		}));
	},
	//===================================================
	// Inherited methods
	//===================================================
	constructor: function(itemStore) {
		this._itemStore = itemStore;
	},
	
	//===================================================
	// Private methods
	//===================================================
	_load: function(url, callback) {
		var xhrArgs = {
			url: url,
			sync: true,
			handleAs: "json-comment-optional"
		};
		var req = dojo.xhrGet(xhrArgs);
		req.addCallback(callback);
//		req.addErrback(onError);
	},
	_convertExhibit: function(data) {
		var auxP = [];
		var auxC = [];
		
		this._prepareExhibit(data);
		dojo.forEach(data.items, function(item) {
			if (item.type === "Property") {
				var source = {"id": item.id, "property": item.id, label: {"en": item.label}, description: {"en": item.description || item.comment}};
				if (!item.ranges || item.ranges["http://www.w3.org/2000/01/rdf-schema#Literal"]) {
					source["type"] = "text";
					source["nodetype"] = "LANGUAGE_LITERAL"
					auxP.push(source);
				} else {
					var props = this._getPropertiesForClasses(data, item.ranges);
					var propArr = [];
					for (var p in props) {
						if (props.hasOwnProperty(p)) {
							propArr.push({"id": p});
						}
					}
//					if (propArr.length > 0) {
						source["type"] = "group";
						source.automatic = true;
						source.content = propArr;
						auxP.push(source);
//					}
					
				}
			} else if (item.type === "Class") {
				var source = {
					"id": item.id, 
					label: {"en": item.label}, 
					description: {"en": item.description || item.comment}
				};
				var t = {};
				t[item.id] = true;
				var props = this._getPropertiesForClasses(data, t);
				var propArr = [];
				for (var p in props) {
					if (props.hasOwnProperty(p)) {
						propArr.push({"id": p});
					}
				}
				if (propArr.length > 0) {
					source["type"] = "group";
					source.content = propArr;
					source.automatic = true;
					auxC.push(source);
				}
			}
		}, this);
		this._itemStore._createItems(auxP);
		this._itemStore._createItems(auxC);
		return {
				properties: dojo.map(auxP, function(item) {return item["id"]}), 
				classes: dojo.map(auxC, function(item) {return item["id"]})
			};
	},
	_prepareExhibit: function(exhibit) {
		//Index property items.
		exhibit.domainProperties = {};
		exhibit.propertyIndex = {};
		exhibit.classIndex = {};

		dojo.forEach(exhibit.items, function(item) {
			switch (item.type) {
				case "Property":
					exhibit.propertyIndex[item.id] = item;
					break;
				case "Class":
					exhibit.classIndex[item.id] = item;
					break;
			}
		});
		//Index ranges and domains
		dojo.forEach(exhibit.items, function(item) {
			switch (item.type) {
				case "Property":
					//Domains
					if (item.domain) {
						var props= exhibit.domainProperties[item.domain] || {};
						props[item.id] = true;
						exhibit.domainProperties[item.domain] = props;
					}
					//Range
					var spo = item;
					do {
						if (spo.range) {
							if (item.ranges == null) {
								item.ranges = {};
							}
							item.ranges[spo.range] = true;
						}
						spo = exhibit.propertyIndex[spo.subPropertyOf];
					} while (spo);
					break;
					
			}
		});
	},
	_getPropertiesForClasses: function(exhibit, clss) {
		var props = {};
		for (var cls in clss) {
			if (clss.hasOwnProperty(cls)) {
				if (exhibit.classIndex[cls]) {
					this._getPropertiesForClassesRecursive(exhibit, exhibit.classIndex[cls], props, {});
				}
			}
		}
		return props;
	},
	_getPropertiesForClassesRecursive: function(exhibit, cls, props, parentClasses) {
		if (parentClasses[cls.id]) {
			return;
		}
		parentClasses[cls.id] = true;
		var props2 = exhibit.domainProperties[cls.id];
		for (var prop in props2) {
			props[prop] = true;
		}
		if (cls.subClassOf == null) {
			return;
		} else if (dojo.isArray(cls.subClassOf)) {
			dojo.forEach(cls.subClassOf, function(superCls) {
				if (exhibit.classIndex[superCls]) {
					this._getPropertiesForClassesRecursive(exhibit, exhibit.classIndex[superCls], props, parentClasses);
				}
			}, this);
		} else if (exhibit.classIndex[cls.subClassOf]) {
			this._getPropertiesForClassesRecursive(exhibit, exhibit.classIndex[cls.subClassOf], props, parentClasses);
		}
	}
    });
});