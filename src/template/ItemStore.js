import PropertyGroup from './PropertyGroup';
import Group from './Group';
import Text from './Text';
import Choice from './Choice';
import OntologyStore from './OntologyStore';
import Bundle from './Bundle';

import {constructTemplate} from '../model/engine';
import {namespaces as ns} from 'rdfjson';

export default class ItemStore {
  /**
   * Keeps a registry of templates and reusable items.
   * Use the createTemplate method to create templates from a source
   * json structure, if the structure contains reusable items they are
   * created and stored separately as well.
   */
  constructor(ontologyStore) {
    this.automaticSortAllowed = true;
    this.ignoreMissingItems = true;

    //==================================================;
    // Private Attribute;
    //==================================================;
    this._bundles = [];
    this._registry = {};
    this._registryByProperty = {};
    this._ontologyStore = ontologyStore || new OntologyStore();

  }

  //===================================================
  // Public API
  //===================================================
  getTemplate(id) {
    return this.getItem(id);
  }

  getChildren(group, original) {
    if (group == null) {
      return [];
    }
    let origSource = group.getSource(true);
    let origSourceContent = origSource.content || origSource.items || [];
    if (original) {
      return this._createItems(origSourceContent, group._forceChildrenClones, group.getBundle());
    } else {
      let ext = this.getItem(origSource['extends']);
      if (ext) {
        return ext.getChildren().concat(group.getChildren(true));
      } else {
        return group.getChildren(true);
      }
    }
  }

  getItem(id) {
    if (id != null) {
      return this._registry[id];
    }
  }

  getItems() {
    let arr = [];
    for (let key in this._registry) {
      if (this._registry.hasOwnProperty(key)) {
        arr.push(this._registry[key]);
      }
    }
    /*  for (let key in this._registryByProperty) {
          if (this._registryByProperty.hasOwnProperty(key)) {
              let item = this._registryByProperty[key]
              if (item.getId() == null) {
                  arr.push(item);
              }
          }
      }*/
    return arr;
  }

  renameItem(from, to) {
    if (this._registry[to]) {
      throw 'Cannot rename to ' + to + ' since an item with that id already exists.';
    }
    if (to === '' || to === null) {
      throw 'Cannot give an item an empty string or null as id.';
    }
    let item = this._registry[from];
    if (item) {
      delete this._registry[from];
      this._registry[to] = item;
      item.setId(to);
    }
    let renameInGroup = function (source) {
      let children = source.content;
      if (children) {
        for (let j = 0; j < children.length; j++) {
          let child = children[j];
          if (child.id === from || child['@id'] === from) {
            child.id = to;
            delete child['@id']; //Clean up backward compatability.
          }
          if (child.content) {
            renameInGroup(child);
          }
        }
      }
    }

    let items = this.getItems();
    for (let i = 0; i < items.length; i++) {
      let childItem = items[i];
      if (childItem instanceof Group) {
        renameInGroup(childItem._source);
      }
    }
  }

  getItemIds() {
    let arr = [];
    for (let key in this._registry) {
      if (this._registry.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }

  getItemByProperty(property) {
    return this._registryByProperty[property];
  }

  detectTemplate(graph, uri, requiredItems) {
    return constructTemplate(graph, uri, this, requiredItems);
  }

  /**
   * Bundle is an object containing:
   * path - can be a relative or absolute path to where the templates are/will be loaded from, optional.
   * source - a RDForms template object, mandatory.
   *
   * @param {Object} bundleSrc
   * @return {Bundle} the created bundle.
   */
  registerBundle(bundle) {
    bundle.itemStore = this;
    let b = new Bundle(bundle);
    this._bundles.push(b);

    if (bundle.source && bundle.source.namespaces) {
      ns.add(bundle.source.namespaces);
    }

    let templates = bundle.source.templates || bundle.source.auxilliary;
    if (templates instanceof Array) {
      this._createItems(templates, false, b);
    }
    if (typeof bundle.source.cachedChoices === 'object') {
      this._ontologyStore.importRegistry(bundle.source.cachedChoices);
    }

    return b;
  }

  getBundles() {
    return this._bundles;
  }

  //Backward compatability
  createTemplate(source) {
    let b = this.registerBundle({source: source});
    return b.getRoot();
  }

  createTemplateFromChildren(children) {
    let childrenObj = (children || []).map(child => typeof child === 'string' ? this.getItem(child) : child, this);
    return new Group({source: {}, children: childrenObj, itemStore: this});
  }

  setPriorities(priorities) {
    this.priorities = priorities;
  }

  createExtendedSource(origSource, extSource) {
    let newSource = Object.assign(Object.assign({}, origSource), extSource);
    newSource['_extendedSource'] = extSource;
    newSource['extends'] = null; //Avoid infinite recursion when creating the fleshed out item.
    delete newSource['children'];
    return newSource;
  }

  /**
   * At a minimum the source must contain a type, the rest can be changed later.
   *
   * @param source
   * @returns {*}
   */
  createItem(source, forceClone, skipRegistration, bundle) {
    let item, id = source.id || source['@id'], type = source['type'] || source['@type'];
    if (source['extends']) {
      //Explicit extends given
      let extItem = this._registry[source['extends']];
      if (extItem == null && !this.ignoreMissingItems) {
        throw 'Cannot find item to extend with id: ' + source['extends'];
      }
      if (extItem) {
        let newSource = this.createExtendedSource(extItem.getSource(), source);
        return this.createItem(newSource, false, false, bundle);
      }
    }

    if (type != null) {
      //If there is a type in the source then it means that the object is a new item.
      switch (type) {
        case 'text':
          item = new Text({source: source, itemStore: this, bundle: bundle});
          break;
        case 'choice':
          item = new Choice({
            source: source,
            itemStore: this,
            ontologyStore: this._ontologyStore,
            bundle: bundle
          });
          break;
        case 'group':
          item = new Group({source: source, children: null, itemStore: this, bundle: bundle}); //Lazy loading of children.
          break;
        case 'propertygroup':
          item = new PropertyGroup({
            source: source,
            children: null,
            itemStore: this,
            bundle: bundle
          }); //Lazy loading of children.
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
      if (id == null) {
        throw 'Cannot create subitem, `type` for creating new or `id` for referencing external are required.';
      }
      if (this._registry[id] == null) {
        throw 'Cannot find referenced subitem using identifier: ' + id;
      }
      //Check if there are any overlay properties, if so force clone mode.
      for (let key in source) {
        if (source.hasOwnProperty(key) && (key !== 'id' && key !== '@id')) {
          forceClone = true;
          break;
        }
      }

      if (forceClone === true) {
        let newSource = Object.assign(Object.assign({}, this._registry[id]._source), source);
        return this.createItem(newSource, false, true);
      } else {
        return this._registry[id];
      }
    }
  }

  removeItem(item, removereferences) {
    let b = item.getBundle();
    if (b != null) {
      b.removeItem(item);
    }
    if (item.getId() != null) {
      delete this._registry[item.getId()];
    }
    let prop = item.getProperty();
    if (prop != null && this._registryByProperty[prop] === item) {
      delete this._registryByProperty[prop];
    }
    if (removereferences) {
      //TODO

    }
  }

  //===================================================
  // Private methods
  //===================================================
  _createItems(sourceArray, forceClone, bundle) {
    return sourceArray.map((child, index) => {
      if (typeof child === 'string') {  //If child is not a object but a direct string reference,
        // create a object.
        child = sourceArray[index] = {id: child};
      }
      return this.createItem(child, forceClone, false, bundle);
    }, this);
  }
};
