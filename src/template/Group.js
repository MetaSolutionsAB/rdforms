import Item from './Item';

const sortItems = (items) => {
  items.forEach((item) => {
    item.__label = (item.getLabel() || '').toLowerCase();
  });
  items.sort((o1, o2) => {
    if (o1._source.priority != null) {
      if (o2._source.priority != null) {
        // eslint-disable-next-line no-nested-ternary
        return o1._source.priority > o2._source.priority ? -1 : (o1._source.priority < o2._source.priority ? 1 : 0);
      }
      return o1._source.priority > 0 ? -1 : 1;
    } else if (o2._source.priority != null) {
      return o2._source.priority > 0 ? 1 : -1;
    } else if (o1.__label > o2.__label) {
      return 1;
    } else if (o1.__label < o2.__label) {
      return -1;
    }
    return 0;
  });
};


export default class Group extends Item {
  /**
   * Group extends an Item by having children.
   */
  constructor(params) {
    super(params);
    this._children = params.children;
    if (this._source.content != null) {
      this._source.items = this._source.content;
      delete this._source.content;
    }
    this._forceChildrenClones = false;
    this._parent = null;
  }

  // ===================================================
  // Public API
  // ===================================================
  getChildren(original) {
    const _original = original && this.isExtention();
    let children = _original ? this._ochildren : this._children;

    if (children == null) {
      children = this._itemStore.getChildren(this, _original);
      if (this.getSource().automatic === true && this._itemStore.automaticSortAllowed) {
        sortItems(children);
      }
      this[`_${_original ? 'o' : ''}children`] = children;
    }
    return children;
  }

  originalChildrenChanged() {
    if (this.isExtention()) {
      delete this._children;
    }
  }

  setExtends(extendsStr) {
    super.setExtends(extendsStr);
    delete this._children;
    delete this._ochildren;
  }

  // ===================================================
  // Inherited methods
  // ===================================================

  getNodetype() {
    return super.getNodetype() || 'RESOURCE'; // Ugly fix because it is often wrong written in SIRFF.
  }
}
