import { namespaces as ns } from '@entryscape/rdfjson';
import PropertyGroup from './PropertyGroup';
import Group from './Group';
import Text from './Text';
import Choice from './Choice';
import OntologyStore from './OntologyStore';
import Bundle from './Bundle';
import { constructTemplate } from '../model/engine';

const deepMerge = (source1, source2) => {
  if (!source1 || !source2) {
    return source2 === undefined ? source1 : source2;
  }

  if (Array.isArray(source1) && Array.isArray(source2)) {
    return [].concat(origSource[key], extSource[key]);
  }

  if (typeof source1 === 'object' && typeof source2 === 'object') {
    const obj = {};
    Object.keys(source1).concat(Object.keys(source2)).forEach(key => {
      obj[key] = deepMerge(source1[key], source2[key]);
    });
    return obj;
  }

  return source2;
}

export default class ItemStore {
  /**
   * Keeps a registry of templates and reusable items.
   * Use the createTemplate method to create templates from a source
   * json structure, if the structure contains reusable items they are
   * created and stored separately as well.
   */
  constructor(ontologyStore) {
    this.automaticSortAllowed = true;
    /**
     * Value may be console methods or 'throw'.
     * @type {string}
     */
    this.handleErrorAs = 'throw';

    //= =================================================;
    // Private Attribute;
    //= =================================================;
    this._bundles = [];
    this._registry = {};
    this._registryByProperty = {};
    this._ontologyStore = ontologyStore || new OntologyStore();
  }

  //= ==================================================
  // Public API
  //= ==================================================
  getTemplate(id) {
    return this.getItem(id);
  }

  getChildren(group, original) {
    if (group == null) {
      return [];
    }
    const origSource = group.getSource(true);
    const origSourceContent = origSource.content || origSource.items || [];
    if (original) {
      return this._createItems(origSourceContent, group._forceChildrenClones, group.getBundle());
    }
    const ext = this.getItem(origSource.extends);
    if (ext) {
      const children = group.getChildren(true);
      if (group.getEnhanced('items') || children.length === 0) {
        return ext.getChildren().concat(children);
      }
      return children;
    }
    return group.getChildren(true);
  }

  getItem(id) {
    if (id != null) {
      return this._registry[id];
    }
    return undefined;
  }

  getItems() {
    return Object.keys(this._registry).map(key => this._registry[key]);
  }

  renameItem(from, to) {
    if (this._registry[to]) {
      this._handleError(`Cannot rename to ${to} since an item with that id already exists.`);
      return;
    }
    if (to === '' || to === null) {
      this._handleError('Cannot give an item an empty string or null as id.');
      return;
    }
    const item = this._registry[from];
    if (item) {
      delete this._registry[from];
      this._registry[to] = item;
      item.setId(to);
    }
    const renameInGroup = (source) => {
      const children = source.content;
      if (children) {
        for (let j = 0; j < children.length; j++) {
          const child = children[j];
          if (child.id === from || child['@id'] === from) {
            child.id = to;
            delete child['@id']; // Clean up backward compatability.
          }
          if (child.content) {
            renameInGroup(child);
          }
        }
      }
    };

    const items = this.getItems();
    for (let i = 0; i < items.length; i++) {
      const childItem = items[i];
      if (childItem instanceof Group) {
        renameInGroup(childItem._source);
      }
    }
  }

