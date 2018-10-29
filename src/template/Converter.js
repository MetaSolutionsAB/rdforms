const xhr = require('dojo/request/xhr');

export default class Converter {
  // TODO @scazan: Update documentation here. Where is createTemplate?
  /**
   * Keeps a registry of templates and reusable items.
   * Use the createTemplate method to create templates from a source
   * json structure, if the structure contains reusable items they are
   * created and stored separately as well.
   */
  constructor(itemStore) {
    this._itemStore = itemStore;
  }
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
  convertExhibit(url, callback) {
    this._load(url, function (data) { callback(this._convertExhibit(data))}.bind(this));
  }

  //===================================================
  // Inherited methods
  //===================================================

  //===================================================
  // Private methods
  //===================================================
  _load(url, callback) {
    let xhrArgs = {
      sync: true,
      handleAs: "json-comment-optional"
    };
    let req = xhr(url, xhrArgs);
    req.addCallback(callback);
//		req.addErrback(onError);
  }

  _convertExhibit(data) {
    let auxP = [];
    let auxC = [];

    this._prepareExhibit(data);
    data.items.forEach((item) => {
      if (item.type === "Property") {
        let source = {
          "id": item.id,
          "property": item.id,
          label: {"en": item.label},
          description: {"en": item.description || item.comment}
        };
        if (!item.ranges || item.ranges["http://www.w3.org/2000/01/rdf-schema#Literal"]) {
          source["type"] = "text";
          source["nodetype"] = "LANGUAGE_LITERAL"
          auxP.push(source);
        } else {
          let props = this._getPropertiesForClasses(data, item.ranges);
          let propArr = [];
          for (let p in props) {
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
        let source = {
          "id": item.id,
          label: {"en": item.label},
          description: {"en": item.description || item.comment}
        };
        let t = {};
        t[item.id] = true;
        let props = this._getPropertiesForClasses(data, t);
        let propArr = [];
        for (let p in props) {
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
      properties: auxP.map(item => item["id"]),
      classes: auxC.map(item => item["id"]),
    };
  }

  _prepareExhibit(exhibit) {
    //Index property items.
    exhibit.domainProperties = {};
    exhibit.propertyIndex = {};
    exhibit.classIndex = {};

    exhibit.items.forEach((item) => {
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
    exhibit.items.forEach((item) => {
      switch (item.type) {
        case "Property":
          //Domains
          if (item.domain) {
            let props = exhibit.domainProperties[item.domain] || {};
            props[item.id] = true;
            exhibit.domainProperties[item.domain] = props;
          }
          //Range
          let spo = item;
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
  }

  _getPropertiesForClasses(exhibit, clss) {
    let props = {};
    for (let cls in clss) {
      if (clss.hasOwnProperty(cls)) {
        if (exhibit.classIndex[cls]) {
          this._getPropertiesForClassesRecursive(exhibit, exhibit.classIndex[cls], props, {});
        }
      }
    }
    return props;
  }

  _getPropertiesForClassesRecursive(exhibit, cls, props, parentClasses) {
    if (parentClasses[cls.id]) {
      return;
    }
    parentClasses[cls.id] = true;
    let props2 = exhibit.domainProperties[cls.id];
    for (let prop in props2) {
      props[prop] = true;
    }
    if (cls.subClassOf == null) {
      return;
    } else if (Array.isArray(cls.subClassOf)) {
      cls.subClassOf.forEach((superCls) => {
        if (exhibit.classIndex[superCls]) {
          this._getPropertiesForClassesRecursive(exhibit, exhibit.classIndex[superCls], props, parentClasses);
        }
      }, this);
    } else if (exhibit.classIndex[cls.subClassOf]) {
      this._getPropertiesForClassesRecursive(exhibit, exhibit.classIndex[cls.subClassOf], props, parentClasses);
    }
  }
};
