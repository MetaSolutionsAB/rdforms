let counter = 0;
export default class Bundle {
  /**
   * A Bundle corresponds to a set of items typically managed in a single file.
   */
  constructor({ itemStore, source, path, readOnly = false }) {
    this._itemStore = itemStore;
    this._source = source;
    this._path = path;
    this._readOnly = readOnly;
    this._items = [];
    counter += 1;
    this._id = `_bundle_${counter}`;

    this._root = null;
    this._modified = false;
  }

  getInternalId() {
    return this._id;
  }

  getSource() {
    return this._source;
  }

  setRoot(itemId) {
    this._source.root = itemId;
    return itemId;
  }

  getRoot() {
    if (this._source.root) {
      return this._itemStore.getItem(this._source.root);
    }
    return undefined;
  }

  getItemStore() {
    return this._itemStore;
  }

  getPath() {
    return this._path;
  }

  getItems() {
    return this._items;
  }

  addItem(item) {
    this._items.push(item);
  }

  removeItem(item) {
    this._items.splice(this._items.indexOf(item), 1);
  }

  isModified() {
    return this._modified;
  }

  setModified(modified) {
    this._modified = modified;
  }

  isReadOnly() {
    return this._readOnly || this._path == null;
  }
}