  getItemIds() {
    return Object.keys(this._registry);
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
    const b = new Bundle(bundle);
    this._bundles.push(b);

    if (bundle.source && bundle.source.namespaces) {
      ns.add(bundle.source.namespaces);
    }

    const templates = bundle.source.templates || bundle.source.auxilliary;
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

  // Backward compatability
  createTemplate(source) {
    const b = this.registerBundle({ source });
    return b.getRoot();
  }

  createTemplateFromChildren(children) {
    const childrenObj = (children || []).map(child => (typeof child === 'string' ? this.getItem(child) : child));
    return new Group({ source: {}, children: childrenObj, itemStore: this });
  }

  setPriorities(priorities) {
    this.priorities = priorities;
  }

  // eslint-disable-next-line class-methods-use-this
  createExtendedSource(origSource, extSource) {
    const newSource = Object.assign({}, origSource, extSource);
    if (extSource.enhanced) {
      let keys;
      if (extSource.enhanced === true) {
        keys = Object.keys(origSource).concat(Object.keys(extSource));
      } else {
        keys = Object.keys(extSource.enhanced);
      }
      keys.forEach(key => {
        newSource[key] = deepMerge(origSource[key], extSource[key]);
      });
    }
    newSource._extendedSource = extSource;
    newSource.extends = null; // Avoid infinite recursion when creating the fleshed out item.
    delete newSource.children;
    return newSource;
  }

  /**
   * At a minimum the source must contain a type, the rest can be changed later.
   *
   * @param source
   * @returns {*}
   */
  createItem(source, forceClone, skipRegistration, bundle) {
    let item;
    const id = source.id || source['@id'];
    const type = source.type || source['@type'];
    if (source.extends) {
      // Explicit extends given
      const extItem = this._registry[source.extends];
      if (extItem == null) {
        this._handleError(`Cannot find item to extend with id: ${source.extends}`);
      }
      if (extItem) {
        const newSource = this.createExtendedSource(extItem.getSource(), source);
        return this.createItem(newSource, false, false, bundle);
      }
    }

    if (type != null) {
      // If there is a type in the source then it means that the object is a new item.
      // eslint-disable-next-line default-case
      switch (type) {
        case 'text':
          item = new Text({ source, itemStore: this, bundle });
          break;
        case 'choice':
          item = new Choice({
            source,
            itemStore: this,
            ontologyStore: this._ontologyStore,
            bundle,
          });
          break;
        case 'group':
          item = new Group({ source, children: null, itemStore: this, bundle }); // Lazy loading of children.
          break;
        case 'propertygroup':
          item = new PropertyGroup({
            source,
            children: null,
            itemStore: this,
            bundle,
          }); // Lazy loading of children.
          break;
      }
      if (skipRegistration !== true) {
        if (source.property != null) {
          this._registryByProperty[source.property] = item;
          if (this.priorities && this.priorities[source.property] != null) {
            item.priority = this.priorities[source.property];
          }
        }
        if (id != null) {
          if (this._registry[id]) {
            console.log(`RDForms conflict with item id ${id}, overwriting item from bundle "${
              this._registry[id].getPath() || ''}" with item from bundle "${item.getBundle().getPath() || ''}".`);
          }
          this._registry[id] = item;
          if (bundle != null) {
            bundle.addItem(item);
          }
        }
      }
      return item;
    }
    // No type means it is a reference, check that the referred item (via id) exists
    if (id == null) {
      this._handleError('Cannot create subitem, `type` for creating new or `id` for referencing external are required.');
      return;
    }
    if (this._registry[id] == null) {
      this._handleError(`Cannot find referenced subitem using identifier: ${id}`);
      return;
    }

    // Clone if forceClone set to true or if the source contains non-id properties.
    if (forceClone === true || Object.keys(source).find(key => (key !== 'id' && key !== '@id'))) {
      const newSource = Object.assign(Object.assign({}, this._registry[id]._source), source);
      return this.createItem(newSource, false, true);
    }
    return this._registry[id];
  }

  removeItem(item, removereferences) {
    const b = item.getBundle();
    if (b != null) {
      b.removeItem(item);
    }
    if (item.getId() != null) {
      delete this._registry[item.getId()];
    }
    const prop = item.getProperty();
    if (prop != null && this._registryByProperty[prop] === item) {
      delete this._registryByProperty[prop];
    }
    if (removereferences) {
      // TODO

    }
  }

  //= ==================================================
  // Private methods
  //= ==================================================
  _createItems(sourceArray, forceClone, bundle) {
    return sourceArray.map((child, index) => {
      // If child is not a object but a direct string reference,
      const childToUse = typeof child === 'string' ? sourceArray[index] = { id: child } : child;
      return this.createItem(childToUse, forceClone, false, bundle);
    }).filter(item => item);
  }

  _handleError(message) {
    if (this.handleErrorAs === 'throw') {
      throw new Error(message);
    }
    console[this.handleErrorAs](message);
  }
}
